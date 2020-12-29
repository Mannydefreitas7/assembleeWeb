import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable, Subject } from 'rxjs';
import { Congregation } from 'src/app/models/congregation.model';
import { Publisher } from 'src/app/models/publisher.model';
import { FireStoreService } from 'src/app/services/fire-store.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe'
import { takeUntil, takeWhile } from 'rxjs/operators';

@AutoUnsubscribe()
@Component({
  selector: 'ab-publishers',
  templateUrl: './publishers.component.html',
  styleUrls: ['./publishers.component.scss']
})
export class PublishersComponent implements OnInit, OnDestroy {

  constructor(
    private storage: LocalStorageService,
    private fireStoreService: FireStoreService
  ) { }
 congregation: Congregation;
 path: string;
 $publishers: Observable<Publisher[]>;
 ngUnsubscribe = new Subject();
 active = 0;
  ngOnInit(): void {
    this.congregation = this.storage.retrieve('congregation');
    this.path = this.storage.retrieve('congregationref');
    this.$publishers = this.fireStoreService.fireStore.collection(`${this.path}/publishers`).valueChanges().pipe(takeUntil(this.ngUnsubscribe))
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
