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
import { Gender, Privilege, Publisher } from 'src/app/models/publisher.model';
import { AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'ab-congregation',
  templateUrl: './congregation.component.html',
  styleUrls: ['./congregation.component.scss']
})




export class CongregationComponent implements OnInit {
   congrationGroup: FormGroup;
   languageForm: FormGroup;
   aboutForm: FormGroup;
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
   checkedLanguage: CongLanguage;
   faLanguage = faLanguage;
   genders: Gender[] = [Gender.brother, Gender.sister]
   $fireUser: Observable<User>;
   privileges: Privilege[] = [Privilege.elder, Privilege.ms]
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
   this.$fireUser = this.auth.fireStoreUser;
   this.congrationGroup = this.fb.group({
      zipControl: ['', [
         Validators.required, 
         Validators.minLength(5),
         Validators.maxLength(5)
      ]],
      languageControl: ['', [
         Validators.required,
         Validators.minLength(2)
      ]],
   });
   this.languageForm = this.fb.group({
   languageControl: ['', [
      Validators.required,
      Validators.minLength(2)
   ]],
   }); 
   this.aboutForm = this.fb.group({
      fname: ['',  [
         Validators.required,
         Validators.minLength(2)
      ]],
      lname: ['', [
         Validators.required,
         Validators.minLength(2)
      ]],
      gender: [{ value: Gender.brother, disabled: true}, [
         Validators.required
      ]],
      privilege: [{ value: Privilege.elder, disabled: false}, [
         Validators.required,
      ]]  
   }); 
   this.$fireUser.subscribe(fireUser => {
      if (fireUser) {
         this.fname.setValue(fireUser.firstName)
         this.lname.setValue(fireUser.lastName)
      }
   })
  }

  get zipInput() { return this.congrationGroup.get('zipControl'); }
  get language() { return this.congrationGroup.get('languageControl'); }

  get fname() { return this.aboutForm.get('fname'); }
  get lname() { return this.aboutForm.get('lname'); }
  get gender() { return this.aboutForm.get('gender'); }
  get privilege() { return this.aboutForm.get('privilege'); }

  loadLanguages() {
     if (this.languages == null)
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
      this.loadCongregations();
     })
  }


  selectLanguage(language: CongLanguage) {
     this.checkedLanguage = language
     console.log(language)
      this.language.setValue(language.languageName);
      // this.loadCongregations(); 
  }
 
  selectCongregation(congregation: GeoLocationList) {
      this.selectedCong = congregation;
  }

  verifyAll() {
   let _congregation: Congregation = {
      id: this.selectedCong.properties.orgGuid,
      language: this.language.value,
      geoLocation: this.selectedCong,
      properties: this.selectedCong.properties
   }
    let congregationRef: AngularFirestoreDocument<Congregation> = this.fireStoreService.fireStore.doc(`congregations/${this.selectedCong.properties.orgGuid}`)
   
    congregationRef.set(_congregation).then((data) => {
      this.auth.afAuth.user.subscribe(user => {
         let updatedUser: User = {
            congregation: congregationRef.ref
         }
         this.fireStoreService.update(`users/${user.uid}`, updatedUser).then(() => {

               let publisher: Publisher = {
                  email: user.email,
                  firstName: this.fname.value,
                  lastName: this.lname.value,
                  gender: this.gender.value,
                  photoURL: user.photoURL,
                  privilege: this.privilege.value,
                  uid: user.uid,
                  isInvited: true
               }
               congregationRef.collection('publishers').doc(user.uid).set(publisher)
         })
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
   
   this.congrationGroup.get('zipControl').valueChanges.subscribe((data: string) => {
      if (data.length > 4) {
         this.checkedZip = true;
         if (this.zipInput.valid && this.language.valid) {
            this.$geoZip = this.geoService.getGeolocationFromZip(Number(data));
         }
      } else {
         this.checkedZip = false;
      }
   })
  }
}


