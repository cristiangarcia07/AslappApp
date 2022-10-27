import { Injectable, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  constructor(
    private spinnerCtrl: LoadingController
  ) { }

  showLoader(message: string) {
    this.spinnerCtrl.create({
      message,
      spinner: 'dots'
    }).then((res) => {
      res.present();
    });
  }

  hideSpinner() {
    this.spinnerCtrl.dismiss();
  }


}
