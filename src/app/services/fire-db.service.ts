import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Permission, Privilege } from '../models/publisher.model';
@Injectable({
  providedIn: 'root'
})
export class FireDBService {

  constructor(
     public fireDBService: AngularFireDatabase
  ) { }



  setPermissions(privilege: Privilege) : Array<Permission> {
   switch(privilege) {
      case Privilege.admin: {
         return [
            Permission.add, 
            Permission.delete,
            Permission.edit,
            Permission.view
         ]
      }
      case Privilege.elder: {
         return [
            Permission.edit,
            Permission.view
         ]
      }
      case Privilege.ms: {
         return [
            Permission.edit,
            Permission.view
         ]
      }
      case Privilege.pub: {
         return [
            Permission.view
         ]
      }
      default:
         return [
            Permission.view
         ]
   }

   }
}
