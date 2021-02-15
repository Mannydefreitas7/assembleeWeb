import { Component, Input, OnInit } from '@angular/core';
import { Parent, Part, WeekProgram } from 'src/app/models/wol.model';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  constructor() { }

  @Input('week') weekProgram: WeekProgram;


  ngOnInit(): void {
  
  }

  get treasures() : Part[] { return this.weekProgram.parts.filter(part => part.parent == Parent.treasures).sort((a, b) => a.index - b.index) }
  get apply() : Part[] { return this.weekProgram.parts.filter(part => part.parent == Parent.apply).sort((a, b) => a.index - b.index) }
  get life() : Part[] { return this.weekProgram.parts.filter(part => part.parent == Parent.life).sort((a, b) => a.index - b.index) }
  get talk() : Part[] { return this.weekProgram.parts.filter(part => part.parent == Parent.talk).sort((a, b) => a.index - b.index) }

  get wt() : Part[] { return this.weekProgram.parts.filter(part => part.parent == Parent.wt).sort((a, b) => a.index - b.index) }

  get chairmans() : Part[] { return this.weekProgram.parts.filter(part => part.parent == Parent.chairman).sort((a, b) => a.index - b.index) }

  get prayers() : Part[] { return this.weekProgram.parts.filter(part => part.parent == Parent.prayer).sort((a, b) => a.index - b.index) }



}
