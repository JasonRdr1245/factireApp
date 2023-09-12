import { Component, computed, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ProductGetResponse } from '../../interfaces/products-get-response.interface';
import { DetailService } from '../../services/detail.service';
import Swal from 'sweetalert2';
import { DetailPostResponse } from '../../interfaces/details-post-response.interface';
import { FactureService } from '../../services/facture.service';
import { Router } from '@angular/router';
import { FacturePostResponse } from '../../interfaces/facture-post-response.interface';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { DatePipe } from '@angular/common';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-facturation',
  templateUrl: './facturation.component.html',
  styleUrls: ['./facturation.component.css']
})
export class FacturationComponent {

  constructor() { // Asigna el FormArray correctamente
  }

  private datePipe = inject(DatePipe)

  private fb = inject(FormBuilder)
  private detailService = inject(DetailService)
  private factureService = inject(FactureService)
  private router = inject(Router)

  private productService = inject(ProductService)
  public products = computed<ProductGetResponse[] | null>(() => { return this.productService.currentProducts() })

  public myForm: FormGroup = this.fb.group({
    payMethod: ["credito", [Validators.required]],
    totalPayments: ["", [Validators.required]],
    ruc: ["10460278975", [Validators.required]],
    details: this.fb.array([this.detailForm()])
  })


  get details() {
    return this.myForm.get("details") as FormArray;
  }

  detailForm() {
    return this.fb.group({
      product: ["", [Validators.required]],
      amount: ["", [Validators.required]]
    })
  }

  async create() {
    try {
      console.log(this.myForm.value)
      const { payMethod, totalPayments, ruc } = this.myForm.value
      const detailArray: DetailPostResponse[] = [];
      for (const detailInstance of this.myForm.value.details) {
        try {
          const { product, amount } = detailInstance
          const detailPromise = await this.detailService.createDetail(product, Number(amount)).toPromise()
          detailArray.push(detailPromise!)
        } catch (error) {
          console.log(error)
          Swal.fire('Error', 'error al mandar la promise', 'error')
        }
      }
      const idsDetails = detailArray.map(obj => obj._id)
      console.log(idsDetails)

      const newfacture: FacturePostResponse | undefined = await this.factureService.createFacture(idsDetails, payMethod, Number(totalPayments), Number(ruc)).toPromise()
      console.log(newfacture)
      //generar pdf

      this.generatePdf(newfacture!)
      Swal.fire({
        icon: 'info', // Icono de información
        title: 'Facturacion Registrada',
        text: 'facaturacion exitosa',
        confirmButtonText: 'Aceptar'
      })

    } catch (error: any) {
      Swal.fire('Error', 'Datos erroneos al crear factura', 'error')
    }

  }

  agregar() {
    this.details.push(this.detailForm())
  }


  deleteDetail(i: Required<number>) {
    this.details.removeAt(i)
  }


  generatePdf(facture: FacturePostResponse) {
    const date = this.datePipe.transform(facture.date, 'dd,MM,yyyy')

    const documentDefinition: TDocumentDefinitions = {
      pageOrientation: 'landscape',
      content: [
        { text: 'FACTURA', style: 'header', tocItem: 'Factura' },
        { text: `Fecha: ${date}`, alignment: 'right' },
        { text: `Tipo Documento: Factura` },
        { text: `Metodo de pago: ${facture.payMethod}` },
        { text: `Moneda: PEN` },
        { text: 'INFORMACIÓN DE LA EMPRESA', style: 'subheader', tocItem: 'Información de la Empresa' },
        { text: `Nombre de la Empresa: ${facture.company.name}` },
        { text: `Dirección: ${facture.company.adress}` },
        { text: `Condición: ${facture.company.condition}` },
        { text: `RUC: ${facture.company.ruc}`, margin: [0, 0, 0, 10] },
        { text: 'INFORMACIÓN DEL CLIENTE', style: 'subheader', tocItem: 'Información del Cliente' },
        { text: `Cliente: ${facture.client.name}` },
        { text: `Dirección: ${facture.client.adress}` },
        { text: `RUC: ${facture.client.ruc}`, margin: [0, 0, 0, 10] },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              ['Nombre', 'Unidad', 'Cantidad', 'Precio Unitario', 'IGV', 'TasaImpuesto', 'Precio', 'SubTotal'],
              // Detalles de productos
              // Puedes usar un bucle para agregar detalles dinámicamente aquí
              // Ejemplo:
              // facture.detail.forEach((detail) => {
              //   tableRow.push(detail.product.name, detail.amount, detail.product.unitPrice, detail.totalPrice);
              // });
              ...facture.detail.map((detail) => [
                detail.product.name,
                detail.product.unit,
                detail.amount,
                detail.product.unitPrice,
                this.redondearNumero(detail.igvImportDetail),
                this.redondearNumero(detail.product.igv),
                this.redondearNumero(detail.totalPrice - detail.igvImportDetail),
                this.redondearNumero(detail.totalPrice)
              ])
            ],
          },
        },
        { text: '\n', margin: [0, 10] },
        {
          text: `Valor de Venta:  S/${this.redondearNumero(facture.totalPriceNet)}`,
          alignment: 'right',
          margin: [0, 0, 0, 5],
        },
        {
          text: `Impuesto: S/${this.redondearNumero(facture.totalIgv)}`,
          alignment: 'right',
          margin: [0, 0, 0, 5],
        },
        {
          text: `Total: S/${this.redondearNumero(facture.totalPrice)}`,
          alignment: 'right',
          margin: [0, 0, 0, 5],
          bold: true,
        },
        {
          table: {
            widths: ['*', '*'],
            body: [
              [
                {
                  text: 'Información de Crédito:',
                  style: 'subheader',
                  fillColor: '#333',
                  color: '#fff',
                  colSpan: 2,
                },
                {},
              ],
              [
                {
                  text: `Cantidad de Pagos: ${facture.totalPayments}`,
                  colSpan: 2,
                },
                {},
              ],
              [
                {
                  text: `Cantidad por Pago: S/${this.redondearNumero(facture.amountPayments)}`,
                  colSpan: 2,
                },
                {},
              ],
            ],
          },
          layout: 'noBorders', // Elimina los bordes de la tabla para un cuadro estilizado
          margin: [0, 10],
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true, alignment: 'center' },
        subheader: { fontSize: 14, bold: true, margin: [0, 10] },
      },
    };

    const pdfDoc = pdfMake.createPdf(documentDefinition);
    pdfDoc.open()
  }

  redondearNumero(numero: number): string {
    // Redondear al primer dígito decimal y formatear con dos dígitos después del punto
    const numeroRedondeado = Math.round(numero * 10) / 10;
    return numeroRedondeado.toFixed(2);
  }
}
