import { Game } from './Game.model';

export class InvalidGame {

    constructor(public index:number,
            public game: Game){

    }
}