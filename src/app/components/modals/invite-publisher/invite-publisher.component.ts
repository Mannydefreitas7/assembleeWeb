import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForage } from 'ngforage';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from 'src/app/auth/auth.service';
import { Congregation } from 'src/app/models/congregation.model';
import { Permission, Publisher } from 'src/app/models/publisher.model';
import { EmailMessage, User } from 'src/app/models/user.model';
import { EmailService } from 'src/app/services/email.service';
import { FireStoreService } from 'src/app/services/fire-store.service';

@Component({
  selector: 'app-invite-publisher',
  templateUrl: './invite-publisher.component.html',
  styleUrls: ['./invite-publisher.component.scss']
})
export class InvitePublisherComponent implements OnInit {

  constructor(
    private auth : AuthService,
    private fireStore: FireStoreService,
    private storage: LocalStorageService,
    public fb: FormBuilder,
    private forage: NgForage,
    private email: EmailService,
    public modal: NgbActiveModal
  ) { }

  @Input('publisher') publisher: Publisher;
  congregation: Congregation;
  inviteForm: FormGroup;
  fireUser: User;
  permissions: Permission[] = [Permission.view]

  ngOnInit(): void {
    this.congregation = this.storage.retrieve('congregation');

    this.inviteForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  get password() { return this.inviteForm.get('password') }



  invite() {

    // create user with email and pass

      this.forage.getItem<string>('congregationRef').then(path => {
        if (path) {
          let url: string = `https://assemblee.web.app/#/invite?cong=${path}&pub=${this.publisher.uid}`
          this.auth.afAuth.sendSignInLinkToEmail(this.publisher.email, {
            url: url,
            handleCodeInApp: true
          })
        }
      })

  }


}
