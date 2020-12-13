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
     console.log("BUTTON PRESSED")
     let mondays = this.storeService.getMondays(this.monthData.date);
      // if has account, do fireStore
      this.authService.afAuth.user
     /// .toPromise()
      .subscribe(user => {
         console.log(user)
         this.fireStoreService.read(`publishers/${user.uid}`)
       //  .toPromise<Publisher>()
         .subscribe((publisher => {
            mondays.forEach(monday => {
          
               this.wolApiService.getWeekProgram(this.selectedYear, moment(monday).month() + 1, monday.getDate())
               .toPromise()
               .then(wolWeek => {
                 // console.log(wolWeek)
                 this.fireStoreService.addWeekProgram(publisher.congregationID, monday, wolWeek)
               })
            })
         }))
      })

      // if not, use localStorage
     
  }


}
