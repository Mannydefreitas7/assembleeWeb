import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { environment } from 'src/environments/environment';
import { NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AssembleeModule } from './assemblee/assemblee.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { ProgramsComponent } from './pages/programs/programs.component';
import { PublishersComponent } from './pages/publishers/publishers.component';
import { SpeakersComponent } from './pages/speakers/speakers.component';
import { ExportComponent } from './pages/export/export.component';
import { AuthModule } from './auth/auth.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SidebarModule } from 'ng-sidebar';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import en from '@angular/common/locales/en';
import { TopbarComponent } from './components/topbar/topbar.component';
import { SetupComponent } from './components/setup/setup.component';
import { CongregationComponent } from './components/congregation/congregation.component';
import { AddSpeakerComponent } from './components/add-speaker/add-speaker.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
      HomeComponent,
      DashboardComponent,
      ProgramsComponent,
      PublishersComponent,
      SpeakersComponent,
      ExportComponent,
      SidebarComponent,
      TopbarComponent,
      SetupComponent,
      CongregationComponent,
      AddSpeakerComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AssembleeModule,
    AuthModule,
    CommonModule,
    SidebarModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FontAwesomeModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
