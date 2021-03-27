import { Component, Input, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable, Subject } from 'rxjs';
import { Congregation } from 'src/app/models/congregation.model';
import { Permission, Privilege, Publisher, Speaker, Talk } from 'src/app/models/publisher.model';
import { User } from 'src/app/models/user.model';
import { Part } from 'src/app/models/wol.model';
import { FireStoreService } from 'src/app/services/fire-store.service';
import { HttpClient } from '@angular/common/http';
import { EmailService } from 'src/app/services/email.service';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from 'src/app/auth/auth.service';
import { NgForage } from 'ngforage';
import { AlertDeleteComponent } from 'src/app/components/modals/alert-delete/alert-delete.component';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, map, take } from 'rxjs/operators';

@Component({
  selector: 'speaker-detail',
  templateUrl: './speaker-detail.component.html',
  styleUrls: ['./speaker-detail.component.scss']
})
export class SpeakerDetailComponent implements OnInit {

  constructor(
    private storage: LocalStorageService,
    private http: HttpClient,
    private emailService: EmailService,
    public modal: NgbModal,
    private auth: AuthService,
    private forage: NgForage,
    private toastService: ToastrService,
    private fireStoreService: FireStoreService
  ) { }
 congregation: Congregation;
 path: string;
 $publishers: Observable<Publisher[]>;
 ngUnsubscribe = new Subject();
 isPublisherAdmin: boolean = false;
 amIAdmin: boolean = false;
  @Input('speaker') speaker: Speaker;
  @Input('active') active: number;

  firstName: string;
  lastName: string;
  privilege: Privilege;
  
  privileges: Privilege[] = [Privilege.elder, Privilege.ms, Privilege.pub, Privilege.talkCo]
  isEditing: boolean = false;
  authUser: firebase.default.User;
  fireUser: User;
  $parts: Observable<Part[]>
  user: User;
  me: User;
  congID: string;
  allTalks: Talk[];
  talks$: Observable<Talk[]>;
  congregationName: string = "";

  ngOnInit(): void {
    this.firstName = this.speaker.firstName;
    this.lastName = this.speaker.lastName;
    this.privilege = this.speaker.privilege;
    
    if (this.speaker.congregation)
    this.congregationName = this.speaker.congregation.properties.orgName

    this.forage.getItem<firebase.default.User>('user').then(authUser => {
      this.authUser = authUser;
    })
    this.forage.getItem<string>('congregationRef').then(path => {
      this.path = path;
      this.congID = this.path.split('/')[1]
      this.loadSpeakerTalks()
    })
  }

  loadSpeakerTalks() {
    this.forage.getItem<string>('congregationRef').then(path => {
      this.loadTalks()
      this.talks$ = this.fireStoreService.fireStore.collection<Talk>(`${path}/speakers/${this.speaker.id}/talks`)
      .valueChanges();
    })
  }

  permissions(user: User) : boolean {
    
      switch (user) {
        case user.permissions.includes(Permission.admin):
          return true;
        case user.permissions.includes(Permission.speakers):
          return true;
        default:
          return false;
      }
  }

  saveTalk(talk: Talk, currentTalk: Talk) {
    this.forage.getItem<Congregation>('congregationRef').then(path => {
      this.fireStoreService.fireStore
      .doc<Part>(`${path}/speakers/${this.speaker.id}/talks/${currentTalk.id}`)
      .update({
        title: talk.title,
        talkNumber: String(talk.id + 1)
      })
    })
  }

  deleteTalk(talk: Talk) {
    this.forage.getItem<Congregation>('congregationRef').then(path => {
      this.fireStoreService.fireStore
      .doc<Part>(`${path}/speakers/${this.speaker.id}/talks/${talk.id}`)
      .delete()
    })
  }

  addTalk() {
    this.forage.getItem<string>('congregationRef').then(path => {

      let id = this.fireStoreService.fireStore.createId()
      let talk: Talk = {
        id: id,
        timeStamp: Date(),
        title: null,
        songNumber: null,
        lastDelivered: null,
        number: null 
      }
      this.fireStoreService.fireStore.doc<Talk>(`${path}/speakers/${this.speaker.id}/talks/${id}`)
      .set(talk)  
    })
  }

openDeleteAlert() {
  const modalRef = this.modal.open(AlertDeleteComponent, {
    centered: true,
    size: 'sm'
  })
  modalRef.componentInstance.publisher = this.speaker
  modalRef.componentInstance.type = 'speaker';
  modalRef.componentInstance.id = this.speaker.id;
  modalRef.componentInstance.message = 'This will delete all parts associated with this speaker.';
}

loadTalks() {
  this.fireStoreService.fireStore.collection<Talk>('languages/F/talks')
  .valueChanges()
  .subscribe(talks => this.allTalks = talks)
}

  saveDetail() {
    this.forage.getItem<string>('congregationRef').then(path => {
    this.fireStoreService.fireStore.doc<Speaker>(`${path}/speakers/${this.speaker.id}`).update({
      firstName: this.firstName,
      lastName: this.lastName,
      privilege:this.privilege,
      congregation: {
        properties: {
          orgName: this.congregationName
        }
      }
    })})
  }

  search = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 1 ? []
      : this.allTalks.filter(v => v.title.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  )


}
