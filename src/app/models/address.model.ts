import { CongLanguage, CongregationData } from './congregation.model'

export class Address {
   id?: string
   street?: string
   city?: string
   zip?: number
   coordinates?: Coordinates   
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
export class Convert {
   public static toGeoZip(json: string): GeoZip {
       return JSON.parse(json);
   }
   public static toGeoCity(json: string): GeoCity {
      return JSON.parse(json);
  }
  public static toCongLanguage(json: string): CongLanguage {
   return JSON.parse(json);
}
public static toCongregation(json: string): CongregationData {
   return JSON.parse(json);
}
}
