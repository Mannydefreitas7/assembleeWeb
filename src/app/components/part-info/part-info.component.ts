import { Component, Input, OnInit } from '@angular/core';
import { Part } from 'src/app/models/wol.model';

@Component({
  selector: 'part-info',
  templateUrl: './part-info.component.html',
  styleUrls: ['./part-info.component.scss']
})
export class PartInfoComponent implements OnInit {

  constructor() { }

  @Input('part') part: Part;

  ngOnInit(): void {
  }

}
