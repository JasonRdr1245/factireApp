export interface Product {
  _id:          string;
  name:         string;
  unit:         string;
  unitPrice:    number;
  descripcion:  string;
  tipoProducto: string;
  igvIndicator: boolean;
  igv:          number;
  __v:          number;
}
