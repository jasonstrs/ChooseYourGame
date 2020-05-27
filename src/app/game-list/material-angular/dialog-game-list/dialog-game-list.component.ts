import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlateformeGenreService } from 'src/app/services/plateforme-genre.service';

@Component({
  selector: 'app-dialog-game-list',
  templateUrl: './dialog-game-list.component.html',
  styleUrls: ['./dialog-game-list.component.scss']
})
export class DialogGameListComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogGameListComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any, private plateformeGenreService:PlateformeGenreService
    ) { }

  displaySelectGenre:boolean=false;
  displaySelectPlateforme:boolean=false;
  genres:string[]=[];
  plateformes:string[]=[];


  ngOnInit(): void {
    this.genres=this.plateformeGenreService.genres;
    this.plateformes=this.plateformeGenreService.plateformes;
    // On regarde ensuite les filtres déjà selectionnés
    if (this.data.plateforme){
      $("#check2").prop("checked",true);
      this.displaySelectPlateforme=true;
    }
    if(this.data.genre){
      $("#check1").prop("checked",true);
      this.displaySelectGenre=true;
    }
      
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onChangeAge(event) {
    var flag = event.srcElement.checked;
    if (flag == true){
      if($(event.currentTarget).is("#check3")){ // si la première checkbox est true, on met la seconde en disabled
        $("#check5").prop("checked",false);
        delete this.data.ageDescending; // on remove la propriété si l'utilisateur coche et décoche
      }
      else {
        $("#check3").prop("checked",false);
        delete this.data.age;
      }
    } else {
      delete this.data.ageDescending; // on remove la propriété si l'utilisateur coche et décoche
      delete this.data.age;
    }
  }

  onChangeDate(event) {
    var flag = event.srcElement.checked;
    if (flag == true){
      if($(event.currentTarget).is("#check4")){ // si la première checkbox est true, on met la seconde en disabled
        $("#check6").prop("checked",false);
        delete this.data.releaseYearDescending;
      }
      else {
        $("#check4").prop("checked",false);
        delete this.data.releaseYear;
      }
    } else {
      delete this.data.releaseYearDescending; // on remove la propriété si l'utilisateur coche et décoche
      delete this.data.releaseYear;
    }
  }

  onActivateSelect(event){
    var flag = event.srcElement.checked;
    if ($(event.currentTarget).is("#check1")){ // alors c'est le genre
      if (flag)
        this.displaySelectGenre=true;
      else {
        this.displaySelectGenre=false;
        delete this.data.genre; // on supprime le genre s'il y en a un
      }
        
    } else { // alors c'est une plateforme
      if (flag)
        this.displaySelectPlateforme=true;
      else {
        this.displaySelectPlateforme=false;
        delete this.data.plateforme;
      }
        
    }
  }

}
