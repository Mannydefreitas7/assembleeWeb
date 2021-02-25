import { HostListener, Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NgForage } from 'ngforage';
import moment, { MomentInput } from 'moment';
import { MonthData } from '../models/month.model';
@Injectable({
  providedIn: 'root',
})
export class StoreService {
  isNavToggled: boolean = false;
  today: Date = new Date();
  showNextYear: boolean = false;
  months: Array<MonthData> = [];
  publisherActiveTab: number = 0;
  public innerWidth: any;
  constructor(public ngf: NgForage) {
    this.onResize();
  }

  public getItem<T = any>(key: string): Promise<T> {
    return this.ngf.getItem<T>(key);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }

  getMonths(year: number) {
    this.months = [];
    let today = moment(new Date());
    let twoMonths = moment(new Date()).add(2, 'month');
    if (moment(today).year() === twoMonths.year()) {
      this.showNextYear = false;
      for (
        var i = moment(new Date()).month();
        i <= moment(new Date()).month() + 3;
        i++
      ) {
        let month: MonthData = {
          name: moment.months()[i],
          date: moment(new Date()).month(i).toDate(),
        };
        this.months.push(month);
      }
    } else {
      let _currentMonthIndex = today.toDate().getMonth();
      this.showNextYear = true;
      let nextMonth = moment(new Date()).add(1, 'month');
      let nextMonthIndex = nextMonth.month();
      let nextTwoMonth = moment(new Date()).add(2, 'month');
      let nextTwoIndex = nextMonth.month();

      this.months = [
        {
          name: moment.months()[_currentMonthIndex],
          date: moment().month(_currentMonthIndex).toDate(),
        },
        {
          name: moment.months()[nextMonthIndex],
          date: nextMonth.toDate(),
        },
        {
          name: moment.months()[nextTwoIndex + 1],
          date: nextTwoMonth.toDate(),
        },
        {
          name: moment.months()[nextTwoIndex + 2],
          date: nextTwoMonth.toDate(),
        },
      ].filter((month) => month.date.getFullYear() == year);
    }
  }

  toggleNav() {
    this.isNavToggled = !this.isNavToggled;
  }

  getMondays(date: Date): Date[] {
    let startMonth = moment(date).startOf('month').day('Monday');
    
    let endMonth = moment(date).endOf('month');
    let mondays: Date[] = [];
    let numberOfWeeks = moment(endMonth).diff(startMonth, 'week');
    for (var i = 1; i <= numberOfWeeks; i++) {
      let next = startMonth.add(1, 'week');
      mondays.push(next.toDate());
    }
    return mondays;
  }
}
