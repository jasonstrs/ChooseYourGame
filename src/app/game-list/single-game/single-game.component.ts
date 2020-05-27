import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/models/Game.model';
import { ActivatedRoute, Router } from '@angular/router';
import { GamesService } from 'src/app/services/games.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { Subscription } from 'rxjs';
import { PopupService } from 'src/app/services/popup.service';
import { DialogGameListComponent } from '../material-angular/dialog-game-list/dialog-game-list.component';
import { MatDialog } from '@angular/material/dialog';
import { PopupAvisComponent } from '../material-angular/popup-avis/popup-avis.component';
import { Avis } from 'src/app/models/Avis.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-single-game',
  templateUrl: './single-game.component.html',
  styleUrls: ['./single-game.component.scss']
})
export class SingleGameComponent implements OnInit {

  game:Game;
  gameSubscription:Subscription;
  idGame:number;
  isAuth:boolean=false;
  authSubscription:Subscription;
  modificationSuccess:boolean=false;
  dispAvis:boolean=false;
  oneAvis:boolean=false;


  constructor(private route:ActivatedRoute,private router:Router,
            private gamesService:GamesService,private authService:AuthService,
            private navCtrl:NgxNavigationWithDataComponent, private popupService:PopupService,
            public dialog: MatDialog,private _modifSuccess: MatSnackBar) { }


  ngOnInit(): void {
    // On commence par vérifier si on doit afficher l'alert success de modification
    var res = this.navCtrl.get('gameModif');
    if (res === 'success' && !this.popupService.isAlertModification){ // c'est une inscription, on affiche l'alerte
      this.modificationSuccess=true; // on affiche l'alerte
      this.popupService.modificationSuccessVisible(); // on place le jeu en visible dans le service
    } 
    
    this.game = new Game('','',0,[],'','',[],false,0,'',[]); // on crée un jeu vierge
    const id = this.route.snapshot.params['id'];
    this.idGame=id;
    
    // On est obligé de mettre en place une subscription concernant les jeux
    // en effet si l'utilisateur est déjà sur la page view et qu'il refresh
    // Le tableau games dans le service ne sera pas chargé et donc il sera undefined
    // ainsi, si il n'est pas chargé on lance getGames()
    if (this.gamesService.games.length === 0)
      this.gamesService.getGames();
    else
      this.game=this.gamesService.getSingleGame(+id);

    this.gameSubscription=this.gamesService.gamesSubject.subscribe(
      (games) => {
        this.game = this.gamesService.getSingleGame(+id); // le tableau est chargé
      }
    );


    // On met en place une subscription ici car si l'utilisateur est déjà connecté et qu'il se rend immédiatement vers un jeu
    // alors isAuth sera à false, car l'authentification est asynchrone donc en cours !
    this.isAuth=this.authService.isAuth; // on met en place l'init
    this.authSubscription=this.authService.authSubject.subscribe(
      (isAuth: boolean) => {
        this.isAuth = isAuth;
      }
    );

  }

  onBack(){
    this.router.navigate(['/games']);
  }

  onModif(){
    this.navCtrl.navigate('/games/view/modification/'+this.idGame,{gameModif:this.game,idJeu:this.idGame});
  }

  displayAvis(){
    if(this.game.avis.length !== 0 && this.game.avis[0].pseudo != "") // s'il y a au moins 1 avis et différent de l'avis test
      this.oneAvis=true;
    else 
      this.oneAvis=false;

    if(this.dispAvis)
      this.dispAvis=false;
    else
      this.dispAvis=true;
  }

  displayPopupAvis(){
    const dialogRef = this.dialog.open(PopupAvisComponent, {
      width: 'auto',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
         
      if (result == undefined || Object.keys(result).length == 0) return;   
      // ajouter l'avis au game, et envoyer 
      var email = this.authService.getMail();
      var aux = email.split('@'); // on récupère ce qu'il y a avant @ 
      var pseudo = aux[0];

      var avis = new Avis(result,pseudo);
      this.gamesService.addAvis(avis,this.game);
      this.oneAvis=true;

      this._modifSuccess.open("Your opinion has just been published",'Close',{
        duration : 3000
      });
     
    });
  }

}
