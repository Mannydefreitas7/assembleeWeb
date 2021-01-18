import { Component, Input, OnInit } from '@angular/core';
import { NgForage } from 'ngforage';
import { Part } from 'src/app/models/wol.model';
import { FireStoreService } from 'src/app/services/fire-store.service';

@Component({
  selector: 'part-row',
  templateUrl: './part-row.component.html',
  styleUrls: ['./part-row.component.scss']
})
export class PartRowComponent implements OnInit {

  constructor(
    public fireStore: FireStoreService,
    public forage: NgForage
  ) { }

  @Input('part') part: Part;

  ngOnInit(): void {
    
  }

  confirm() {
    this.forage.getItem('congregationRef').then(path => {
      this.fireStore.fireStore.doc<Part>(`${path}/parts/${this.part.id}`).update({
        isConfirmed: true
      })
    })
  }
  unconfirm() {
    this.forage.getItem('congregationRef').then(path => {
      this.fireStore.fireStore.doc<Part>(`${path}/parts/${this.part.id}`).update({
        isConfirmed: false
      })
    })
  }
 
}
