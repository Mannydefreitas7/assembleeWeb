import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForage } from 'ngforage';
import { Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { Publisher } from 'src/app/models/publisher.model';
import { Part, WeekProgram } from 'src/app/models/wol.model';
import { FireStoreService } from 'src/app/services/fire-store.service';

@Component({
  selector: 'publisher-parts',
  templateUrl: './publisher-parts.component.html',
  styleUrls: ['./publisher-parts.component.scss']
})
export class PublisherPartsComponent implements OnInit {

  constructor(
    private fireStoreService: FireStoreService,
    private forage: NgForage
  ) { }

  @Input('publisher') publisher: Publisher;
  @Input('part') part: Part;
  ngUnsubscribe = new Subject();
  $parts: Observable<Part[]>;
  ngOnInit(): void {
    this.getPublisherParts();
  }

  getPublisherParts() {
    let _parts: string[] = [];

    if (this.publisher.parts && this.publisher.parts.length > 0) {
      this.forage.getItem('congregationRef').then(path => {
        if (path) {

          this.publisher.parts.forEach(p => {
            _parts.push(p.path.split('/')[3])
          })

          this.$parts = this.fireStoreService.fireStore
          .collection<Part>(`${path}/parts`)
          .valueChanges()
          .pipe(
            map(data => {
              return data.filter(p => {
                return p.assignee && p.assignee.uid == this.publisher.uid || p.assistant && p.assistant.uid == this.publisher.uid
              })
            }),
            take(1),
          //  takeUntil(this.ngUnsubscribe)
            )
        }
      })
      }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


}
