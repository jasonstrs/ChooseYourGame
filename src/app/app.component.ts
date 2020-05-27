import { Component } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(){
    var firebaseConfig = {
      apiKey: "YOUR_API_KEY_FIREBASE",
      authDomain: "AUTH_DOMAIN",
      databaseURL: "DATABASE_URL",
      projectId: "PROJECT_ID",
      storageBucket: "STORAGE_BUCKET",
      messagingSenderId: "MESSAGING_SENDER",
      appId: "API_ID"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }
}
