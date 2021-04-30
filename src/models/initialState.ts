import { Part, PartType, WeekProgram } from "./wol";
import firebase from 'firebase/app';
import 'firebase/auth';
import { Publisher } from "./publisher";
import { ReactNode } from "react";
import { Congregation } from "./congregation";

export interface InitialState {
  week: WeekProgram;
  weeks: WeekProgram[];
  parts: Part[];
  congregation: Congregation;
  auth: firebase.auth.Auth;
  firestore: firebase.firestore.Firestore;
  functions: firebase.functions.Functions;
  loading: boolean;
  part: Part;
  publisher: Publisher;
  changeWeek: any;
  dismissPanel: any;
  openPanel: any;
  type: PartType;
  isPanelOpen: boolean;
  selectPublisher: any;
  dismissModal: any;
  openModal: any;
  isModalOpen: boolean;
  modalChildren: ReactNode;
  viewPublisherParts: any; 
  assignPublisher: any;
  addProgram: any;
  openPublisherModal: any;
  openExportModal: any;
}
