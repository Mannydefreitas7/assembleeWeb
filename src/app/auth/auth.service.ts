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
import { ToastrService } from 'ngx-toastr';


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
      public toastr: ToastrService,
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
                this.fireStoreService.fireStore.doc<User>(`users/${user.uid}`).valueChanges().subscribe((fireUser) => {
                   if (fireUser && fireUser.congregation) {
                     this.forage.getItem('fireUser').then(fu => {
                       if (!fu) {
                        this.forage.setItem('fireUser', fireUser).then(() => this.forage.setItem('congregationRef', fireUser.congregation))
                        if (fireUser)
                        this.fireStoreService.fireStore.doc(fireUser.congregation).valueChanges().subscribe(cong => {
                          if (cong) {
                            this.forage.setItem('congregation', cong)
                          }
                        })
                       }
                     })
                   }
                })
            })

         } else {
        //  this.forage.clear()
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

   appleSignIn() {
     const provider = new firebase.default.auth.OAuthProvider('apple.com')
     this.socialLogin(provider)
   }

  googleSignUp() {
    const provider = new firebase.default.auth.GoogleAuthProvider();
    this.socialSignUp(provider)
  }

  appleSignUp() {
    const provider = new firebase.default.auth.OAuthProvider('apple.com')
    this.socialSignUp(provider)
  }


   private socialLogin(provider) {

      return this.afAuth.signInWithPopup(provider)
         .then((credential: firebase.default.auth.UserCredential) => {
           console.log(credential)
              if (credential.additionalUserInfo.isNewUser == false) {
                let fireUserRef = this.fireStoreService.fireStore.doc<User>(`users/${credential.user.uid}`).valueChanges();
                fireUserRef.subscribe(fireUser => {
                  if (fireUser) {
                    this.toastr.success("Login success")
                     // already exists
                     if (fireUser.congregation) {
                        // already has congregation setup
                        this.ngZone.run(() => this.router.navigate(['/home/dashboard']));
                     } else {
                        this.ngZone.run(() => this.router.navigate(['/setup']));
                     }
                  }
               })
              } else {
                this.toastr.error("User not found")
                console.warn("login not found")
              }
         })
       .catch(console.log);
   }

   private socialSignUp(provider) {
    return this.afAuth.signInWithPopup(provider)
       .then((credential: firebase.default.auth.UserCredential) => {

          let fireUserRef = this.fireStoreService.fireStore.doc<User>(`users/${credential.user.uid}`).valueChanges()

          fireUserRef.subscribe(fireUser => {
             if (fireUser) {
              this.toastr.info("User already exists. Please login instead.")
            //  this.storage.store('fireUser', fireUser);
                // // already exists
                // if (fireUser.congregation) {
                //  //  this.storage.store('congregationref', fireUser.congregation)
                //    // already has congregation setup
                //    this.ngZone.run(() => this.router.navigate(['/home/dashboard']));
                // } else {
                //    this.ngZone.run(() => this.router.navigate(['/setup']));
                // }
             } else {
                this.createUserData(credential, credential.additionalUserInfo.profile['given_name'], credential.additionalUserInfo.profile['family_name'])
                   .then(() => {
                      this.ngZone.run(() => this.router.navigate(['/setup']));
                   })
             }
          })
       })
     .catch(error => this.toastr.error(error.message));
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
      return this.fireStoreService.create('users', credential.user.uid, data);
   }


}
