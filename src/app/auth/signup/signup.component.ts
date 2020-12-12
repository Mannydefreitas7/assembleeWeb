import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MustMatch } from 'src/app/shared/helpers/must-match.validator';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
   signUpForm: FormGroup;
   hide = true;
   empty = true;
   emailMessage = false;
   emailOne: string;
   emailTwo: string;

   emailCheck: boolean;
   constructor(
      public fb: FormBuilder,
      public auth: AuthService,
      private router: Router,
    ) {}

  ngOnInit(): void {
   this.signUpForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      emailTwo: ['', [Validators.required]],
    password: ['',
    [
      Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
      Validators.minLength(6),
      Validators.maxLength(25)
    ],
  ], displayName: ['', Validators.required]
  }, { updateOn: 'blur', validators: MustMatch('email', 'emailTwo')});
  }

  get email() {
   return this.signUpForm.get('email');
 }
 get password() {
  return this.signUpForm.get('password');
 }
 get name() {
   return this.signUpForm.get('displayName');
  }
  signUp() {

   if (this.signUpForm.get('email').value) {
     this.emailCheck = true;
     return this.auth.emailSignUp(this.email.value, this.password.value, this.name.value)
     .then(user => {
       if (this.signUpForm.valid) {
         this.router.navigate(['/home']);
       }
     }).catch(err => {
      // this.pub.snackBar.open(err.message, '', { duration: 3000 })
     })
   } else {
     this.emailCheck = false;
     this.signUpForm.get('email').status == 'INVALID'
     
   }
  
 }

}
