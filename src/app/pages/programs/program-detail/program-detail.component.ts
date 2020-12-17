import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { WeekProgram } from 'src/app/models/wol.model';

@Component({
  selector: 'ab-program-detail',
  templateUrl: './program-detail.component.html',
  styleUrls: ['./program-detail.component.scss']
})
export class ProgramDetailComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }
id: string

@Input('weekProgram') public weekProgram: WeekProgram;
  ngOnInit(): void {
   //   this.route.paramMap
   //      .subscribe(param => {
   //         this.id = param.get('id');
   //      });
  }

}
