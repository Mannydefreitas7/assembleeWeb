import { Component, OnInit } from '@angular/core';
import { DocumentData, DocumentReference } from '@angular/fire/firestore';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { config } from 'process';
import { AuthService } from 'src/app/auth/auth.service';
import { MonthData } from 'src/app/models/month.model';
import { Publisher } from 'src/app/models/publisher.model';
import { FireStoreService } from 'src/app/services/fire-store.service';
import { StoreService } from 'src/app/services/store.service';
import { WolApiService } from 'src/app/services/wol-api.service';
import moment from 'moment';
import { WOLWeek } from 'src/app/models/wol.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.scss']
})
export class ProgramsComponent implements OnInit {

   year: number;
   selectedYear: number;
   years: number[];
   monthData: MonthData;
   $weekProgram: Observable<WOLWeek[]>;
  constructor(
     private wolApiService: WolApiService,
     public storeService: StoreService,
     public fireStoreService: FireStoreService,
     public authService: AuthService
  ) { }
  active = 'top';
  ngOnInit(): void {
     this.year = new Date().getFullYear();
     this.selectedYear = new Date().getFullYear();
      this.years = [this.year, this.year + 1]
      this.storeService.getMonths(this.year);
      this.monthData = this.storeService.months[0];
     // this.loadMonths();
 // this.wolApiService.getWeekProgram().subscribe(console.log)
 this.loadWeeks();
  }

  selectedMonth() {
//     this.monthData = this.storeService.months[0];
  }

  loadMonths() {
     
      this.storeService.getMonths(this.selectedYear);
      this.storeService.months;
      this.monthData = this.storeService.months[0];
  }

  addMonthProgram() {
     let mondays = this.storeService.getMondays(this.monthData.date);
      // if has account, do fireStore
      this.authService.afAuth.user
      .subscribe(user => {
         this.fireStoreService.read(`publishers/${user.uid}`)
         .subscribe((publisher => {
            mondays.forEach(monday => {
          
               this.wolApiService.getWeekProgram(this.selectedYear, moment(monday).month() + 1, monday.getDate())
               .toPromise()
               .then(wolWeek => {
                 this.fireStoreService.addWeekProgram(publisher.congregationID, monday, wolWeek)
               })
            })
         }))
      })
      // if not, use localStorage
     
  }

  loadWeeks() {
     
     this.authService.afAuth.user
     .subscribe(user => {
      this.fireStoreService.read(`publishers/${user.uid}`)
      .subscribe((publisher: Publisher) => {
         console.log(publisher)
         console.log(publisher.congregationID)
         this.$weekProgram =
         this.fireStoreService.readCollection(`congregations/${publisher.congregationID}/weeks`)

         this.$weekProgram.subscribe(data => {
            this.wolApiService.parseWolContent(data[0].items[1].content);
         })
         //.subscribe(console.log)
            // this.wolApiService.getWeekProgram(this.selectedYear, moment(monday).month() + 1, monday.getDate())
            // .toPromise()
            // .then(wolWeek => {
            //   this.fireStoreService.addWeekProgram(publisher.congregationID, monday, wolWeek)
            // })

      })
   })
   }


  


}
