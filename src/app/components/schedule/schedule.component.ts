import { Component, Input, OnInit } from '@angular/core';
import { Parent, Part, WeekProgram } from 'src/app/models/wol.model';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  constructor() { }

@Input('parts') parts: Part[];
@Input('week') weekProgram: WeekProgram;
  treasures: Part[];
  apply: Part[];
  life: Part[];
  talk: Part[];
  wt: Part[];
  chairmans: Part[];
  prayers: Part[];

  ngOnInit(): void {
   
    if (this.parts && this.parts.length > 0) {
      console.log(this.parts)
      this.treasures = this.parts.filter(part => part.parent == Parent.treasures).sort((a, b) => a.index - b.index)
      this.apply = this.parts.filter(part => part.parent == Parent.apply).sort((a, b) => a.index - b.index)
      this.life = this.parts.filter(part => part.parent == Parent.life).sort((a, b) => a.index - b.index)
      this.talk = this.parts.filter(part => part.parent == Parent.talk).sort((a, b) => a.index - b.index)
      this.wt = this.parts.filter(part => part.parent == Parent.wt).sort((a, b) => a.index - b.index)
      this.chairmans = this.parts.filter(part => part.parent == Parent.chairman).sort((a, b) => a.index - b.index)
      this.prayers = this.parts.filter(part => part.parent == Parent.prayer).sort((a, b) => a.index - b.index)
    }
  }

}
