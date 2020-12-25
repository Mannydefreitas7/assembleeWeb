import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prayers'
})
export class PrayersPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
