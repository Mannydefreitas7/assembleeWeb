import { Component, OnInit } from '@angular/core';
import { NgForage } from 'ngforage';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { Part, WeekProgram } from 'src/app/models/wol.model';
import { FireStoreService } from 'src/app/services/fire-store.service';
import moment from 'moment';
import { Publisher } from 'src/app/models/publisher.model';


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
  $user: Observable<User>;
  ngOnInit(): void {
 
    let today: Date = new Date()
    this.forage.getItem('congregationRef').then(path => {
      if (path) {
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
          map(data => data.filter(p => moment(p.date.toDate()).isAfter(today))))

          this.$user = this.fireStore.fireStore.doc(`users/${user.uid}`).valueChanges()

          this.$parts = this.fireStore.fireStore.collection<Part>(`${path}/parts`)
          .valueChanges()
          .pipe(map(data => {
            return data.filter(p => {
              return moment(p.date.toDate()).isAfter(today)
            })
          }),
          map(data => data.filter(p => p.assistant != null || p.assignee != null)),
          map(data => data.sort((a, b) => a.date - b.date)),
          map(data => {
            return data.filter(p => {
              if (p.assignee) return p.assignee.uid != user.uid;
              if (p.assistant) return p.assistant.uid != user.uid;
            })
          }))
        })
      }
    })
    .then(() => this.deleteOldWeeks())
    .then(() => this.deleteOlderParts())
  }

  deleteOldWeeks() {
    this.forage.getItem('congregationRef').then((path) => {
      this.fireStore.fireStore
        .collection<WeekProgram>(`${path}/weeks`, (ref) =>
          ref.orderBy('date', 'asc')
        )
        .valueChanges()
        .pipe(
          map(weeks => {
            return weeks.filter(week => moment(week.date.toDate()).isBefore(moment(new Date()).subtract('1', 'week')))
          })
        ).subscribe(weeks => {
          if (weeks.length > 0)
          weeks.forEach(week => {
            this.fireStore.fireStore
            .doc<WeekProgram>(`${path}/weeks/${week.id}`)
            .delete()
          })
        })
    })
  }

  deleteOlderParts() {
    this.forage.getItem('congregationRef').then((path) => {
      this.fireStore.fireStore
        .collection<Part>(`${path}/parts`, (ref) =>
          ref.orderBy('date', 'asc')
        )
        .valueChanges()
        .pipe(
          map(parts => {
            return parts.filter(part => moment(part.date.toDate()).isBefore(moment(new Date()).subtract('2', 'month')))
          })
        )
        .subscribe(parts => {
          if (parts.length > 0)
          parts.forEach(part => {
            this.fireStore.fireStore
            .doc<WeekProgram>(`${path}/parts/${part.id}`)
            .delete()
          })
        })
    })
  }

}
