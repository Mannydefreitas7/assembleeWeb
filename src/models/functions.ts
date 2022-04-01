import { Functions } from "firebase/functions";
import Mail from "nodemailer/lib/mailer";
import { Congregation, FireLanguage } from "./congregation"
import { Part } from "./wol";

export interface DownloadWeekProgram {
    language: FireLanguage,
    date: Date
 }
 
 export interface FetchCongregationsFromGeolocation {
    languageCode: string,
    location: Location
 }

 export interface CongregationSearchResult {
    geoLocationList?:           GeoLocationList[];
    suggestedLanguageCodeList?: string[];
    hasMoreResults?:            boolean;
    isBroadSearch?:             boolean;
 }
 
 export interface GeoLocationList {
    geoId?:      string;
    type?:       string;
    isPrimary?:  boolean;
    location?:   Location;
    properties?: Properties;
 }
 
 export interface Location {
    latitude?:  number;
    longitude?: number;
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
    phone?: string;
    ext?:   string;
 }
 
 export interface Schedule {
    current?:     Current;
    futureDate?:  Date | null;
    changeStamp?: null;
    future?:      Current;
 }
 
 export interface Current {
    weekend?: Midweek;
    midweek?: Midweek;
 }
 
 export interface Midweek {
    weekday?: number;
    time?:    string;
 }

 export interface EmailPartPDF {
   part: Part;
   sending: Mail.Address;
   cc: Mail.Address;
   bcc: Mail.Address;
   congregation: Congregation;
   attachment: Mail.Attachment;
   functions: Functions;
 }