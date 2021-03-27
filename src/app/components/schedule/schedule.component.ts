import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Parent, Part, WeekProgram } from 'src/app/models/wol.model';
import { ExportService } from 'src/app/services/export.service';
import { FireStoreService } from 'src/app/services/fire-store.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  constructor(
    public exportService: ExportService,
    public fireStore: FireStoreService,
    public route: ActivatedRoute,
  ) { }

  @Input('week') weekProgram: WeekProgram;


  ngOnInit(): void {
  
  }

  downloadPDF() {
        let congID = environment.cong;
        this.loadProgram(congID, this.weekProgram.id).then(parts => {
          let _week : WeekProgram = {
            ...this.weekProgram,
            parts: parts
          }
          this.exportService.downloadSinglePDF(_week)
        })
  }

  loadProgram(congID: String, weekID: string) : Promise<Part[]> {
    return this.fireStore.fireStore.collection<Part>(`congregations/${congID}/weeks/${weekID}/parts`)
    .get()
    .pipe(
      map(data => data.docs)
    )
    .toPromise()
   }

  get treasures() : Part[] { return this.weekProgram.parts.filter(part => part.parent == Parent.treasures).sort((a, b) => a.index - b.index) }
  get apply() : Part[] { return this.weekProgram.parts.filter(part => part.parent == Parent.apply).sort((a, b) => a.index - b.index) }
  get life() : Part[] { return this.weekProgram.parts.filter(part => part.parent == Parent.life).sort((a, b) => a.index - b.index) }
  get talk() : Part[] { return this.weekProgram.parts.filter(part => part.parent == Parent.talk).sort((a, b) => a.index - b.index) }

  get wt() : Part[] { return this.weekProgram.parts.filter(part => part.parent == Parent.wt).sort((a, b) => a.index - b.index) }

  get chairmans() : Part[] { return this.weekProgram.parts.filter(part => part.parent == Parent.chairman).sort((a, b) => a.index - b.index) }

  get prayers() : Part[] { return this.weekProgram.parts.filter(part => part.parent == Parent.prayer).sort((a, b) => a.index - b.index) }



}
