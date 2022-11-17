import { Injectable, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  spinner: any;
  constructor(
    private spinnerCtrl: LoadingController
  ) { }

  async showLoader(message: string) {
    this.spinner = this.spinnerCtrl.create({
      message,
      spinner: 'dots'
    });

    await (await this.spinner).present();
  }

  async hideSpinner() {
    await (await this.spinner).dismiss();
  }


}
