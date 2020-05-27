import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.scss']
})
export class ForgotPassComponent implements OnInit,OnDestroy {

  errorMessage:string;
  newPassForm:FormGroup;
  messageSubscription: Subscription;
  

  constructor(private navCtrl:NgxNavigationWithDataComponent,
    private auth:AuthService, private formBuilder:FormBuilder) { }

  ngOnDestroy(): void {
    this.messageSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.initForm();

    this.messageSubscription=this.auth.messageSubject.subscribe(
      (message:string) => {
        this.errorMessage=message;
      }
    );
  }

  initForm(){
    this.newPassForm = this.formBuilder.group(
      {
        email: [this.navCtrl.get('email'),[Validators.required,Validators.email]]
      }
    );
  }

  onSubmit(){
    const email = this.newPassForm.get('email').value;

    this.auth.sendPasswordResetEmail(email);
    
  }

}
