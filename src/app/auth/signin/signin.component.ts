import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { PopupService } from 'src/app/services/popup.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit,OnDestroy {

  signInForm: FormGroup;
  errorMessage: string;
  messageSubscription: Subscription;
  isAlert:boolean=false; // permet d'afficher ou non l'alert de confirmation d'inscription
  isAlertNewPass:boolean=false; // permet d'afficher ou non l'alert de confirmation d'un nouveau pass

  newMail:Subscription;
  displayNewMail:boolean=false;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private navCtrl:NgxNavigationWithDataComponent,
    private popupService:PopupService) { 
      
    }


  ngOnDestroy(): void {
    this.messageSubscription.unsubscribe();
    this.newMail.unsubscribe();
  }

  ngOnInit(): void {
    var res = this.navCtrl.get('email');
    if (!this.popupService.isAlertSignIn){ // si la notification n'a pas déjà été activé
      if (res === 'success'){ // c'est une inscription, on affiche l'alerte
        this.isAlert=true;
        this.popupService.alertSignInVisible();
      }
      else if (res === 'successResetPass'){ // c'est un mot de passe oublié 
        this.isAlertNewPass=true;
        this.popupService.alertSignInVisible();
      }
    }
    
    
    this.initForm();
    // on gère les deux subscriptions
    this.messageSubscription=this.authService.messageSubject.subscribe(
      (message:string) => {
        this.errorMessage=message;
      }
    );

    
    this.newMail=this.authService.confirmEmail.subscribe(
      (value:boolean) => {
        this.displayNewMail=value;
      }
    );
    
    
  }

  initForm() {
    this.signInForm = this.formBuilder.group(
      { 
        email: ['',[Validators.required, Validators.email]],
        password: ['',[Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    });
  }

  onSubmit() {
    const email = this.signInForm.get('email').value;
    const password = this.signInForm.get('password').value;

    this.authService.login(email,password);
  }

  onNewMail(){
    this.authService.receiveNewMail();
  }

  onNewPass(){
    const email = this.signInForm.get('email').value;
    this.navCtrl.navigate('/auth/forgot-password',{email:email}); // on envoie la mail pour pré-remplir le champs email
  }

  onGoogle(){
    this.authService.loginWithGoogle();
  }
  

}
