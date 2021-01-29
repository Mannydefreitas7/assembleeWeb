import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForage } from 'ngforage';
import { Congregation } from 'src/app/models/congregation.model';
import { Part, WeekProgram } from 'src/app/models/wol.model';
import { FireStoreService } from 'src/app/services/fire-store.service';
import moment, { WeekSpec } from 'moment';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  constructor(
    public fireStore: FireStoreService,
    public forage: NgForage,
    public route: ActivatedRoute
  ) { }

  congregation: Congregation;
  weeks: WeekProgram[];
  parts: Part[];
  ngOnInit(): void {
    
    this.route.url.subscribe(data => {
      if (data.length > 1) {
        let congID = data[2].path;
        this.fireStore.fireStore.doc<Congregation>(`congregations/${congID}`)
        .valueChanges()
        .pipe(take(1))
        .subscribe(cong => this.congregation = cong)
        this.loadWeeks(congID)
      }
    })
  }

  loadWeeks(congID: String) {
      this.fireStore.fireStore
        .collection<WeekProgram>(`congregations/${congID}/weeks`, (ref) =>
          ref.orderBy('date', 'asc')
        )
        .valueChanges()
        .pipe(
          map(weeks => {
            return weeks.filter(week => moment(week.date.toDate()).isAfter(new Date()))
          }),
        //  take(1)
        )
        .subscribe((data) => {
          this.weeks = data;
          this.weeks.forEach(week => {
            this.fireStore.fireStore.collection<Part>(`congregations/${congID}/parts`, ref => ref.where('week', '==', week.id)).valueChanges()
            .pipe(
             // take(1)
            )
            .subscribe(parts => {
              this.parts = parts;
             })
          })
      });
  }

}
