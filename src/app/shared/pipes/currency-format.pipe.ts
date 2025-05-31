import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat'
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number, currency: string = 'USD', minimumFractionDigits: number = 2): string {
    if (value == null) return '';

    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: minimumFractionDigits
    });
  }
}
