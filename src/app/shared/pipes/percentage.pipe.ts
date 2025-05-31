import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentage'
})
export class PercentagePipe implements PipeTransform {
  transform(value: number, digits: number = 2): string {
    if (value == null) return '';

    const formattedValue = value.toFixed(digits);
    const sign = value > 0 ? '+' : '';

    return `${sign}${formattedValue}%`;
  }
}
