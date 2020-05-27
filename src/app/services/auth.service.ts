import { Injectable } from '@angular/core';
import { Router } from  "@angular/router";
import { auth } from  'firebase/app';
import { AngularFireAuth } from  "@angular/fire/auth";
import { User } from  'firebase';
import * as firebase from 'firebase';
import { Subject } from 'rxjs';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { AdminService } from './admin.service';
import { PopupService } from './popup.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User; // stocker le user connecté
  authSubject = new Subject<boolean>(); // gérer si l'utilisateur passe de HL à EL (hors ligne - en ligne)
  messageSubject = new Subject<string>(); // envoyer les erreurs
  isNew:boolean=false;
  isConnexion:boolean=false;
  confirmEmail = new Subject<boolean>(); // savoir si l'utilisateur doit confirmer son mail
  isAuth:boolean=false;


  userAux:User;
  
  constructor(public afAuth:AngularFireAuth, 
    public router:Router,public navCtrl:NgxNavigationWithDataComponent
    ,public admin:AdminService, public popupService:PopupService ) {

    // si l'utilisateur est connecté, on met les data dans la variable user
    // sinon on stock null

      this.afAuth.authState.subscribe(user => {
        if (user){ // l'utilisateur est connecté
          if (this.isNew || this.isConnexion){ // si il est nouveau ou il doit confirmer son adresse
            this.isNew=false;
            this.isConnexion=false;
            this.admin.notAdmin(); // on met à false le boolean admin, si l'admin n'a pas confirmé son adresse ou est nouveau
          }
          else { // il est bien connecté
            this.user = user;
            this.emitAuth(true);
            this.admin.verifAdmin(user); // on vérifie si l'utilisateur est admin, si oui, le boolean du service passe à 1
            localStorage.setItem('user', JSON.stringify(this.user));
          }
          
        } else { // l'utilisateur n'est pas connecté
          localStorage.setItem('user', null);
        }

      });
        
    } 
  

  /**
   * Permet de gérer l'asynchronisme entre cette page et le header
   */
  emitAuth(value){
    this.authSubject.next(value);
    this.isAuth=value;
  }

  /**
   * Permet de gérer l'asynchronisme entre cette page et le sign in
   */
  emitMessage(value){
    this.messageSubject.next(value);
  }

  /**
   * Permet de gérer l'asynchronisme entre cette page et le sign in concernant la vérification de l'email
   */
  emitMail(value){
    this.confirmEmail.next(value);
  }

  /**
   * Savoir si l'utilisateur a vérifié son mail
   */
  getIsVerif():boolean {
    return firebase.auth().currentUser.emailVerified;
  }

  getUser(){
    return firebase.auth().currentUser;
  }


  /**
   * Fonction pour se connecter
   */
  async login(email: string, password: string) {
    try {
      this.isConnexion=true;
      var result = await this.afAuth.signInWithEmailAndPassword(email, password)

      // l'utilisateur a saisi les bons identifiants
      if (this.getIsVerif()){ // si l'utilisateur a vérifié son mail
        this.isConnexion=false; 
        this.emitAuth(true);
        this.user=this.getUser(); // /!\ Remettre ici dans le tableau principal car si isNew est encore à 1, on ne stocke pas l'user
        this.emitMessage('');
        this.router.navigate(['/games']);
      }  else { // il n'a pas vérifié son mail ! on retourne une erreur
        this.userAux=this.getUser(); // on stocke le user afin de pouvoir lui envoyer un mail de vérification
        await firebase.auth().signOut(); // on se déconnecte
        this.emitAuth(false);
        this.emitMessage("Please confirm your email address. ");
        this.emitMail(true);
      }

    } catch (error) {
      this.isConnexion=false;
      this.emitMessage(error.message);
    }
  }

  /**
   * Fonction pour s'enregister
   */
  async register(email: string, password: string) {
    try {
      this.isNew=true;
      var result = await this.afAuth.createUserWithEmailAndPassword(email, password) // l'utilisateur est enregistré
      
      this.sendEmailVerification(); // on lui envoie un mail de vérification
    } catch(error) {
      this.isNew=false;
      this.emitMessage(error.message);
    }
  }

  async sendEmailVerification() {
    try {
      await (await this.afAuth.currentUser).sendEmailVerification(); // le mail s'envoie, sinon on passe par le catch      
      await this.afAuth.signOut(); // on déconnecte l'utilisateur car il doit vérifier son adresse
      this.popupService.alertSignInNotVisible(); // on place le flag de l'alert à false, autrement dit elle peut être activé
      this.navCtrl.navigate('/auth/signin',{email:"success"});
    } catch(error) {
      this.emitMessage(error.message);
    }
  }

  async sendPasswordResetEmail(passwordResetEmail: string) {
    try {
      await this.afAuth.sendPasswordResetEmail(passwordResetEmail);
      this.popupService.alertSignInNotVisible(); // on place le flag de l'alert à false, autrement dit elle peut être activé
      this.navCtrl.navigate('/auth/signin',{email:"successResetPass"});
    } catch(error){
      this.emitMessage(error.message);
    }
    
  }

  async logout(){
    await this.afAuth.signOut();
    this.emitAuth(false);
    this.admin.notAdmin(); // il n'y a plus d'admin, on le déconnecte
    this.user=null; // on vide la variable user
    localStorage.removeItem('user');
    this.router.navigate(['/games']);
  }

  async  loginWithGoogle(){
    try {
      await  this.afAuth.signInWithPopup(new auth.GoogleAuthProvider())
      this.emitAuth(true);
      this.user=this.getUser(); // on stocke les données de l'utilisateur
      this.router.navigate(['/games']);
    } catch(error) {
      console.log(error);
    }
  }

  async receiveNewMail(){
    try {
      await this.userAux.sendEmailVerification();
      this.emitMessage("A new email has just been sent to you !");
      this.emitMail(false);
    } catch (error) {
      this.emitMessage(error.message);
    }
  }
  
  getMail(){
    return this.user.email;
  }

}
