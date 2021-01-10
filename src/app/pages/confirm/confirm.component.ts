import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Part } from 'src/app/models/wol.model';
import { FireStoreService } from 'src/app/services/fire-store.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  constructor(
    public fireStore: FireStoreService,
    public route: ActivatedRoute
  ) { }

  part$: Observable<Part>;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params && params.part && params.cong) {
       this.part$ = this.fireStore.fireStore.doc<Part>(`congregations/${params.cong}/parts/${params.part}`).valueChanges();
      }
    })
  }

}
