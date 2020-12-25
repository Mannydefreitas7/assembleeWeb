import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { AngularFireModule } from "@angular/fire";
import { AngularFireDatabaseModule } from "@angular/fire/database";
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
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NGFORAGE_CONFIG_PROVIDER } from './ngforage.config';
import { ProgramDetailComponent } from './pages/programs/program-detail/program-detail.component';
import { SelectPublisherComponent } from './components/modals/select-publisher/select-publisher.component';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ClaimedCongregationComponent } from './components/modals/claimed-congregation/claimed-congregation.component';
import { FilterPipe } from './shared/helpers/filter.pipe';
import { WeekendPipe } from './shared/helpers/weekend.pipe';
import { TreasuresPipe } from './shared/helpers/treasures.pipe';
import { PrayersPipe } from './shared/helpers/prayers.pipe';
import { LifePipe } from './shared/helpers/life.pipe';
import { ChairmansPipe } from './shared/helpers/chairmans.pipe';
import { ApplyPipe } from './shared/helpers/apply.pipe';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
      HomeComponent,
      DashboardComponent,
      ProgramsComponent,
      ProgramDetailComponent,
      PublishersComponent,
      SpeakersComponent,
      ExportComponent,
      SidebarComponent,
      TopbarComponent,
      SetupComponent,
      CongregationComponent,
      AddSpeakerComponent,
      SelectPublisherComponent,
      ClaimedCongregationComponent,
      FilterPipe,
      WeekendPipe,
      TreasuresPipe,
      PrayersPipe,
      LifePipe,
      ChairmansPipe,
      ApplyPipe
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AssembleeModule,
    AuthModule,
    CommonModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    AngularFireDatabaseModule,
    AngularSvgIconModule.forRoot(),
  ],
  bootstrap: [AppComponent],
  providers: [
     NGFORAGE_CONFIG_PROVIDER,
     {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { 
         displayDefaultIndicatorType: false,
         showError: true
       }
    }
   ],
   schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
