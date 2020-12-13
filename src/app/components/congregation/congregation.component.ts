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
import { saveAs } from 'file-saver';
import { FireStoreService } from 'src/app/services/fire-store.service';
import { Publisher } from 'src/app/models/publisher.model';

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
   jsonObject: object = {
      'City': [
        {
          'id': 1,
          'name': 'Basel',
          'founded': -200,
          'beautiful': true,
          'data': 123,
          'keywords': ['Rhine', 'River']
        },
        {
          'id': 1,
          'name': 'Zurich',
          'founded': 0,
          'beautiful': false,
          'data': 'no',
          'keywords': ['Limmat', 'Lake']
        }
      ]
    };


   constructor(
      public fb: FormBuilder,
      public auth: AuthService,
      private router: Router,
      private http: HttpClient,
      private geoService: GeolocationService,
      private fireStoreService: FireStoreService
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

  saveJson() {
   const blob = new Blob([JSON.stringify(this.jsonObject)], {type : 'application/json'});
   saveAs(blob, 'abc.assemblee');
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
      let _congregation: Congregation = {
         id: this.selectedCong.properties.orgGuid,
         language: this.language.value,
         geoLocation: this.selectedCong,
         properties: this.selectedCong.properties
      }
      this.fireStoreService.create('congregations', this.selectedCong.properties.orgGuid,_congregation).then(() => {
         this.auth.afAuth.user.subscribe(user => {
            let publisher: Publisher = {
               congregationID: this.selectedCong.properties.orgGuid
            }
            this.fireStoreService.update(`publishers/${user.uid}`, publisher).then(console.log)
         })
      })
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


