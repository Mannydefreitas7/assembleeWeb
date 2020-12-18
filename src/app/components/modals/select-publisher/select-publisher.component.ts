import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Gender, Privilege, Publisher } from 'src/app/models/publisher.model';
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
  constructor(
     public fb: FormBuilder,
      public fireStoreService: FireStoreService,
      public auth: AuthService
     ) { }
  publisherForm: FormGroup;
  isCollapsed: boolean = true;

   $publishers: Observable<Publisher[]>;

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
      ]]
   });
  
}

  get fname() { return this.publisherForm.get('fname')}
  get lname() { return this.publisherForm.get('fname')}
  get email() { return this.publisherForm.get('email')}
  get gender() { return this.publisherForm.get('gender')}

  addPublisher() {
     if (this.publisherForm.valid) {
        
      this.auth.afAuth.user.subscribe(user => {
         this.fireStoreService.read(`publishers/${user.uid}`)
         .subscribe((publisher: Publisher) => {
            let id = this.fireStoreService.fireStore.createId()
            let newPublisher: Publisher = {

               email: this.email.value,
               lastName: this.lname.value,
               firstName: this.fname.value,
               privilege: Privilege.pub,
               photoURL: null,
               uid: id,
               gender: this.gender.value
            }
            this.fireStoreService.create('publishers', id, newPublisher)
         })
      })
     }
  }
 
}
