import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForage } from 'ngforage';
import { map, take } from 'rxjs/operators';
import { MonthData } from 'src/app/models/month.model';
import { Publisher } from 'src/app/models/publisher.model';
import { Part, WeekProgram } from 'src/app/models/wol.model';
import { FireStoreService } from 'src/app/services/fire-store.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-alert-delete',
  templateUrl: './alert-delete.component.html',
  styleUrls: ['./alert-delete.component.scss']
})
export class AlertDeleteComponent implements OnInit {

  @Input('message') message: string;
  @Input('publisher') publisher: Publisher;
  @Input('type') type: string;
  @Input('weeks') weeks: WeekProgram[];

  @Input('monthData') monthData: MonthData;


  constructor(
    public modal: NgbActiveModal,
    private fireStoreService: FireStoreService,
    private forage: NgForage,
    private store: StoreService
  ) { }

  delete() {
    if (this.type == 'publisher') {
      this.deletePublisher()
    }
    if (this.type == 'program') {
      this.deleteMonth()
    }
    this.store.publisherActiveTab = 0;
    this.modal.close()
  }

  ngOnInit(): void {
  }


  deleteMonth() {
    this.forage.getItem('congregationRef').then(path => {
      let filteredWeeks = this.weeks.filter(d => d.date.toDate().getMonth() == this.monthData.date.getMonth())
      if (filteredWeeks.length > 0) {
        filteredWeeks.forEach(week => {

          this.fireStoreService.fireStore.collection(`${path}/parts`, ref => ref.where('week', '==', week.id)).get().pipe(
            take(1)
          ).subscribe(parts => {
            parts.forEach(part => part.exists ? this.fireStoreService.delete(`${path}/parts/${part.id}`) : '')
          },console.log, () => this.fireStoreService.fireStore.doc(`${path}/weeks/${week.id}`).delete())

        })
      }
    })
   }

  deletePublisher() {
    this.forage.getItem('congregationRef').then(path => {
      if (path) {
        if (this.publisher.isInvited) {
          this.fireStoreService.delete(`users/${this.publisher.uid}`)
        }
        this.fireStoreService.delete(`${path}/publishers/${this.publisher.uid}`).then(() => {
          this.fireStoreService.fireStore.collection<Part>(`${path}/parts`)
          .get()
          .pipe(map(data => {
              return data.docs.filter(p => {
              if (p.data().assistant) return p.data().assistant.uid == this.publisher.uid
              if (p.data().assignee) return p.data().assignee.uid == this.publisher.uid
            })
          })).subscribe(parts => {
            parts.forEach(part => {
              if (part.data().assistant)
              this.fireStoreService.fireStore.doc<Part>(`${path}/parts/${part.data().id}`)
              .update({ assistant: null })
              if (part.data().assignee)
              this.fireStoreService.fireStore.doc<Part>(`${path}/parts/${part.data().id}`)
              .update({ assignee: null })
            })
          })
      })
      }
  })
}

}
