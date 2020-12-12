import { Congregation } from './congregation.model';

export class Publisher {

   setPermissions() : Array<Permission> {
      switch(this.privilege) {
         case Privilege.admin: {
            return [
               Permission.add, 
               Permission.delete,
               Permission.edit,
               Permission.view
            ]
            break;
         }
         case Privilege.elder: {
            return [
               Permission.edit,
               Permission.view
            ]
            break;
         }
         case Privilege.ms: {
            return [
               Permission.edit,
               Permission.view
            ]
            break;
         }
         case Privilege.pub: {
            return [
               Permission.view
            ]
            break;
         }
         default:
            return [
               Permission.view
            ]
            break;
      }
   }

	uid?: string;
	email?: string;
	photoURL?: string;
	congregation?: Congregation;
   firstName?: string;
   lastName?: string;
   privilege?:Privilege;
   permissions?: Array<Permission> = this.setPermissions();
};



enum Privilege {
   pub = 'publisher',
   ms = 'ms',
   admin = 'admin',
   elder = 'elder'
}

enum Permission {
   edit = 'edit',
   delete = 'delete',
   add = 'add',
   view = 'view'
}
