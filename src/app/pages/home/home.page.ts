import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirestoreService } from 'src/app/base/services/firestore.service';

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
    private _auth: AngularFireAuth,
    private _afs: FirestoreService,
  ) {
   }

  ngOnInit(): void {
    this.initPage();
  }

  initPage(){
    this._auth.user.subscribe(
      res=>{
        this.uid = String(res?.uid);
        this.getAllOrdens(String(res?.uid));
      }
    );
  }

  getAllOrdens(uid: string){
    this._afs.getAllDocWithParams('ordenes','created',uid).subscribe(res=>{
      this.ordens = [];
      res.forEach((data: any) => {
        this.ordens.push({
          id:data.payload.doc.id,
          ...data.payload.doc.data()
        });
      });

    this.canceladas = this.ordens.filter((res)=>res.estado?.includes('cancelado')).length;

    this.pendiente = this.ordens.filter((res)=>res.estado?.includes('pendiente')).length;
    });
  }

}
