import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase/app';
import { NgForage } from 'ngforage';
import { Permission, Publisher } from 'src/app/models/publisher.model';
import { EmailMessage, User } from 'src/app/models/user.model';
import { EmailService } from 'src/app/services/email.service';
import { FireStoreService } from 'src/app/services/fire-store.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit {

  signUpForm: FormGroup;
  hide = true;
  empty = true;
  emailMessage = false;
  publisher: Publisher;
  path: string;
  permissions: Permission[] = [Permission.view]
  emailCheck: boolean;
  constructor(
     public fb: FormBuilder,
     public auth: AuthService,
     public forage: NgForage,
     public emailService: EmailService,
     public fireStore: FireStoreService,
     public route: ActivatedRoute,
     private router: Router,
  ) { }
// http://localhost:4200/#/invite?cong=0927216B-2451-4AB5-AD08-11AC5777CCB1&pub=7Gaknqo7h37XUV1mUC4m
  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      firstName: ['', [Validators.minLength(3), Validators.required]],
      lastName: ['', [Validators.minLength(2), Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      password: ['',
         [
            Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
            Validators.minLength(6),
            Validators.maxLength(25)
         ],
      ]
   });
     this.route.queryParams.subscribe(params => {
       this.path = params.cong;
       let uid = params.pub;
       this.fireStore.fireStore.doc<Publisher>(`congregations/${this.path}/publishers/${uid}`).valueChanges().subscribe(publisher => {
         this.publisher = publisher;
        this.email.setValue(publisher.email)
        this.firstName.setValue(publisher.firstName)
        this.lastName.setValue(publisher.lastName)
       })
     })
  }

  get email() {
     return this.signUpForm.get('email');
  }
  get password() {
     return this.signUpForm.get('password');
  }
  get firstName() {
     return this.signUpForm.get('firstName');
  }

  get lastName() {
     return this.signUpForm.get('lastName');
  }

  createUser(credential: firebase.auth.UserCredential) {
    this.forage.clear().then(() => {
 // create user with email and pass
 this.route.queryParams.subscribe(params => {

  let path = params.cong;

    if (credential) {
      this.forage.setItem('user', credential.user);
      // create fireUser
      let user: User = {
        congregation: `congregations/${path}`,
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

        this.forage.setItem('fireUser', user).then(() => {
          this.fireStore.fireStore.doc<Publisher>(`congregations/${path}/publishers/${credential.user.uid}`).set({
            email: this.publisher.email,
            firstName: this.publisher.firstName,
            gender: this.publisher.gender,
            isInvited: true,
            lastName: this.publisher.lastName,
            parts: this.publisher.parts,
            photoURL: this.publisher.photoURL,
            privilege: this.publisher.privilege,
            isReader: false,
            uid: credential.user.uid
          }).then(() => {

            let msg : EmailMessage = {
              from: "Assemblee App <assemblee.app@gmail.com>",
              subject: `New Login`,
              to: "assemblee.app@gmail.com",
              html: `<p><strong>New login</strong></p><p><strong>${this.publisher.lastName} ${this.publisher.firstName}</strong> just logged in as a user.</p><p>Sincerely,<br>Assemblee App</p>`
            }

            this.emailService.sendEmail(msg);

            this.forage.setItem('congregationRef', `congregations/${path}`)
             // delete old publisher
          this.fireStore.delete(`congregations/${path}/publishers/${this.publisher.uid}`)
          }).then(() => this.router.navigateByUrl('/home/dashboard'))
        })
      })
    }
  })
})
  }

  signUp() {
     if (this.signUpForm.valid) {
       this.auth.afAuth.createUserWithEmailAndPassword(this.email.value, this.password.value).then(credential => {
        this.createUser(credential)
       })
     } else {
       console.log(this.signUpForm.status)
     }
  }

  appleSignIn() {
    let provider = new firebase.auth.OAuthProvider('apple.com');
    this.auth.afAuth.signInWithPopup(provider).then(credential => {
      this.createUser(credential)
    })
  }

  googleSignIn() {
    let provider = new firebase.auth.GoogleAuthProvider();
    this.auth.afAuth.signInWithPopup(provider).then(credential => {
      this.createUser(credential)
    })
  }

}
