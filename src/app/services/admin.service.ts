import { Injectable } from '@angular/core';
import { User } from 'firebase';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  
  isAdmin:boolean=false;
  adminSubject = new Subject<boolean>();

  constructor() { }

  emitAdmin(value:boolean){
    this.isAdmin=value;
    this.adminSubject.next(value);
  }

  verifAdmin(user:User){
    if (user.email === "jason.sautieres@gmail.com"){
      this.isAdmin=true;
      this.emitAdmin(true);
      return true;
    }
    return false;
  }

  async notAdmin(){
    this.isAdmin=false;
    this.emitAdmin(false);
  }


}
