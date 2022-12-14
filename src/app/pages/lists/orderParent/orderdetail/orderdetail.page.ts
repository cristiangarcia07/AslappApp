import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Platform, ToastController } from '@ionic/angular';
import { MasterView } from 'src/app/base/views/masterView';

@Component({
  selector: 'app-orderdetail',
  templateUrl: './orderdetail.page.html',
  styleUrls: ['./orderdetail.page.scss'],
})
export class OrderdetailPage extends MasterView implements OnInit {
  orderDetail: any;
  pdfObject: any;

  constructor(
    private auth: AngularFireAuth,
    private al: ToastController,
    public ptl: Platform,
  ) {
    super(ptl);
  }

  ngOnInit() {
    this.initAll();
  }

  initAll() {
    this.auth.user.subscribe(
      () => {
        this.getOrder();
      }
    );
  }

  getOrder() {
    this.orderDetail = JSON.parse(localStorage.getItem('orden'));
    console.log(this.orderDetail);
  }

}
