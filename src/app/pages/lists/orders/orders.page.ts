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

  searchText!: any;

  searchMap = ['fechaCrea','paciente.NOMBRE','paciente.TIPOID','paciente.NUMERO','numRef'];

  constructor(
    private _afs: FirestoreService,
    private _auth: AngularFireAuth,

  ) { }

  ngOnInit() {
    this.initAll();
  }

  initAll() {
    this._auth.user.subscribe(
      (res) => {
        this._afs.getDoc<User>('users', String(res?.uid)).subscribe(
          // eslint-disable-next-line @typescript-eslint/no-shadow
          (res) => {
            this.getallData(String(res?.uid));
          }
        );
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

      this.ordens.forEach(ordn=> ordn.createdDate = ordn.createdDate.toDate());
  });}

}
