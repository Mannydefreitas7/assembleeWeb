import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'ab-toasts',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  host: {'[class.ngb-toasts]': 'true'}
})
export class ToastComponent implements OnInit {

  constructor(
    public toastService: MessageService
  ) { }

  ngOnInit(): void {
  }

}
