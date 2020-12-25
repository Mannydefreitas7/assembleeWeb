import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAccordionModule, NgbAlertModule, NgbCollapseModule, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SortByPipe } from './helpers/sort-by.pipe';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { TreasuresPipe } from './helpers/treasures.pipe';
import { ApplyPipe } from './helpers/apply.pipe';
import { LifePipe } from './helpers/life.pipe';
import { WeekendPipe } from './helpers/weekend.pipe';
import { ChairmansPipe } from './helpers/chairmans.pipe';
import { PrayersPipe } from './helpers/prayers.pipe';
@NgModule({
  declarations: [SortByPipe],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    NgbAlertModule,
    NgbModalModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatInputModule,
    MatStepperModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatIconModule,
    FontAwesomeModule,
    NgbAccordionModule,
    NgbCollapseModule,
    NgxSpinnerModule,
    NgxSkeletonLoaderModule.forRoot(),
    NgxWebstorageModule.forRoot()
  ],
  exports: [
   FormsModule,
   CommonModule,
   BrowserModule,
   NgbAlertModule,
   MatSidenavModule,
   ReactiveFormsModule,
   MatToolbarModule,
   NgbModalModule,
   MatListModule,
   MatStepperModule,
   MatInputModule,
   MatAutocompleteModule,
   MatSelectModule,
   MatProgressSpinnerModule,
   MatIconModule,
   FontAwesomeModule,
   NgbAccordionModule,
   NgxSpinnerModule,
   NgxSkeletonLoaderModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule { }
