import { Permission, Privilege } from "../models/publisher"

export class FireStoreService {
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