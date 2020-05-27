import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GamesService } from 'src/app/services/games.service';
import { Game } from 'src/app/models/Game.model';
import { NgxNavigationWithDataComponent } from 'ngx-navigation-with-data';
import { PopupService } from 'src/app/services/popup.service';
import { PlateformeGenreService } from 'src/app/services/plateforme-genre.service';
import { Avis } from 'src/app/models/Avis.model';

@Component({
  selector: 'app-game-form',
  templateUrl: './game-form.component.html',
  styleUrls: ['./game-form.component.scss']
})
export class GameFormComponent implements OnInit {

  constructor(private formBuilder:FormBuilder,private gamesService:GamesService,
                private navCtrl:NgxNavigationWithDataComponent, private popupService:PopupService,
                private plateformeGenreService:PlateformeGenreService) { }

  gameForm:FormGroup;
  submitted:boolean=false;

  genres:string[]=[];
  genresSelected:string[]=[];
  isFull:boolean=false;
  oneGenre:boolean=false; // verifie qu'il y a au moins un genre
  plateformes:string[]=[];
  plateformesSelected:string[]=[];
  onePlateforme:boolean=false;
  isEmpty:boolean=false;

  // gérer le chargement d'un fichier
  currentFile:File=null;
  fileUrl:any;

  // On récupère l'année actuelle
  annee:number = new Date().getFullYear();
  
  obj = { // cet objet va permettre de modifier les genres et plateformes par référence
    "isFull":this.isFull,
    "oneGenre":this.oneGenre,
    "onePlateforme":this.onePlateforme,
    "isEmpty":this.isEmpty
  };
  
  ngOnInit(): void {
    this.fileUrl=this.gamesService.fileUrl;
    this.initForm();
    this.remiseEtatInit();
  }

  initForm(){
    this.gameForm = this.formBuilder.group(
      {
        title: ['',Validators.required],
        developpeur:['',Validators.required],
        age:['18',[Validators.required,Validators.pattern('[0-9]*')]],
        multijoueur: [''],
        description:[],
        releaseYear:['2020',[Validators.pattern('[0-9]*')]]
      }
    );
  }

  onSaveGame() {

    this.submitted=true;

    // si le form est invalide, on se stoppe ici
    if (this.gameForm.invalid || !this.onePlateforme || !this.oneGenre) // si le form est invalide, ou pas de genre, ou pas de plateforme : invalide
      return;

    const title = this.gameForm.get('title').value;
    const developpeur = this.gameForm.get('developpeur').value;
    const age = this.gameForm.get('age').value;
    const multijoueur = this.gameForm.get('multijoueur').value ? true : false; // si c'est coché true, sinon false
    const genre = this.genresSelected;
    const plateforme = this.plateformesSelected;
    const description = this.gameForm.get('description').value;
    const releaseYear = this.gameForm.get('releaseYear').value;

    var resMulti='Non'
    if (multijoueur)
      resMulti = 'Oui'

    var desc = '';
    if (description !== '')
      desc=description;

    if (this.currentFile == null){ // on ne doit pas héberger d'image
      const newGame = new Game(title,developpeur,age,genre,resMulti,this.fileUrl,plateforme,false,releaseYear,desc,[new Avis('','')]);
      this.gamesService.createNewGame(newGame);
    } else // on doit héberger une image
      this.onUploadFile(this.currentFile,title,developpeur,age,genre,resMulti,plateforme,releaseYear,desc);
    
    
    this.remiseEtatInit();
    this.popupService.gameNotVisible(); // permet de mettre en false l'affichage de l'alert 
    this.navCtrl.navigate('/games',{game:"success"});
  }

  /**
   * Fonction qui permet de remettre à l'état initial l'ensemble des variables
   */
  remiseEtatInit(){
    this.genres = this.gamesService.getCopy(this.plateformeGenreService.genres);
    this.genresSelected=[]; // on vide les genres selected
    this.plateformes = this.gamesService.getCopy(this.plateformeGenreService.plateformes);
    this.plateformesSelected=[];
    this.isEmpty=this.isFull=this.oneGenre=this.onePlateforme=false;
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



  /**
   * Les fonctions suivantes vont permettres de vérifier les champs
   */

   // on met en place un getter afin de faciliter les écritures
  get f() { return this.gameForm.controls; }

  /**
   * Fonctions pour permettre de upload un fichier
   */

  detectFiles (context){
    var file:File = context.target.files[0];
    // on regarde si on obtient bien une image
    if (file.type.match(/image\/*/) == null){
      $("#photo").val(''); // ce n'est pas un bon fichier !
      return;
    }

    this.gamesService.modificationPhoto(file).then( // on affiche l'image que l'utilisateur souhaite
      (url) => {
        this.fileUrl=url;
        this.currentFile=file;
      }
    )
  }

  onUploadFile(file: File,title,developpeur,age,genre,resMulti,plateforme,releaseYear,desc){
    this.gamesService.uploadFile(file).then(
      (url : string) => {
        this.fileUrl = url;
        const newGame = new Game(title,developpeur,age,genre,resMulti,this.fileUrl,plateforme,false,releaseYear,desc,[new Avis('','')]);
        this.gamesService.createNewGame(newGame);
      }
    );
  }


}
