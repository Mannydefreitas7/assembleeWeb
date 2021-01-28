import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { EmailMessage } from 'src/app/models/user.model';
import { Part } from 'src/app/models/wol.model';
import { EmailService } from 'src/app/services/email.service';
import { FireStoreService } from 'src/app/services/fire-store.service';
import moment from 'moment';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  constructor(
    public fireStore: FireStoreService,
    public route: ActivatedRoute,
    public emailService: EmailService
  ) { }

  part$: Observable<Part>;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params && params.part && params.cong) {
       this.part$ = this.fireStore.fireStore.doc<Part>(`congregations/${params.cong}/parts/${params.part}`).valueChanges();
      }
    })
  }

confirm() {
  this.route.queryParams.subscribe(params => {
    if (params && params.part && params.cong) {
     this.fireStore.fireStore.doc<Part>(`congregations/${params.cong}/parts/${params.part}`).update({
       isConfirmed: true
     }).then(() => {

      this.fireStore.fireStore.doc<Part>(`congregations/${params.cong}/parts/${params.part}`).get().subscribe(data => {
        if (data.exists) {
          let _part: Part = data.data();
          let msg: EmailMessage = {
            from: `West Hudson French <assemblee.app@gmail.com>`,
            subject: `${_part.assignee.firstName.slice(0,1)}. ${_part.assignee.lastName}'s part confirmed`,
            to: `manny.defreitas7@gmail.com`,
            html: `
              <p>Hello,</p>
              <p><strong>${_part.assignee.firstName} ${_part.assignee.lastName}</strong> confirmed his part for ${moment(_part.date.toDate()).format('MMMM DD yyyy')}.</p>
              <p>Sincerely, <br>
              West Hudson French<p>
            `
          }
          this.emailService.sendEmail(msg)
        }
      })

       

      
     })
    }
  })
}

}
