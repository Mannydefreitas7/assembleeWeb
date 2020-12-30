import { DocumentReference } from "@angular/fire/firestore";
import { Congregation } from "./congregation.model";
import { Permission } from "./publisher.model";

export class User {
	uid?: string;
	email?: string;
	photoURL?: string;
	congregation?: string;
   displayName?: string;
   firstName?: string;
   lastName?: string;
   permissions?: Permission[];
   loginProvider?: string;
   isEmailVerified?: boolean;
};
