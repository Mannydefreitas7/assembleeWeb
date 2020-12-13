import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'ab-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  constructor(
     public auth: AuthService,
     public activeRoute: ActivatedRoute,
     public router: Router,
     public storeService: StoreService
     ) { }

  ngOnInit(): void {
     this.activeRoute.url.subscribe((data) => {
      console.log(this.router.isActive('home/publishers', true)) 
     })
    
  }

}
