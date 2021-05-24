
import { Gender, Privilege, Publisher } from "./publisher";

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
   isAssemblee?: boolean;
   parts?: Part[];
   isSent?: boolean;
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
   date?: any;
   id?: string;
   privilege?: Privilege[] | string[];
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
   isEmailed?: boolean;
   index?: number;
   parent?: Parent;
   path?: string;
   week?: string;
   isCalendarAdded?: boolean;
   isSymposium?: boolean;
   talkNumber?: string;
   songNumber?: number;
   parts?: Part[];
}


export enum PartType {
   assignee = "assignee",
   assistant = "assistant"
}

export enum Parent {
   treasures = 'treasures',
   apply = 'apply',
   life = 'life',
   talk = 'talk',
   wt = 'watchtower',
   chairman = 'chairman',
   prayer = 'prayer'
}
