import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForage } from 'ngforage';
import { Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { Congregation } from 'src/app/models/congregation.model';
import { Publisher } from 'src/app/models/publisher.model';
import { Part, WeekProgram } from 'src/app/models/wol.model';
import { FireStoreService } from 'src/app/services/fire-store.service';

@Component({
  selector: 'publishers-modal',
  templateUrl: './publishers.component.html',
  styleUrls: ['./publishers.component.scss']
})
export class PublisherModalComponent implements OnInit {

  constructor(
    private fireStoreService: FireStoreService,
    private forage: NgForage,
    private modal: NgbActiveModal,

  ) {}
  congregation: Congregation;
  path: string;
  $publishers: Observable<Publisher[]>;
  ngUnsubscribe = new Subject();
  active = 0;

  @Input('part') part: Part;
  @Input('id') weekProgram: WeekProgram;
  @Input('type') type: string;
  @Input('relacing') replacing: Publisher;
  @Input('searchText') searchText: string;

  ngOnInit(): void {
    this.forage.getItem<string>('congregationRef').then(path => {
      this.$publishers = this.fireStoreService.fireStore.collection<Publisher>(`${path}/publishers`).valueChanges().pipe(
        map((data) => {
          return data.filter(
            (pubs) =>
              this.part.privilege.includes(pubs.privilege) &&
              this.part.gender.includes(pubs.gender)
          );
        }),
        take(1)
      );

    })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  selectPublisher(publisher: Publisher) {
    let replacingRef: AngularFirestoreDocument;
    this.forage.getItem<string>('congregationRef').then(path => {
      let documentRef = this.fireStoreService.fireStore.doc<Part>(
        `${path}/parts/${this.part.id}`
      );
      let publisherRef = this.fireStoreService.fireStore.doc<Publisher>(
        `${path}/publishers/${publisher.uid}`
      );

      if (this.replacing) {
        replacingRef = this.fireStoreService.fireStore.doc<Publisher>(
        `${path}/publishers/${this.replacing.uid}`);
      }
      if (this.type == 'assignee') {
        // this.part.assignee = publisher
         documentRef.update({
           assignee: publisher,
         });
       } else {
       //  this.part.assistant = publisher
         documentRef.update({
           assistant: publisher,
         });
       }
      this.part.path = documentRef.ref.path;
      publisherRef
      .get()
      .toPromise()
      .then((data) => {
        this.part.assignee = null
        this.part.assistant = null
          publisherRef.collection('parts').doc(this.part.id).set({
            assignee: null,
            assistant: null,
            ...this.part
          }, { merge: true })

        this.modal.close(); 
      })
    })

  }


}
