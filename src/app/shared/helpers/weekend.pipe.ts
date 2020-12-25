import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weekend'
})
export class WeekendPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
