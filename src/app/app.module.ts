import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { GameListComponent } from './game-list/game-list.component';
import { SingleGameComponent } from './game-list/single-game/single-game.component';
import { GameFormComponent } from './game-list/game-form/game-form.component';
import { ValidateGameComponent } from './validate/validate-game/validate-game.component';
import { ValidateNoteComponent } from './validate/validate-note/validate-note.component';
import { HeaderComponent } from './header/header.component';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { GamesService } from './services/games.service';
import { ValidateService } from './services/validate.service';
import {HttpClientModule } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { ForgotPassComponent } from './auth/forgot-pass/forgot-pass.component';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import {NgxPaginationModule} from 'ngx-pagination'; 
import { AdminService } from './services/admin.service';
import { AdminGuardService } from './services/admin-guard.service';
import { PopupService } from './services/popup.service';
import { ModificationGameComponent } from './game-list/single-game/modification-game/modification-game.component';
import { PlateformeGenreService } from './services/plateforme-genre.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import { DialogGameListComponent } from './game-list/material-angular/dialog-game-list/dialog-game-list.component'; 
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { PopupAvisComponent } from './game-list/material-angular/popup-avis/popup-avis.component';
import { FooterComponent } from './footer/footer.component'; 

var firebaseConfig = {
  apiKey: "YOUR_API_KEY_FIREBASE",
  authDomain: "AUTH_DOMAIN",
  databaseURL: "DATABASE_URL",
  projectId: "PROJECT_ID",
  storageBucket: "STORAGE_BUCKET",
  messagingSenderId: "MESSAGING_SENDER",
  appId: "API_ID"
};

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    GameListComponent,
    SingleGameComponent,
    GameFormComponent,
    ValidateGameComponent,
    ValidateNoteComponent,
    HeaderComponent,
    ForgotPassComponent,
    ModificationGameComponent,
    DialogGameListComponent,
    PopupAvisComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  providers: [
    AuthGuardService,
    AuthService,
    GamesService,
    ValidateService,
    NgxNavigationWithDataComponent,
    AdminService,
    AdminGuardService,
    PopupService,
    PlateformeGenreService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
