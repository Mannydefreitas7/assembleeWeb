import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForage } from 'ngforage';
import { map, take } from 'rxjs/operators';
import { MonthData } from 'src/app/models/month.model';
import { Publisher, Speaker } from 'src/app/models/publisher.model';
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
  @Input('id') id: string;



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
      this.deleteWeek()
    }
    if (this.type == 'speaker') {
      this.deleteSpeaker()
    }
    this.store.publisherActiveTab = 0;
    this.modal.close()
  }

  ngOnInit(): void {
  }


  deleteWeek() {
    this.forage.getItem('congregationRef').then(path => {
      if (path)
      this.fireStoreService.fireStore.doc(`${path}/weeks/${this.id}`).delete()
    })
   }

   deleteSpeaker() {
    this.forage.getItem('congregationRef')
    .then(path => {
      this.fireStoreService.fireStore.doc<Speaker>(`${path}/speakers/${this.id}`).delete()
    })
   }

  deletePublisher() {
    this.forage.getItem('congregationRef').then(path => {
      if (path) {
        if (this.publisher.isInvited) {
          this.fireStoreService.delete(`users/${this.publisher.uid}`)
        }
        this.fireStoreService.delete(`${path}/publishers/${this.publisher.uid}`)
      }
  })
}

}
