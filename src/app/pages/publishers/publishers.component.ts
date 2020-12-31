import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable, Subject } from 'rxjs';
import { Congregation } from 'src/app/models/congregation.model';
import { Publisher } from 'src/app/models/publisher.model';
import { FireStoreService } from 'src/app/services/fire-store.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { takeUntil, takeWhile } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddPublisherComponent } from 'src/app/components/modals/add-publisher/add-publisher.component';
import { MatDrawer } from '@angular/material/sidenav';
import { StoreService } from 'src/app/services/store.service';

@AutoUnsubscribe()
@Component({
  selector: 'ab-publishers',
  templateUrl: './publishers.component.html',
  styleUrls: ['./publishers.component.scss'],
  host: {
    '(window:resize)': 'onResize($event)',
  },
})
export class PublishersComponent implements OnInit, OnDestroy {
  constructor(
    private storage: LocalStorageService,
    private fireStoreService: FireStoreService,
    public modal: NgbModal
  ) {}
  congregation: Congregation;
  path: string;
  $publishers: Observable<Publisher[]>;
  ngUnsubscribe = new Subject();
  active = 0;
  innerWidth: number;
  @ViewChild('sidenav') sidenav: MatDrawer;

  ngOnInit(): void {
    this.congregation = this.storage.retrieve('congregation');
    this.path = this.storage.retrieve('congregationref');
    this.$publishers = this.fireStoreService.fireStore
      .collection(`${this.path}/publishers`)
      .valueChanges()
      .pipe(takeUntil(this.ngUnsubscribe));

  }

  onResize(event) {
    this.innerWidth = event.target.innerWidth;
    this.toggleSideBarOnResize()
  }

  toggleSideBarOnResize() {
    if (this.innerWidth < 700) {
      this.sidenav.close();
    } else {
      this.sidenav.open();
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  addPublisher() {
    const modalRef = this.modal.open(AddPublisherComponent, {
      centered: true,
      size: 'md',
    });
  }
}
