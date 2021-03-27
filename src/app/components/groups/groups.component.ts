import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'card-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {

  constructor() { }

  @Input('title') title: string;
  @Input('subtitle') subtitle: string;

  ngOnInit(): void {
  }

}
