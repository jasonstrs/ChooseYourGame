import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Game } from '../models/Game.model';
import { Subscription } from 'rxjs';
import { GamesService } from '../services/games.service';
import { Router } from '@angular/router';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { PopupService } from '../services/popup.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogGameListComponent } from './material-angular/dialog-game-list/dialog-game-list.component';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GameListComponent implements OnInit,OnDestroy {

  constructor(private gamesService: GamesService,private router:Router,
    private navCtrl:NgxNavigationWithDataComponent, private popupService:PopupService,
    public dialog: MatDialog) { }
    
  
  
  games:Game[];
  gamesSubscription: Subscription;
  p:number;
  pageSubscription:Subscription;
  itemsPage:number=12;
  isAlert:boolean=false;
  private resultFilter={}; // on enregistre les filtres déjà selectionnés

  ngOnInit(): void {
    this.pageSubscription = this.gamesService.myPage$.subscribe(
      (number) => {
        this.p=number;
      }
    )
    this.games=[];
    this.gamesSubscription = this.gamesService.gamesSubject.subscribe(
      (games: Game[]) => {
        this.games=games;
      }
    );
    if (this.gamesService.games.length != 0) // si les jeux ont déjà été chargés : on les emets
      this.gamesService.emitGames();
    else // sinon on les charges
      this.gamesService.getGames();
    
    var res = this.navCtrl.get('game');
    if (res === 'success' && !this.popupService.isAlertNewGame){ // c'est une inscription, on affiche l'alerte
      this.isAlert=true; // on affiche l'alerte
      this.popupService.gameVisible(); // on place le jeu en visible dans le service
    } 
  }

  ngOnDestroy(): void {
    this.pageSubscription && this.pageSubscription.unsubscribe();
  }

  getGames(){
    this.gamesService.getGames();
    this.gamesService.changePage(1); // on renvoie à la page initiale
  }

  changePage(value){
    this.gamesService.changePage(value); // on change la valeur dans la sauvegarde
    this.p=value; // on change la valeur actuelle
  }

  viewSingle(index:number){
    // indexPage ==> index + (12*(PAGE_ACTUELLE-1))
    this.router.navigate(['/games','view',index+(this.itemsPage*(this.p-1))]);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogGameListComponent, {
      width: 'auto',
      data: this.resultFilter
    });

    dialogRef.afterClosed().subscribe(result => {
         
      if (result == undefined || Object.keys(result).length == 0) return; 
      this.resultFilter=result; // on enregirstre le filtre
      var tabKeys = Object.keys(result);

      this.gamesService.games.sort(this.sortByMultipleKey(tabKeys,result));
      this.gamesService.emitGames();
    });
  }


  /**
   * 
   * @param keys 
   * @param result Ce paramètre n'est pas nécéssaire au tri de nombre croissant ou décroissant
   *              Cependant, il est indispensable pour déterminer le genre/plateforme sélectionné
   */
  sortByMultipleKey(keys,result) {
    return (a, b)=> {
        var desc=1; // ordre croissant

        if (keys.length == 0) return 0; // force to equal if keys run out
        var key = keys[0]; // take out the first key
        /**
         * Cas des tableaux
         */
        if (key == "plateforme" || key == "genre"){
          var res;
          if (key == "plateforme")
            res=result.plateforme; // on stocke le résultat
          else
            res=result.genre; // on stocke le résultat

          var v1=0;
          var v2=0;

          if (a[key].includes(res))
            v1=1;
          if(b[key].includes(res))
            v2=1;

          return v2-v1 || this.sortByMultipleKey(keys.slice(1),result)(a, b);
        }

        /**
         * Cas décroissant !
         */
        if (key == "ageDescending" || key == "releaseYearDescending"){
          if(key == "ageDescending") key="age"; // on renomme la key
          else key="releaseYear";

          desc=-1;
        }
        /**
         * On tri ensuite :
         * if desc === 1 -> Croissant
         * if desc === -1 -> Décroissant 
         */
        if (a[key] < b[key]) return -1*desc; // will be 1 if DESC
        else if (a[key] > b[key]) return 1*desc; // will be -1 if DESC
        else return this.sortByMultipleKey(keys.slice(1),result)(a, b);
    }
  }

}
