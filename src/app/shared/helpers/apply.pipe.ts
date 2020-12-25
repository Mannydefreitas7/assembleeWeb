import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'apply'
})
export class ApplyPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
