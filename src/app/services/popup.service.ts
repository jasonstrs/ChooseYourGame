import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  isAlertNewGame:boolean=false;
  isAlertSignIn:boolean=false;
  isAlertModification:boolean=false;

  constructor() { }

  gameVisible(){
    this.isAlertNewGame=true;
  }

  gameNotVisible(){
    this.isAlertNewGame=false;
  }

  alertSignInVisible(){
    this.isAlertSignIn=true;
  }

  alertSignInNotVisible(){
    this.isAlertSignIn=false;
  }

  modificationSuccessVisible(){
    this.isAlertModification=true;
  }

  modificationSuccessNotVisible(){
    this.isAlertModification=false;
  }
}
