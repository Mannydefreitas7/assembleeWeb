import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForage } from 'ngforage';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from 'src/app/auth/auth.service';
import { Congregation } from 'src/app/models/congregation.model';
import { Permission, Publisher } from 'src/app/models/publisher.model';
import { User } from 'src/app/models/user.model';
import { Part } from 'src/app/models/wol.model';
import { EmailService } from 'src/app/services/email.service';
import { FireStoreService } from 'src/app/services/fire-store.service';

@Component({
  selector: 'app-rename-part',
  templateUrl: './rename-part.component.html',
  styleUrls: ['./rename-part.component.scss']
})
export class RenamePartComponent implements OnInit {


  constructor(
    private auth : AuthService,
    public fireStore: FireStoreService,
    public fb: FormBuilder,
    private forage: NgForage,
    public modal: NgbActiveModal
  ) { }

  @Input('part') part: Part;
  congregation: string;
  inviteForm: FormGroup;
  fireUser: User;
  title: string;

  ngOnInit(): void {
   this.title = this.part.title;
  }



  rename() {
    this.forage.getItem<string>('congregationRef').then(congregation => {
      this.fireStore.rename(congregation, this.part, this.title)
    }).then(() => this.modal.close())
  }

}
