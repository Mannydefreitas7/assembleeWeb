import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MustMatch } from 'src/app/shared/helpers/must-match.validator';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

   signInForm: FormGroup;
   hide = true;
   empty = true;
   emailMessage = false;
   emailOne: string;
   constructor(
      public fb: FormBuilder,
      public auth: AuthService,
      private router: Router,
    ) {}

  ngOnInit(): void {
   this.signInForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
    password: ['',
    [
      Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
      Validators.minLength(6),
      Validators.maxLength(25)
    ],
  ]
  });
  }

  get email() {
   return this.signInForm.get('email');
 }
 get password() {
  return this.signInForm.get('password');
 }

 signIn() {
    this.auth.emailSignIn(this.email.value, this.password.value).then((value) => {
       this.router.navigateByUrl('/home/dashboard')
    })
 }
}
