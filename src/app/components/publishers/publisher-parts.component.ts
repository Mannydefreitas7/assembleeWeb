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

      this.forage.getItem('congregationRef').then(path => {
        if (path) {
          this.$parts = this.fireStoreService.fireStore
          .collection<Part>(`${path}/publishers/${this.publisher.uid}/parts`)
          .valueChanges()
          .pipe(takeUntil(this.ngUnsubscribe))
        }
      })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


}
