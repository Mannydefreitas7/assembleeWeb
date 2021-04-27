import { Part, WeekProgram } from "./wol";
import firebase from 'firebase/app';
import 'firebase/auth';
import { Publisher } from "./publisher";
import { ReactNode } from "react";

export interface InitialState {
  week: WeekProgram;
  weeks: WeekProgram[];
  parts: Part[];
  auth: firebase.auth.Auth;
  firestore: firebase.firestore.Firestore;
  loading: boolean;
  part: Part;
  publisher: Publisher;
  changeWeek: any;
  dismissPanel: any;
  openPanel: any;
  isPanelOpen: boolean;
  selectPublisher: any;
  dismissModal: any;
  openModal: any;
  isModalOpen: boolean;
  modalChildren: ReactNode;
  viewPublisherParts: any;
}
