import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForage } from 'ngforage';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from 'src/app/auth/auth.service';
import { Congregation } from 'src/app/models/congregation.model';
import { Permission, Publisher } from 'src/app/models/publisher.model';
import { EmailMessage, User } from 'src/app/models/user.model';
import { EmailService } from 'src/app/services/email.service';
import { FireStoreService } from 'src/app/services/fire-store.service';

@Component({
  selector: 'app-invite-publisher',
  templateUrl: './invite-publisher.component.html',
  styleUrls: ['./invite-publisher.component.scss']
})
export class InvitePublisherComponent implements OnInit {

  constructor(
    private auth : AuthService,
    private fireStore: FireStoreService,
    private storage: LocalStorageService,
    public fb: FormBuilder,
    private forage: NgForage,
    private email: EmailService,
    public modal: NgbActiveModal
  ) { }

  @Input('publisher') publisher: Publisher;
  congregation: Congregation;
  inviteForm: FormGroup;
  fireUser: User;
  permissions: Permission[] = [Permission.view]

  ngOnInit(): void {
    this.congregation = this.storage.retrieve('congregation');

    this.inviteForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  get password() { return this.inviteForm.get('password') }

  invite() {

    // create user with email and pass
    if (this.inviteForm.valid) {

      this.forage.getItem<string>('congregationRef').then(path => {
        this.auth.afAuth.createUserWithEmailAndPassword(this.publisher.email, this.password.value).then(credential => {
          if (credential) {
            // create fireUser
            let user: User = {
                congregation: path,
                displayName: `${this.publisher.firstName} ${this.publisher.lastName}`,
                email: this.publisher.email,
                isEmailVerified: false,
                loginProvider: "email",
                permissions: this.permissions,
                uid: credential.user.uid,
                firstName: this.publisher.firstName,
                lastName: this.publisher.lastName,
                photoURL: null
            }
            this.fireStore.create('users', credential.user.uid, user).then(() => {
              // create replacing publisher
            this.fireStore.fireStore.doc<Publisher>(`${path}/publishers/${credential.user.uid}`).set({
              email: this.publisher.email,
              firstName: this.publisher.firstName,
              gender: this.publisher.gender,
              isInvited: true,
              lastName: this.publisher.lastName,
              parts: this.publisher.parts,
              photoURL: this.publisher.photoURL,
              privilege: this.publisher.privilege,
             // speaker: this.publisher.speaker,
            //  isWTConductor: this.publisher.isWTConductor,
              uid: credential.user.uid
            }).then(() => {
               // delete old publisher
            this.fireStore.delete(`${path}/publishers/${this.publisher.uid}`)

            // send email to new user
              let msg: EmailMessage = {
                to: this.publisher.email,
                from: `${this.congregation.properties.orgName} <assemblee.app@gmail.com>`,
                subject: `Invitation from Assemblee - ${this.publisher.lastName} ${this.publisher.firstName}`,
                html: `<p>Welcome ${this.publisher.lastName} ${this.publisher.firstName},</p><p>Here is your login information:</p><p><strong>Login URL:</strong> <a href="https://assemblee.web.app/login">https://assemblee.web.app/login</a></p><p><strong>Email:</strong> ${this.publisher.email}</p><p><strong>Password:</strong> ${this.password.value}</p><p>Sincerely,<br>${this.congregation.properties.orgName}</p>`,
              }

              this.email.sendEmail(msg)

            }).then(() => this.modal.close())
            })
          }
      })
      })
    }
  }

}
