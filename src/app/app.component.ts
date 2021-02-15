import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MessageService } from './services/message.service';
import talks from './../assets/talks.json';
import { FireStoreService } from './services/fire-store.service';
import { Talk } from './models/publisher.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'assembleeWeb';
  constructor(
    private fns: AngularFireFunctions,
    public fs: FireStoreService,
    public messageService: MessageService
    ) {}

  ngOnInit() {

  

  }
} 
