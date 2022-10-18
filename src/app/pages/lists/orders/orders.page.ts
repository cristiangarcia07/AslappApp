/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from 'src/app/base/models/generalModels';
import { FirestoreService } from 'src/app/base/services/firestore.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  ordens!: any;

  searchText;

  searchMap = ['fechaCrea','paciente.NOMBRE','paciente.TIPOID','paciente.NUMERO','numRef'];

  constructor(
    private _afs: FirestoreService,
    private _auth: AngularFireAuth,

  ) { }

  ngOnInit() {
    this.initUser();
  }
  initUser(){
    this._auth.user.subscribe(
      (res)=>{
        this.getallData(String(res?.uid));
      }
    );
  }

  getallData(uid: string){
    this._afs.getAllDocWithParams('ordenes','created',uid).subscribe(res=>{
      this.ordens = [];
      res.forEach((data: any): void => {
        this.ordens.push({
          id:data.payload.doc.id,
          ...data.payload.doc.data()
        });
      });

      this.ordens.forEach(ordn => ordn.createdDate = ordn.createdDate.toDate());
      console.log(this.ordens);
  });}

}
