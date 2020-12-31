import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { MonthData } from 'src/app/models/month.model';
import { FireStoreService } from 'src/app/services/fire-store.service';
import { StoreService } from 'src/app/services/store.service';
import { WolApiService } from 'src/app/services/wol-api.service';
import moment from 'moment';
import { Part, WeekProgram } from 'src/app/models/wol.model';
import { Observable, Subject } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Congregation } from 'src/app/models/congregation.model';
import { LocalStorageService } from 'ngx-webstorage';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExportService } from 'src/app/services/export.service';
import { takeUntil } from 'rxjs/operators';
import { MatDrawer } from '@angular/material/sidenav';
import { NgForage } from 'ngforage';
@AutoUnsubscribe()
@Component({
   selector: 'app-programs',
   templateUrl: './programs.component.html',
   styleUrls: ['./programs.component.scss'],
   host: {
    '(window:resize)': 'onResize($event)',
  },
})


export class ProgramsComponent implements OnInit, OnDestroy {

   year: number;
   selectedYear: number;
   years: number[];
   monthData: MonthData;
   monday: Date;
   exportPDFisActive: boolean;
   isLoading: boolean = false;
   weekProgram: WeekProgram[];
   ngUnsubscribe = new Subject();
   innerWidth: number;
   @ViewChild('sidenav') sidenav: MatDrawer;


   constructor(
      private wolApiService: WolApiService,
      public storeService: StoreService,
      public storage: LocalStorageService,
      public forage: NgForage,
      public fireStoreService: FireStoreService,
      public authService: AuthService,
      private spinner: NgxSpinnerService,
      private exportService: ExportService
   ) { }
   active = 0;

   ngOnInit(): void {
      this.year = new Date().getFullYear();
      this.selectedYear = new Date().getFullYear();
      this.years = [this.year, this.year + 1]
      this.storeService.getMonths(this.year);
      this.monthData = this.storeService.months[0];
      this.loadWeeks();
   }

   ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
}


onResize(event) {
  this.innerWidth = event.target.innerWidth;
  this.toggleSideBarOnResize()
}

toggleSideBarOnResize() {
  if (this.innerWidth < 700) {
    this.sidenav.close();
  } else {
    this.sidenav.open();
  }
}

   downloadMonthPDF(weeks: WeekProgram[]) {
       let filteredWeeks = weeks.filter(d => d.date.toDate().getMonth() == this.monthData.date.getMonth())
       if (filteredWeeks.length > 0) {
         this.exportPDFisActive = true;
        this.exportService.downloadMonthPDF(filteredWeeks)
       } else {
         this.exportPDFisActive = false;
       }
   }

   emailMonthPDF(weeks: WeekProgram[]) {
    let filteredWeeks = weeks.filter(d => d.date.toDate().getMonth() == this.monthData.date.getMonth())
    if (filteredWeeks.length > 0) {
      this.exportPDFisActive = true;
     this.exportService.emailMonthPDF(filteredWeeks)
    } else {
      this.exportPDFisActive = false;
    }
}

   loadMonths() {
      this.storeService.getMonths(this.selectedYear);
      this.monthData = this.storeService.months[0];
      this.checkCanExport()
   }

   addMonthProgram() {
     this.spinner.show()
      let mondays = this.storeService.getMondays(this.monthData.date);
      this.forage.getItem<Congregation>('congregation').then(congregation => {
        this.forage.getItem<string>('congregationRef').then(path => {
          mondays.forEach(monday => {
            this.wolApiService.getWeekProgram(this.selectedYear, moment(monday).month() + 1, monday.getDate(), congregation.fireLanguage.apiURL)
                .toPromise()
                .then(wolWeek => {
                  if (this.wolApiService.parseWolContent(wolWeek, monday)) {

                      let wolContent = this.wolApiService.parseWolContent(wolWeek, monday);

                      this.fireStoreService.addWeekProgram(path, monday, wolContent[0]).then(_ => {
                        wolContent[1].forEach(part => {
                            this.fireStoreService.fireStore.doc<Part>(`${path}/weeks/${wolContent[0].id}/parts/${part.id}`).set(part)
                        })
                      })
                  }
            }).catch(console.log)
            .finally(() => this.spinner.hide())
        })
        })
    })
   }

   checkCanExport() {
    this.forage.getItem('congregationRef').then(path => {
      this.fireStoreService.fireStore.
      collection<WeekProgram>(`${path}/weeks`, ref => ref.orderBy('date', 'asc')).valueChanges().subscribe(data => {
  let filteredWeeks = data.filter(d => d.date.toDate().getMonth() == this.monthData.date.getMonth())
  if (filteredWeeks.length > 0) {
    this.exportPDFisActive = true;
  } else {
    this.exportPDFisActive = false;
  }
})
    })
   }

   deleteMonth(weeks: WeekProgram[]) {
    this.forage.getItem('congregationRef').then(path => {
      let filteredWeeks = weeks.filter(d => d.date.toDate().getMonth() == this.monthData.date.getMonth())
      if (filteredWeeks.length > 0) {
        filteredWeeks.forEach(week => {

          this.fireStoreService.fireStore.doc(`${path}/weeks/${week.id}`).collection('parts').get().pipe(
            takeUntil(this.ngUnsubscribe)
          ).subscribe(parts => {
            parts.forEach(part => part.exists ? this.fireStoreService.delete(`${path}/weeks/${week.id}/parts/${part.id}`) : '')
          },console.log, () => this.fireStoreService.fireStore.doc(`${path}/weeks/${week.id}`).delete())

        })
      }
    })

   }

   loadWeeks() {
    this.forage.getItem('congregationRef').then(path => {
      this.fireStoreService.fireStore.
      collection<WeekProgram>(`${path}/weeks`, ref => ref.orderBy('date', 'asc')).valueChanges().subscribe(data => {
        this.weekProgram = data
        if (data.length == 0) this.sidenav.close()
      })
    this.checkCanExport()
    })
   }
}
