import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { User } from 'firebase';
import { AdminService } from '../services/admin.service';
import { GamesService } from '../services/games.service';
import { Game } from '../models/Game.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit,OnDestroy {

  isAuth:boolean;
  authSubscription: Subscription;
  isAdmin:boolean;
  adminSubscription: Subscription;
    

  constructor(private auth:AuthService,private adminService:AdminService,private gamesService:GamesService,
    private _modifSuccess: MatSnackBar,private router:Router,private navCtrl:NgxNavigationWithDataComponent) { }
  

  ngOnInit(): void {
    this.authSubscription=this.auth.authSubject.subscribe(
      (isAuth: boolean) => {
        this.isAuth = isAuth;
      }
    );

    this.adminSubscription=this.adminService.adminSubject.subscribe(
      (isAdmin: boolean) => {
        this.isAdmin = isAdmin;
      }
    );

    if (this.gamesService.games.length != 0) // si les jeux ont déjà été chargés : on les emets
      this.gamesService.emitGames();
    else // sinon on les charges
      this.gamesService.getGames();
  }

  onSignOut(){
    this.auth.logout();
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
    this.adminSubscription.unsubscribe();
  }

  /**
   * Permet de rechercher avec le bouton Entrée
   * @param event évenement sur la touche appuyé
   */
  onSearchViaKey(event){
    var contenu = $("#search").val();

    var obj = {"value":contenu};
    if(event.key == "Enter"){
      $("#search").val('');
      this.searchGame(obj);
    }
  }

  searchGame(event){
    var contenu = event.value;
    event.value='';
    contenu = contenu.toLowerCase();
    var regex = new RegExp(contenu,'i'); // on crée la regex
    var answer;
    var res:number;

    res=this.onSort(regex);

    this.gamesService.changePage(1); // on remet en première page
    if (this.router.url !== '/games') // on redirige sur la page Games
      this.navCtrl.navigate("/games");

    answer = res + " Result(s) found";
    if(res === 0) // si il n'y a aucun résultat
      answer="Not found, do not hesitate to add the game";

    this._modifSuccess.open(answer,'Close',{
      duration : 3000
    });
  }


  /**
   * Permet de trier le tableau avec la regex choisie
   * @param regex Regex saisi par l'utilisateur 
   */
  onSort(regex:RegExp){
    var tabTrue:Game[]=[]; // tableau qui contient les jeux qui correspondent
    var game:Game;
    var nbOcc:number=0; //nombre de jeux qui respecte la regex

    var tabAux = this.gamesService.getCopy(this.gamesService.validateGames);
    for(var i in tabAux){
      game = tabAux[i];
      
      if (regex.test(game.title)){ // ça match
        tabTrue.push(game);
        nbOcc++;
      }
    }

    this.gamesService.games=tabTrue;
    this.gamesService.emitGames();
    return nbOcc;
  }
  
  
}
