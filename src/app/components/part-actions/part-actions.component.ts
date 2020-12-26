import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageService } from 'ngx-webstorage';
import { Publisher } from 'src/app/models/publisher.model';
import { Parent, Part, WeekProgram } from 'src/app/models/wol.model';
import { FireStoreService } from 'src/app/services/fire-store.service';
import { SelectPublisherComponent } from '../modals/select-publisher/select-publisher.component';

@Component({
  selector: 'part-actions',
  templateUrl: './part-actions.component.html'
})
export class PartActionsComponent implements OnInit {
  constructor(
    public modalService: NgbModal,
    private fireStoreService: FireStoreService,
    private storage: LocalStorageService
  ) {}
  @Input('part') part: Part;
  @Input('weekProgram') weekProgram: WeekProgram;
  congregation: string;
  assigneeDocRef: AngularFirestoreDocument<Publisher>;
  assistantDocRef: AngularFirestoreDocument<Publisher>;
  partDocRef: AngularFirestoreDocument<Part>;
  parentApply = Parent.apply;
  parentWeekend = Parent.weekend;
  ngOnInit(): void {
    this.congregation = this.storage.retrieve('congregationref');
    Parent.apply;
  }

  remove(type: string) {
    if (this.part.assignee)
      this.assigneeDocRef = this.fireStoreService.fireStore.doc<Publisher>(
        `${this.congregation}/publishers/${this.part.assignee.uid}`
      );

    if (this.part.assistant)
      this.assistantDocRef = this.fireStoreService.fireStore.doc<Publisher>(
        `${this.congregation}/publishers/${this.part.assistant.uid}`
      );

    if (this.part)
      this.partDocRef = this.fireStoreService.fireStore.doc<Part>(
        `${this.congregation}/weeks/${this.weekProgram.id}/parts/${this.part.id}`
      );

    switch (type) {
      case 'assignee':
        if (this.part.assignee)
          this.partDocRef.update({ assignee: null }).then(() => {
            this.assigneeDocRef
              .get()
              .toPromise()
              .then((document) => {
                if (document.exists) {
                  let parts = document
                    .data()
                    .parts.filter((p) => p.split('/')[5] !== this.part.id);
                  this.assigneeDocRef.update({ parts: parts });
                }
              });
          });
      case 'assistant':
        if (this.part.assistant)
          this.partDocRef.update({ assistant: null }).then(() => {
            this.assistantDocRef
              .get()
              .toPromise()
              .then((document) => {
                if (document.exists) {
                  let parts = document
                    .data()
                    .parts.filter((p) => p.split('/')[5] !== this.part.id);
                  this.assistantDocRef.update({ parts: parts });
                }
              });
          });
    }
  }

  openSelectPublisherModal(part: Part, type: string) {
    const modalRef = this.modalService.open(SelectPublisherComponent, {
      centered: false,
      keyboard: false,
      backdrop: true,
      size: 'md',
      scrollable: true,
    });
    modalRef.componentInstance.part = part;
    modalRef.componentInstance.type = type;
    if (part.assistant || part.assistant)
      modalRef.componentInstance.replacing =
        type == 'assignee' ? part.assignee : part.assistant;
    modalRef.componentInstance.weekProgram = this.weekProgram;
  }
}
