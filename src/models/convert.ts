import { GeoCity, GeoZip } from "./address.model";
import { CongLanguage, CongregationData } from "./congregation.model";
import { WOLWeek } from "./wol.model";

export class Convert {
   public static toWOLWeek(json: string): WOLWeek {
      return JSON.parse(json);
   }
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
