import { Injectable } from '@angular/core';
import { GamesService } from './games.service';
import { InvalidGame } from '../models/InvalidGame.model';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {

  constructor(public gamesService:GamesService) { }

  validate(invalidGame:InvalidGame){
    console.log(invalidGame);
  }

  delete(invalidGame:InvalidGame){
    console.log(invalidGame);
  }
}
