import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MidWeekProgram, Part, WeekEndProgram, WeekProgram, WOLWeek } from '../models/wol.model';
import moment from 'moment';
import { FireStoreService } from './fire-store.service';
import { Gender, Privilege } from '../models/publisher.model';

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

  getWeekProgram(year: number, month: number, day: number, apiURL: string) : Observable<WOLWeek> {
     let url = `http://localhost:4200/${apiURL}${year}/${month}/${day}`;
      return this.http.get<WOLWeek>(url);
  }

  parseWolContent(wolWeek: WOLWeek, date: Date) : WeekProgram {
   if (wolWeek.items.length > 1) {
      let midContent: Document = this.parse.parseFromString(wolWeek.items[1].content, "text/html");
      let endContent: Document = this.parse.parseFromString(wolWeek.items[2].content, "text/html");
      let midWeek : MidWeekProgram;
      let weekEnd : WeekEndProgram;
      let treasuresParts : Part[] = [];

      midContent.getElementById('section2')
      .querySelector('ul')
      .querySelectorAll('.so')
      .forEach(element => {
         treasuresParts.push({
            assignee: null,
            hasDiscussion: false,
            hasAssistant: false,
            assistant: null,
            gender: [Gender.brother],
            id: this.fireStore.fireStore.createId(),
            length: element.textContent.match(/\(([^)]+)\)/)[1],
            privilege: element.textContent.match(/\(([^)]+)\)/)[1].includes('10') ? [Privilege.elder, Privilege.ms] : [Privilege.pub, Privilege.elder, Privilege.ms],
            subTitle: "",
            title: element.textContent,
            lengthTime: moment(element.textContent.match(/\(([^)]+)\)/)[1].match(/\d+/)[0]).toDate().getTime()
         })
      })

      treasuresParts[1].hasDiscussion = true;
  
      let prayer: Part = {
        assignee: null,
        id: this.fireStore.fireStore.createId(),
        privilege: [Privilege.elder, Privilege.ms, Privilege.pub],
        gender: [Gender.brother]
     }
  
    let applyParts : Part[] = [];
    midContent.getElementById('section3')
    .querySelector('ul')
    .querySelectorAll('.so')
    .forEach(element => {
     
       applyParts.push({
          assignee: null,
          hasDiscussion: element.textContent.match(/\(([^)]+)\)/)[1].includes('15'),
          hasAssistant: !element.textContent.match(/\(([^)]+)\)/)[1].includes('15'),
          assistant: null,
          gender: element.textContent.match(/\(([^)]+)\)/)[1].includes('15') ? [Gender.brother] : [Gender.sister, Gender.brother],
          id: this.fireStore.fireStore.createId(),
          length: element.textContent.match(/\(([^)]+)\)/)[1],
          privilege: element.textContent.match(/\(([^)]+)\)/)[1].includes('15') ? [Privilege.elder, Privilege.ms] : [Privilege.pub],
          subTitle: "",
          title: element.textContent,
          lengthTime: moment(element.textContent.match(/\(([^)]+)\)/)[1].match(/\d+/)[0]).toDate().getTime()
       })
    })
  
    let lifeParts : Part[] = [];
    midContent.getElementById('section4')
    .querySelector('ul')
    .querySelectorAll('li')
    .forEach(element => {
    
     lifeParts.push({
          assignee: null,
          hasDiscussion: false,
          hasAssistant: false,
          assistant: null,
          gender: [Gender.brother],
          id: this.fireStore.fireStore.createId(),
          length: element.textContent.match(/\(([^)]+)\)/) ? element.textContent.match(/\(([^)]+)\)/)[1] : '',
          lengthTime: element.textContent.match(/\(([^)]+)\)/) ? moment(element.textContent.match(/\(([^)]+)\)/)[1].match(/\d+/)[0]).toDate().getTime() : null,
          privilege: [Privilege.elder, Privilege.ms],
          subTitle: '',
          title: element.textContent,
       })
    })
  
    lifeParts.pop();
    lifeParts.pop();
    lifeParts.shift();
   
      midWeek = {
         chairman: {
           assignee: null,
           hasAssistant: false,
           gender: [Gender.brother],
           privilege: [Privilege.elder],
           id: this.fireStore.fireStore.createId()
         },
         prayers: [
           prayer,
           prayer
         ],
         treasuresParts: treasuresParts,
        applyParts: applyParts,
        lifeParts: lifeParts,
        date: date
      }
  
      weekEnd = {
        prayers: [
           prayer,
           prayer
         ],
         chairman: {
           assignee: null,
           hasAssistant: false,
           gender: [Gender.brother],
           privilege: [Privilege.elder],
           id: this.fireStore.fireStore.createId()
         },
         publicTalk: {
            assignee: null,
            gender: [Gender.brother],
            id: this.fireStore.fireStore.createId(),
            length: '30',
            lengthTime: moment('00:30:00', 'hh:mm:ss').toDate().getTime(),
            privilege: [Privilege.elder, Privilege.ms],
            title: "",
            subTitle: "",
         },
         watchtowerStudy: {
            assignee: null,
            gender: [Gender.brother],
            title: endContent.querySelector('.groupTOC').querySelector('h3').textContent,
            subTitle: endContent.querySelector('.groupTOC').querySelector('p').textContent,
            id: this.fireStore.fireStore.createId(),
            hasAssistant: true,
            assistant: null,
            length: '60',
            lengthTime: moment('01:00:00', 'hh:mm:ss').toDate().getTime(),
            privilege: [Privilege.elder]
         }
      }
  
      let weekProgram : WeekProgram = {
         date: date,
         range: midContent.querySelector('header').querySelector('#p1').textContent,
         id: this.fireStore.fireStore.createId(),
         isCOVisit: false,
         midWeek: midWeek,
         weekEnd: weekEnd
      }
      return weekProgram;
   } else {
      return null;
   }
  }

}
