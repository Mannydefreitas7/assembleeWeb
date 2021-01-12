import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MessageService } from './services/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'assembleeWeb';
  constructor(
    private fns: AngularFireFunctions,
    public messageService: MessageService
    ) {}

  ngOnInit() {
    console.log(this.messageService.toasts)
  }
}
