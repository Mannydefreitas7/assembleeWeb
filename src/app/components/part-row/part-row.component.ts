import { Component, Input, OnInit } from '@angular/core';
import { NgForage } from 'ngforage';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user.model';
import { Parent, Part } from 'src/app/models/wol.model';
import { EmailService } from 'src/app/services/email.service';
import { ExportService } from 'src/app/services/export.service';
import { FireStoreService } from 'src/app/services/fire-store.service';

@Component({
  selector: 'part-row',
  templateUrl: './part-row.component.html',
  styleUrls: ['./part-row.component.scss']
})
export class PartRowComponent implements OnInit {
  parentApply = Parent.apply;
  parentTalk = Parent.talk;
  parentTreasures = Parent.treasures;
  parentWt = Parent.wt;
  parentlife = Parent.life;
  constructor(
    public fireStore: FireStoreService,
    public forage: NgForage,
    public clipboardService: ClipboardService,
    public exportService: ExportService,
    public emailService: EmailService,
    public toastService : ToastrService
  ) { }

  @Input('part') part: Part;
  user: User;
  ngOnInit(): void {
    this.forage.getItem<User>("fireUser").then(fireUser => this.user = fireUser)
  }

  emailPart(part: Part, user: User) {
    this.exportService.emailPartPDF(part, user)
    this.toastService.success('Email sent successfully')
  }

  copyEmail(part: Part) {
    this.clipboardService.copy(part.assignee.email);
    this.toastService.info("Email Copied")
  }

  confirm() {
    this.forage.getItem('congregationRef').then(path => {
      this.fireStore.fireStore.doc<Part>(`${path}/weeks/${this.part.week}/parts/${this.part.id}`).update({
        isConfirmed: true
      }).then(() => {
        this.fireStore.fireStore.doc<Part>(`${path}/publishers/${this.part.assignee.uid}/parts/${this.part.id}`).update({
          isConfirmed: true
        })
      })
    })
  }
  unconfirm() {

    this.forage.getItem('congregationRef').then(path => {
      this.fireStore.fireStore.doc<Part>(`${path}/weeks/${this.part.week}/parts/${this.part.id}`).update({
        isConfirmed: false
      }).then(() => {
     
        this.fireStore.fireStore.doc<Part>(`${path}/publishers/${this.part.assignee.uid}/parts/${this.part.id}`).update({
          isConfirmed: false
        })
      })
    })
  }
 
}
