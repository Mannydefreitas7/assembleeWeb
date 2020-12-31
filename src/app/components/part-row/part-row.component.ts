import { Component, Input, OnInit } from '@angular/core';
import { Part } from 'src/app/models/wol.model';

@Component({
  selector: 'part-row',
  templateUrl: './part-row.component.html',
  styleUrls: ['./part-row.component.scss']
})
export class PartRowComponent implements OnInit {

  constructor() { }

  @Input('part') part: Part;

  ngOnInit(): void {
  }

}
