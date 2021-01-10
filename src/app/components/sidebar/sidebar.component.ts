import { Component, OnInit } from '@angular/core';
import { NgForage } from 'ngforage';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Permission } from 'src/app/models/publisher.model';
import { User } from 'src/app/models/user.model';
import { FireStoreService } from 'src/app/services/fire-store.service';

@Component({
  selector: 'ab-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  $fireUser: Observable<User>;
  constructor(
    public auth: AuthService,
    public forage: NgForage,
    public fireStore: FireStoreService
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
