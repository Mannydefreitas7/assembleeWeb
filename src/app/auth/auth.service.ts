import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { switchMap, map } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { User } from '../models/user.model';


@Injectable({
  providedIn:  'root'
})
export class AuthService {
  user: Observable<User>;
  authState: Observable<firebase.default.User>;
  private userDetails: firebase.default.User = null;

  constructor(
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private ngZone: NgZone,
    private form: FormBuilder
  ) {
    this.authState = this.afAuth.authState;
    this.authState.subscribe(
      (user) => {
        if (user) {
          this.userDetails = user;
          console.log(this.userDetails);
          this.router.navigate(['home'])
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
        this.ngZone.run(() => this.router.navigate(['/home']));
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
        this.router.navigate(['/home']);
      })
      // .then(() => this.snackBar.open('you have successfully signed in','', { duration: 3000}))
      // .catch(error => this.snackBar.open(error.message,'', { duration: 3000}));
  }



  emailSignUp(email: string, password: string, displayName?: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
    .then(credential => { 
       console.log(credential)
       this.createUserData(credential.user)
    //})
      // this.afAuth.currentUser.updateProfile({
      //   displayName: `${displayName}`,
      //   photoURL: 'https://firebasestorage.googleapis.com/v0/b/lita-jw-app.appspot.com/o/publications%2Fprofile.png?alt=media&token=86287c07-526f-447a-acbf-7161c007ff1e'})
      // .then(() => this.createUserData(credential.user))
      // .then(() => this.snackBar.open('welcome, your account has been created','', { duration: 3000}))
      // .catch(error => this.snackBar.open(error.message,'', { duration: 3000}))
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


  googleLogin() {
    const provider = new firebase.default.auth.GoogleAuthProvider();

    return this.afAuth.signInWithPopup(provider)
    .then(() => {
      this.ngZone.run(() => this.router.navigate(['/home']))
    //  this.snackBar.open('You are logged-in with Google','', { duration: 3000})
    })
   // .catch(error => this.snackBar.open(error.message,'', { duration: 3000}));
  }

  googleSignUp() {
    const provider = new firebase.default.auth.GoogleAuthProvider();

    return this.socialLogin(provider)
    .then(() => {
      this.ngZone.run(() => this.router.navigate(['/home']));
    })
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
      .then((credential: any) => {
        return this.createUserData(credential.user);
      })
     // .catch(error => this.snackBar.open(error.message,'', { duration: 3000}));
  }


  createUserData(user) {

    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      congregation: null,
      displayName: user.displayName,
      photoURL: user.photoURL,
      homeView: {
        publishers: true
      }
    };
    return userRef.set(data, { merge: true })
}


}
