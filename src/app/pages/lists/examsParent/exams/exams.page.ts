import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { User } from 'src/app/base/models/generalModels';
import { FirestoreService } from 'src/app/base/services/firestore.service';
import { SpinnerService } from 'src/app/base/services/spinner.service';
import { MasterView } from 'src/app/base/views/masterView';


@Component({
  selector: 'app-exams',
  templateUrl: './exams.page.html',
  styleUrls: ['./exams.page.scss'],
})
export class ExamsPage extends MasterView implements OnInit {

  detailModal = false;
  exams: any[] = [];
  id = '';
  exam: any;
  searchText;

  searchMap = ['EXAMEN', 'CUP'];
  cloner = [];

  paquetes: any;

  paqSel: any;

  paquete: any;


  constructor(
    private afs: FirestoreService,
    private auth: AngularFireAuth,
    private spinner: SpinnerService,
    private al: ToastController,
    private als: AlertController,
    private rout: Router
  ) {
    super();
  }

  ngOnInit() {
    this.spinner.showLoader('Cargando Examenes');
    this.initAll();
    setTimeout(() => {
      this.spinner.hideSpinner();
    }, 1500);
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


  initAll() {
    this.auth.user.subscribe(
      (res) => {
        this.afs.getDoc<User>('users', String(res?.uid)).subscribe(
          (resp) => {
            this.getallExam(String(resp.convenio));
            this.getAllPaquetes(res.uid);
          }
        );
      }
    );
  }

  getallExam(convenio: string) {

    if (convenio === 'undefined' || !convenio) {

      this.afs.getAllDoc('Exams_DB').subscribe(res => {
        this.exams = [];
        res.forEach((data: any) => {
          this.exams.push({
            id: data.payload.doc.id,
            ...data.payload.doc.data()
          });
        });
        this.cloner.push(this.exams);
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

        this.cloner.push(this.exams);
      });
    }

  }

  getExamData(exam: any) {
    localStorage.setItem('exam', JSON.stringify(exam));
    this.rout.navigateByUrl('/user/exam');
  }



  async addExam(data: any) {
    const packList = [];
    if (!this.paquetes.length) {
      this.addingExam(data);

    } else {
      this.paquetes.map(pac => {
        packList.push({
          type: 'radio',
          label: pac.nombre,
          value: pac.id,
          handler: (datas) => {
            this.paqSel = datas;
          }
        });
      });

      packList.push({
        type: 'radio',
        label: 'carrito',
        value: 'cart',
      });

      const alertIn = this.als.create({
        header: 'Donde quieres agregar el carrito',
        inputs: packList,
        buttons: [
          {
            text: 'cancelar',
            role: 'cancel'
          },
          {
            text: 'Subir',
            handler: async (sel) => {
              console.log(sel);
              if (sel === 'cart') {
                this.addingExam(data);
              } else {
                const paqueteSelecci = this.paquetes.filter(p => p.id === sel);
                paqueteSelecci[0].exams.push(data);
                this.afs.updateDoc('packages', sel, {
                  exams: paqueteSelecci[0].exams
                }).then(async (res) => {
                  const l = this.al.create({
                    message: 'Examen añadido al paquete exitosamente',
                    position: 'top',
                    color: 'success',
                    duration: 1500
                  });
                  await (await l).present();
                }).catch(async (err) => {
                  const l = this.al.create({
                    message: 'Hubo un error',
                    position: 'middle',
                    duration: 1500,
                    color: 'danger'
                  });

                  await (await l).present();
                });
              }
            }
          }
        ]
      });

      await (await alertIn).present();
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

  private async addingExam(data: any) {
    const alert = this.al.create({
      message: 'Examen añadido al carrito',
      color: 'success',
      position: 'top',
      duration: 2000,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        }
      ]
    });

    const dataCart = localStorage.getItem('cart');

    const item = {
      item: data,
      quantity: 1
    };

    if (dataCart !== null) {

      const cart = JSON.parse(dataCart);
      cart.push(item);
      localStorage.setItem('cart', JSON.stringify(cart));

      await (await alert).present();


    } else {
      const cart = [];
      cart.push(item);
      localStorage.setItem('cart', JSON.stringify(cart));
      await (await alert).present();
    }
  }

}
