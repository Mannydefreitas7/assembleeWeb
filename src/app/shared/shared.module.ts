import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAccordionModule, NgbAlertModule, NgbCollapseModule, NgbModalModule, NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
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
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { NgxFileDropModule } from 'ngx-file-drop';
import { NgxSpinnerModule } from 'ngx-spinner';
@NgModule({
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
    MatProgressBarModule,
    NgbAccordionModule,
    NgbNavModule,
    NgbCollapseModule,
    NgxSkeletonLoaderModule.forRoot(),
    NgxWebstorageModule.forRoot(),
    NgxFileDropModule,
    NgxSpinnerModule
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
   NgbNavModule,
   MatStepperModule,
   MatProgressBarModule,
   MatInputModule,
   MatAutocompleteModule,
   MatSelectModule,
   MatProgressSpinnerModule,
   MatIconModule,
   NgbAccordionModule,
   NgxSkeletonLoaderModule,
   NgxFileDropModule,
   NgxSpinnerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule { }
