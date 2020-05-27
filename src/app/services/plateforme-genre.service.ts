import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlateformeGenreService {

  constructor() { }

  genres= ["Action",
    "Aventure",
    "Jeu de rôle",
    "Reflexion",
    "Simulation",
    "Stratégie",
    "Sport"
  ];

  plateformes=[
    "PS4",
    "Xbox One",
    "Nintendo Switch",
    "PC",
    "Android",
    "IOS"
  ];

  ajouterGenre(event,genresSelected:string[],genres:string[],obj){
    const indexSelected = event.selectedIndex;

    if (genresSelected.length < 3){
      genresSelected.push(genres[indexSelected]); // on ajoute un genre selectionné
      genres.splice(indexSelected,1); // on supprime des genres
      obj.isFull=false;
      obj.oneGenre=true;
      if(genresSelected.length == 3)
        obj.isFull=true;
    } 
  }

  removeGenre(index,genresSelected:string[],genres:string[],obj){
    genres.push(genresSelected[index]);
    genresSelected.splice(index,1);
    obj.isFull=false;

    if (genresSelected.length == 0)
      obj.oneGenre=false; // il n'y a plus de genre
  }

  ajouterPlateforme(event,plateformesSelected:string[],plateformes:string[],obj){
    const indexSelected = event.selectedIndex;
    plateformesSelected.push(plateformes[indexSelected]); // on ajoute une plateforme
    plateformes.splice(indexSelected,1);
    obj.onePlateforme=true;
    

    if (plateformes.length == 0)
      obj.isEmpty=true;
  }

  removePlateforme(index,plateformesSelected:string[],plateformes:string[],obj){
    plateformes.push(plateformesSelected[index]);
    plateformesSelected.splice(index,1);
    obj.isEmpty=false;

    if (plateformesSelected.length == 0)
      obj.onePlateforme=false;
    
  }

  /**
   * Permet de récupérer un tableau sans les éléments déjà sélectionnés
   * @param value 'genre' ou 'plateforme'
   */
  getPlateformeOrGenre(value:string,tabSelected:string[]){
    var tab:string[];
    var allTab:string[];

    if (value === 'genre')
      allTab = this.genres;
    else if (value === 'plateforme')
      allTab = this.plateformes;
    
    tab = allTab.filter((value1) => { // iterate over the array
        return !tabSelected.includes(value1);
    });
    
    return tab;
  }
  
}
