import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit,OnDestroy {

  signUpForm: FormGroup;
  errorMessage: string;
  messageSubscription: Subscription;
  btnDisabled: boolean=false;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router) { }
  ngOnDestroy(): void {
    this.messageSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.initForm();

    this.messageSubscription=this.authService.messageSubject.subscribe(
      (message:string) => {
        this.errorMessage=message;
        this.btnDisabled=false; // on desactive le bouton quand il reçoit un message d'erreur
      }
    );
  }

  initForm() {
    this.signUpForm = this.formBuilder.group(
      { 
        email: ['',[Validators.required, Validators.email]],
        password: ['',[Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]],
        passwordConfirm:['']
    });
  }

  onSubmit() {
    const email = this.signUpForm.get('email').value;
    const password = this.signUpForm.get('password').value;
    const passwordConfirm = this.signUpForm.get('passwordConfirm').value;

    if(passwordConfirm !== password){
      this.errorMessage="Please enter two identical passwords";
      return;
    }
    this.btnDisabled=true; // on désactive le bouton
    this.authService.register(email,password);
  }

 

}
