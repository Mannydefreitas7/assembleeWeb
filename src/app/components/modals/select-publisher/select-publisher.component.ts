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

  }


}
