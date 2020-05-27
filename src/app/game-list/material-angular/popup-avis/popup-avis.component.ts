import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-popup-avis',
  templateUrl: './popup-avis.component.html',
  styleUrls: ['./popup-avis.component.scss']
})
export class PopupAvisComponent implements OnInit {

  description = new FormControl('',[Validators.required,Validators.minLength(5),Validators.maxLength(150)])

  constructor(public dialogRef: MatDialogRef<PopupAvisComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getErrorMessage(){
    if(this.description.hasError('required'))
      return "Veuillez saisir une valeur";
    if (this.description.hasError('minlength')) 
      return 'Veuillez saisir au moins 5 caractères'
    else
      return 'Veuillez saisir moins de 150 caractères'
  }

  onSaveData(){
    this.data=$("textarea").val();
  }


}
