import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ForgotPassComponent } from './auth/forgot-pass/forgot-pass.component';
import { GameListComponent } from './game-list/game-list.component';
import { GameFormComponent } from './game-list/game-form/game-form.component';
import { SingleGameComponent } from './game-list/single-game/single-game.component';
import { AuthGuardService } from './services/auth-guard.service';
import { NegativeAuthGuardService } from './services/negative-auth-guard.service';
import { ValidateGameComponent } from './validate/validate-game/validate-game.component';
import { AdminGuardService } from './services/admin-guard.service';
import { ModificationGameComponent } from './game-list/single-game/modification-game/modification-game.component';


const appRoutes: Routes = [
  { path: 'auth/signin',canActivate:[NegativeAuthGuardService] , component: SigninComponent },
  { path: 'auth/signup',canActivate:[NegativeAuthGuardService] , component: SignupComponent },
  { path: 'auth/forgot-password',canActivate:[NegativeAuthGuardService] , component: ForgotPassComponent },
  { path: 'games', component: GameListComponent },
  { path: 'games/view/modification/:id',canActivate:[AuthGuardService] , component: ModificationGameComponent },
  { path: 'admin/validation', canActivate:[AdminGuardService],component: ValidateGameComponent },
  { path: 'games/new',canActivate:[AuthGuardService] ,component: GameFormComponent },
  {path: 'games/view/:id', component: SingleGameComponent},
  { path:'', redirectTo: '/games',pathMatch:'full' },
  { path:'**', redirectTo: '/games' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
