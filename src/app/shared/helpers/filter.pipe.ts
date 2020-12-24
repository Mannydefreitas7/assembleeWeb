import { Pipe, PipeTransform } from '@angular/core';
import { Publisher } from 'src/app/models/publisher.model';

@Pipe({
   name: 'filter'
 })
 export class FilterPipe implements PipeTransform {
   transform(publishers: Publisher[], searchText: string): any[] {
     if (!publishers) return [];
     if (!searchText) return publishers;
   
     return publishers.filter(item => {
        return item.firstName.toLowerCase().includes(searchText.toLowerCase()) || item.lastName.toLowerCase().includes(searchText.toLowerCase())
     });
    }
 }
 