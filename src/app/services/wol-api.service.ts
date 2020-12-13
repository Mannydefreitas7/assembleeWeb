import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WOLWeek } from '../models/wol.model';

@Injectable({
  providedIn: 'root'
})
export class WolApiService {
// url: 'https://wol.jw.org/wol/dt/r1/lp-e/2020/4/28'

  constructor(private http: HttpClient, private parse: DOMParser) { }

  getWeekProgram(year: number, month: number, day: number) : Observable<WOLWeek> {
     let url = `http://localhost:4200/wol/dt/r1/lp-e/${year}/${month}/${day}`;
      return this.http.get<WOLWeek>(url);
  }

  parseWolContent(html: string) {
    let content: Document = this.parse.parseFromString(html, "text/html");
  //  content.
  }

}
