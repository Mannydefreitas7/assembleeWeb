import { Component, OnInit } from '@angular/core';
import { NgForage } from 'ngforage';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { Part } from 'src/app/models/wol.model';
import { FireStoreService } from 'src/app/services/fire-store.service';
import moment from 'moment';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private forage: NgForage,
    private fireStore: FireStoreService,
  ) { }

  fireUser: User;
  $parts: Observable<Part[]>;
  $myParts: Observable<Part[]>;

  ngOnInit(): void {

    this.forage.getItem('congregationRef').then(path => {
      this.forage.getItem<User>('fireUser').then(user => {
        this.$myParts = this.fireStore.fireStore.collection<Part>(`${path}/parts`)
        .valueChanges()
        .pipe(map(data => {
          return data.filter(p => {
            if (p.assignee) return p.assignee.uid == user.uid;
            if (p.assistant) return p.assistant.uid == user.uid;
          })
        }),
        map(data => data.sort((a, b) => a.date - b.date)),
        take(1))

        this.$parts = this.fireStore.fireStore.collection<Part>(`${path}/parts`)
        .valueChanges()
        .pipe(map(data => {
          return data.filter(p => {
            return !p.isConfirmed && moment(p.date.toDate()).isAfter(new Date())
          })
        }),
        map(data => data.filter(p => p.assistant != null || p.assignee != null)),
        map(data => data.sort((a, b) => a.date - b.date)),
        map(data => {
          return data.filter(p => {
            if (p.assignee) return p.assignee.uid != user.uid;
            if (p.assistant) return p.assistant.uid != user.uid;
          })
        }),
        take(1))
      })
    })

  }

}
