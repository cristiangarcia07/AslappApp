/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Users } from 'src/app/base/models/generalModels';
import { FirestoreService } from 'src/app/base/services/firestore.service';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.page.html',
  styleUrls: ['./packages.page.scss'],
})
export class PackagesPage implements OnInit {
  paquete: any[] = [];
  idPackage!: string;

  exams: any[] = [];
  examsFilter: any[] = [];
  paquetes: any[] = [];
  filterPaquetes: any;

  packages: any[] = [];
  filterPackages: any;

  userId!: string;
  conventionId!: string;

  searchText: any;

  constructor(
    private _afs: FirestoreService,
    private _auth: AngularFireAuth,
  ) { }

  ngOnInit() {
    this.initUser();
    this.getAllPackges();
  }

  getAllPackges(){
    this._afs.getAllDoc('pkgAdmin').subscribe(res=>{
      this.packages = [];
      res.forEach((data: any) => {
        this.packages.push({
          id:data.payload.doc.id,
          ...data.payload.doc.data()
        });
      });
    });
  }

  initUser(){
    this._auth.currentUser.then(
      (res)=>{
        localStorage.setItem('id',String(res?.uid));
        this.userId = String(res?.uid);

        this.getAllPaquetes(String(res?.uid));
        this._afs.getDoc<Users>('users',String(res?.uid)).subscribe(
          (res)=>{
            this.getAllExams(String(res?.convenio));
          }
        );
      }
    );

  }

  getAllPaquetes(uid: string){
    this._afs.getAllDocWithParams('packages','created',uid).subscribe(res=>{
      this.paquetes = [];
      res.forEach((data: any): void => {
        this.paquetes.push({
          id:data.payload.doc.id,
          ...data.payload.doc.data()
        });
      });

    });

  }

  getAllExams(convenio: string){
    if(convenio === 'undefined' || !convenio){
      this._afs.getAllDoc('Exams_DB').subscribe(res=>{
        this.exams = [];
        res.forEach((data: any) => {
          this.exams.push({
            id:data.payload.doc.id,
            ...data.payload.doc.data()
          });
        });
      });

    }else{
      this._afs.getAllDoc('exams-'+convenio).subscribe(res=>{
        this.exams = [];
        res.forEach((data: any) => {
          this.exams.push({
            id:data.payload.doc.id,
            ...data.payload.doc.data()
          });
        });
      });
    }

  }

}
