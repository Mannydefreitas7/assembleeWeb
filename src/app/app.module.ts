import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { AngularFireModule } from "@angular/fire";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFirestoreModule, SETTINGS } from "@angular/fire/firestore";
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
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NGFORAGE_CONFIG_PROVIDER } from './ngforage.config';
import { ProgramDetailComponent } from './pages/programs/program-detail/program-detail.component';
import { AngularFireFunctionsModule, NEW_ORIGIN_BEHAVIOR, ORIGIN, USE_EMULATOR } from '@angular/fire/functions';
import { SelectPublisherComponent } from './components/modals/select-publisher/select-publisher.component';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ClaimedCongregationComponent } from './components/modals/claimed-congregation/claimed-congregation.component';
import { FilterPipe } from './shared/helpers/filter.pipe';
import { SortByPipe } from './shared/helpers/sort-by.pipe';
import { PartActionsComponent } from './components/part-actions/part-actions.component';
import { ImportPubsComponent } from './components/import-pubs/import-pubs.component';
import { PublisherRowComponent } from './components/publisher-row/publisher-row.component';
import { PublisherDetailComponent } from './pages/publishers/publisher-detail.component';
import { AngularFireAuthModule, USE_EMULATOR as AUTH_EMULATOR } from '@angular/fire/auth';

import { PublisherComponent } from './components/skeletons/publisher/publisher.component';
import { AddPublisherComponent } from './components/modals/add-publisher/add-publisher.component';
import { InvitePublisherComponent } from './components/modals/invite-publisher/invite-publisher.component';
import { PartRowComponent } from './components/part-row/part-row.component';
import { PublisherPartsComponent } from './components/publishers/publisher-parts.component';
import { PublisherModalComponent } from './components/publishers/publishers.component';
import { AlertDeleteComponent } from './components/modals/alert-delete/alert-delete.component';
import { ImportComponent } from './components/modals/import/import.component';
import { LoginComponent } from './auth/login/login.component';
import { RenamePartComponent } from './components/modals/rename-part/rename-part.component';
import { ConfirmComponent } from './pages/confirm/confirm.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
      HomeComponent,
      DashboardComponent,
      ProgramsComponent,
      ProgramDetailComponent,
      PublishersComponent,
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
      SortByPipe,
      PartActionsComponent,
      ImportPubsComponent,
      PublisherRowComponent,
      PublisherModalComponent,
      PublisherDetailComponent,
      PublisherComponent,
      AddPublisherComponent,
      InvitePublisherComponent,
      PartRowComponent,
      PublisherPartsComponent,
      AlertDeleteComponent,
      ImportComponent,
      RenamePartComponent,
      ConfirmComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AssembleeModule,
    AuthModule,
    CommonModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule.enablePersistence(),
    AngularFireFunctionsModule,
    AngularFireAuthModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AngularFireDatabaseModule
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
    },
    // { provide: NEW_ORIGIN_BEHAVIOR, useValue: true },
    // { provide: ORIGIN, useValue: 'https://assemblee.web.app/' },
    // { provide: USE_EMULATOR, useValue: ['localhost', 4200] }

      // {
      //   provide: AUTH_EMULATOR,
      //   useValue: environment.production ? undefined : ['localhost', 9099],
      // },
      // {
      //   provide: FIRESTORE_EMULATOR,
      //   useValue: environment.production ? undefined : ['localhost', 8080],
      // },
      // {
      //   provide: FUNCTIONS_EMULATOR,
      //   useValue: environment.production ? undefined : ['localhost', 5001],
      // }

   ],
   schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
