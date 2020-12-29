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

   emailCheck: boolean;
   constructor(
      public fb: FormBuilder,
      public auth: AuthService,
      private router: Router,
   ) { }

   ngOnInit(): void {
      this.signUpForm = this.fb.group({
         firstName: ['', [Validators.minLength(3), Validators.required]],
         lastName: ['', [Validators.minLength(2), Validators.required]],
         email: ['', [Validators.email, Validators.required]],
         password: ['',
            [
              // Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
               Validators.minLength(6),
               Validators.maxLength(25)
            ],
         ]
      });
   }

   get email() {
      return this.signUpForm.get('email');
   }
   get password() {
      return this.signUpForm.get('password');
   }
   get firstName() {
      return this.signUpForm.get('firstName');
   }

   get lastName() {
      return this.signUpForm.get('lastName');
   }

   signUp() {
      if (this.signUpForm.valid) {
         this.auth.emailSignUp(this.email.value, this.password.value, this.firstName.value, this.lastName.value)
      } else {
        console.log(this.signUpForm.status)
      }
   }

}
