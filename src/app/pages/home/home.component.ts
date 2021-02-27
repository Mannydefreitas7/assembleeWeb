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
  weeks: WeekProgram[];
  $myParts: Observable<Part[]>;
  $user: Observable<User>;
  ngOnInit(): void {
  //  this.addAssigneeAssistantToPubs()
    let today: Date = new Date()
    this.forage.getItem('congregationRef').then(path => {
      if (path) {
        this.forage.getItem<User>('fireUser').then(user => {
          this.$myParts = this.fireStore.fireStore.collection<Part>(`${path}/publishers/${user.uid}/parts`)
          .valueChanges()
          .pipe(map(data => data.sort((a, b) => a.date.toDate() - b.date.toDate())),
          map(data => data.filter(p => moment(p.date.toDate()).isAfter(today))))
          this.$user = this.fireStore.fireStore.doc(`users/${user.uid}`).valueChanges()
        })
      }
    })
    .then(() => this.deleteOldWeeks())
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

  addAssigneeAssistantToPubs() {
    this.forage.getItem('congregationRef').then((path) => {
      this.fireStore.fireStore.collection<Publisher>(`${path}/publishers`)
      .get()
      .subscribe(data => {
        let publishers = data.docs;
        publishers.map(pub => pub.data()).forEach(publisher => {
           this.fireStore.fireStore.collection<Part>(`${path}/publishers/${publisher.uid}/parts`)
           .get()
           .subscribe(partsData => {
              let parts = partsData.docs
              parts.map(p => p.data()).forEach(p => {
                this.fireStore.fireStore.doc<Part>(`${path}/publishers/${publisher.uid}/parts/${p.id}`)
                .update({
                  assignee: publisher
                })
              })
           })
        })
      })
      })
  }

  transferPartsToWeeks() {
    this.forage.getItem('congregationRef').then((path) => {
    this.fireStore.fireStore.collection<WeekProgram>(`${path}/weeks`)
    .get()
    .subscribe(data => {
      let weeks = data.docs;
      this.fireStore.fireStore
        .collection<Part>(`${path}/parts`)
        .get()
        .subscribe(parts => {

        weeks.forEach(week => {
          let _parts: Part[] = [];
          let _week = week.data();
          _parts = parts.docs.filter(p => p.data().week == _week.id).map(p => p.data())
          
          _parts.forEach(p => {
            let part: Part = {
              ...p, 
              parts: []
            }
            this.fireStore.fireStore.doc<Part>(`${path}/weeks/${_week.id}/parts/${p.id}`).set(part)
          })

        })

      })
    })
    })
  }
}
