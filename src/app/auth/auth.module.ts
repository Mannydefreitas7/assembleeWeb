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
import { CongregationComponent } from '../components/congregation/congregation.component';
import { InviteComponent } from './invite/invite.component';
import { ConfirmComponent } from '../pages/confirm/confirm.component';
import { ToastComponent } from '../components/toast/toast.component';
import { BoardComponent } from '../pages/board/board.component';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [

   { path: '', redirectTo: 'login', pathMatch: 'full' },
   { path: 'signup', component: SignupComponent },
   { path: 'reset', component: ResetComponent },
   { path: 'login', component: LoginComponent },
   { path: 'invite', component: InviteComponent },
   { path: 'confirm', component: ConfirmComponent },
   { path: 'board/cong/:id', component: BoardComponent }
 ];


@NgModule({
  declarations: [
     EmailComponent,
     LoginComponent,
     SignupComponent,
     ResetComponent,
     InviteComponent
   ],
  imports: [
     AngularFireAuthModule,
     SharedModule,
     AngularFirestoreModule,
     RouterModule.forRoot(routes),
     SharedModule
   ],
   providers: [
      AuthService
   ]
})
export class AuthModule { }
