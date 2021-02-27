import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForage } from 'ngforage';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'ngx-webstorage';
import { Publisher } from 'src/app/models/publisher.model';
import { EmailMessage, User } from 'src/app/models/user.model';
import { Parent, Part, WeekProgram } from 'src/app/models/wol.model';
import { EmailService } from 'src/app/services/email.service';
import { ExportService } from 'src/app/services/export.service';
import { FireStoreService } from 'src/app/services/fire-store.service';
import { RenamePartComponent } from '../modals/rename-part/rename-part.component';
import { SelectPublisherComponent } from '../modals/select-publisher/select-publisher.component';

@Component({
  selector: 'part-actions',
  templateUrl: './part-actions.component.html'
})
export class PartActionsComponent implements OnInit {

  constructor(
    public modalService: NgbModal,
    private fireStoreService: FireStoreService,
    private storage: LocalStorageService,
    private forage: NgForage,
    public clipboardService: ClipboardService,
    public exportService: ExportService,
    public emailService: EmailService,
    public toastService : ToastrService
  ) {}

  @Input('part') part: Part;
  @Input('weekProgram') weekProgram: WeekProgram;
  congregation: string;
  assigneeDocRef: AngularFirestoreDocument<Part>;
  assistantDocRef: AngularFirestoreDocument<Part>;
  partDocRef: AngularFirestoreDocument<Part>;
  parentApply = Parent.apply;
  parentTalk = Parent.talk;
  parentTreasures = Parent.treasures;
  parentWt = Parent.wt;
  parentlife = Parent.life;
  user: User;

  ngOnInit(): void {
    this.forage.getItem<User>("fireUser").then(fireUser => this.user = fireUser)
  }

  remove(type: string) {
    this.forage.getItem('congregationRef').then(path => {

      if (this.part) {
        this.partDocRef = this.fireStoreService.fireStore.doc<Part>(
          `${path}/weeks/${this.part.week}/parts/${this.part.id}`
        );

    switch (type) {
      case 'assignee':
        if (this.part.assignee) {
          this.assigneeDocRef = this.fireStoreService.fireStore.doc<Part>(
            `${path}/publishers/${this.part.assignee.uid}/parts/${this.part.id}`
          );
          this.partDocRef.update({ 
            assignee: null,
            isConfirmed: false
           })
          .then(() => {
            this.assigneeDocRef.delete()
          }) 
        }
         
      case 'assistant':
        if (this.part.assistant) {
          this.assistantDocRef = this.fireStoreService.fireStore.doc<Part>(
            `${path}/publishers/${this.part.assistant.uid}/parts/${this.part.id}`
          );
          this.partDocRef.update({ assistant: null })
          .then(() => {
            this.assistantDocRef.delete()
          }) 
        }  
    }
      }
    })
  }

  copyEmail(part: Part) {
    this.clipboardService.copy(part.assignee.email);
    this.toastService.info("Email Copied")
  }

  emailPart(part: Part, user: User) {
    this.exportService.emailPartPDF(part, user)
    this.toastService.success('Email sent successfully')
  }
  confirm(part: Part) {
    if (part.assignee) {
      this.forage.getItem('congregationRef').then(path => {
        this.fireStoreService.fireStore.doc<Part>(`${path}/weeks/${part.week}/parts/${part.id}`).update({
          isConfirmed: true
        }).then(() => {
          this.fireStoreService.fireStore.doc<Part>(`${path}/publishers/${part.assignee.uid}/parts/${part.id}`).update({
            isConfirmed: true
          })
        })
      })
    }
  }

  unconfirm(part: Part) {
    if (part.assignee) {
      this.forage.getItem('congregationRef').then(path => {
        this.fireStoreService.fireStore.doc<Part>(`${path}/weeks/${part.week}/parts/${part.id}`).update({
          isConfirmed: false
        }).then(() => {
          this.fireStoreService.fireStore.doc<Part>(`${path}/publishers/${part.assignee.uid}/parts/${part.id}`).update({
            isConfirmed: false
          })
        })
      })
    }
  }

  openRenameModal(part: Part) {
    const modalRef = this.modalService.open(RenamePartComponent, {
      centered: true,
      backdrop: true,
      size: 'md'
    })
    modalRef.componentInstance.part = part;
  }

  openSelectPublisherModal(part: Part, type: string) {
    const modalRef = this.modalService.open(SelectPublisherComponent, {
      centered: false,
      keyboard: false,
      backdrop: true,
      size: 'xl',
      scrollable: true,
    });
    modalRef.componentInstance.part = part;
    modalRef.componentInstance.type = type;
    if (part.assignee || part.assistant) {
      modalRef.componentInstance.replacing =
      type == 'assignee' ? part.assignee : part.assistant;
    }
    modalRef.componentInstance.weekProgram = this.weekProgram;
  }
}
