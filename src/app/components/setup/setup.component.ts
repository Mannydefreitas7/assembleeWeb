import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'ab-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {
   congregationForm: FormGroup;
   hide = true;
   empty = true;
   congregationName:string;
   congregationNumber: string;

   constructor(
      public fb: FormBuilder,
      public auth: AuthService,
      private router: Router,
    ) {}

  ngOnInit(): void {
   this.congregationForm = this.fb.group({
      congregationName: ['', [Validators.required]],
      congregationNumber: ['',
    [
      Validators.minLength(6),
      Validators.maxLength(25)
    ],
  ]
  });
  }
  current = 0;


  pre(): void {
    this.current -= 1;

  }

  next(): void {
    this.current += 1;
  }

  done(): void {
    console.log('done');
  }


}
