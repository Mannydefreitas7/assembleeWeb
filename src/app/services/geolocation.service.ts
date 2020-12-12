import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Convert, GeoZip, GeoCity } from '../models/address.model';
import { CongLanguage, CongregationData } from '../models/congregation.model';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor(private http: HttpClient) { }

  getGeolocationFromZip(zip: number) : Observable<GeoZip> {
      let url = `http://api.zippopotam.us/us/${zip}`;
      let request = this.http.get(url).pipe(
         map(data => {

            let geoZip: GeoZip = Convert.toGeoZip(JSON.stringify(data));
            return geoZip;
         })
      )
      return request;
  }

  getGeolocationFromStateCity(state: string, city: string) : Observable<GeoCity> {
      let url = `http://api.zippopotam.us/us/${state}/${city}`;
      let request = this.http.get(url).pipe(
         map(data => {
            let geoCity: GeoCity = Convert.toGeoCity(JSON.stringify(data));
            return geoCity;
         })
      )
      return request;
  }



  getCongLanguages() : Observable<Array<CongLanguage>> {
   const headers = new HttpHeaders({
      'Content-Type': 'text/plain; charset=utf-8',
        "Access-Control-Allow-Methods": "GET",
       "Access-Control-Allow-Origin" : "*",
       "X-Requested-With": "XMLHttpRequest",
      })
     let url = 'http://localhost:4200/api/languages'
     let request = this.http.get(url).pipe(
      map((data: Array<Object>) => {
 
         let languages: Array<CongLanguage> = [];
         data.forEach(item => {
            languages.push(Convert.toCongLanguage(JSON.stringify(item)))
         })
        
         return languages;
      })
   )
   return request;
  }

  getCongregations(long: number, lat: number, language: CongLanguage) : Observable<CongregationData> {
   let url = `http://localhost:4200/api/weekly-meetings?lowerLatitude=${lat - 0.05}&lowerLongitude=${long - 0.05}&searchLanguageCode=${language.languageCode}&upperLatitude=${lat}&upperLongitude=${long}`;

   let request = this.http.get(url).pipe(
    map(data => {
       let congregation: CongregationData = Convert.toCongregation(JSON.stringify(data));
       return congregation;
    })
 )
 return request;
  }

}
