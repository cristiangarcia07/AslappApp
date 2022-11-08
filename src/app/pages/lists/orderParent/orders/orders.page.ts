import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {  Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
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

  searchMap = ['fechaCrea', 'paciente.NOMBRE', 'paciente.TIPOID', 'paciente.NUMERO', 'numRef'];

  constructor(
    private afs: FirestoreService,
    private auth: AngularFireAuth,
    private spinner: SpinnerService,
    private al: AlertController,
    private rout: Router
  ) { }

  ngOnInit() {
    this.spinner.showLoader('Cargando Ordenes');
    setTimeout(() => {
      this.initUser();

      this.spinner.hideSpinner();
    }, 1000);
  }

  initUser() {
    this.auth.user.subscribe(
      (res) => {
        this.getallData(String(res?.uid));
      }
    );
  }

  getallData(uid: string) {
    this.afs.getAllDocWithParams('ordenes', 'created', uid).subscribe(res => {
      this.ordens = [];
      res.forEach((data: any): void => {
        this.ordens.push({
          id: data.payload.doc.id,
          ...data.payload.doc.data()
        });
      });

      this.ordens.forEach(ordn => ordn.createdDate = ordn.createdDate.toDate());
    });
  }

  async deleteOrden(uid: string) {
    let alert: any;
    const confirmAl = this.al.create({
      header: 'Eliminar Orden?',
      message: 'Desea Eliminar la orden?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: async () => {
            const cancelAl = this.al.create({
              message: 'Eliminacion de orden cancelada'
            });
            await (await cancelAl).present();
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.afs.deleteDoc('ordenes', String(uid)).then
              (async () => {
                alert = this.al.create({
                  message: 'Orden Eliminada con Exito',
                  header: 'Orden Eliminada'
                });
                await (await alert).present();
              })
              .catch(async () => {
                alert = this.al.create({
                  header: 'Error',
                  message: 'Error al eliminar la orden'
                });

                await (await alert).present();
              });
          }
        }
      ]
    });
    await (await confirmAl).present();
  }

  getOrderDetail(orden: any) {
    localStorage.setItem('orden', JSON.stringify(orden));
    this.rout.navigateByUrl('/user/orden');
  }
}
