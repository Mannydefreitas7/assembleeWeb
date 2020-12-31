import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { NgForage } from 'ngforage';
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
    public forage: NgForage,
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

    // this.forage.getItem<string>('congregationRef').then(path => {
    //   this.$publishers = this.fireStoreService.fireStore.collection<Publisher>(`${path}/publishers`).valueChanges().pipe(
    //     map((data) => {
    //       return data.filter(
    //         (pubs) =>
    //           this.part.privilege.includes(pubs.privilege) &&
    //           this.part.gender.includes(pubs.gender)
    //       );
    //     })
    //   );
    // })
  }


  // selectPublisher(publisher: Publisher) {
  //   let replacingRef: AngularFirestoreDocument;
  //   this.forage.getItem<string>('congregationRef').then(path => {
  //     let documentRef = this.fireStoreService.fireStore.doc<Part>(
  //       `${path}/weeks/${this.weekProgram.id}/parts/${this.part.id}`
  //     );
  //     let publisherRef = this.fireStoreService.fireStore.doc<Publisher>(
  //       `${path}/publishers/${publisher.uid}`
  //     );

  //     if (this.replacing) {
  //       replacingRef = this.fireStoreService.fireStore.doc<Publisher>(
  //       `${path}/publishers/${this.replacing.uid}`);
  //     }
  //     if (this.type == 'assignee') {
  //       // this.part.assignee = publisher
  //        documentRef.update({
  //          assignee: publisher,
  //        });
  //      } else {
  //      //  this.part.assistant = publisher
  //        documentRef.update({
  //          assistant: publisher,
  //        });
  //      }
  //     this.part.path = documentRef.ref.path;
  //     publisherRef
  //     .get()
  //     .toPromise()
  //     .then((data) => {
  //       if (data.exists && data.data().parts) {
  //         let newParts = data.data().parts;

  //         newParts.push(this.part);
  //         publisherRef.update({
  //           parts: newParts,
  //         });
  //       } else {
  //         publisherRef.set(
  //           {
  //             parts: [this.part],
  //           },
  //           { merge: true }
  //         );
  //       }
  //       this.modal.close();
  //     }).then(() => {
  //       if (this.replacing)
  //       replacingRef.get().toPromise().then(document => {
  //         if (document.exists) {
  //           let parts = document.data().parts.filter(p => p.path.split('/')[5] !== this.part.id)
  //           replacingRef.update({parts: parts})
  //         }
  //       })
  //     })
  //   })

  // }
}
