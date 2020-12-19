import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';

import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { switchMap, map } from 'rxjs/operators';

import { Observable, forkJoin } from 'rxjs';
import { of } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { User } from '../models/user.model';
import { FireStoreService } from '../services/fire-store.service';
import { Publisher, Privilege } from '../models/publisher.model';


@Injectable({
  providedIn:  'root'
})
export class AuthService {
  user: Observable<User>;
  authState: Observable<firebase.default.User>;
  private userDetails: firebase.default.User = null;

  constructor(
    public afAuth: AngularFireAuth,
    private fireStoreService: FireStoreService,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.authState = this.afAuth.authState;
    this.authState.subscribe(
      (user) => {
        if (user) {
          this.userDetails = user;
        }
        else {
          this.userDetails = null;
        }
      }
    ); 
  }

  get _currentUserObservable(): any {
    return this.afAuth.authState
  }

  get authenticated(): boolean {
    return this.authState != null;
  }

  // Returns current user
// get _currentUser(): any {
//  // return this.authenticated ? this.authState.auth : null;
// }

// Returns current user UID
// get _currentUserId(): string {
//  // return this.authenticated ? this.authState.uid : '';
// }

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
     this.afAuth.signOut().then(value => {
        this.router.navigate(['login'])
     })
  }


  stateChanged(): any {
    return this.afAuth.onAuthStateChanged(user => {
      
      if (user) {
        this.ngZone.run(() => this.router.navigate(['/home/dashboard']));
      } else {
        this.ngZone.run(() => this.router.navigate(['/']));
      }
    });
  }



  get isAuth(): boolean {
    return this.user !== null;
  }
  isLoggedIn() {
   if (this.userDetails == null ) {
       return false;
     } else {
       return true;
     }
   }
//   get currentUserId(): string {
//     return this.authenticated ? this.currentUserObservable : null;
//   }

  emailSignIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then(() => {
        this.router.navigate(['/home/dashboard']);
      })
      // .then(() => this.snackBar.open('you have successfully signed in','', { duration: 3000}))
      // .catch(error => this.snackBar.open(error.message,'', { duration: 3000}));
  }



  emailSignUp(email: string, password: string, firstName: string, lastName: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
    .then(credential => { 
       
       this.createUserData(credential, firstName, lastName)
    });
  }



//   resetPassword(email: string) {
//     return firebase.auth().sendPasswordResetEmail(email)
//       .then(() => this.snackBar.open('We\'ve sent you a password reset link','', { duration: 3000}))
//       .catch(error => this.snackBar.open(error.message,'', { duration: 3000}));
//   }

//   signOut() {
//     return this.afAuth.auth.signOut()
//       .then(() => {
//         this.router.navigate(['/']);
//         this.snackBar.open('Logged Out Succesfully','', { duration: 3000})
//       });
//   }

//   googleLogin() {
//     const provider = new firebase.default.auth.GoogleAuthProvider();
//     return this.afAuth.signInWithPopup(provider)
//       .then((credential: firebase.default.auth.UserCredential) => {
//          if (credential.user)
//             this.ngZone.run(() => this.router.navigate(['/home/dashboard']));
//       })
//    // .then(() => this.snackBar.open('You are logged-in with Google','', { duration: 3000}))
//   //  .catch(error => this.snackBar.open(error.message,'', { duration: 3000}));
//   }

  googleSignIn() {
   const provider = new firebase.default.auth.GoogleAuthProvider();
   this.socialLogin(provider)
  // .then(() => this.snackBar.open('You are logged-in with Google','', { duration: 3000}))
 //  .catch(error => this.snackBar.open(error.message,'', { duration: 3000}));
 }



//   facebookLogin() {
//     const provider = new firebase.auth.FacebookAuthProvider();
//     return this.afAuth.auth.signInWithPopup(provider)
//     .then(() => {
//       this.ngZone.run(() => this.router.navigate(['/home']));
//     })
//     .then(() => this.snackBar.open('You are logged-in with Facebook','', { duration: 3000}))
//     .catch(error =>
//       this.snackBar.open(error.message,'', { duration: 3000}));
//   }


//   facebookSignup() {
//     const provider = new firebase.auth.FacebookAuthProvider();
//     return this.afAuth.auth.signInWithPopup(provider)
//     .then((result: any) => {
//       return this.createUserData(result.user); })
//     .then(() => {
//       this.ngZone.run(() => this.router.navigate(['/home']));
//     })
//     .then(() => this.snackBar.open('You signed up with Facebook successfully','', { duration: 3000}))
//     .catch(error =>
//       this.snackBar.open(error.message,'', { duration: 3000}));
//   }

  private socialLogin(provider) {
    return this.afAuth.signInWithPopup(provider)
      .then((credential: firebase.default.auth.UserCredential) => {

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


  createUserData(credential: firebase.default.auth.UserCredential, firstName: string, lastName: string) : Promise<any> {
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
