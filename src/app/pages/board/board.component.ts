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
import { ExportService } from 'src/app/services/export.service';
import { environment } from 'src/environments/environment';

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
    
        this.fireStore.fireStore.doc<Congregation>(`congregations/${environment.cong}`)
        .get()
        .subscribe(cong => this.congregation = cong.data())
        this.loadWeeks(environment.cong)
  }

  loadProgram(congID: String, weekID: string) : Observable<Part[]> {
   return this.fireStore.fireStore.collection<Part>(`congregations/${congID}/weeks/${weekID}/parts`).valueChanges()
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


  onWeekChange(weeks: WeekProgram[]) {
      this.loadProgram(environment.cong, weeks[this.active].id).subscribe(parts => weeks[this.active].parts = parts)
    }

    


  loadWeeks(congID: String) {
      this.fireStore.fireStore
        .collection<WeekProgram>(`congregations/${congID}/weeks`, (ref) =>
           ref.where('isSent', "==", true)
        )
        .valueChanges()
        .pipe(
          map(weeks => {
            return weeks.filter(week => moment(week.date.toDate()).isAfter(moment(new Date()).subtract('1', 'week')))
          }),
          map(weeks => {
            return weeks.sort((a, b) => a.date.toDate() - b.date.toDate())
          })
        )
        .subscribe((data) => {
          this.weeks = data;
          this.loadProgram(congID, data[this.active].id).subscribe(parts => data[this.active].parts = parts)
      });
  }

}
