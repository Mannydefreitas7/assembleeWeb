import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { GeoLocationList } from 'src/app/models/congregation.model';
import { FireStoreService } from 'src/app/services/fire-store.service';
import { User } from 'src/app/models/user.model';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { map } from 'rxjs/operators';

@AutoUnsubscribe()
@Component({
  selector: 'app-claimed-congregation',
  templateUrl: './claimed-congregation.component.html',
  styleUrls: ['./claimed-congregation.component.scss']
})
export class ClaimedCongregationComponent implements OnInit, OnDestroy {

  constructor(
     public activeModal: NgbActiveModal,
     public fireStore: FireStoreService
     ) { }
   $users: Observable<User[]>;
  @Input('congregation') congregation: GeoLocationList

  ngOnInit(): void {
     this.$users = this.fireStore.fireStore.collection<User>('users').valueChanges().pipe(map(data => {
        return data.filter(d => {
           if (d.congregation)
            return d.congregation.path == `congregations/${this.congregation.properties.orgGuid}`
         })
     }))
  }

  ngOnDestroy(): void {
     //Called once, before the instance is destroyed.
     //Add 'implements OnDestroy' to the class.
  }

}
