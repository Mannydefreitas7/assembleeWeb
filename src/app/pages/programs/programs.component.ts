import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { MonthData } from 'src/app/models/month.model';
import { FireStoreService } from 'src/app/services/fire-store.service';
import { StoreService } from 'src/app/services/store.service';
import { WolApiService } from 'src/app/services/wol-api.service';
import moment from 'moment';
import { Part, WeekProgram, WOLWeek } from 'src/app/models/wol.model';
import { Observable, Subject } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Congregation } from 'src/app/models/congregation.model';
import { LocalStorageService } from 'ngx-webstorage';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExportService } from 'src/app/services/export.service';
import { map, takeUntil } from 'rxjs/operators';
import { MatDrawer } from '@angular/material/sidenav';
import { NgForage } from 'ngforage';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertDeleteComponent } from 'src/app/components/modals/alert-delete/alert-delete.component';
import { ToastrService } from 'ngx-toastr';
import { error } from 'protractor';
import talks from './../../../assets/talks.json';
import { Talk } from 'src/app/models/publisher.model';
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
    public store: StoreService,
    public fireStoreService: FireStoreService,
    public authService: AuthService,
    public modal: NgbModal,
    private spinner: NgxSpinnerService,
    private exportService: ExportService,
    public toastService: ToastrService
  ) {}
  active = 0;

  ngOnInit(): void {
    this.store.publisherActiveTab = 0;
    this.year = new Date().getFullYear();
    this.selectedYear = new Date().getFullYear();
    this.years = [this.year, this.year + 1];
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
    this.toggleSideBarOnResize();
  }

  toggleSideBarOnResize() {
    if (this.innerWidth < 700) {
      this.sidenav.close();
    } else {
      this.sidenav.open();
    }
  }

  downloadMonthPDF(weeks: WeekProgram[]) {
    this.isLoading = true;
    let filteredWeeks = weeks.filter(
      (d) => d.date.toDate().getMonth() == this.monthData.date.getMonth()
    );
      this.exportService.downloadMonthPDF(filteredWeeks).then(() => {
        this.isLoading = false
      })

  }

  emailMonthPDF(weeks: WeekProgram[]) {
    let filteredWeeks = weeks.filter(
      (d) => d.date.toDate().getMonth() == this.monthData.date.getMonth()
    );
    if (filteredWeeks.length > 0) {
      this.exportPDFisActive = true;
      this.exportService.emailMonthPDF(filteredWeeks);
    } else {
      this.exportPDFisActive = false;
    }
  }

  loadMonths() {
    this.storeService.getMonths(this.selectedYear);
    this.monthData = this.storeService.months[0];
    this.checkCanExport();
  }

  addProgram(date: Date) {
    const promises: Promise<any>[] = [];
    this.forage.getItem<Congregation>('congregation').then((congregation) => {
      this.forage.getItem<string>('congregationRef').then((path) => {
        this.wolApiService
            .getWeekProgram(
              moment(date).year(),
              moment(date).month() + 1,
              date.getDate(),
              congregation.fireLanguage.apiURL
          ).toPromise().then(wolWeek => {
            if (this.wolApiService.parseWolContent(wolWeek, date, path)) {
              let wolContent = this.wolApiService.parseWolContent(
                wolWeek,
                date,
                path
              );
              let partPromise: Promise<any> = this.fireStoreService.addWeekProgram(
                path,
                date,
                wolContent[0]
              );
              promises.push(partPromise);
              partPromise.then((_) => {
                wolContent[1].forEach((part) => {
                  promises.push(
                    this.fireStoreService.fireStore
                      .doc<Part>(`${path}/parts/${part.id}`)
                      .set(part)
                  );
                });
              });
            }
          })
      })
    })
  }

  addMonthProgram() {
    this.isLoading = true;
    const promises: Promise<any>[] = [];
    let mondays = this.storeService.getMondays(this.monthData.date);
    this.forage.getItem<Congregation>('congregation').then((congregation) => {
      this.forage.getItem<string>('congregationRef').then((path) => {

        mondays.forEach((monday) => {
          let wolWeekPromise: Promise<WOLWeek> = this.wolApiService
            .getWeekProgram(
              this.selectedYear,
              moment(monday).month() + 1,
              monday.getDate(),
              congregation.fireLanguage.apiURL
            )
            .toPromise();
          wolWeekPromise
            .then((wolWeek) => {
              // if program exists at all
              if (wolWeek.items.length > 0) {
                let start = moment(monday).locale('fr');
                let range = `${moment(start).format("Do MMM")} - ${start.add(6, 'day').format('Do MMM')}`
                let week: WeekProgram = this.wolApiService.weekSchedule(wolWeek, monday, path, range)
                let weekPromise: Promise<any> = this.fireStoreService.addWeekProgram(
                  path,
                  monday,
                  week
                );
                promises.push(weekPromise);

                let prayers : Part[] = this.wolApiService.addPrayers(monday, path, week.id)
                let chairmans : Part[] = this.wolApiService.addChairmans(monday, path, week.id)

                prayers.forEach(prayer => {
                  promises.push(
                    this.fireStoreService.fireStore
                      .doc<Part>(`${path}/parts/${prayer.id}`)
                      .set(prayer)
                  );
                })
                chairmans.forEach(chairman => {
                  promises.push(
                    this.fireStoreService.fireStore
                      .doc<Part>(`${path}/parts/${chairman.id}`)
                      .set(chairman)
                  );
                })
                
                if (wolWeek.items.length > 2) {
                  
                  let midWeekPart : Part[] = this.wolApiService.parseMidWeek(wolWeek, monday, path, week.id)
                  let weekEndPart : Part[] = this.wolApiService.parseWeekEnd(wolWeek, monday, path, week.id)
                  promises[0].then(_ => {
                    weekEndPart.forEach(part => {
                      promises.push(
                        this.fireStoreService.fireStore
                          .doc<Part>(`${path}/parts/${part.id}`)
                          .set(part)
                      );
                    })
                    midWeekPart.forEach(part => {
                      promises.push(
                        this.fireStoreService.fireStore
                          .doc<Part>(`${path}/parts/${part.id}`)
                          .set(part)
                      );
                    })
                  })

                } else if (wolWeek.items.length > 1) {
               
                  let weekEndPart : Part[] = this.wolApiService.parseWeekEnd(wolWeek, monday, path, week.id)
                  promises[0].then(_ => {
                    weekEndPart.forEach(part => {
                      promises.push(
                        this.fireStoreService.fireStore
                          .doc<Part>(`${path}/parts/${part.id}`)
                          .set(part)
                      );
                    })
                  }) 
                 }
              }
            })
            .catch((error: Error) => { this.toastService.error(`${moment(this.monthData.date).format('MMMM')} schedule not available yet`, `${error.message}`, {
             // progressBar: true,
            })})
            .then(() => { 
              Promise.all(promises).then(_ => this.isLoading = false)
             // setTimeout(() => this.isLoading = false, 3000) 
            })
        });
      });
    });
  }

  checkCanExport() {
    this.forage.getItem('congregationRef').then((path) => {
      this.fireStoreService.fireStore
        .collection<WeekProgram>(`${path}/weeks`, (ref) =>
          ref.orderBy('date', 'asc')
        )
        .valueChanges()
        .subscribe((data) => {
          let filteredWeeks = data.filter(
            (d) => d.date.toDate().getMonth() == this.monthData.date.getMonth()
          );
          if (filteredWeeks.length > 0) {
            this.exportPDFisActive = true;
          } else {
            this.exportPDFisActive = false;
          }
        });
    });
  }

  deleteMonth(weeks: WeekProgram[]) {
    const modalRef = this.modal.open(AlertDeleteComponent, {
      centered: true,
      size: 'sm',
    });
    modalRef.componentInstance.weeks = weeks;
    modalRef.componentInstance.type = 'program';
    modalRef.componentInstance.monthData = this.monthData;
    modalRef.componentInstance.message =
      'This will delete all parts for this month.';
  }

  loadWeeks() {
    this.forage.getItem('congregationRef').then((path) => {
      this.fireStoreService.fireStore
        .collection<WeekProgram>(`${path}/weeks`, (ref) =>
          ref.orderBy('date', 'asc')
        )
        .valueChanges()
        .pipe(
          map(weeks => {
            return weeks.filter(week => moment(week.date.toDate()).isAfter(moment(new Date()).subtract('1', 'week')))
          })
        )
        .subscribe((data) => {
          this.weekProgram = data;
          if (data.length == 0) this.sidenav.close();
        });
      this.checkCanExport();
    });
  }
}
