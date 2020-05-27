import { Injectable } from '@angular/core';
import { Game } from '../models/Game.model';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import * as firebase from 'firebase';
import { InvalidGame } from '../models/InvalidGame.model';
import { Avis } from '../models/Avis.model';


@Injectable({
  providedIn: 'root'
})
export class GamesService {
  fileUrl:any="data:image/png;base64,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";

  validateGames:Game[]=[]; // permet de stocker l'ensemble des jeux validés
  games:Game[]=[]; // Games validés
  gamesSubject = new Subject<Game[]>();
  allGames:Game[];
  invalidGames:InvalidGame[]=[];
  modificationGames:Game[]=[];
  gamesModificationSubject = new Subject<Game[]>();
  gamesInvalidSubject = new Subject<InvalidGame[]>();
  page:number=1;
  private myPage  : BehaviorSubject<number>=new BehaviorSubject<number>(this.page);

  myPage$:Observable<number>=this.myPage.asObservable();

  constructor() { }

  /**
   * Permet de sauvegarder le numéro de la page actuelle
   * @param value : Numéro de la nouvelle page
   */
  changePage(value:number){
    this.page=value;
    this.myPage.next(this.page);
  }

  emitGames(){
    this.gamesSubject.next(this.games);
  }

  emitSearchGames(tab:Game[]){
    this.gamesSubject.next(tab);
  }

  emitGamesInvalid(){
    this.gamesInvalidSubject.next(this.invalidGames);
  }


  saveGames(){
    firebase.database().ref('/games/').set(this.allGames);
  }

  getGames(){
    
    firebase.database().ref('/games/').on('value',
    (data) => {
      this.allGames = data.val() ? data.val() : [];
      this.sortGames(this.allGames);
    }
    );
  }

  getSingleGame(index:number){
    return this.games[index];
  }

  createNewGame(game: Game){
    this.allGames.push(game);
    this.saveGames();
  }

  removePhoto(url:string){
    const storageRef = firebase.storage().refFromURL(url);

    storageRef.delete().then(
      () => {
        
      },
      (error) => {
        console.log('Could not remove photo! : ' + error);
      }
    );
  }

  uploadFile(file: File){
    return new Promise(
      (resolve,reject) => {
        const almostUniqueFileName = Date.now().toString();
        const upload = firebase.storage().ref()
        .child('images/'+almostUniqueFileName+ file.name)
        .put(file);

        console.log(upload);
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
            console.log("Chargement en cours");
          },
          (error) => {
            console.log('Erreur de chargement : '+  error);
            reject();
          },
          () => {
            resolve(upload.snapshot.ref.getDownloadURL());
          }
        );
      }
    );
  }

  isPhotoUseModification(url:string){
    var flag:boolean=false;
    if(url == this.fileUrl) // si on souhaite supprimer la photo par défaut, on ne le fait pas car elle est utile
      return;
    for (var i=0;i<this.modificationGames.length;i++){
      if(this.modificationGames[i].photo === url){
        flag=true;
        break;
      }
    }

    if (!flag) // la photo n'est plus proposée on peut supprimer
      this.removePhoto(url);

  }


  sortGames(tab:Game[]){
    this.games=[];
    this.invalidGames=[];
    this.emitGamesInvalid(); // on envoie cela si on a tous les jeu valides
    for (var i=0;i<tab.length;i++){
      if (tab[i].valide === true){ // le jeu est validé !
        this.games.push(tab[i]);
        this.emitGames();
      }
      else if (tab[i].valide === false){
        var auxInvalidGame = new InvalidGame(i,tab[i]);
        this.invalidGames.push(auxInvalidGame);
        this.emitGamesInvalid();
      }
    }
    this.validateGames=this.getCopy(this.games); // on stocke une copie de l'ensemble des livres
  }

  /**
   * 
   * @param invalidGame Correspond au jeu à valider
   */
  validate(index:number){
    this.allGames[this.invalidGames[index].index].valide=true;
    this.saveGames();
    this.sortGames(this.allGames);
  }

  /**
   * 
   * @param invalidGame Correspond au jeu à supprimer
   */
  delete(invalidGame:InvalidGame){
    var url = invalidGame.game.photo;
    if(url != this.fileUrl) // si la photo est différente de la photo par défaut, on la supprime
      this.removePhoto(invalidGame.game.photo);
    
    this.allGames.splice(invalidGame.index,1); // on supprime le jeu
    this.saveGames();
    this.sortGames(this.allGames); 
  }

  /**
   * Modifier une photo en temps réelle dans une balise image
   */
  modificationPhoto(file:File){
    return new Promise(
      (resolve,reject) => {
        var reader = new FileReader(); // on crée un flux qui va permettre de changer l'image de la page
        reader.readAsDataURL(file);
        reader.onload=() =>{
          resolve(reader.result);
        } 
      }
    );
  }

  getCopy(tab:any[]){
    const tabAux = Array.from(tab);
    return tabAux;
  }

  saveGamesModification(){
    firebase.database().ref('/modifications/').set(this.modificationGames);
  }

  getGamesModification(){
    
    firebase.database().ref('/modifications/').on('value',
    (data) => {
      this.modificationGames = data.val() ? data.val() : [];
      this.emitModificationGames();
    }
    );
  }

  emitModificationGames(){
    this.gamesModificationSubject.next(this.modificationGames);
  }

  SaveAllModification(game:Game){
    this.modificationGames.push(game);
    this.saveGamesModification();
  }

  
  findIndex(game:Game) {
    return this.games.findIndex(
      (gameAux) => {
        if (gameAux == game)
          return true;
      }
    );
  }

  findIndexModification(game:Game) {
    return this.modificationGames.findIndex(
      (gameAux) => {
        if (gameAux == game)
          return true;
      }
    );
  }

  findIndexAllGames(game:Game){
    return this.allGames.findIndex(
      (gameAux) => {
        if (gameAux == game)
          return true;
      }
    );
  }

  addAvis(avis:Avis,game:Game){
    var indexAllGame = this.findIndexAllGames(game);

    this.verifIsEmpty(this.allGames,indexAllGame);
    this.allGames[indexAllGame].avis.push(avis);
    this.saveGames();
    
    this.emitGames();
  }

  /**
   * Vérifie si il y a un seul avis de type défaut
   * @param tab Tableau à modifier
   * @param index 
   */
  verifIsEmpty(tab:Game[],index){
    if (tab[index].avis.length === 1) // s'il n'y a qu'un seul avis
      if (tab[index].avis[0].pseudo === '' ) 
        tab[index].avis.splice(0,1); // on vide le tableau si c'est l'avis par défaut !
  }

}
