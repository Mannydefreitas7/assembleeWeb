import moment from 'moment';
import { v4 } from 'uuid';
import { CONG_ID } from '../constants';
import { Congregation } from '../models/congregation';
import { Gender, Privilege } from '../models/publisher';
import { Parent, Part, WeekProgram, WOLWeek } from '../models/wol';
import firebase from 'firebase/app';

export class WOLApi {
  async getWeekProgram(
    year: number,
    month: number,
    day: number,
    apiURL: string
  ): Promise<Response> {
    let url = `${process.env.REACT_APP_WOL_URL}${apiURL}${year}/${month}/${day}`;
    return await fetch(url);
  }

  parseMidWeek(
    wolWeek: WOLWeek,
    date: Date,
    path: string,
    weekID: string
  ): Part[] {
    const parse = new DOMParser();
    let midContent: Document = parse.parseFromString(
      wolWeek.items[1].content,
      'text/html'
    );
    let parts: Part[] = [];

    // Treasures
    midContent
      ?.getElementById('section2')
      ?.querySelector('ul')
      ?.querySelectorAll('.so')
      .forEach((element, i) => {
        let time = element?.textContent?.match(/\(([^)]+)\)/) ?? [];
        parts.push({
          hasDiscussion: false,
          hasAssistant: false,
          gender: [Gender.brother],
          id: v4(),
          length: time[1] ?? '1',
          privilege: time[1].includes('10')
            ? [Privilege.elder, Privilege.ms]
            : [Privilege.pub, Privilege.elder, Privilege.ms],
          subTitle: '',
          path: path,
          title: element?.textContent ?? '',
          lengthTime: moment((time[1].match(/\d+/) ?? [])[0])
            .toDate()
            .getTime(),
          index: i,
          isConfirmed: false,
          isEmailed: false,
          isCalendarAdded: false,
          parent: Parent.treasures,
          date: date,
          week: weekID,
        });
      });
    parts[1].hasDiscussion = true;

    // Apply
    midContent
      ?.getElementById('section3')
      ?.querySelector('ul')
      ?.querySelectorAll('.so')
      .forEach((element, i) => {
        let time = element?.textContent?.match(/\(([^)]+)\)/) ?? [];
        parts.push({
          hasDiscussion: time[1].includes('15'),
          hasAssistant: !time[1].includes('15'),
          path: path,
          gender: time[1].includes('15')
            ? [Gender.brother]
            : [Gender.sister, Gender.brother],
          id: v4(),
          length: time[1],
          privilege: time[1].includes('15')
            ? [Privilege.elder, Privilege.ms]
            : [Privilege.elder, Privilege.ms, Privilege.pub],
          isEmailed: false,
          subTitle: '',
          title: element?.textContent ?? '',
          lengthTime: moment((time[1].match(/\d+/) ?? [])[0])
            .toDate()
            .getTime(),
          index: i,
          isCalendarAdded: false,
          isConfirmed: false,
          parent: Parent.apply,
          date: date,
          week: weekID,
        });
      });

    // Living
    let lifeParts: Part[] = [];
    midContent
      .getElementById('section4')
      ?.querySelector('ul')
      ?.querySelectorAll('li')
      .forEach((element, i) => {
        let time = element?.textContent?.match(/\(([^)]+)\)/) ?? [];
        lifeParts.push({
          hasDiscussion: false,
          hasAssistant: false,
          path: path,
          gender: [Gender.brother],
          id: v4(),
          length: element?.textContent?.match(/\(([^)]+)\)/) ? time[1] : '',
          lengthTime: element?.textContent?.match(/\(([^)]+)\)/)
            ? moment((time[1].match(/\d+/) ?? [])[0])
                .toDate()
                .getTime()
            : 10,
          privilege: [Privilege.elder, Privilege.ms],
          subTitle: '',
          title: element?.textContent ?? '',
          index: i,
          isCalendarAdded: false,
          isEmailed: false,
          isConfirmed: false,
          parent: Parent.life,
          date: date,
          week: weekID,
        });
      });

    lifeParts.pop();
    lifeParts.pop();
    lifeParts.shift();
    lifeParts[lifeParts.length - 1].hasAssistant = true;
    parts.push(...lifeParts);

    return parts;
  }

  weekSchedule(
    wolWeek: WOLWeek,
    date: Date,
    path: string,
    range: string
  ): WeekProgram {
    let weekID = v4();
    let weekProgram: WeekProgram = {
      date: date,
      isSent: false,
      range: range,
      id: weekID,
      isCOVisit: false,
    };
    return weekProgram;
  }

  parseWeekEnd(
    wolWeek: WOLWeek,
    date: Date,
    path: string,
    weekID: string
  ): Part[] {
    const parse = new DOMParser();
    let endContent: Document = parse.parseFromString(
      wolWeek.items[wolWeek.items.length - 1].content,
      'text/html'
    );
    let parts: Part[] = [];
    parts.push(
      {
        gender: [Gender.brother],
        id: v4(),
        length: '30',
        lengthTime: moment('00:30:00', 'hh:mm:ss').toDate().getTime(),
        privilege: [Privilege.elder, Privilege.ms],
        title: '',
        path: path,
        subTitle: '',
        hasAssistant: false,
        index: 0,
        isCalendarAdded: false,
        isEmailed: false,
        isConfirmed: false,
        date: date,
        parent: Parent.talk,
        week: weekID,
      },
      {
        gender: [Gender.brother],
        title: endContent?.querySelector('.groupTOC')?.querySelector('h3')
              ?.textContent ?? '',
        subTitle: endContent?.querySelector('.groupTOC')?.querySelector('p')
              ?.textContent ?? '',
        id: v4(),
        hasAssistant: true,
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
        week: weekID,
      }
    );
    return parts;
  }

  addPrayers(date: Date, path: string, weekID: string): Part[] {
    let parts: Part[] = [];
    for (var p = 0; p < 4; p++) {
      parts.push({
        id: v4(),
        hasDiscussion: false,
        hasAssistant: false,
        gender: [Gender.brother],
        isConfirmed: false,
        index: p,
        path: path,
        isEmailed: false,
        parent: Parent.prayer,
        isCalendarAdded: false,
        title: 'Prière',
        date: date,
        privilege: [Privilege.elder, Privilege.ms, Privilege.pub],
        week: weekID,
      });
    }
    return parts;
  }

  addChairmans(date: Date, path: string, weekID: string): Part[] {
    let parts: Part[] = [];
    for (var c = 0; c < 2; c++) {
      parts.push({
        id: v4(),
        hasDiscussion: false,
        hasAssistant: false,
        gender: [Gender.brother],
        isConfirmed: false,
        index: c,
        isCalendarAdded: false,
        path: path,
        parent: Parent.chairman,
        title: 'Président',
        isEmailed: false,
        date: date,
        privilege: [Privilege.elder, Privilege.ms],
        week: weekID,
      });
    }
    return parts;
  }

  parseWolContent(
    wolWeek: WOLWeek,
    date: Date,
    path: string
  ): [WeekProgram, Part[]] {
    const parse = new DOMParser();
    let weekID = v4();
    let endContent: Document;
    if (wolWeek.items.length > 1) {
      let midContent: Document = parse.parseFromString(
        wolWeek.items[1].content,
        'text/html'
      );
      if (wolWeek.items.length > 2) {
        endContent = parse.parseFromString(
          wolWeek.items[2].content,
          'text/html'
        );
      }
      let parts: Part[] = [];

      // Treasures
      midContent
        ?.getElementById('section2')
        ?.querySelector('ul')
        ?.querySelectorAll('.so')
        .forEach((element, i) => {
          let time = element?.textContent?.match(/\(([^)]+)\)/) ?? [];
          parts.push({
            hasDiscussion: false,
            hasAssistant: false,
            gender: [Gender.brother],
            id: v4(),
            length: time[1] ?? '1',
            privilege: time[1].includes('10')
              ? [Privilege.elder, Privilege.ms]
              : [Privilege.pub, Privilege.elder, Privilege.ms],
            subTitle: '',
            path: path,
            title: element?.textContent ?? '',
            lengthTime: moment((time[1].match(/\d+/) ?? [])[0])
              .toDate()
              .getTime(),
            index: i,
            isConfirmed: false,
            isEmailed: false,
            isCalendarAdded: false,
            parent: Parent.treasures,
            date: date,
            week: weekID,
          });
        });
      parts[1].hasDiscussion = true;

      // Apply
      midContent
        ?.getElementById('section3')
        ?.querySelector('ul')
        ?.querySelectorAll('.so')
        .forEach((element, i) => {
          let time = element?.textContent?.match(/\(([^)]+)\)/) ?? [];
          parts.push({
            hasDiscussion: time[1].includes('15'),
            hasAssistant: !time[1].includes('15'),
            path: path,
            gender: time[1].includes('15')
              ? [Gender.brother]
              : [Gender.sister, Gender.brother],
            id: v4(),
            length: time[1],
            privilege: time[1].includes('15')
              ? [Privilege.elder, Privilege.ms]
              : [Privilege.elder, Privilege.ms, Privilege.pub],
            isEmailed: false,
            subTitle: '',
            title: element?.textContent ?? '',
            lengthTime: moment((time[1].match(/\d+/) ?? [])[0])
              .toDate()
              .getTime(),
            index: i,
            isCalendarAdded: false,
            isConfirmed: false,
            parent: Parent.apply,
            date: date,
            week: weekID,
          });
        });

      // Living
      let lifeParts: Part[] = [];
      midContent
        .getElementById('section4')
        ?.querySelector('ul')
        ?.querySelectorAll('li')
        .forEach((element, i) => {
          let time = element?.textContent?.match(/\(([^)]+)\)/) ?? [];
          lifeParts.push({
            hasDiscussion: false,
            hasAssistant: false,
            path: path,
            gender: [Gender.brother],
            id: v4(),
            length: element?.textContent?.match(/\(([^)]+)\)/) ? time[1] : '',
            lengthTime: element?.textContent?.match(/\(([^)]+)\)/)
              ? moment((time[1].match(/\d+/) ?? [])[0])
                  .toDate()
                  .getTime()
              : 10,
            privilege: [Privilege.elder, Privilege.ms],
            subTitle: '',
            title: element?.textContent ?? '',
            index: i,
            isCalendarAdded: false,
            isEmailed: false,
            isConfirmed: false,
            parent: Parent.life,
            date: date,
            week: weekID,
          });
        });

      lifeParts.pop();
      lifeParts.pop();
      lifeParts.shift();
      lifeParts[lifeParts.length - 1].hasAssistant = true;
      parts.push(...lifeParts);

      for (var p = 0; p < 4; p++) {
        parts.push({
          id: v4(),
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
          week: weekID,
        });
      }

      for (var c = 0; c < 2; c++) {
        parts.push({
          id: v4(),
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
          week: weekID,
        });
      }

      if (wolWeek.items.length > 2) {
        endContent = parse.parseFromString(
          wolWeek.items[2].content,
          'text/html'
        );
        parts.push(
          {
            gender: [Gender.brother],
            id: v4(),
            length: '30',
            lengthTime: moment('00:30:00', 'hh:mm:ss').toDate().getTime(),
            privilege: [Privilege.elder, Privilege.ms],
            title: '',
            path: path,
            subTitle: '',
            hasAssistant: false,
            index: 0,
            isCalendarAdded: false,
            isEmailed: false,
            isConfirmed: false,
            date: date,
            parent: Parent.talk,
            week: weekID,
          },
          {
            gender: [Gender.brother],
            title: endContent?.querySelector('.groupTOC')?.querySelector('h3')
              ?.textContent ?? '',
            subTitle: endContent?.querySelector('.groupTOC')?.querySelector('p')
              ?.textContent ?? '',
            id: v4(),
            hasAssistant: true,
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
            week: weekID,
          }
        );
      }

      let weekProgram: WeekProgram = {
        date: date,
        isSent: false,
        range: midContent.querySelector('header')?.querySelector('#p1')
          ?.textContent ?? '',
        id: weekID,
        isCOVisit: false,
      };
      return [weekProgram, parts];
    } else {
      return [{}, []];
    }
  }

  async downloadMidWeek(
    week: WeekProgram,
    congregation: Congregation,
    fireStore: firebase.firestore.Firestore
  ) {
    let path: string = `congregations/${CONG_ID}`;
    try {
      let wolWeekPromise = await this.getWeekProgram(
        moment(week.date.toDate()).year(),
        moment(week.date.toDate()).month() + 1,
        week.date.toDate().getDate(),
        congregation?.fireLanguage?.apiURL!
      );
      if (wolWeekPromise.status === 200) {
        let wolWeek: WOLWeek = await wolWeekPromise.json();
        if (wolWeek.items.length > 2) {
          let midWeekPart: Part[] = this.parseMidWeek(
            wolWeek,
            week.date.toDate(),
            path,
            week.id!
          );
          midWeekPart.forEach((part) => {
            fireStore
              .doc(`${path}/weeks/${week.id}/parts/${part.id}`)
              .set(part);
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
