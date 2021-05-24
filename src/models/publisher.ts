
import { Congregation } from "./congregation";
import { Part } from "./wol";

export class Publisher {
	uid?: string;
   email?: string;
	photoURL?: string;
   firstName?: string;
   lastName?: string;
   privilege?:any;
   gender?: Gender | string;
   isInvited?: boolean;
   isWTConductor?: boolean;
   speaker?: Speaker;
   parts?: Part[];
   groupId?: string;
   userId?: string;
   isReader?: boolean;
   talks?: Talk[];
   isOutGoing?: boolean;
};

export class SafePublisher {
	uid?: string;
   email?: string;
	photoURL?: string;
   firstName?: string;
   lastName?: string;
   privilege?:any;
   gender?: Gender | string;
   isInvited?: boolean;
   isWTConductor?: boolean;
   speaker?: Speaker;
   parts?: Part[];
   isReader?: boolean;
};

export class Speaker {
   id?: string
   firstName?: string;
   lastName?: string;
   email?: string;
   privilege?:Privilege | string;
   isOutGoing?: boolean;
   photoURL?: string;
   congregation?: Congregation;
   talks?: Talk[];
}

export class Talk {
   id?: string;
   timeStamp?: any;
   title?: string;
   number?: number;
   lastDelivered?: Date;
   songNumber?: Song;
}


export class Song {
   id?: string;
   title?: string;
   number?: number;
}

export enum Privilege {
   pub = 'publisher',
   ms = 'ms',
   admin = 'admin',
   elder = 'elder',
   talkCo = 'talkCo',
}

export enum Gender {
   brother = 'brother',
   sister = 'sister'
}

export enum Permission {
   edit = 'edit',
   delete = 'delete',
   add = 'add',
   view = 'view',
   programs = 'programs',
   publishers = 'publishers',
   admin = 'admin',
   speakers = 'speakers'
}
