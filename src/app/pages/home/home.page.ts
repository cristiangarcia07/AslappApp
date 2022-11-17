import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/base/services/firestore.service';
import { SpinnerService } from 'src/app/base/services/spinner.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  ordens: any[] = [];
  orden: any;
  uid!: string;
  canceladas!: any;
  pendiente!: any;
  exam!: any;


  constructor(
    private auth: AngularFireAuth,
    private afs: FirestoreService,
    private spinner: SpinnerService,
    private rout: Router
  ) {
   }

  ngOnInit(): void {
    this.spinner.showLoader('Cargando Ordenes');
    this.initPage();
    this.spinner.hideSpinner();

  }

  initPage(){
    this.auth.user.subscribe(
      res=>{
        this.uid = String(res?.uid);
        this.getAllOrdens(String(res?.uid));
      }
    );
  }

  getAllOrdens(uid: string){
    this.afs.getAllDocWithParams('ordenes','created',uid).subscribe(res=>{
      this.ordens = [];
      res.forEach((data: any) => {
        this.ordens.push({
          id:data.payload.doc.id,
          ...data.payload.doc.data()
        });
      });

    this.canceladas = this.ordens.filter((resp)=>resp.estado?.includes('cancelado')).length;

    this.pendiente = this.ordens.filter((resp)=>resp.estado?.includes('pendiente')).length;
    });
  }

  orderDetail(orden: any) {
    localStorage.setItem('orden', JSON.stringify(orden));
    this.rout.navigateByUrl('/user/orden');
  }


}
