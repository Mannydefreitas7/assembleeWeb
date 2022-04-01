
import { Address } from './address';

export class Congregation {
   id?: string;
   language?: CongLanguage;
   geoLocation?: GeoLocationList;
   properties?: Properties;
   fireLanguage?: FireLanguage;
};

export interface CongLanguage {
   languageCode:        string;
   languageName:        string;
   scriptDirection:     string;
   isSignLanguage:      boolean;
   writtenLanguageCode: string[];
}

export interface CongregationData {
   geoLocationList:           GeoLocationList[];
   suggestedLanguageCodeList: any[];
   hasMoreResults:            boolean;
   isBroadSearch:             boolean;
}

export interface GeoLocationList {
   geoId:      string;
   type:       string;
   isPrimary:  boolean;
   location:   Location;
   properties: Properties;
   isClaimed?: boolean;
}

export interface Location {
   latitude:  number;
   longitude: number;
}

export interface FireLanguage {
   languageCode: string;
   apiURL: string;
}

export interface Properties {
   orgGuid?:               string;
   orgName?:               string;
   orgType?:               string;
   orgTransliteratedName?: string;
   address?:               string;
   transliteratedAddress?: string;
   languageCode?:          string;
   schedule?:              Schedule;
   relatedLanguageCodes?:  any[];
   phones?:                Phone[];
   isPrivateMtgPlace?:     boolean;
   memorialAddress?:       string;
   memorialTime?:          string;
}

export interface Phone {
   phone: string;
   ext:   string;
}

export interface Schedule {
   current:     Current;
   futureDate:  Date;
   changeStamp: null;
}

export interface Current {
   weekend: Midweek;
   midweek: Midweek;
}

export interface Midweek {
   weekday: number;
   time:    string;
}

export const congregation: Congregation = {
   id: '0927216B-2451-4AB5-AD08-11AC5777CCB1',
   fireLanguage: {
       apiURL: "wol/dt/r30/lp-f/",
       languageCode: "F"
   },
   language: {
       isSignLanguage: false,
       languageCode: 'F',
       languageName: 'Francais',
       scriptDirection: 'LTR',
       writtenLanguageCode: ['fr']
   },
   properties: {
       orgName: 'West Hudson French - NY (USA)',
       orgGuid: '0927216B-2451-4AB5-AD08-11AC5777CCB1'
   }
}

export const language: FireLanguage = {
   apiURL: 'wol/dt/r30/lp-f/',
   languageCode: 'F'
}
