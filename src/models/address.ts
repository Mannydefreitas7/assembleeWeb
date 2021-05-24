import { CongLanguage, CongregationData } from './congregation'

export class Address {
   id?: string
   street?: string
   city?: string
   zip?: number
  // coordinates?: GeolocationCoordinates   
}

export interface GeoZip {
   "post code":            string;
   country:                string;
   "country abbreviation": string;
   places:                 Place[];
}

export interface GeoCity {
   "country abbreviation": string;
   places:                 Place[];
   country:                string;
   "place name":           string;
   state:                  string;
   "state abbreviation":   string;
}

export interface Place {
   "place name":         string;
   longitude:            string;
   state:                string;
   "state abbreviation": string;
   latitude:             string;
}

