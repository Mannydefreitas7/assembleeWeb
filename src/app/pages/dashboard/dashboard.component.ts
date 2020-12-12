import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

   opened: boolean = true;
   constructor() { }
   
   toggleSidebar() {
    this.opened = !this.opened;
  }
   ngOnInit(): void {
   }

}
