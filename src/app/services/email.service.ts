import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireFunctions } from '@angular/fire/functions'
@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(
    public http: HttpClient,
    public fun: AngularFireFunctions
    ) { }

    sendEmail(data) {
      const callable = this.fun.httpsCallable('sendEmail');
      callable(data).subscribe(console.log, console.log)
    }
}
