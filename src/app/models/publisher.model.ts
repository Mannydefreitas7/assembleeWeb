import { AngularFirestoreDocument, DocumentReference } from "@angular/fire/firestore";
import { Congregation } from "./congregation.model";

export class Publisher {

	uid?: string;
   email?: string;
	photoURL?: string;
   firstName?: string;
   lastName?: string;
   privilege?:Privilege;
   gender?: Gender;
   isInvited?: boolean;
};



export enum Privilege {
   pub = 'publisher',
   ms = 'ms',
   admin = 'admin',
   elder = 'elder',
}

export enum Gender {
   brother = 'brother',
   sister = 'sister'
}

export enum Permission {
   edit = 'edit',
   delete = 'delete',
   add = 'add',
   view = 'view'
}
