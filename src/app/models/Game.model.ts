import { Avis } from './Avis.model';

export class Game {
    

    constructor(public title:string,
        public developpeur: string,
        public age: number,
        public genre: string[],
        public multijoueur: string,
        public photo:string,
        public plateforme: string[],
        public valide:boolean,
        public releaseYear:number,
        public description:string,
        public avis:Avis[]
        ){

    }
}