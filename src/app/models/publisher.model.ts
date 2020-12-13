
export class Publisher {

	uid?: string;
   email?: string;
   loginProvider?: string;
	photoURL?: string;
	congregationID?: string;
   firstName?: string;
   lastName?: string;
   privilege?:Privilege;
   permissions?: Array<Permission>;
   isEmailVerified?: boolean;
};



export enum Privilege {
   pub = 'publisher',
   ms = 'ms',
   admin = 'admin',
   elder = 'elder'
}

export enum Permission {
   edit = 'edit',
   delete = 'delete',
   add = 'add',
   view = 'view'
}
