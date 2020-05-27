import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { AdminService } from './admin.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService implements CanActivate {

  constructor(private router:Router, private adminService:AdminService) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise(
      (resolve,reject) => {
        firebase.auth().onAuthStateChanged(
          (user) => { 
            if (user === null){
              this.router.navigate(['/games']); 
              resolve(false); // personne n'est connecté ! on peut pas accéder à la page
            } else {
              if(this.adminService.verifAdmin(user) === true) { 
                resolve(true); // il est admin, il peut passer !
              } else { 
                this.router.navigate(['/games']);  
                resolve(false);
              }
            }

            
          }
        );
      }
    );
  }
}
