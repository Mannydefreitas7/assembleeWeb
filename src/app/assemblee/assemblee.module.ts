import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { ProgramsComponent } from '../pages/programs/programs.component';
import { PublishersComponent } from '../pages/publishers/publishers.component';
import { SpeakersComponent } from '../pages/speakers/speakers.component';
import { ExportComponent } from '../pages/export/export.component';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { AuthModule } from '../auth/auth.module';
import { SharedModule } from '../shared/shared.module';
import { AuthGuard } from '../auth/auth.guard';
import { ProgramDetailComponent } from '../pages/programs/program-detail/program-detail.component';
import { CongregationComponent } from '../components/congregation/congregation.component';


const routes: Routes = [
   { path: 'home', component: DashboardComponent, canActivate: [AuthGuard],
   children: [
      { path: 'dashboard', component: HomeComponent },
      { path: 'programs', component: ProgramsComponent,
      // children: [
      //    {
      //       path: 'weeks/:id', component: ProgramDetailComponent, outlet: 'program'
      //    }
      // ]
   },

      { path: 'publishers', component: PublishersComponent },
      { path: 'speakers', component: SpeakersComponent },
      { path: 'export', component: ExportComponent }
   ] }
 ];


@NgModule({
  imports: [
     AuthModule,
     SharedModule,
    RouterModule.forChild(routes),
  ],
  exports: [
     RouterModule,
     AuthModule
  ]
})
export class AssembleeModule { }
