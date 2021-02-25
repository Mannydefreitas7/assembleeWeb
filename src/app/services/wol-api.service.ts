import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Parent, Part, WeekProgram, WOLWeek } from '../models/wol.model';
import moment from 'moment';
import { FireStoreService } from './fire-store.service';
import { Gender, Privilege } from '../models/publisher.model';
import { Congregation } from '../models/congregation.model';
import { NgForage } from 'ngforage';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WolApiService {
// url: 'https://wol.jw.org/wol/dt/r1/lp-e/2020/4/28'
   parse = new DOMParser()
  constructor(
     private http: HttpClient,
     private forage: NgForage,
     private fireStore: FireStoreService
     ) { }

  getWeekProgram(year: number, month: number, day: number, apiURL: string) : Observable<WOLWeek> {
     let url = `${environment.wolApiUrl}${apiURL}${year}/${month}/${day}`;
      return this.http.get<WOLWeek>(url);
  }

  parseMidWeek(wolWeek: WOLWeek, date: Date, path: string, weekID: string) : Part[] {
   let midContent: Document = this.parse.parseFromString(wolWeek.items[1].content, "text/html");
   let parts : Part[] = [];

   // Treasures
   midContent.getElementById('section2')
   .querySelector('ul')
   .querySelectorAll('.so')
   .forEach((element, i) => {
      parts.push({
         assignee: null,
         hasDiscussion: false,
         hasAssistant: false,
         assistant: null,
         gender: [Gender.brother],
         id: this.fireStore.fireStore.createId(),
         length: element.textContent.match(/\(([^)]+)\)/)[1],
         privilege: element.textContent.match(/\(([^)]+)\)/)[1].includes('10') ? [Privilege.elder, Privilege.ms] : [Privilege.pub, Privilege.elder, Privilege.ms],
         subTitle: "",
         path: path,
         title: element.textContent,
         lengthTime: moment(element.textContent.match(/\(([^)]+)\)/)[1].match(/\d+/)[0]).toDate().getTime(),
         index: i,
         isConfirmed: false,
         isEmailed: false,
         isCalendarAdded: false,
         parent: Parent.treasures,
         date: date,
         week: weekID
      })
   })
   parts[1].hasDiscussion = true;

   // Apply
   midContent.getElementById('section3')
    .querySelector('ul')
    .querySelectorAll('.so')
    .forEach((element, i) => {

       parts.push({
          assignee: null,
          hasDiscussion: element.textContent.match(/\(([^)]+)\)/)[1].includes('15'),
          hasAssistant: !element.textContent.match(/\(([^)]+)\)/)[1].includes('15'),
          assistant: null,
          path: path,
          gender: element.textContent.match(/\(([^)]+)\)/)[1].includes('15') ? [Gender.brother] : [Gender.sister, Gender.brother],
          id: this.fireStore.fireStore.createId(),
          length: element.textContent.match(/\(([^)]+)\)/)[1],
          privilege: element.textContent.match(/\(([^)]+)\)/)[1].includes('15') ? [Privilege.elder, Privilege.ms] : [Privilege.elder, Privilege.ms, Privilege.pub],
          isEmailed: false,
          subTitle: "",
          title: element.textContent,
          lengthTime: moment(element.textContent.match(/\(([^)]+)\)/)[1].match(/\d+/)[0]).toDate().getTime(),
          index: i,
          isCalendarAdded: false,
          isConfirmed: false,
          parent: Parent.apply,
          date: date,
          week: weekID
       })
    })

    // Living
    let lifeParts : Part[] = [];
    midContent.getElementById('section4')
    .querySelector('ul')
    .querySelectorAll('li')
    .forEach((element, i) => {
     lifeParts.push({
          assignee: null,
          hasDiscussion: false,
          hasAssistant: false,
          assistant: null,
          path: path,
          gender: [Gender.brother],
          id: this.fireStore.fireStore.createId(),
          length: element.textContent.match(/\(([^)]+)\)/) ? element.textContent.match(/\(([^)]+)\)/)[1] : '',
          lengthTime: element.textContent.match(/\(([^)]+)\)/) ? moment(element.textContent.match(/\(([^)]+)\)/)[1].match(/\d+/)[0]).toDate().getTime() : null,
          privilege: [Privilege.elder, Privilege.ms],
          subTitle: '',
          title: element.textContent,
          index: i,
          isCalendarAdded: false,
          isEmailed: false,
          isConfirmed: false,
          parent: Parent.life,
          date: date,
          week: weekID
       })
    })

    lifeParts.pop();
    lifeParts.pop();
    lifeParts.shift();
    lifeParts[lifeParts.length - 1].hasAssistant = true;
    parts.push(...lifeParts)

   return parts
  }

  weekSchedule(wolWeek: WOLWeek, date: Date, path: string, range: string) : WeekProgram {
   let weekID = this.fireStore.fireStore.createId();
   let weekProgram : WeekProgram = {
      date: date,
      isSent: false,
      range: range,
      id: weekID,
      isCOVisit: false
   }
   return weekProgram
  }

  parseWeekEnd(wolWeek: WOLWeek, date: Date, path: string, weekID: string) : Part[] {
      let endContent: Document = this.parse.parseFromString(wolWeek.items[wolWeek.items.length - 1].content, "text/html");
      let parts : Part[] = [];
      parts.push({
         assignee: null,
         assistant: null,
         gender: [Gender.brother],
         id: this.fireStore.fireStore.createId(),
         length: '30',
         lengthTime: moment('00:30:00', 'hh:mm:ss').toDate().getTime(),
         privilege: [Privilege.elder, Privilege.ms],
         title: "",
         path: path,
         subTitle: "",
         hasAssistant: false,
         index: 0,
         isCalendarAdded: false,
         isEmailed: false,
         isConfirmed: false,
         date: date,
         parent: Parent.talk,
         week: weekID
    },
    {
      assignee: null,
      gender: [Gender.brother],
      title: endContent ? endContent.querySelector('.groupTOC').querySelector('h3').textContent : "",
      subTitle: endContent ? endContent.querySelector('.groupTOC').querySelector('p').textContent : "",
      id: this.fireStore.fireStore.createId(),
      hasAssistant: true,
      assistant: null,
      length: '60',
      path: path,
      isCalendarAdded: false,
      lengthTime: moment('01:00:00', 'hh:mm:ss').toDate().getTime(),
      privilege: [Privilege.elder],
      index: 1,
      isEmailed: false,
      date: date,
      isConfirmed: false,
      parent: Parent.wt,
      week: weekID
    })
      return parts
  }

  parseWolContent(wolWeek: WOLWeek, date: Date, path: string) : [WeekProgram, Part[]] {

    let weekID = this.fireStore.fireStore.createId();
    let endContent: Document;
   if (wolWeek.items.length > 1) {
      let midContent: Document = this.parse.parseFromString(wolWeek.items[1].content, "text/html");
      if (wolWeek.items.length > 2) {
         endContent = this.parse.parseFromString(wolWeek.items[2].content, "text/html");
      }
      let parts : Part[] = [];

      midContent.getElementById('section2')
      .querySelector('ul')
      .querySelectorAll('.so')
      .forEach((element, i) => {
         parts.push({
            assignee: null,
            hasDiscussion: false,
            hasAssistant: false,
            assistant: null,
            gender: [Gender.brother],
            id: this.fireStore.fireStore.createId(),
            length: element.textContent.match(/\(([^)]+)\)/)[1],
            privilege: element.textContent.match(/\(([^)]+)\)/)[1].includes('10') ? [Privilege.elder, Privilege.ms] : [Privilege.pub, Privilege.elder, Privilege.ms],
            subTitle: "",
            path: path,
            title: element.textContent,
            lengthTime: moment(element.textContent.match(/\(([^)]+)\)/)[1].match(/\d+/)[0]).toDate().getTime(),
            index: i,
            isConfirmed: false,
            isEmailed: false,
            isCalendarAdded: false,
            parent: Parent.treasures,
            date: date,
            week: weekID
         })
      })

      parts[1].hasDiscussion = true;

    midContent.getElementById('section3')
    .querySelector('ul')
    .querySelectorAll('.so')
    .forEach((element, i) => {

       parts.push({
          assignee: null,
          hasDiscussion: element.textContent.match(/\(([^)]+)\)/)[1].includes('15'),
          hasAssistant: !element.textContent.match(/\(([^)]+)\)/)[1].includes('15'),
          assistant: null,
          path: path,
          gender: element.textContent.match(/\(([^)]+)\)/)[1].includes('15') ? [Gender.brother] : [Gender.sister, Gender.brother],
          id: this.fireStore.fireStore.createId(),
          length: element.textContent.match(/\(([^)]+)\)/)[1],
          privilege: element.textContent.match(/\(([^)]+)\)/)[1].includes('15') ? [Privilege.elder, Privilege.ms] : [Privilege.elder, Privilege.ms, Privilege.pub],
          isEmailed: false,
          subTitle: "",
          title: element.textContent,
          lengthTime: moment(element.textContent.match(/\(([^)]+)\)/)[1].match(/\d+/)[0]).toDate().getTime(),
          index: i,
          isCalendarAdded: false,
          isConfirmed: false,
          parent: Parent.apply,
          date: date,
          week: weekID
       })
    })

    let lifeParts : Part[] = [];
    midContent.getElementById('section4')
    .querySelector('ul')
    .querySelectorAll('li')
    .forEach((element, i) => {

     lifeParts.push({
          assignee: null,
          hasDiscussion: false,
          hasAssistant: false,
          assistant: null,
          path: path,
          gender: [Gender.brother],
          id: this.fireStore.fireStore.createId(),
          length: element.textContent.match(/\(([^)]+)\)/) ? element.textContent.match(/\(([^)]+)\)/)[1] : '',
          lengthTime: element.textContent.match(/\(([^)]+)\)/) ? moment(element.textContent.match(/\(([^)]+)\)/)[1].match(/\d+/)[0]).toDate().getTime() : null,
          privilege: [Privilege.elder, Privilege.ms],
          subTitle: '',
          title: element.textContent,
          index: i,
          isCalendarAdded: false,
          isEmailed: false,
          isConfirmed: false,
          parent: Parent.life,
          date: date,
          week: weekID
       })
    })

    lifeParts.pop();
    lifeParts.pop();
    lifeParts.shift();
    lifeParts[lifeParts.length - 1].hasAssistant = true;
    parts.push(...lifeParts)

    for(var p = 0; p < 4; p++) {
      parts.push({
         id: this.fireStore.fireStore.createId(),
         assignee: null,
         hasDiscussion: false,
         hasAssistant: false,
         gender: [Gender.brother],
         isConfirmed: false,
         index: p,
         path: path,
         isEmailed: false,
         parent: Parent.prayer,
         isCalendarAdded: false,
         title: 'Priere',
         date: date,
         privilege: [Privilege.elder, Privilege.ms, Privilege.pub],
         week: weekID
      })
   }

   for(var c = 0; c < 2; c++) {
      parts.push({
         id: this.fireStore.fireStore.createId(),
         assignee: null,
         hasDiscussion: false,
         hasAssistant: false,
         gender: [Gender.brother],
         isConfirmed: false,
         index: c,
         isCalendarAdded: false,
         path: path,
         parent: Parent.chairman,
         title: 'President',
         isEmailed: false,
         date: date,
         privilege: [Privilege.elder, Privilege.ms],
         week: weekID
      })
   }


       parts.push({
            assignee: null,
            gender: [Gender.brother],
            id: this.fireStore.fireStore.createId(),
            length: '30',
            lengthTime: moment('00:30:00', 'hh:mm:ss').toDate().getTime(),
            privilege: [Privilege.elder, Privilege.ms],
            title: "",
            path: path,
            subTitle: "",
            hasAssistant: false,
            index: 0,
            isCalendarAdded: false,
            isEmailed: false,
            isConfirmed: false,
            date: date,
            parent: Parent.talk,
            week: weekID
       },
       {
         assignee: null,
         gender: [Gender.brother],
         title: endContent ? endContent.querySelector('.groupTOC').querySelector('h3').textContent : "",
         subTitle: endContent ? endContent.querySelector('.groupTOC').querySelector('p').textContent : "",
         id: this.fireStore.fireStore.createId(),
         hasAssistant: true,
         assistant: null,
         length: '60',
         path: path,
         isCalendarAdded: false,
         lengthTime: moment('01:00:00', 'hh:mm:ss').toDate().getTime(),
         privilege: [Privilege.elder],
         index: 1,
         isEmailed: false,
         date: date,
         isConfirmed: false,
         parent: Parent.wt,
         week: weekID
       })

      let weekProgram : WeekProgram = {
         date: date,
         isSent: false,
         range: midContent.querySelector('header').querySelector('#p1').textContent,
         id: weekID,
         isCOVisit: false
      }
      return [weekProgram, parts];
   } else {
      return null;
   }
  }

}
