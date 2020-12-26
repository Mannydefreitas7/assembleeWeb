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
  ngOnInit(): void {
   const func = this.fns.httpsCallable('test');
   func({ test: 'test'}).subscribe(console.log)
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }

  test() {
    console.log('RAN FROM A FUNCTION')
  }
}
