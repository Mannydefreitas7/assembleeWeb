
import { Congregation } from "./congregation";
import { Permission } from "./publisher";

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
   isOnline?: boolean;
};

export interface Attachment {
  content?: string;
  filename?: string;
  type?: string;
}

export class EmailMessage {
    to?: string[];
    from?: string;
    fromName?: string;
    subject?: string;
    text?: string;
    cc?: string;
    html?: string;
    attachments?: Attachment[]
}
