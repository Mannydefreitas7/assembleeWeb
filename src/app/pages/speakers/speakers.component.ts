import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForage } from 'ngforage';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { Congregation } from 'src/app/models/congregation.model';
import { Gender, Privilege, Publisher, Speaker } from 'src/app/models/publisher.model';
import { FireStoreService } from 'src/app/services/fire-store.service';
import { StoreService } from 'src/app/services/store.service';
import { AddSpeakerComponent } from 'src/app/components/add-speaker/add-speaker.component';

@Component({
  selector: 'ab-speakers',
  templateUrl: './speakers.component.html',
  styleUrls: ['./speakers.component.scss']
})
export class SpeakersComponent implements OnInit {
  constructor(
    private storage: LocalStorageService,
    private fireStoreService: FireStoreService,
    public modal: NgbModal,
    private forage: NgForage,
    public store: StoreService
  ) {}
  congregation: Congregation;
  path: string;
  searchText: string = '';
  $localSpeakers: Observable<Speaker[]>;
  $OutSpeakers: Observable<Speaker[]>;
  ngUnsubscribe = new Subject();
  active = 0;
  innerWidth: number;
  @ViewChild('sidenav') sidenav: MatDrawer;

  ngOnInit(): void {
    this.store.publisherActiveTab = 0;
    this.path = this.storage.retrieve('congregationref');

    this.forage.getItem<string>('congregationRef').then(path => {
      this.$localSpeakers = this.fireStoreService.fireStore
      .collection<Publisher>(`${path}/speakers`)
      .valueChanges()
      .pipe(
        map(data => data.sort((a, b) => a.lastName.localeCompare(b.lastName))),
        takeUntil(this.ngUnsubscribe)
        );
    })

   // this.transferSpeakers();

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  transferSpeakers() {
    this.forage.getItem<string>('congregationRef').then(path => {

      this.fireStoreService.fireStore.doc<Congregation>(`${path}`)
      .valueChanges()
      .pipe(take(1))
      .subscribe(cong => {
        this.fireStoreService.fireStore
      .collection<Publisher>(`${path}/publishers`)
      .valueChanges()
      .pipe(
        map(data => data.filter(p => p.gender == Gender.brother && p.privilege == Privilege.elder || p.privilege == Privilege.ms)),
        take(1)
        ).subscribe(brothers => {
          brothers.forEach(brother => {
            this.fireStoreService.fireStore.doc<Speaker>(`${path}/speakers/${brother.uid}`)
            .set({
              id: brother.uid,
              congregation: {
                id: cong.id,
                language: cong.language,
                fireLanguage: cong.fireLanguage,
                properties: cong.properties
              },
              email: brother.email,
              firstName: brother.firstName,
              lastName: brother.lastName,
              isOutGoing: false,
              photoURL: null,
              privilege: brother.privilege,
              talks: []
            })
          })
        })
      })

    })
  }

  addSpeaker() {
    const modalRef = this.modal.open(AddSpeakerComponent, {
      centered: true,
      size: 'md',
    });
  }

}
