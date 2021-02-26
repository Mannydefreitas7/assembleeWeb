import { Component, Input, OnInit } from '@angular/core';
import { Publisher, Speaker } from 'src/app/models/publisher.model';

@Component({
  selector: 'speaker-row',
  templateUrl: './speaker-row.component.html',
  styleUrls: ['./speaker-row.component.scss']
})
export class SpeakerRowComponent implements OnInit {

  constructor() { }

  @Input('speaker') speaker: Speaker;

  ngOnInit(): void {
  }

}
