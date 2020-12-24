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
   date?: Date;
   
   midWeek?: MidWeekProgram;
   weekEnd?: WeekEndProgram;
   isCOVisit?: boolean;
}


export interface MidWeekProgram {
   date?: Date;
  // treasuresTalk?: Part;
   chairman?: Part;
  // treasuresDiscussion?: Part;
 //  bibleReading?: Part;
   applyParts?: Part[];
   treasuresParts?: Part[];
   lifeParts?: Part[];
   prayers?: Part[];
}

export interface WeekEndProgram {
   date?: Date;
   publicTalk: Part;
   watchtowerStudy: Part;
   chairman?: Part;
   prayers: Part[];
}

export interface Part {
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
   pathToUpdate?: string;
}
