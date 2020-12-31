import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageService } from 'ngx-webstorage';
import { Gender, Privilege, Publisher } from 'src/app/models/publisher.model';
import { FireStoreService } from 'src/app/services/fire-store.service';

@Component({
  selector: 'app-add-publisher',
  templateUrl: './add-publisher.component.html',
  styleUrls: ['./add-publisher.component.scss']
})
export class AddPublisherComponent implements OnInit {
  pubForm: FormGroup;
  privileges: Privilege[] =  [Privilege.elder, Privilege.ms, Privilege.pub, Privilege.talkCo]
  genders: Gender[] = [Gender.brother, Gender.sister]
  constructor(
    public fb: FormBuilder,
    private fireStore: FireStoreService,
    private storage: LocalStorageService,
    public modal: NgbActiveModal,
  ) { }



  ngOnInit(): void {

    this.pubForm = this.fb.group({
      firstName: ['', [Validators.minLength(3), Validators.required]],
      lastName: ['', [Validators.minLength(3), Validators.required]],
      email: ['', [Validators.email, Validators.minLength(3), Validators.required]],
      privilege: [Privilege.pub, [Validators.minLength(2), Validators.required]],
      gender: [Gender.brother, [Validators.minLength(2), Validators.required]],
    })
  }

get fname() { return this.pubForm.get('firstName') }
get lname() { return this.pubForm.get('lastName') }
get email() { return this.pubForm.get('email') }
get privilege() { return this.pubForm.get('privilege') }
get gender() { return this.pubForm.get('gender') }

addPublisher() {
  let congregationRef = this.storage.retrieve('congregationref');
  if (this.pubForm.valid) {
    let id = this.fireStore.fireStore.createId();
    let newPublisher: Publisher = {
      email: this.email.value,
      lastName: this.lname.value,
      firstName: this.fname.value,
      privilege: this.privilege.value,
      photoURL: null,
      uid: id,
      gender: this.gender.value,
      isInvited: false,
      parts: [],
    };
    this.fireStore
      .create(`${congregationRef}/publishers`, id, newPublisher)
      .then(() => {
        this.modal.close()
      })
  }
}


}
