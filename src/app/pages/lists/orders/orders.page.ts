import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirestoreService } from 'src/app/base/services/firestore.service';
import { SpinnerService } from 'src/app/base/services/spinner.service';

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
    private afs: FirestoreService,
    private auth: AngularFireAuth,
    private spinner: SpinnerService
  ) { }

  ngOnInit() {
    this.spinner.showLoader('Cargando Ordenes');
    setTimeout(() => {
      this.initUser();

      this.spinner.hideSpinner();
    }, 1000);
  }

  initUser(){
    this.auth.user.subscribe(
      (res)=>{
        this.getallData(String(res?.uid));
      }
    );
  }

  getallData(uid: string){
    this.afs.getAllDocWithParams('ordenes','created',uid).subscribe(res=>{
      this.ordens = [];
      res.forEach((data: any): void => {
        this.ordens.push({
          id:data.payload.doc.id,
          ...data.payload.doc.data()
        });
      });

      this.ordens.forEach(ordn => ordn.createdDate = ordn.createdDate.toDate());
  });}

}
