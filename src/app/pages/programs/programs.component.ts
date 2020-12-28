import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { MonthData } from 'src/app/models/month.model';
import { FireStoreService } from 'src/app/services/fire-store.service';
import { StoreService } from 'src/app/services/store.service';
import { WolApiService } from 'src/app/services/wol-api.service';
import moment from 'moment';
import { Part, WeekProgram } from 'src/app/models/wol.model';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Congregation } from 'src/app/models/congregation.model';
import { LocalStorageService } from 'ngx-webstorage';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExportService } from 'src/app/services/export.service';
import  firestore  from 'firebase/app';
import Timestamp = firestore.firestore.Timestamp;
@AutoUnsubscribe()
@Component({
   selector: 'app-programs',
   templateUrl: './programs.component.html',
   styleUrls: ['./programs.component.scss']
})
export class ProgramsComponent implements OnInit, OnDestroy {

   year: number;
   selectedYear: number;
   years: number[];
   monthData: MonthData;
   monday: Date;
   exportPDFisActive: boolean;
   isLoading: boolean = false;
   $weekProgram: Observable<WeekProgram[]>;
   constructor(
      private wolApiService: WolApiService,
      public storeService: StoreService,
      public storage: LocalStorageService,
      public fireStoreService: FireStoreService,
      public authService: AuthService,
      private spinner: NgxSpinnerService,
      private exportService: ExportService
   ) { }
   active = '';
   ngOnInit(): void {
      this.year = new Date().getFullYear();
      this.selectedYear = new Date().getFullYear();
      this.years = [this.year, this.year + 1]
      this.storeService.getMonths(this.year);
      this.monthData = this.storeService.months[0];
      this.loadWeeks();
   }

   ngOnDestroy() {
   }

   createMonthPDF(weeks: WeekProgram[]) {
       let filteredWeeks = weeks.filter(d => d.date.toDate().getMonth() == this.monthData.date.getMonth())
       if (filteredWeeks.length > 0) {
         this.exportPDFisActive = true;
        this.exportService.createMonthPDF(filteredWeeks)
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
      // if has account, do fireStore
      let congregation : Congregation = this.storage.retrieve('congregation')
      let path : string = this.storage.retrieve('congregationref')
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
            }).finally(() => this.spinner.hide())
          })
   }

   checkCanExport() {
    this.$weekProgram.subscribe(data => {
      let filteredWeeks = data.filter(d => d.date.toDate().getMonth() == this.monthData.date.getMonth())
      if (filteredWeeks.length > 0) {
        this.exportPDFisActive = true;
      } else {
        this.exportPDFisActive = false;
      }
    })
   }

   deleteMonth(weeks: WeekProgram[]) {
    let path : string = this.storage.retrieve('congregationref')

      let filteredWeeks = weeks.filter(d => d.date.toDate().getMonth() == this.monthData.date.getMonth())
      if (filteredWeeks.length > 0) {
        filteredWeeks.forEach(week => {
          this.fireStoreService.fireStore.doc(`${path}/weeks/${week.id}`).delete()
        })

      }
   }

   loadWeeks() {
     let path : string = this.storage.retrieve('congregationref')
        this.$weekProgram = this.fireStoreService.fireStore.
          collection<WeekProgram>(`${path}/weeks`, ref => ref.orderBy('date', 'asc')).valueChanges()
        this.$weekProgram.subscribe(data => {
          if (data.length > 0) this.active = data[0].id;
          this.checkCanExport()
        }, console.log, () => {console.warn('FINISHED LOADING WEEKS')})
   }
}
