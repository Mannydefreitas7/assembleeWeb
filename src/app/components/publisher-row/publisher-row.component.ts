import { Component, Input, OnInit } from '@angular/core';
import { Publisher } from 'src/app/models/publisher.model';

@Component({
  selector: 'publisher-row',
  templateUrl: './publisher-row.component.html',
  styleUrls: ['./publisher-row.component.scss']
})
export class PublisherRowComponent implements OnInit {

  constructor() { }

  @Input('publisher') publisher: Publisher;

  ngOnInit(): void {
  }

}
