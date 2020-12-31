import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
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
     public storage: LocalStorageService
     ) { }

  ngOnInit(): void {

    this.fireUser = this.storage.retrieve('fireUser');
    this.congregation = this.storage.retrieve('congregation');
  }

}
