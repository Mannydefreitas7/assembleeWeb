import { AngularFirestoreDocument, DocumentReference } from "@angular/fire/firestore";
import { Congregation } from "./congregation.model";
import { Part } from "./wol.model";

export class Publisher {

	uid?: string;
   email?: string;
	photoURL?: string;
   firstName?: string;
   lastName?: string;
   privilege?:Privilege;
   gender?: Gender;
   isInvited?: boolean;
   isWTConductor?: boolean;
   speaker?: Speaker;
   parts?: string[];

};

export class Speaker {
   isOutGoing?: boolean;
   talks?: Talk[];
}

export class Talk {
   id?: string;
   title?: string;
   number?: number;
   lastDelivered?: Date;
   songNumber?: Song;
   isSymposium?: boolean;
   symposiumAssistant?: Publisher;
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
   settings = 'settings',
   speakers = 'speakers'
}
