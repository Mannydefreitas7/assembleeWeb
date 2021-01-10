import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData, DocumentReference } from '@angular/fire/firestore';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Privilege, Permission, Publisher } from '../models/publisher.model';
import { User } from '../models/user.model';
import { Part, WeekProgram, WOLWeek } from '../models/wol.model';


@Injectable({
  providedIn: 'root'
})
export class FireStoreService {

  constructor(
     public fireStore: AngularFirestore,
     private storage: LocalStorageService
     ) { }

  // helpers firestore methods

  // CREATE
  create(collection: string, doc: string, data: any) : Promise<any> {
    return this.fireStore.collection(collection).doc(doc).set(data, { merge: true });
  }

  getCongregationPublishers() : Observable<Publisher[]> {
    let congregation: string = this.storage.retrieve('congregationRef');
   return this.fireStore.collection<Publisher>(`${congregation}/publishers`).valueChanges();
  }

  addWeekProgram(congregation: string, date: Date, data: WeekProgram) : Promise<any> {
   // data.date = date
      return this.fireStore.collection(`${congregation}/weeks`).doc(`${data.id}`).set(data);

  }

  rename(congregation: string, part: Part, title: string) {
    this.fireStore.doc<Part>(`${congregation}/parts/${part.id}`).update({
      title: title,
      subTitle: title
    })
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
            Permission.view,
            Permission.programs,
            Permission.publishers,
            Permission.admin,
            Permission.speakers,
         ]
      }
      case Privilege.elder: {
         return [
            Permission.view,
            Permission.programs,
            Permission.publishers,
         ]
      }
      case Privilege.talkCo: {
        return [
          Permission.view,
          Permission.add,
          Permission.delete,
          Permission.edit,
          Permission.speakers,
        ]
     }
      case Privilege.ms: {
         return [
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
