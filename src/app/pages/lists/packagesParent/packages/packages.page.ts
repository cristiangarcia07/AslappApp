
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AlertController, AlertInput, Platform, ToastController } from '@ionic/angular';
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
    private al: ToastController,
    private alert: AlertController,
    private rout: Router,
    plt: Platform
  ) {
    super(plt);
  }

  ngOnInit() {
    this.spinner.showLoader('Cargando Paquetes');
      this.initUser();
      this.getAllPackges();
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
      this.spinner.hideSpinner();


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
      this.spinner.hideSpinner();

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
            console.log('A??ADIDOS --->');
            console.log(this.paquete);
          } else {
            console.log('No a??adido');
          }
        });
      });
  }

  editPackage(exams: any, packageId: any) {
    this.filterExams(exams);
    localStorage.setItem('examsList', JSON.stringify(exams));
    localStorage.setItem('packageInfo', packageId);
    this.rout.navigateByUrl('user/package_edit');
  }

  viewDetails(exams: any) {
    this.filterExams(exams);
    localStorage.setItem('examsList', JSON.stringify(exams));
    this.rout.navigateByUrl('user/package_detail');
  }

  addPack(examns: any) {
    if (!localStorage.getItem('ordEdit')) {
      this.addPackage(examns);
      return;
    }
    this.editOrdn(examns);
  }

  async deletePackage(id: string){
    const alert = this.al.create({
      message: 'Quiere borrar el paquete?',
      position: 'middle',
      color: 'danger',
      header: 'Borrar paquete',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Borrar',
          handler: () => {
            this.afs.deleteDoc('packages',id).then(
              async ()=>{
                const delAlert = this.al.create({
                  message: 'Paquete Borrado con Exito',
                  position: 'middle',
                  duration: 1500,
                  color: 'success'
                });
                await (await delAlert).present();
              }
            ).catch((err) => {
            });
          }
        }
      ]
    });

    await (await alert).present();
  }

  async createPackage() {
    const al = this.alert.create({
      inputs: [
        {
          name: 'packageName',
          type: 'text',
          max: 50,
          placeholder: 'Ingresa un nombre',
        }
      ],
      header: 'Crear Paquete',
      buttons: [
        {
          text: 'Crear Paquete',
          handler: (input) => {
            this.afs.createDocFrist({
              nombre: input.packageName,
              created: this.userId,
              exams: []
            }, 'packages').then(
              async (res) => {
                console.log(res);
                const confAl = this.al.create({
                  message: 'Paquete creado con exito',
                  color: 'success',
                  duration: 1500,
                  position: 'middle'
                });

                await (await confAl).present();
              }
            ).catch(async (_err) => {
              const confAl = this.al.create({
                message: 'Error al crear el paquete',
                color: 'danger',
                position: 'middle',
                duration: 1500
              });

              await (await confAl).present();
            });
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    await (await al).present();
  }


  private async editOrdn(data: any) {

    this.filterExams(data);

    this.paquete.map(async (pac) => {
      let dataCart = JSON.parse(localStorage.getItem('ordEdit'));
      dataCart = dataCart.exams;

      const item = {
        item: pac,
        quantity: 1
      };

      const cart = JSON.parse(dataCart);
      cart.push(item);
      localStorage.setItem('ordEdit', JSON.stringify(cart));
      const packAl = this.al.create({
        message: 'Paquete a??adido al carrito',
        color: 'success',
        duration: 2000,
        position: 'middle',
        buttons: [
          {
            text: 'cerrar',
            role: 'cancel'
          }
        ]
      });
      await (await packAl).present();

    });

  }

  private async addPackage(examens: any){
    this.filterExams(examens);

    this.paquete.map(async (pac) => {
      const dataCart = localStorage.getItem('cart');

      const item = {
        item: pac,
        quantity: 1
      };

      const cart = JSON.parse(dataCart);
      cart.push(item);
      localStorage.setItem('cart', JSON.stringify(cart));
      const packAl = this.al.create({
        message: 'Paquete a??adido al carrito',
        color: 'success',
        duration: 2000,
        position: 'middle',
        buttons: [
          {
            text: 'cerrar',
            role: 'cancel'
          }
        ]
      });
      await (await packAl).present();

    });

  }
}
