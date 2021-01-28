import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForage } from 'ngforage';
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
    public exportService: ExportService,
    public emailService: EmailService,
    public toastService : ToastrService
  ) {}
  @Input('part') part: Part;
  @Input('weekProgram') weekProgram: WeekProgram;
  congregation: string;
  assigneeDocRef: AngularFirestoreDocument<Publisher>;
  assistantDocRef: AngularFirestoreDocument<Publisher>;
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
      if (this.part)
      this.partDocRef = this.fireStoreService.fireStore.doc<Part>(
        `${path}/parts/${this.part.id}`
      );

    switch (type) {
      case 'assignee':
        if (this.part.assignee)
          this.partDocRef.update({ assignee: null })
      case 'assistant':
        if (this.part.assistant)
          this.partDocRef.update({ assistant: null })
    }
    })
  }

  emailPart(part: Part, user: User) {
    this.exportService.emailPartPDF(part, user)
    this.toastService.success('Email sent successfully')
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
