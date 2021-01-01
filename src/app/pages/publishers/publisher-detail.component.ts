import { Component, Input, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { Congregation } from 'src/app/models/congregation.model';
import { Permission, Privilege, Publisher } from 'src/app/models/publisher.model';
import { User } from 'src/app/models/user.model';
import { Part } from 'src/app/models/wol.model';
import { FireStoreService } from 'src/app/services/fire-store.service';
import { HttpClient } from '@angular/common/http';
import { EmailService } from 'src/app/services/email.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InvitePublisherComponent } from 'src/app/components/modals/invite-publisher/invite-publisher.component';
import { AuthService } from 'src/app/auth/auth.service';
import { NgForage } from 'ngforage';
import { AlertDeleteComponent } from 'src/app/components/modals/alert-delete/alert-delete.component';

@Component({
  selector: 'publisher-detail',
  templateUrl: './publisher-detail.component.html',
  styleUrls: ['./publisher-detail.component.scss']
})
export class PublisherDetailComponent implements OnInit {

  constructor(
    private storage: LocalStorageService,
    private http: HttpClient,
    private emailService: EmailService,
    public modal: NgbModal,
    private auth: AuthService,
    private forage: NgForage,
    private fireStoreService: FireStoreService
  ) { }
 congregation: Congregation;
 path: string;
 $publishers: Observable<Publisher[]>;
 ngUnsubscribe = new Subject();
 isPublisherAdmin: boolean = false;
 amIAdmin: boolean = false;
  @Input('publisher') publisher: Publisher;
  @Input('active') active: number;

  firstName: string;
  lastName: string;
  privilege: Privilege;
  privileges: Privilege[] = [Privilege.elder, Privilege.ms, Privilege.pub, Privilege.talkCo]
  permissions: Permission[] = [Permission.view, Permission.add, Permission.delete, Permission.edit, Permission.programs, Permission.publishers, Permission.admin, Permission.speakers]
  isEditing: boolean = false;
  authUser: firebase.default.User;
  fireUser: User;
  $parts: Observable<Part[]>
  user: User;
  me: User;
  ngOnInit(): void {
    this.firstName = this.publisher.firstName;
    this.lastName = this.publisher.lastName;
    this.privilege = this.publisher.privilege;
    this.path = this.storage.retrieve('congregationref');
    this.forage.getItem<firebase.default.User>('user').then(authUser => {
      this.authUser = authUser;
    })

    this.forage.getItem<User>('fireUser').then(fireUser => {
      if (this.publisher.isInvited) {
        this.fireStoreService.fireStore.doc<User>(`users/${this.publisher.uid}`).valueChanges().pipe(takeUntil(this.ngUnsubscribe)).subscribe(d => {
          if (d) {
            this.user = d;
            this.isPublisherAdmin = this.publisher.isInvited && d.permissions.includes(Permission.admin)
          }

        })
        this.fireStoreService.fireStore.doc<User>(`users/${fireUser.uid}`).valueChanges().pipe(takeUntil(this.ngUnsubscribe)).subscribe(d => {
          if (d) {
            this.me = d;
            this.amIAdmin = d.permissions.includes(Permission.admin)
          }
        })
      }
    })
    this.getPublisherParts()
  }

  revokeAccess() {

    this.forage.getItem<string>('congregationRef').then(path => {
      this.fireStoreService.fireStore.doc(`${path}/users/${this.publisher.uid}`).delete().then(() => {
        this.fireStoreService.fireStore.doc<Publisher>(`${path}/publishers/${this.publisher.uid}`).update({
          isInvited: false
        })
      })
    })
  }



openDeleteAlert() {
  const modalRef = this.modal.open(AlertDeleteComponent, {
    centered: true,
    size: 'sm'
  })
  modalRef.componentInstance.publisher = this.publisher
  modalRef.componentInstance.type = 'publisher';
  modalRef.componentInstance.message = 'This will delete all parts associated with this publisher.';
}

  saveDetail() {
    this.forage.getItem<string>('congregationRef').then(path => {
    this.fireStoreService.fireStore.doc<Publisher>(`${path}/publishers/${this.publisher.uid}`).update({
      firstName: this.firstName,
      lastName: this.lastName,
      privilege:this.privilege
    })})
  }

  editPermissions(user: User, permission: Permission) {
    let _permissions = [...user.permissions];
   if (_permissions.includes(permission)) {
    _permissions = _permissions.filter(p => p != permission)
   } else {
     _permissions.push(permission)
  }
  this.fireStoreService.fireStore.doc<User>(`users/${user.uid}`).update({
    permissions: _permissions
})
}

openInviteModal() {
  const modalRef = this.modal.open(InvitePublisherComponent, {
    centered: true,
    size: 'md',
  })
  modalRef.componentInstance.publisher = this.publisher;
}

getPublisherParts() {
  let _parts: string[] = [];

  if (this.publisher.parts && this.publisher.parts.length > 0) {
    this.forage.getItem('congregationRef').then(path => {
      this.publisher.parts.forEach(p => {
        _parts.push(p.path.split('/')[3])
      })
        this.$parts = this.fireStoreService.fireStore
        .collection<Part>(`${path}/parts`)
        .valueChanges()
        .pipe(
          map(data => {
            return data.filter(p => {
                if (p.assignee) return p.assignee.uid == this.publisher.uid
                if (p.assistant) return p.assistant.uid == this.publisher.uid
             })
          }),
          take(1)
          )
    })
    }
}

}
