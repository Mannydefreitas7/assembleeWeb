import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForage } from 'ngforage';
import { Congregation } from 'src/app/models/congregation.model';
import { Part, WeekProgram } from 'src/app/models/wol.model';
import { FireStoreService } from 'src/app/services/fire-store.service';
import moment, { WeekSpec } from 'moment';
import { map, take } from 'rxjs/operators';
import { NgbCarousel, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  providers: [NgbCarouselConfig]
})
export class BoardComponent implements OnInit {

  constructor(
    public fireStore: FireStoreService,
    public forage: NgForage,
    public route: ActivatedRoute,
    public config: NgbCarouselConfig
  ) { 
    config.showNavigationArrows = false;
    config.showNavigationIndicators = false;
  }

  @ViewChild('carousel') carousel: NgbCarousel;
  active = 0;
  congregation: Congregation;
  weeks: WeekProgram[] = []
  parts: Part[];
  showNavigationArrows = false;
  showNavigationIndicators = false;

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

  loadProgram(congID: String, weekID: string) : Observable<Part[]> {
   return this.fireStore.fireStore.collection<Part>(`congregations/${congID}/parts`, ref => ref.where('week', '==', weekID)).valueChanges()
  }

  get nextDate() : Date {
      let index = 0;
      if (this.carousel)
      index = Number(this.carousel?.activeId.split('-')[2]) + 1;
      if (this.weeks[index])
      return this.weeks[index].date.toDate()
  }

  get prevDate() : Date {
    let index = 0;
      if (this.carousel) {
        index = Number(this.carousel?.activeId.split('-')[2]) - 1;
      }
     
      if (this.weeks[index])
      return this.weeks[index].date.toDate()
  }





  loadWeeks(congID: String) {
      this.fireStore.fireStore
        .collection<WeekProgram>(`congregations/${congID}/weeks`, (ref) =>
          ref.orderBy('date', 'asc')
        )
        .valueChanges()
        .pipe(
          map(weeks => {
            return weeks.filter(week => moment(week.date.toDate()).isAfter(moment(new Date()).subtract('1', 'week')))
          }),
          map(weeks => {
             weeks.forEach(week => {
              return this.loadProgram(congID, week.id).subscribe(parts => week.parts = parts)
            })
            return weeks 
          }),
       //   take(1)
        )
        .subscribe((data) => {
          this.weeks = data;
          
         // console.log(this.weeks)
      });
  }

}
