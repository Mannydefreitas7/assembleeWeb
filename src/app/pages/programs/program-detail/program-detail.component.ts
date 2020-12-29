import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Parent, Part, WeekProgram } from 'src/app/models/wol.model';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { FireStoreService } from 'src/app/services/fire-store.service';
import { LocalStorageService } from 'ngx-webstorage';

import { ExportService } from 'src/app/services/export.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@AutoUnsubscribe()
@Component({
  selector: 'ab-program-detail',
  templateUrl: './program-detail.component.html',
  styleUrls: ['./program-detail.component.scss']
})
export class ProgramDetailComponent implements OnInit, OnDestroy {
  @ViewChild('pdfTable', {static: false}) pdfTable: ElementRef;
  constructor(
     private router: Router,
     private route: ActivatedRoute,
     private fireStoreService: FireStoreService,
     public modalService: NgbModal,
     private storage: LocalStorageService,
     private exportService: ExportService
     ) { }
id: string
parts: Part[];
treasures: Part[];
apply: Part[];
life: Part[];
talk: Part[];
wt: Part[];
chairmans: Part[];
prayers: Part[];
ngUnsubscribe = new Subject();


@Input('weekProgram') public weekProgram: WeekProgram;
  ngOnInit(): void {
    let path : string = this.storage.retrieve('congregationref');
    if (!this.parts)
      this.fireStoreService.fireStore.collection<Part>(`${path}/weeks/${this.weekProgram.id}/parts`).valueChanges()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(parts => {
         this.parts = parts
         this.treasures = this.parts.filter(part => part.parent == Parent.treasures).sort((a, b) => a.index - b.index)
         this.apply = this.parts.filter(part => part.parent == Parent.apply).sort((a, b) => a.index - b.index)
         this.life = this.parts.filter(part => part.parent == Parent.life).sort((a, b) => a.index - b.index)
         this.talk = this.parts.filter(part => part.parent == Parent.talk).sort((a, b) => a.index - b.index)
         this.wt = this.parts.filter(part => part.parent == Parent.wt).sort((a, b) => a.index - b.index)
         this.chairmans = this.parts.filter(part => part.parent == Parent.chairman).sort((a, b) => a.index - b.index)
         this.prayers = this.parts.filter(part => part.parent == Parent.prayer).sort((a, b) => a.index - b.index)
      })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }

  public downloadAsPDF() {

    this.exportService.createSinglePDF(this.weekProgram, this.parts)
  }


}
