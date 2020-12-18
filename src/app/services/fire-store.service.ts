import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Privilege, Permission, Publisher } from '../models/publisher.model';
import { WeekProgram, WOLWeek } from '../models/wol.model';


@Injectable({
  providedIn: 'root'
})
export class FireStoreService {

  constructor(
     public fireStore: AngularFirestore
     ) { }

  // helpers firestore methods

  // CREATE
  create(collection: string, doc: string, data: any) : Promise<any> {
    return this.fireStore.collection(collection).doc(doc).set(data, { merge: true });
  }

//   getCongregationPublishers() : Observable<Publisher[]> {

    

//   }

  addWeekProgram(congregationID: string, date: Date, data: WeekProgram) : Promise<any> {
  
      return this.fireStore.collection('congregations').doc(`${congregationID}`).collection('weeks').doc(`${this.fireStore.createId()}`).set(data);

  }

  read(path: string) : Observable<any> {
    return this.fireStore.doc(path).valueChanges();
  }

  readCollection(path: string) : Observable<any> {
   return this.fireStore.collection(path).valueChanges();
 }

  update(path: string, document: DocumentData) : Promise<any> {
     return this.fireStore.doc(path).update(document);
  }

  delete(path: string) : Promise<any> {
      return this.fireStore.doc(path).delete();
  }

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
