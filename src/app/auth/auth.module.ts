import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailComponent } from './email/email.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ResetComponent } from './reset/reset.component';
import { SharedModule } from '../shared/shared.module';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

const routes: Routes = [

   { path: '', redirectTo: '/home', pathMatch: 'full' },
   { path: 'signup', component: SignupComponent },
   { path: 'reset', component: ResetComponent },
   { path: 'login', component: LoginComponent }
 ];


@NgModule({
  declarations: [
     EmailComponent, 
     LoginComponent, 
     SignupComponent, 
     ResetComponent
   ],
  imports: [
     AngularFireAuthModule,
     AngularFirestoreModule,
     RouterModule.forRoot(routes), 
     SharedModule
   ],
   providers: [
      AuthService
   ]
})
export class AuthModule { }
