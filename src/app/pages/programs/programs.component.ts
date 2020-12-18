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
import { WeekProgram, WOLWeek } from 'src/app/models/wol.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';

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
   $weekProgram: Observable<WeekProgram[]>;
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
                  if (this.wolApiService.parseWolContent(wolWeek, monday)) {
                     this.fireStoreService.addWeekProgram(publisher.congregationID, monday, this.wolApiService.parseWolContent(wolWeek, monday))
                  }
               })
            })
         }))
      })
      // if not, use localStorage
     
  }

  loadWeeks() {
     this.authService.afAuth.user
     .subscribe(user => {
      this.fireStoreService.read(`users/${user.uid}`)
      .subscribe((user: User) => {
        this.$weekProgram =
        this.fireStoreService.readCollection(`${user.congregation}/weeks`).pipe(map(arr => arr.sort((a,b) => a.date - b.date)))
      })
   })
   }
}
