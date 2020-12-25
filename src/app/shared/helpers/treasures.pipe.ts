import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'treasures'
})
export class TreasuresPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
