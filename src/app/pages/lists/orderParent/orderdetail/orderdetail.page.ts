import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-orderdetail',
  templateUrl: './orderdetail.page.html',
  styleUrls: ['./orderdetail.page.scss'],
})
export class OrderdetailPage implements OnInit {
  orderDetail: any;

  constructor(
    private auth: AngularFireAuth
  ) { }

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
  }

}
