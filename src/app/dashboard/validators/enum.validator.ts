import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function EnumValidator(enumValue: any): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === undefined || value === null) {
      return null;
    }

    const isValid = Object.values(enumValue).includes(value);

    return !isValid ? {enum: {value: value}} : null;
  };
}
