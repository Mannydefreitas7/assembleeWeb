import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Parent, Part, WeekProgram } from 'src/app/models/wol.model';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { FireStoreService } from 'src/app/services/fire-store.service';
import { LocalStorageService } from 'ngx-webstorage';

import { ExportService } from 'src/app/services/export.service';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, take, takeUntil } from 'rxjs/operators';
import { NgForage } from 'ngforage';
import talks from './../../../../assets/talks.json'
import { Congregation } from 'src/app/models/congregation.model';
import { StoreService } from 'src/app/services/store.service';
import { Talk } from 'src/app/models/publisher.model';

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
     private forage: NgForage,
     public store: StoreService,
     private exportService: ExportService
     ) { }
id: string
parts: Part[];
treasures: Part[];
apply: Part[];
life: Part[];
talk: Part[];
selectedTalk: Talk = null
wt: Part[];
chairmans: Part[];
prayers: Part[];
talks: Talk[];
ngUnsubscribe = new Subject();


@Input('weekProgram') public weekProgram: WeekProgram;

public model: string;

  ngOnInit(): void {
    let path : string = this.storage.retrieve('congregationref');

    this.forage.getItem<string>('congregationRef').then(path => {
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
         this.loadTalks(this.talk)
      })
    })
    
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }
  test(selectedTalk: Talk) {
    console.log(selectedTalk)

  }

  saveTalk(talk: Talk, part: Part) {
    if (talk)
    this.forage.getItem<Congregation>('congregation').then(congregation => {
      this.fireStoreService.fireStore
      .doc<Part>(`congregations/${congregation.id}/weeks/${this.weekProgram.id}/parts/${part.id}`)
      .update({
        title: talk.title,
        isSymposium: false,
        talkNumber: String(talk.id + 1)
      })
    })
  }

  loadTalks(talkParts: Part[]) {
  
    if (talkParts && talkParts.length > 0) {
     
      this.forage.getItem<Congregation>('congregationRef').then(path => {
      this.fireStoreService.fireStore.doc<Part>(`${path}/weeks/${this.weekProgram.id}/parts/${talkParts[0].id}`)
      .valueChanges()
      .subscribe(talkChanges => {
        if (talkChanges.assignee) {
          this.fireStoreService.fireStore.collection<Talk>(`${path}/speakers/${talkChanges.assignee.uid}/talks`)
          .valueChanges()
          .subscribe(talks => this.talks = talks)
      }
      })
    })
    }
  }

  deleteWeek(weekID: string) {
    this.forage.getItem<Congregation>('congregation').then(congregation => {
      this.fireStoreService
      .delete(`congregations/${congregation.id}/weeks/${weekID}`)
    })
   
  }

  search = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 1 ? []
      : this.talks.filter(v => v.title.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  )

}
