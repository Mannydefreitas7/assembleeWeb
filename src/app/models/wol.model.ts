import { DocumentReference } from "@angular/fire/firestore";
import { Gender, Privilege, Publisher } from "./publisher.model";

export interface WOLWeek {
   items: Item[];
}

export interface Item {
   title:              string;
   cardImageType:      string;
   url:                string;
   imageUrl:           string;
   caption:            string;
   content:            string;
   articleClasses:     string;
   did:                number;
   hideThumbnailImage: boolean;
   preReference:       string;
   reference:          string;
   source:             string;
   classification:     number;
   publicationTitle:   string;
   navScopeData:       any[];
   mediaHtml:          boolean;
   rsconf:             string;
   lib:                string;
}

export interface WeekProgram {
   id?: string;
   range?: string;
   date?: any;
   isCOVisit?: boolean;
   parts?: Part[];
}


// export interface MidWeekProgram {
//    date?: Date;
//    chairman?: string;
//    applyParts?: string[];
//    treasuresParts?: string[];
//    lifeParts?: string[];
//    prayers?: string[];
// }

// export interface WeekEndProgram {
//    date?: Date;
//    publicTalk: string;
//    watchtowerStudy: string;
//    chairman?: string;
//    prayers: string[]
// }

export interface Part {
   date?: Date;
   id?: string;
   privilege?: Privilege[];
   assignee?: Publisher;
   gender?: Gender[],
   hasAssistant?: boolean;
   assistant?: Publisher;
   length?: string;
   lengthTime?: number;
   hasDiscussion?: boolean;
   title?: string;
   subTitle?: string;
   isConfirmed?: boolean;
   index?: number;
   parent?: Parent;
}


export enum Parent {
   treasures = 'treasures',
   apply = 'apply',
   life = 'life',
   weekend = 'weekend',
   chairman = 'chairman',
   prayer = 'prayer'
}
