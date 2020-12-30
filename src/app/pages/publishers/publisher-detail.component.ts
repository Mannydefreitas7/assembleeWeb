import { Component, Input, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Congregation } from 'src/app/models/congregation.model';
import { Permission, Privilege, Publisher } from 'src/app/models/publisher.model';
import { User } from 'src/app/models/user.model';
import { Part } from 'src/app/models/wol.model';
import { FireStoreService } from 'src/app/services/fire-store.service';
import * as email from '@sendgrid/mail'
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { emit } from 'process';
import { EmailService } from 'src/app/services/email.service';
import { AngularFireAuth } from '@angular/fire/auth';

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
    private fireStoreService: FireStoreService
  ) { }
 congregation: Congregation;
 path: string;
 $publishers: Observable<Publisher[]>;
 ngUnsubscribe = new Subject();

  @Input('publisher') publisher: Publisher;

  firstName: string;
  lastName: string;
  privilege: Privilege;
  privileges: Privilege[] = [Privilege.elder, Privilege.ms, Privilege.pub, Privilege.talkCo]
  permissions: Permission[] = [Permission.view, Permission.add, Permission.delete, Permission.edit, Permission.programs, Permission.publishers, Permission.admin, Permission.speakers]
  isEditing: boolean = false;
  user: firebase.default.User;
  fireUser: User;
  $parts: Observable<Part[]>
  $user: Observable<User>;
  ngOnInit(): void {
    this.firstName = this.publisher.firstName;
    this.lastName = this.publisher.lastName;
    this.privilege = this.publisher.privilege;
    this.path = this.storage.retrieve('congregationref');
    this.user = this.storage.retrieve('user');
    this.fireUser = this.storage.retrieve('fireUser');
    if (this.publisher.isInvited) this.$user = this.fireStoreService.fireStore.doc(`users/${this.publisher.uid}`).valueChanges().pipe(takeUntil(this.ngUnsubscribe))

    this.getPublisherParts()

  }

  saveDetail() {
    this.fireStoreService.fireStore.doc<Publisher>(`${this.path}/publishers/${this.publisher.uid}`).update({
      firstName: this.firstName,
      lastName: this.lastName,
      privilege:this.privilege
    })
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
this.fireUser.permissions = _permissions;
    this.storage.store('fireUser', this.fireUser)
}

getPublisherParts() {
  let _parts: string[] = [];
  if (this.publisher.parts && this.publisher.parts.length > 0) {
    this.publisher.parts.forEach(p => {
      _parts.push(p.path.split('/')[5])
    })
      this.$parts = this.fireStoreService.fireStore.collectionGroup('parts', ref => ref.where('id', 'in', _parts)).valueChanges().pipe(takeUntil(this.ngUnsubscribe))
  }

// email.setApiKey(environment.SENDGRID_API_KEY)
// const msg = {
//   to: 'manny.defreitas7@gmail.com', // Change to your recipient
//   from: 'assemblee.app@gmail.com', // Change to your verified sender
//   subject: 'Sending with SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// }
// email.send(msg).then(res => {console.log(res)})


}

}
