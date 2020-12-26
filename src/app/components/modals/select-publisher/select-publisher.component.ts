import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Congregation } from 'src/app/models/congregation.model';
import { Gender, Privilege, Publisher } from 'src/app/models/publisher.model';
import { User } from 'src/app/models/user.model';
import { Part, WeekProgram } from 'src/app/models/wol.model';
import { FireStoreService } from 'src/app/services/fire-store.service';

@Component({
  selector: 'select-publisher',
  templateUrl: './select-publisher.component.html',
  styleUrls: ['./select-publisher.component.scss'],
})
export class SelectPublisherComponent implements OnInit {
  publisher: Publisher;
  searchText: string = '';
  genders: Gender[] = [Gender.brother, Gender.sister];
  privileges: Privilege[] = [Privilege.elder, Privilege.ms, Privilege.pub];
  constructor(
    public fb: FormBuilder,
    public fireStoreService: FireStoreService,
    public storage: LocalStorageService,
    public auth: AuthService,
    public modal: NgbActiveModal
  ) {}
  publisherForm: FormGroup;
  isCollapsed: boolean = true;
  congregationRef: string;
  $publishers: Observable<Publisher[]>;

  @Input('part') part: Part;
  @Input('id') weekProgram: WeekProgram;
  @Input('type') type: string;
  @Input('relacing') replacing: Publisher;

  ngOnInit(): void {
    this.congregationRef = this.storage.retrieve('congregationref');
    this.publisherForm = this.fb.group({
      fname: ['', [Validators.required, Validators.minLength(2)]],
      lname: ['', [Validators.required, Validators.minLength(2)]],
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(2)],
      ],
      gender: [Gender.brother, [Validators.required, Validators.minLength(2)]],
      privilege: [Privilege.pub, [Validators.minLength(2)]],
    });

    this.$publishers = this.fireStoreService.getCongregationPublishers().pipe(
      map((data) => {
        return data.filter(
          (pubs) =>
            this.part.privilege.includes(pubs.privilege) &&
            this.part.gender.includes(pubs.gender)
        );
      })
    );
  }

  get fname() {
    return this.publisherForm.get('fname');
  }
  get lname() {
    return this.publisherForm.get('lname');
  }
  get email() {
    return this.publisherForm.get('email');
  }
  get gender() {
    return this.publisherForm.get('gender');
  }
  get privilege() {
    return this.publisherForm.get('privilege');
  }

  selectPublisher(publisher: Publisher) {
    let replacingRef: AngularFirestoreDocument;
    let documentRef = this.fireStoreService.fireStore.doc<Part>(
      `${this.congregationRef}/weeks/${this.weekProgram.id}/parts/${this.part.id}`
    );
    let publisherRef = this.fireStoreService.fireStore.doc<Publisher>(
      `${this.congregationRef}/publishers/${publisher.uid}`
    );
    if (this.replacing) replacingRef = this.fireStoreService.fireStore.doc<Publisher>(
      `${this.congregationRef}/publishers/${this.replacing.uid}`
    );

    if (this.type == 'assignee') {
      documentRef.update({
        assignee: publisher,
      });
    } else {
      documentRef.update({
        assistant: publisher,
      });
    }

    this.isCollapsed = true;
    publisherRef
      .get()
      .toPromise()
      .then((data) => {
        if (data.exists && data.data().parts) {
          let newParts = data.data().parts;
          newParts.push(documentRef.ref.path);
          publisherRef.update({
            parts: newParts,
          });
        } else {
          publisherRef.set(
            {
              parts: [documentRef.ref.path],
            },
            { merge: true }
          );
        }
        this.modal.close();
      }).then(() => {
        if (this.replacing)
        replacingRef.get().toPromise().then(document => {
          if (document.exists) {
            let parts = document.data().parts.filter(p => p.split('/')[5] !== this.part.id)
            replacingRef.update({parts: parts})
          }
        })
      })
  }

  addPublisher() {
    let congregationRef = this.storage.retrieve('congregationref');
    if (this.publisherForm.valid) {
      let documentRef = this.fireStoreService.fireStore.doc<Part>(
        `${congregationRef}/weeks/${this.weekProgram.id}/parts/${this.part.id}`
      );

      let id = this.fireStoreService.fireStore.createId();
      let newPublisher: Publisher = {
        email: this.email.value,
        lastName: this.lname.value,
        firstName: this.fname.value,
        privilege: this.privilege.value,
        photoURL: null,
        uid: id,
        gender: this.gender.value,
        isInvited: false,
        parts: [documentRef.ref.path],
      };
      this.part.assignee = newPublisher;
      this.fireStoreService
        .create(`${congregationRef}/publishers`, id, newPublisher)
        .then(() => {
          this.isCollapsed = true;
          documentRef
            .set(
              {
                assignee: newPublisher,
              },
              { merge: true }
            )
            .then(() => {
              this.modal.close();
            });
        });
    }
  }
}
