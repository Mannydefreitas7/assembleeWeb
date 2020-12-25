import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'life'
})
export class LifePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
