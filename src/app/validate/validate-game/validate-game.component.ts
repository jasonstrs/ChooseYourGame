import { Component, OnInit, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { InvalidGame } from 'src/app/models/InvalidGame.model';
import { GamesService } from 'src/app/services/games.service';
import { Subscription } from 'rxjs';
import { Game } from 'src/app/models/Game.model';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-validate-game',
  templateUrl: './validate-game.component.html',
  styleUrls: ['./validate-game.component.scss']
})
export class ValidateGameComponent implements OnInit,OnDestroy {

  invalidGames:InvalidGame[]=[];
  isEmpty:boolean=true;
  gamesInvalidSubscription: Subscription;
  gamesModifications:Game[]=[];
  gamesModificationSubscription:Subscription;
  games:Game[]=[];
  gamesSubscription: Subscription;

  // -----
  gameModif:Game=null;
  currentGame:Game=null;
  objNewModif:any;
  isValid:boolean; // permet de déterminer s'il reste des checked
  event_type:any;

  constructor(public gamesService:GamesService,@Inject(ChangeDetectorRef) private changeDetectorRef: ChangeDetectorRef,
  private _modifSuccess: MatSnackBar) { }

  ngOnDestroy(): void {
    this.gamesInvalidSubscription.unsubscribe();
    this.gamesModificationSubscription.unsubscribe();
    this.gamesSubscription.unsubscribe();
  }

  ngOnInit(): void {
    /**
     * Si on accède immédiatement à cette page : /admin/validation, si nous ne sommes pas passé par /games alors les jeux ne sont pas chargés
     * Par conséquent, /admin/validation sera vide ! On met donc en place une subscription, puis on charge ensuite les jeux pour être sur 
     * que les jeux à modifier sont bien présents.
     */
    this.gamesInvalidSubscription = this.gamesService.gamesInvalidSubject.subscribe(
      (invalidGames) => {
        this.invalidGames=invalidGames;
        this.verifIsEmpty();
      }
    );

    this.gamesModificationSubscription = this.gamesService.gamesModificationSubject.subscribe(
      (gamesModifications) => {
        this.gamesModifications=gamesModifications;
      }
    );

    this.gamesSubscription = this.gamesService.gamesSubject.subscribe(
      (games) => {
        this.games = games;
      }
    )

    this.gamesService.getGames(); // on charge les jeux valides et invalides
    this.gamesService.getGamesModification(); // on charge les modifications

    // Permet de retirer le focus du select Game quand on clique sur Escap
    $("ng-select").keyup((event)=> {
      if (event.keyCode == 27) // clic sur Escap
        $('.ng-input input').blur(); // on désactive le focus
    });
  }

  validerGame(index:number){
    this.gamesService.validate(index);  
    this.verifIsEmpty(); // on verifie s'il n'y a plus de jeu
  }

  refuserGame(index:number){
    this.gamesService.delete(this.invalidGames[index]);
    this.verifIsEmpty(); // on verifie s'il n'y a plus de jeu
  }

  verifIsEmpty(){
    if(this.invalidGames.length === 0)
      this.isEmpty=true;
    else
      this.isEmpty=false;
  }


  //--------------------------------------------
  differenceBetweenField(){
    this.objNewModif={}; // à chaque changement, on reset l'objet

    this.changeDetectorRef.detectChanges(); // on met à jour le template
    $(".modificationArea").remove(); // on supprime les check s'ils existent déjà
     
    for (let key in this.gameModif) {
      switch(key) {
        case 'plateforme':
        case 'genre' :
            var flag:boolean;
            if (key === "genre")
              flag = this.compareArray(this.currentGame.genre,this.gameModif.genre);
            else
              flag = this.compareArray(this.currentGame.plateforme,this.gameModif.plateforme);

            if (flag){
              $("."+key).css({"font-weight":"bold","color":"green"});
              this.objNewModif[key]=this.currentGame[key]; // on remplit l'objet de modification
            }
            else {
              $("."+key).css({"font-weight":"bold","color":"red"});
              this.insertCheck(key,"after",true);
            }
              
        break;

        case 'photo' :
          if (this.currentGame.photo !== this.gameModif.photo)
            this.insertCheck(key,"after",false);
          else 
            this.objNewModif[key]=this.currentGame[key]; // on remplit l'objet de modification
        break;

        case 'multijoueur' :
          if (this.gameModif[key] == this.currentGame[key]){
            this.objNewModif[key]=this.currentGame[key]; // on remplit l'objet de modification
            $("."+key).css({"font-weight":"bold","color":"green"});
          }
          else {
            $("."+key).css({"font-weight":"bold","color":"red"});
            this.insertCheck(key,"after",false);
          }
        break;

        default :
          $("."+key).removeClass('is-valid is-invalid'); // on enleve les anciennes classes
          if (this.gameModif[key] == this.currentGame[key]){
            this.objNewModif[key]=this.currentGame[key]; // on remplit l'objet de modification
            $("."+key).addClass('is-valid');   
          }         
          else {
            $("."+key).addClass('is-invalid');
            this.insertCheck(key,"before",false);
          }
      }
    }
    this.isVerifChecked();
    
  }

  onChangeGame(event) {
    this.currentGame = event;
    $('.ng-input input').blur(); // on désactive le focus
    if (this.gameModif) // si il y a les deux jeux, on lance la fonction de modification
      this.differenceBetweenField();
  }

  onChangeModif(event){
    var index = event.srcElement.options.selectedIndex -1;
    this.gameModif = this.gamesModifications[index];
    if (this.currentGame) // si il y a les deux jeux, on lance la fonction de modification
      this.differenceBetweenField();
  }


  /**
   * Permet de savoir si deux tableaux sont identiques
   * @param tabGame 
   * @param tabModif 
   */
  compareArray(tabGame,tabModif) {
    var gameAux = this.gamesService.getCopy(tabGame);
    var modifAux = this.gamesService.getCopy(tabModif);
    gameAux.sort();
    modifAux.sort();
    return JSON.stringify(gameAux)==JSON.stringify(modifAux); 
  }

  /**
   * Permet d'insérer les boutons check !
   * @param key Valeur de la classe que l'on doit modifier
   * @param where after ou before
   * @param plateformeOrGenre si on ajoute sur une plateforme ou un genre la structure est différente
   */
  insertCheck(key,where,plateformeOrGenre:boolean){
    var check = $(`<svg class="bi bi-check" style="cursor:pointer;" width="1.5em" height="1.5em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" d="M13.854 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L6.5 10.293l6.646-6.647a.5.5 0 01.708 0z" clip-rule="evenodd"/>
    </svg>`).click((event)=> {
      this.validateModification(event,key);
    });

    if (where === "after")
      $("."+key).after("<span class='modificationArea' name='"+key +"'></span>"); // on crée le span qui va contenir les icons
    else
      $("."+key).before("<span class='modificationArea'  name='"+key +"'></span>"); // on crée le span qui va contenir les icons

      if (plateformeOrGenre)
        $("."+key).next().append(check);
      else
        $(".modificationArea",$("."+key).parent()).append(check);  // on insère en ayant une reférence sur le parent 
  }

  /**
   * Permet de valider une modification
   * @param event 
   * @param key 
   */
  validateModification(event,key) {
    var refSpan =event.currentTarget.parentElement;
    var containsSpan = document.getElementById("currentGame").contains(refSpan); // si on a cliqué côté current Game
    
    if (containsSpan == true){ // alors on insère dans l'objet la key de currentGame
      this.objNewModif[key] = this.currentGame[key];
    } else { // sino on insère dans l'objet la key de gameModif
      this.objNewModif[key] = this.gameModif[key];
    }

    $("span[name='"+key +"']").remove();

    // tester si il y a encore des checks
    this.isVerifChecked();
    
  }

  reset(){
    this.objNewModif=null; // on vide l'objet
    this.differenceBetweenField();
  }

  /**
   * Permet de vérifier si toutes les modifications ont été faites !
   */
  isVerifChecked(){
    if ($(".modificationArea").length)
      this.isValid=false;
    else{
      this.isValid=true;
    }
  }

  onValidateNewGame(){

    var title = this.objNewModif.title; // le titre reste le meme
    var developpeur = this.objNewModif.developpeur;
    var plateforme = this.objNewModif.plateforme;
    var genre = this.objNewModif.genre;
    var multijoueur = this.objNewModif.multijoueur;
    var photo = this.objNewModif.photo;
    var age = this.objNewModif.age;
    var releaseYear = this.objNewModif.releaseYear;
    var description = this.objNewModif.description;
    if (description == undefined)
      description='';


    var newGame = new Game(title,developpeur,age,genre,multijoueur,photo,plateforme,true,releaseYear,description,[]);
    if (this.currentGame.photo != this.gameModif.photo){
      // il faut supprimer une des deux photos 
      if (photo != this.gameModif.photo){ // on n'a pas choisi la nouvelle image
      // on supprime cette photo
        this.gamesService.removePhoto(this.gameModif.photo);
      } else {
        // on a décidé de choisir une nouvelle photo, il faut désormais regarder si cette photo est utilisé dans d'autres modifications avant de la supprimer
        this.gamesService.isPhotoUseModification(this.currentGame.photo);
      }
    }

    this.saveModification(newGame);
    this.onStart();
    this._modifSuccess.open('Modification taken into account','Close',{
      duration : 3000
    });
  }

  saveModification(newGame:Game){
    var indexAllGame = this.gamesService.findIndexAllGames(this.currentGame);
    var indexGameModification = this.gamesService.findIndexModification(this.gameModif);
    
    /**
     * On se charge de mettre en place le nouveau jeu
     * On le supprime du tableau initial et on met le nouveau
     * On envoie tout cela sur firebase
     */
    this.gamesService.allGames.splice(indexAllGame,1);
    this.gamesService.allGames.push(newGame);
    this.gamesService.saveGames();
    this.gamesService.getGames();

    /**
     * On effectue la même démarche pour la modification
     */
    this.gamesService.modificationGames.splice(indexGameModification,1);
    this.gamesService.saveGamesModification();
    this.gamesService.emitModificationGames();

  }

  onStart(){
    this.currentGame=null;
    this.gameModif=null;
    this.objNewModif=null;
    $("#inputModif").prop("selectedIndex",0);
    this.event_type='';
  }


}
