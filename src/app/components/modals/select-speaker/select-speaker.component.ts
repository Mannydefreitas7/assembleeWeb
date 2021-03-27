import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, } from '@ng-bootstrap/ng-bootstrap';
import { NgForage } from 'ngforage';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Gender, Privilege, Publisher, Speaker } from 'src/app/models/publisher.model';
import { Part, WeekProgram } from 'src/app/models/wol.model';
import { FireStoreService } from 'src/app/services/fire-store.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'select-speaker',
  templateUrl: './select-speaker.component.html',
  styleUrls: ['./select-speaker.component.scss'],
})
export class SelectSpeakerComponent implements OnInit {
  speaker: Speaker;
  searchText: string = '';
  privileges: Privilege[] = [Privilege.elder, Privilege.ms];
  constructor(
    public fb: FormBuilder,
    public fireStoreService: FireStoreService,
    public storage: LocalStorageService,
    public forage: NgForage,
    public store: StoreService,
    public auth: AuthService,
    public modal: NgbActiveModal
  ) {}
  publisherForm: FormGroup;
  isCollapsed: boolean = true;
  congregationRef: string;
  $speakers: Observable<Speaker[]>;

  @Input('part') part: Part;
  @Input('priere') priere: Part;
  @Input('id') weekProgram: WeekProgram;
  @Input('type') type: string;
  @Input('relacing') replacing: Speaker;

  ngOnInit(): void {
    this.forage.getItem<string>('congregationRef').then(path => {
      this.$speakers = this.fireStoreService.fireStore
      .collection<Publisher>(`${path}/speakers`)
      .valueChanges()
      .pipe(
        map(data => data.sort((a, b) => a.lastName.localeCompare(b.lastName))),
        );
    })
  }

  saveSpeaker(speaker: Speaker) {
    let publisher: Publisher = {
      uid: speaker.id,
      speaker: speaker,
      firstName: speaker.firstName,
      lastName: speaker.lastName,
      email: speaker.email,
      gender: Gender.brother,
      privilege: speaker.privilege
    }
    this.forage.getItem<string>('congregationRef').then(path => {
      this.fireStoreService.fireStore.doc<Part>(`${path}/weeks/${this.part.week}/parts/${this.priere.id}`).update({
        assignee: publisher
      })
      if (this.type == 'assignee') {
        this.fireStoreService.fireStore.doc<Part>(`${path}/weeks/${this.part.week}/parts/${this.part.id}`).update({
          assignee: publisher
        }).then(() => this.modal.close())
      } else if (this.type == 'assistant') {
        this.fireStoreService.fireStore.doc<Part>(`${path}/weeks/${this.part.week}/parts/${this.part.id}`).update({
          assistant: publisher
        }).then(() => this.modal.close())
      }
    })
  }


}
