import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { combineAll, debounceTime, distinctUntilChanged, map, windowWhen } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { GeoZip, Place } from 'src/app/models/address.model';
import { CongLanguage, Congregation, CongregationData, GeoLocationList } from 'src/app/models/congregation.model';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { faLanguage } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'ab-congregation',
  templateUrl: './congregation.component.html',
  styleUrls: ['./congregation.component.scss']
})




export class CongregationComponent implements OnInit {
   zipFormGroup: FormGroup;
   languageForm: FormGroup;
   hide = true;
   empty = true;
   html: string;
   emailMessage = false;
   congregationName: string;
   congregationNumber: string;
   longitude: number;
   latitude: number;
   $geoZip: Observable<GeoZip>;
   $congregations: Observable<CongregationData>;
   selectedCong: GeoLocationList;
   languages: CongLanguage[];
   checkedZip: boolean = false;
   checkedLanguage: boolean = false;
   faLanguage = faLanguage;
   constructor(
      public fb: FormBuilder,
      public auth: AuthService,
      private router: Router,
      private http: HttpClient,
      private geoService: GeolocationService
    ) {
    }


  ngOnInit(): void {
   
   this.zipFormGroup = this.fb.group({
      zipControl: ['', [
         Validators.required, 
         Validators.minLength(5),
         Validators.maxLength(5)
      ]],
   });
   this.languageForm = this.fb.group({
   languageControl: ['', [
      Validators.required,
      Validators.minLength(2)
   ]],
   }); 
  }

  get zipInput() { return this.zipFormGroup.get('zipControl'); }
  get language() { return this.languageForm.get('languageControl'); }

  loadLanguages() {
     this.geoService.getCongLanguages().subscribe(data => this.languages = data)
  }


  selectPlace() {
     this.$geoZip.subscribe(data => {
      this.latitude = Number(data.places[0].latitude)
      this.longitude = Number(data.places[0].longitude)
     })
     this.loadLanguages();
  }

  selectLanguage() {
      this.checkedLanguage = true;
      this.loadCongregations();
  }

  selectCongregation(congregation: GeoLocationList) {
      this.selectedCong = congregation;
  }

  loadCongregations() {
    this.$congregations = this.geoService.getCongregations(this.longitude, this.latitude, this.language.value);
   }


  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.languages.filter(v => v.languageName.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )
  
    formatter = (x: {name: string}) => x.name;

  checkZIP(e: Event) {
   
   this.zipFormGroup.get('zipControl').valueChanges.subscribe((data: string) => {
      if (data.length > 4) {
         this.checkedZip = true;
         if (this.zipInput.dirty && this.checkedZip) {
            this.$geoZip = this.geoService.getGeolocationFromZip(Number(data));
         }
      } else {
         this.checkedZip = false;
      }
   })
  }
}


