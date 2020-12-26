import { ThrowStmt } from '@angular/compiler';
import { Component } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'assembleeWeb';
  constructor(private fns: AngularFireFunctions) {}

  test() {
    console.log('RAN FROM A FUNCTION')
  }
}
