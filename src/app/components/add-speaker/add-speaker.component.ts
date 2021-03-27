import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForage } from 'ngforage';
import { LocalStorageService } from 'ngx-webstorage';
import { take } from 'rxjs/operators';
import { Congregation } from 'src/app/models/congregation.model';
import { Gender, Privilege, Publisher, Speaker } from 'src/app/models/publisher.model';
import { FireStoreService } from 'src/app/services/fire-store.service';

@Component({
  selector: 'add-speaker',
  templateUrl: './add-speaker.component.html',
  styleUrls: ['./add-speaker.component.scss']
})
export class AddSpeakerComponent implements OnInit {

  pubForm: FormGroup;
  privileges: Privilege[] =  [Privilege.elder, Privilege.ms]
  constructor(
    public fb: FormBuilder,
    private fireStore: FireStoreService,
    private forage: NgForage,
    public modal: NgbActiveModal,
  ) { }



  ngOnInit(): void {

    this.pubForm = this.fb.group({
      firstName: ['', [Validators.minLength(3), Validators.required]],
      lastName: ['', [Validators.minLength(3), Validators.required]],
      email: ['', [Validators.email, Validators.minLength(3), Validators.required]],
      privilege: [Privilege.elder, [Validators.minLength(2), Validators.required]],
      congregation: ['']
    })
    this.forage.getItem('congregationRef').then(path => {
      this.fireStore.fireStore.doc<Congregation>(`${path}`)
      .valueChanges()
      .subscribe(cong => {
        this.congregation.setValue(cong.properties.orgName)
      })
    })

  }

get fname() { return this.pubForm.get('firstName') }
get lname() { return this.pubForm.get('lastName') }
get email() { return this.pubForm.get('email') }
get privilege() { return this.pubForm.get('privilege') }
get congregation() { return this.pubForm.get('congregation') }

addSpeaker() {

  this.forage.getItem('congregationRef').then(path => {
    if (this.pubForm.valid) {
      let id = this.fireStore.fireStore.createId();
      let newSpeaker: Speaker = {
        email: this.email.value,
        lastName: this.lname.value,
        firstName: this.fname.value,
        privilege: this.privilege.value,
        photoURL: null,
        id: id,
        isOutGoing: false,
        congregation: {
          properties: {
            orgName: this.congregation.value
          }
        },
        talks: [],
      };
      this.fireStore
        .create(`${path}/speakers`, id, newSpeaker)
        .then(() => {
          this.modal.close()
        })
    }
  })

}
}
