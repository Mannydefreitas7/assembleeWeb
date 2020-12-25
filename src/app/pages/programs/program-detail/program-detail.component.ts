import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { from, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SelectPublisherComponent } from 'src/app/components/modals/select-publisher/select-publisher.component';
import { Part, WeekProgram } from 'src/app/models/wol.model';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { FireStoreService } from 'src/app/services/fire-store.service';
import { LocalStorageService } from 'ngx-webstorage';

@AutoUnsubscribe()
@Component({
  selector: 'ab-program-detail',
  templateUrl: './program-detail.component.html',
  styleUrls: ['./program-detail.component.scss']
})
export class ProgramDetailComponent implements OnInit, OnDestroy {

  constructor(
     private router: Router, 
     private route: ActivatedRoute,
     private fireStoreService: FireStoreService,
     public modalService: NgbModal,
     private storage: LocalStorageService
     ) { }
id: string
$parts: Observable<Part[]>;

@Input('weekProgram') public weekProgram: WeekProgram;
  ngOnInit(): void {
    let path : string = this.storage.retrieve('congregation');
    this.$parts = this.fireStoreService.fireStore.collection<Part>(`${path}/weeks/${this.weekProgram.id}/parts`).valueChanges();
  }

  ngOnDestroy() {
    console.log('program detail destroyed')
  }




  openSelectPublisherModal(part: Part) {
     
  const modalRef = this.modalService.open(SelectPublisherComponent, { 
      centered: false, 
      keyboard: false,
      backdrop: 'static',
      size: 'md',
      scrollable: true
  })
  modalRef.componentInstance.part = part;
  modalRef.componentInstance.weekProgram = this.weekProgram;
}
 

}
