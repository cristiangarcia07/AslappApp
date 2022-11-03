
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { messageType, Users } from 'src/app/base/models/generalModels';
import { FirestoreService } from 'src/app/base/services/firestore.service';
import { SpinnerService } from 'src/app/base/services/spinner.service';
import { MasterView } from 'src/app/base/views/masterView';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.page.html',
  styleUrls: ['./packages.page.scss'],
})
export class PackagesPage extends MasterView implements OnInit {
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

  searchText;
  searchText2;
  searchMap = ['EXAMEN', 'SINONIMO', 'CUPS'];

  constructor(
    private afs: FirestoreService,
    private auth: AngularFireAuth,
    private spinner: SpinnerService,
    private al: AlertController,
    private rout: Router
  ) {
    super(al);
  }

  ngOnInit() {
    this.spinner.showLoader('Cargando Paquetes');
    setTimeout(() => {
      this.initUser();
      this.getAllPackges();
      this.spinner.hideSpinner();
    }, 1000);
  }

  getAllPackges() {
    this.afs.getAllDoc('pkgAdmin').subscribe(res => {
      this.packages = [];
      res.forEach((data: any) => {
        this.packages.push({
          id: data.payload.doc.id,
          ...data.payload.doc.data()
        });
      });
    });
  }

  initUser() {
    this.auth.currentUser.then(
      (res) => {
        localStorage.setItem('id', String(res?.uid));
        this.userId = String(res?.uid);

        this.getAllPaquetes(String(res?.uid));
        this.afs.getDoc<Users>('users', String(res?.uid)).subscribe(
          (resp) => {
            this.getAllExams(String(resp?.convenio));
          }
        );
      }
    );

  }

  getAllPaquetes(uid: string) {
    this.afs.getAllDocWithParams('packages', 'created', uid).subscribe(res => {
      this.paquetes = [];
      res.forEach((data: any): void => {
        this.paquetes.push({
          id: data.payload.doc.id,
          ...data.payload.doc.data()
        });
      });

    });

  }

  getAllExams(convenio: string) {
    if (convenio === 'undefined' || !convenio) {
      this.afs.getAllDoc('Exams_DB').subscribe(res => {
        this.exams = [];
        res.forEach((data: any) => {
          this.exams.push({
            id: data.payload.doc.id,
            ...data.payload.doc.data()
          });
        });
      });

    } else {
      this.afs.getAllDoc('exams-' + convenio).subscribe(res => {
        this.exams = [];
        res.forEach((data: any) => {
          this.exams.push({
            id: data.payload.doc.id,
            ...data.payload.doc.data()
          });
        });
      });
    }

  }

  filterExams(examens: Array<any>) {
    this.paquete = [];
    examens.filter(
      (res) => {
        console.log(res.id);
        this.exams.map(i => {
          if (String(res.id) === String(i.id)) {
            this.paquete.push(i);
            console.log('AÑADIDOS --->');
            console.log(this.paquete);
          } else {
            console.log('No añadido');
          }
        });
      });
  }

  viewDetails(exams: any) {
    this.filterExams(exams);
    localStorage.setItem('examsList', JSON.stringify(exams));
    this.rout.navigateByUrl('user/package_detail');
  }


  addPackage(examens: any){
    this.filterExams(examens);

    this.paquete.map(pac => {
      const dataCart = localStorage.getItem('cart');

      const item = {
        item: pac,
        quantity: 1
      };

      const cart = JSON.parse(dataCart);
      cart.push(item);
      localStorage.setItem('cart', JSON.stringify(cart));
    });

  }

}
