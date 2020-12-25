import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chairmans'
})
export class ChairmansPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
