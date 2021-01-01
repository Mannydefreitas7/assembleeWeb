import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForage } from 'ngforage';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Congregation } from 'src/app/models/congregation.model';
import { Permission } from 'src/app/models/publisher.model';
import { User } from 'src/app/models/user.model';
import { FireStoreService } from 'src/app/services/fire-store.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'ab-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  $fireUser: Observable<User>;
  congregation: Congregation;

  constructor(
     public auth: AuthService,
     public activeRoute: ActivatedRoute,
     public router: Router,
     public storeService: StoreService,
     public fireStore: FireStoreService,
     public storage: LocalStorageService,
     public forage: NgForage
     ) { }

  ngOnInit(): void {

     this.forage.getItem<firebase.default.User>('user').then(user => {
      this.$fireUser = this.fireStore.fireStore.doc<User>(`users/${user.uid}`).valueChanges()
     })
  }

  canActivePublisher(user: User) : boolean {
    return user.permissions.includes(Permission.publishers)
  }

  canActivePrograms(user: User) : boolean {
    return user.permissions.includes(Permission.programs)
  }


}
