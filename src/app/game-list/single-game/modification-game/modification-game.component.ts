import { Component, OnInit } from '@angular/core';
import { GamesService } from 'src/app/services/games.service';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { Game } from 'src/app/models/Game.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import $ from "jquery";
import { PopupService } from 'src/app/services/popup.service';
import { PlateformeGenreService } from 'src/app/services/plateforme-genre.service';

@Component({
  selector: 'app-modification-game',
  templateUrl: './modification-game.component.html',
  styleUrls: ['./modification-game.component.scss']
})
export class ModificationGameComponent implements OnInit {

  game:Game;
  gameForm:FormGroup;

  fileUrl:string;

  // Permet de stocker la photo actuelle
  imgUrl:any;
  currentFile:File=null;

  isChanging:boolean=false; // savoir si on est entrain de modifier un input

  // on doit récupèrer les genres et les plateformes
  auxElement:string[]=[]; // ce tableau va permettre de sauvegarder les genres/plateformes sélectionnés pour les remettres en cas de retour en arrière
  genres:string[]=[];
  genresSelected:string[]=[];
  plateformes:string[]=[];
  plateformesSelected:string[]=[];
  isEmpty:boolean=false;
  isFull:boolean=false;
  oneGenre:boolean=true;
  onePlateforme:boolean=true;

  // On est obligé les deux booleens ci-dessous pour mettre en disabled les différents éléments selectionnés
  // On est obligé de faire cela, sinon si on ajoute un élément il est en disabled par défaut car les
  //<li> Possède la classe remove
  isGenreModif:boolean=false; // si on est entrain de modifier le genre
  isPlateformeModif:boolean=false; // si on est entrain de modifier la plateforme

  obj = { // cet objet va permettre de modifier les genres et plateformes par référence
    "isFull":this.isFull,
    "oneGenre":this.oneGenre,
    "onePlateforme":this.onePlateforme,
    "isEmpty":this.isEmpty
  };

  constructor(private navCtrl:NgxNavigationWithDataComponent,private gamesService:GamesService,
    private formBuilder:FormBuilder,private popupService:PopupService,private plateformeGenreService:PlateformeGenreService) {

    }

  ngOnInit(): void {
    if (this.navCtrl.get('gameModif') == undefined)// si l'utilisateur accède à la page directement sans passer par single-game, il est redirigé vers games !
      this.navCtrl.navigate('/games');

    this.game = this.navCtrl.get('gameModif');

    // on charge les modifications
    this.gamesService.getGamesModification();
    
    this.onReset();

    $(document).on("keyup","input,textarea",(event)=>{
      if (event.keyCode == 13) { // cela correspond à Entrée
        var refInput = event.currentTarget;
        this.onFinal(refInput,true); // mode vérification
      }
    })
  }

  initForm(){
    var multi = false;
    if (this.game.multijoueur == 'Oui')
      multi=true;

    this.gameForm = this.formBuilder.group(
      {
        developpeur:[this.game.developpeur,Validators.required],
        age:['18',[Validators.required,Validators.pattern('[0-9]*')]],
        multijoueur: [multi],
        description:[this.game.description],
        releaseYear:[this.game.releaseYear,[Validators.pattern('[0-9]*')]]
      }
    );
  }

  onModifGame(){
    const developpeur = this.gameForm.get('developpeur').value;
    const age = this.gameForm.get('age').value;
    const multijoueur = this.gameForm.get('multijoueur').value ? true : false; // si c'est coché true, sinon false
    var multi="Non";
    if (multijoueur == true)
      multi="Oui";
    const description = this.gameForm.get('description').value;
    const releaseYear = this.gameForm.get('releaseYear').value;

    var game:Game;

    if(this.currentFile == null) { // on n'upload pas de nouvelle image, on peut créer le livre
      game = new Game(this.game.title,developpeur,age,this.genresSelected,
            multi,this.game.photo,this.plateformesSelected,false,releaseYear,description,[]);
      
      this.gamesService.SaveAllModification(game); // on l'enregistre
    } else { // nouvelle photo : Il faut uploader la photo
      this.onUploadFile(this.currentFile,developpeur,age,multi,description,releaseYear);
    }

    var idJeu = this.navCtrl.get("idJeu");
    this.popupService.modificationSuccessNotVisible(); // la notif peut être visible
    this.navCtrl.navigate('/games/view/'+idJeu,{gameModif:"success"});
  }

  onUploadFile(file: File,developpeur:string,age:number,multijoueur:string,description:string,releaseYear:number){
    this.gamesService.uploadFile(file).then(
      (url : string) => {
        var game = new Game(this.game.title,developpeur,age,this.genresSelected,multijoueur,
          url,this.plateformesSelected,false,releaseYear,description,[]);
        
         this.gamesService.SaveAllModification(game);
      }
    );
  }


  detectFiles (context){
    var file:File = context.target.files[0];
    // on regarde si on obtient bien une image
    if (file.type.match(/image\/*/) == null){
      $("#photo").val(''); // ce n'est pas un bon fichier !
      return;
    }

    this.gamesService.modificationPhoto(file).then(
      (result) => {
        this.imgUrl=result;
        this.currentFile=file;
      },
      (error) => {
        console.log(error);
      }
    );
    
  }


  ajouterGenre(event){
    
    this.plateformeGenreService.ajouterGenre(event,this.genresSelected,this.genres,this.obj);
    this.isFull=this.obj.isFull;
    this.oneGenre=this.obj.oneGenre;
  }

  removeGenre(index){

    this.plateformeGenreService.removeGenre(index,this.genresSelected,this.genres,this.obj);
    this.isFull=this.obj.isFull;
    this.oneGenre=this.obj.oneGenre;
  }

  ajouterPlateforme(event){
    this.plateformeGenreService.ajouterPlateforme(event,this.plateformesSelected,this.plateformes,this.obj);
    this.onePlateforme = this.obj.onePlateforme;
    this.isEmpty = this.obj.isEmpty;
  }

  removePlateforme(index){
    this.plateformeGenreService.removePlateforme(index,this.plateformesSelected,this.plateformes,this.obj);
    this.onePlateforme = this.obj.onePlateforme;
    this.isEmpty = this.obj.isEmpty;
  }

  resetGenre(oldTabSelected:string[]){
    this.genresSelected=this.gamesService.getCopy(oldTabSelected); // on remet l'ancien contenu
    this.genres = this.plateformeGenreService.getPlateformeOrGenre('genre',this.genresSelected);
    this.oneGenre=true; // on remet à vrai car il y a au moins un genre
    this.obj.oneGenre=true;

    if(this.genresSelected.length == 3){ // on regarde si on doit désactiver ajouter ou non
        this.isFull=true;
        this.obj.isFull=true;
    }
    else{
      this.isFull=false;
      this.obj.isFull=false;
    }
  }

  resetPlateforme(oldTabSelected:string[]){
    this.plateformesSelected=this.gamesService.getCopy(oldTabSelected); // on remet l'ancien contenu
    this.plateformes = this.plateformeGenreService.getPlateformeOrGenre('plateforme',this.plateformesSelected);
    this.onePlateforme=true; // on remet à vrai car il y a au moins une plateforme
    this.obj.onePlateforme=true;

    if (this.plateformes.length == 0){ // on regarde si toutes les plateformes sont mises
      this.isEmpty=true;
      this.obj.isEmpty=true;
    }
    else {
      this.isEmpty=false;
      this.obj.isEmpty=false;
    }
  }


  onReset(){
    this.currentFile=null;
    this.imgUrl=this.game.photo;
    this.oneGenre=true;
    this.onePlateforme=true;
    this.resetPlateforme(this.game.plateforme);
    this.resetGenre(this.game.genre);
    if(this.genresSelected.length == 3)
      this.isFull=true;

    this.initForm();
  }

  onBack(){
    var idJeu = this.navCtrl.get("idJeu");
    this.navCtrl.navigate('/games/view/'+idJeu);
  }

  /**
   * Les fonctions suivantes permettent de gérer les icons de modification, de validation etc
   */

  changeValue(refInput){
    this.isChanging=true; // on modifie un input
    $(refInput).prop('disabled',false); // on désactive l'attribut disabled
    var refLabel; 
    var contenu;
    var photoInit=null; 
    var file:File=null;

    switch($(refInput).attr('id')) {
      case 'genre' :
        this.isGenreModif=true; // on est entrain de modifier le genre
        refLabel = $("label",$(refInput).parent().parent()); // on récupère une référence sur le label
        this.auxElement = this.gamesService.getCopy(this.genresSelected); // on sauvegarde l'ancien contenu
      break;
      case 'plateforme' :
        refLabel = $("label",$(refInput).parent().parent()); // on récupère une référence sur le label
        this.isPlateformeModif=true;
        this.auxElement = this.gamesService.getCopy(this.plateformesSelected); // on sauvegarde l'ancien contenu
      break;

      case 'photo' :
        refLabel = $("label",$(refInput).parent()); // on récupère une référence sur le label
        photoInit = this.imgUrl; // on stocke l'url initial
        file = this.currentFile; // on stocke le fichier initialement
      break;

      case 'multijoueur' : 
        contenu = $(refInput).is(':checked'); // on récupère la valeur du contenu sous forme de booleen
        refLabel = $("label",$(refInput).parent()); // on récupère une référence sur le label
      break;

      default :
        contenu = $(refInput).val(); // on récupère la valeur du contenu
        refLabel = $("label",$(refInput).parent()); // on récupère une référence sur le label
    }

    /**
     * On met en place les deux icons : Valider et refuser puis on insère à côté du label
     */

    var check = $(`<svg class="bi bi-check" style="cursor:pointer;" width="1.5em" height="1.5em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M13.854 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L6.5 10.293l6.646-6.647a.5.5 0 01.708 0z" clip-rule="evenodd"/>
          </svg>`).click(()=> {
            this.onFinal(refInput,true); // true : mode verif activé car validation
          });

    var cross = $(`<svg class="bi bi-x pointer" style="cursor:pointer;" width="1.5em" height="1.5em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 010 .708l-7 7a.5.5 0 01-.708-.708l7-7a.5.5 0 01.708 0z" clip-rule="evenodd"/>
    <path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 000 .708l7 7a.5.5 0 00.708-.708l-7-7a.5.5 0 00-.708 0z" clip-rule="evenodd"/>
    </svg>`).click(()=>{
      this.onChooseRemove(refInput,contenu,photoInit,file); // false : mode verif désactivé car annulation
    });

    $(refLabel).after("<span id='modificationArea'></span>"); // on crée le span qui va contenir les icons
    $("#modificationArea").append(check);
    $("#modificationArea").append(cross);
  }

  

  onChooseRemove(refInput,contenu,photoInit,file:File=null){
    var label = $(refInput).attr('id');
    
    
    switch (label) {
      case "genre":
        this.resetGenre(this.auxElement);
      break;
      case "plateforme":
        this.resetPlateforme(this.auxElement);
      break;

      case "photo" : 
        $(refInput).val('');
        this.imgUrl=photoInit;
        this.currentFile=file; // on remet en place l'ancien currentFile
      break;

      case "multijoueur" :
        $(refInput).prop('checked',contenu); // on remet le input dans son état inital
      break;
      
      default :
        $(refInput).val(contenu);
    }

    
    this.onFinal(refInput,false); // on remet dans l'état initial
  }

  onFinal(refInput,flag:boolean) {
    
    var idBouton = $(refInput).attr('id');

    switch (idBouton){
      case "genre" :
        if (flag) // on se trouve en mode vérification
          if (!this.oneGenre)
            return;
        
        this.isGenreModif=false; // on réactive le disabled des <li>
      break;

      case "plateforme" :
        if (flag) // on se trouve en mode vérification
          if (!this.onePlateforme)
            return;
        this.isPlateformeModif=false;
      break;
      case "photo" : // pas de vérification nécessaires pour ces deux cas
      case "multijoueur" :
      break;
      
      default :
      // faire les verifications
        if (flag) { // on se trouve en mode vérification
          if($(refInput).val() == '' && idBouton != 'description'){ // si c'est vide, on met une erreur sauf si c'est description car facultatif
            $("#modification").remove(); // si elle existe on supprime
            $(refInput).parent().append(`<div id="modification" style="display:block;" class="invalid-feedback"></div>`);
            $("#modification").html("Veuillez saisir un(e) " + idBouton);
            return;
          }
        }
        $("#modification").remove(); // si elle existe on supprime
        // on n'affiche pas l'erreur
    }
    refInput.disabled=true; // on désactive le bouton

    $("#modificationArea").remove(); // on supprime les deux icons
    this.isChanging=false; // on peut de nouveau modifier
  }

}
