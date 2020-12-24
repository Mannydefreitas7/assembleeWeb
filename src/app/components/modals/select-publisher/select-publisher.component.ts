import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
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
   styleUrls: ['./select-publisher.component.scss']
})
export class SelectPublisherComponent implements OnInit {
   publisher: Publisher
   searchText: string = "";
   genders: Gender[] = [Gender.brother, Gender.sister]
   privileges: Privilege[] = [Privilege.elder, Privilege.ms, Privilege.pub]
   constructor(
      public fb: FormBuilder,
      public fireStoreService: FireStoreService,
      public auth: AuthService,
      public modal: NgbActiveModal
   ) { }
   publisherForm: FormGroup;
   isCollapsed: boolean = true;

   $publishers: Observable<Publisher[]>;

   @Input('part') part: Part;
   @Input('id') weekProgram: WeekProgram;

   ngOnInit(): void {

      this.publisherForm = this.fb.group({
         fname: ['', [
            Validators.required,
            Validators.minLength(2)
         ]],
         lname: ['', [
            Validators.required,
            Validators.minLength(2)
         ]],
         email: ['', [
            Validators.required,
            Validators.email,
            Validators.minLength(2)
         ]],
         gender: [Gender.brother, [
            Validators.required,
            Validators.minLength(2)
         ]],
         privilege: [Privilege.pub, [
            Validators.minLength(2)
         ]]
      });

      this.$publishers = this.fireStoreService.getCongregationPublishers().pipe(
         map(data => {
            return data.filter(pubs => this.part.privilege.includes(pubs.privilege) && this.part.gender.includes(pubs.gender))
         })
      )

   }

   get fname() { return this.publisherForm.get('fname') }
   get lname() { return this.publisherForm.get('lname') }
   get email() { return this.publisherForm.get('email') }
   get gender() { return this.publisherForm.get('gender') }
   get privilege() { return this.publisherForm.get('privilege') }


   selectPublisher(publisher: Publisher) {
      this.auth.afAuth.user.subscribe(user => {
         this.fireStoreService.read(`users/${user.uid}`)
            .subscribe((fireUser: User) => {

               let congregationRef = fireUser.congregation.path
               this.part.assignee = publisher
               this.isCollapsed = true
               this.fireStoreService.fireStore.firestore.doc(`${congregationRef}/weeks/${this.weekProgram.id}`).set(this.weekProgram)
                  .then(() => {
                     this.modal.close()
                  })
            })
      })
   }

   addPublisher() {
      if (this.publisherForm.valid) {
         this.auth.afAuth.user.subscribe(user => {
            this.fireStoreService.read(`users/${user.uid}`)
               .subscribe((fireUser: User) => {

                  let id = this.fireStoreService.fireStore.createId()
                  let congregationRef = fireUser.congregation.path
                  let newPublisher: Publisher = {

                     email: this.email.value,
                     lastName: this.lname.value,
                     firstName: this.fname.value,
                     privilege: this.privilege.value,
                     photoURL: null,
                     uid: id,
                     gender: this.gender.value,
                     isInvited: false
                  }
                  this.part.assignee = newPublisher
                  this.fireStoreService.create(`${congregationRef}/publishers`, id, newPublisher).then(() => {
                     this.isCollapsed = true
                     console.log(this.weekProgram)
                     this.fireStoreService.fireStore.firestore.doc(`${congregationRef}/weeks/${this.weekProgram.id}`).set(this.weekProgram)
                        .then(() => {
                           this.modal.close()
                        })
                  })
               })
         })
      }
   }



}
