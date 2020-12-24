import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, tap } from 'rxjs/operators';
import { SelectPublisherComponent } from 'src/app/components/modals/select-publisher/select-publisher.component';
import { Part, WeekProgram } from 'src/app/models/wol.model';

@Component({
  selector: 'ab-program-detail',
  templateUrl: './program-detail.component.html',
  styleUrls: ['./program-detail.component.scss']
})
export class ProgramDetailComponent implements OnInit {

  constructor(
     private router: Router, 
     private route: ActivatedRoute,
     public modalService: NgbModal
     ) { }
id: string

@Input('weekProgram') public weekProgram: WeekProgram;
  ngOnInit(): void {
   //   this.route.paramMap
   //      .subscribe(param => {
   //         this.id = param.get('id');
   //      });
   this.weekProgram.weekEnd.watchtowerStudy.title
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
