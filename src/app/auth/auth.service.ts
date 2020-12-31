import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { FireStoreService } from '../services/fire-store.service';
import { Privilege } from '../models/publisher.model';
import { LocalStorageService } from 'ngx-webstorage';
import { FireDBService } from '../services/fire-db.service';
import { NgForage } from 'ngforage';


@Injectable({
   providedIn: 'root'
})
export class AuthService {
   user: Observable<User>;
   authState: Observable<firebase.default.User>;
   userDetails: firebase.default.User = null;

   constructor(
      public afAuth: AngularFireAuth,
      private fireStoreService: FireStoreService,
      private fireDBService: FireDBService,
      private router: Router,
      private ngZone: NgZone,
      public forage: NgForage,
      public storage: LocalStorageService,
   ) {
      this.authState = this.afAuth.authState;
      this.stateChanged()
   }

   get _currentUserObservable(): any {
      return this.afAuth.authState
   }

   get authenticated(): boolean {
      return this.authState != null;
   }

   get currentUserObservable() {
      return this.afAuth.currentUser;
   }

   get currentUser() {
      return this.afAuth.user;
   }

   get currentUserID() {
      return this.currentUser.subscribe(user => user.uid);
   }


   signOut() {
    this.forage.clear()
    .then(() => this.afAuth.signOut().then(() => {
      this.router.navigateByUrl('/login')
    }))

      // this.afAuth.signOut().then(value => {
      //    this.router.navigateByUrl('/login')
      //    .then(() => {

      //      this.removeAllStoredKeys()
      //    })
      // })
   }

   removeAllStoredKeys() {

    setTimeout(() => this.storage.clear('user'), 1000)
    setTimeout(() => this.storage.clear('fireUser'), 2000)
    setTimeout(() => this.storage.clear('congregationRef'), 3000)
    setTimeout(() => this.storage.clear('congregation'), 4000)

    this.forage.clear()

   }


   stateChanged(): any {
      return this.afAuth.onAuthStateChanged(user => {

         if (user) {
           // this.storage.store('user', user);
            this.forage.setItem('user', user).then(() => {
                this.fireStoreService.fireStore.doc<User>(`users/${user.uid}`)
                .get()
                .subscribe((fireUser) => {
                   if (fireUser.exists && fireUser.data().congregation) {
                     this.forage.getItem('fireUser').then(fu => {
                       if (!fu) {
                        this.forage.setItem('fireUser', fireUser.data()).then(() => this.forage.setItem('congregationRef', fireUser.data().congregation))
                        this.fireStoreService.fireStore.doc(fireUser.data().congregation).get().subscribe(cong => {
                          if (cong.exists) {
                            this.forage.setItem('congregation', cong.data())
                          }
                        })
                       }
                     })
                   }
                })
            })

         } else {
          this.forage.clear()
         }
      })
   }



   get isAuth(): boolean {
      return this.user !== null;
   }
   isLoggedIn() {
      if (this.userDetails == null) {
         return false;
      } else {
         return true;
      }
   }

   emailSignIn(email: string, password: string) {
      return this.afAuth.signInWithEmailAndPassword(email, password)
         .then((credential) => {

            // this.storage.store('user', credential.user)

            // this.fireStoreService.fireStore.doc(`users/${credential.user.uid}`)
            //    .valueChanges()
            //    .subscribe((fireUser:User) => {
            //       this.storage.store('fireUser', fireUser);
            //       this.storage.store('congregationRef', fireUser.congregation)
            // })

            let _users = this.fireStoreService.fireStore.collection<User>('users', ref => ref.where('uid', '==', credential.user.uid)).valueChanges()

             _users.subscribe(users => {
               if (users.length > 0) {
                  // already exists
                  if (users[0].congregation) {
                     // already has congregation setup
                     this.ngZone.run(() => this.router.navigate(['/home/dashboard']));
                  } else {
                     this.ngZone.run(() => this.router.navigate(['/setup']));
                  }
               }
            })
         })
      // .then(() => this.snackBar.open('you have successfully signed in','', { duration: 3000}))
      // .catch(error => this.snackBar.open(error.message,'', { duration: 3000}));
   }



   emailSignUp(email: string, password: string, firstName: string, lastName: string) {
      return this.afAuth.createUserWithEmailAndPassword(email, password)
         .then((credential) => {

            let _users = this.fireStoreService.fireStore.collection<User>('users', ref => ref.where('uid', '==', credential.user.uid)).valueChanges()

            // this.fireStoreService.fireStore.doc(`users/${credential.user.uid}`)
            //    .valueChanges()
            //    .subscribe((fireUser: User) => {
            //     this.storage.store('fireUser', fireUser);
            //       this.storage.store('congregationRef', fireUser.congregation)
            // })

            _users.subscribe(users => {
               if (users.length > 0) {
                  // already exists
                  if (users[0].congregation) {
                     // already has congregation setup
                     this.ngZone.run(() => this.router.navigate(['/home/dashboard']));
                  } else {
                     this.ngZone.run(() => this.router.navigate(['/setup']));
                  }
               } else {
                  this.createUserData(credential, firstName, lastName)
                     .then(() => {
                        this.ngZone.run(() => this.router.navigate(['/setup']));
                     })
                  }
               })
            })
         }



   //   resetPassword(email: string) {
   //     return firebase.auth().sendPasswordResetEmail(email)
   //       .then(() => this.snackBar.open('We\'ve sent you a password reset link','', { duration: 3000}))
   //       .catch(error => this.snackBar.open(error.message,'', { duration: 3000}));
   //   }



   googleSignIn() {
      const provider = new firebase.default.auth.GoogleAuthProvider();
      this.socialLogin(provider)
   }


   private socialLogin(provider) {
      return this.afAuth.signInWithPopup(provider)
         .then((credential: firebase.default.auth.UserCredential) => {

            let fireUserRef = this.fireStoreService.fireStore.doc<User>(`users/${credential.user.uid}`).valueChanges()

            fireUserRef.subscribe(fireUser => {
               if (fireUser) {
              //  this.storage.store('fireUser', fireUser);
                  // already exists
                  if (fireUser.congregation) {
                   //  this.storage.store('congregationref', fireUser.congregation)
                     // already has congregation setup
                     this.ngZone.run(() => this.router.navigate(['/home/dashboard']));
                  } else {
                     this.ngZone.run(() => this.router.navigate(['/setup']));
                  }
               } else {
                  this.createUserData(credential, credential.additionalUserInfo.profile['given_name'], credential.additionalUserInfo.profile['family_name'])
                     .then(() => {
                        this.ngZone.run(() => this.router.navigate(['/setup']));
                     })
               }
            })
         })
      // .catch(error => this.snackBar.open(error.message,'', { duration: 3000}));
   }


   createUserData(credential: firebase.default.auth.UserCredential, firstName: string, lastName: string): Promise<any> {
      let privilege: Privilege = Privilege.admin
      let data: User = {
         uid: credential.user.uid,
         email: credential.user.email,
         congregation: null,
         firstName: firstName,
         lastName: lastName,
         photoURL: credential.user.photoURL ? credential.user.photoURL : null,
         permissions: this.fireStoreService.setPermissions(privilege),
         loginProvider: credential.additionalUserInfo.providerId,
         isEmailVerified: credential.user.emailVerified
      };
     // return this.fireDBService.fireDBService.object(`users/${credential.user.uid}`).set(data)
      return this.fireStoreService.create('users', credential.user.uid, data);
   }


}
