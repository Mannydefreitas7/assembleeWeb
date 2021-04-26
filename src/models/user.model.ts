
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

export interface Attachment {
  content: string;
  filename: string;
  type?: string;
}

