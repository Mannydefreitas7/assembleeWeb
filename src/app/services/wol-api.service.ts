import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MidWeekProgram, Part, WeekEndProgram, WeekProgram, WOLWeek } from '../models/wol.model';
import moment, { MomentInput } from 'moment';
import { FireStoreService } from './fire-store.service';

@Injectable({
  providedIn: 'root'
})
export class WolApiService {
// url: 'https://wol.jw.org/wol/dt/r1/lp-e/2020/4/28'
   parse = new DOMParser()
  constructor(
     private http: HttpClient,
     private fireStore: FireStoreService
     ) { }

  getWeekProgram(year: number, month: number, day: number) : Observable<WOLWeek> {
     let url = `http://localhost:4200/wol/dt/r1/lp-e/${year}/${month}/${day}`;
      return this.http.get<WOLWeek>(url);
  }

  parseWolContent(html: string, date: Date) : WeekProgram {
    let content: Document = this.parse.parseFromString(html, "text/html");
    let midWeek : MidWeekProgram;
    let weekEnd : WeekEndProgram;
    
    let treasureTalk: Part = {
      id: this.fireStore.fireStore.createId(),
      assignee: null,
      assistant: null,
      hasAssistant: false,
      hasDiscussion: false,
      title: content.getElementById("p6").innerText,
      length: '10 min',
      lengthTime: moment('10:00').toDate()
    }

    let prayer =  {
      assignee: null,
      id: this.fireStore.fireStore.createId(),
   }

    midWeek = {
       treasuresTalk : treasureTalk,
       prayers: [
         prayer,
         prayer
       ],
       applyParts

    }

    let WeekProgram : WeekProgram = {
       date: date,
       range: content.getElementById("p1").innerText,
       id: this.fireStore.fireStore.createId(),
       isCOVisit: false, 
    }
    
  
  }

}
