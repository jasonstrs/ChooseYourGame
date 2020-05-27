import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AuthService } from './auth.service';


@Injectable({
    providedIn: 'root'
  })


export class NegativeAuthGuardService implements CanActivate {    
  constructor(private router:Router, private authService:AuthService) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise(
      (resolve,reject) => {
        firebase.auth().onAuthStateChanged(
          (user) => { 
            if(user && !this.authService.isNew && !this.authService.isConnexion) { 
              resolve(false);
              this.router.navigate(['/games']);
            } else { // on laisse passer si l'utilisateur n'est pas co, ou si il est entrain de s'inscrire ou s'il n'a pas vérifie son adresse il reste sur la page
              resolve(true);
            }
          }
        );
      }
    );
  }
}