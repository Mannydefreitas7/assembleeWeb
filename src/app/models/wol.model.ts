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
   date: Date;
   items: Item[];
   midWeek: MidWeekProgram;
   weekEnd: WeekEndProgram;
}


export interface MidWeekProgram {
   
}

export interface WeekEndProgram {
   
}
