import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForage } from 'ngforage';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Congregation } from 'src/app/models/congregation.model';
import { User } from 'src/app/models/user.model';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'ab-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  fireUser: User;
  congregation: Congregation;

  constructor(
     public auth: AuthService,
     public activeRoute: ActivatedRoute,
     public router: Router,
     public storeService: StoreService,
     public storage: LocalStorageService,
     public forage: NgForage
     ) { }

  ngOnInit(): void {
    this.forage.getItem('fireUser').then(user => this.fireUser = user)
   // this.storage.observe('fireUser').subscribe(user => this.fireUser = user)
    this.congregation = this.storage.retrieve('congregation');
  }

}
