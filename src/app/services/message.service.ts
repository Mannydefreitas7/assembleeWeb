import { Injectable, TemplateRef } from '@angular/core';
import { NgbAlert, NgbToast, NgbToastConfig } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  toasts: ToastModel[] = [];
  alerts: AlertModel[] = [];

  constructor() {

   }
  addToToastCenter(toast: ToastModel) {
    this.toasts.push(toast);
  }

  addToAlertCenter(alert: AlertModel) {
    this.alerts.push(alert);
  }

  closeAlert(alert: AlertModel) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

}


export enum ToastType {
  danger = 'danger',
  warn = 'warn',
  info = 'info',
  success = 'success'
}


export interface ToastModel {
  classname?: string;
  delay?: number;
  text?: string;
  type?: ToastType;
}

export interface AlertModel {
  classname?: string;
  delay?: number;
  text?: string;
  type?: ToastType;
}
