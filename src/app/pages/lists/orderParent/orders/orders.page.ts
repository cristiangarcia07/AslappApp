import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {  Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Ordens } from 'src/app/base/models/generalModels';
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
    private al: ToastController,
    private rout: Router
  ) { }

  ngOnInit() {
    this.spinner.showLoader('Cargando Ordenes');
      this.initUser();

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
      this.spinner.hideSpinner();
    });
  }

  async completeOrder(uid: string) {
    const al = this.al.create({
      message: 'Quiere completar la orden?(No podra editarla ni eliminarla)',
      color: 'warning',
      position: 'middle',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Completar',
          handler: async () => {
            const aler = this.al.create({
              message: 'Orden completada exitosamente',
              color: 'success',
              position: 'middle',
              duration: 1500
            });

            this.afs.updateDoc('ordenes', uid, {
              estado: 'completado'
            });

            await (await aler).present();
          }
        }
      ]
    });

    await (await al).present();
  }

  ordEdit(ord: Ordens) {
    localStorage.setItem('ordEdit', JSON.stringify(ord));
    this.rout.navigateByUrl('/user/cart');
  }

  async deleteOrden(uid: string) {
    let alert: any;
    const confirmAl = this.al.create({
      message: 'Desea Eliminar la orden?',
      color: 'danger',
      position: 'middle',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.afs.deleteDoc('ordenes', String(uid)).then
              (async () => {
                alert = this.al.create({
                  message: 'Orden Eliminada con Exito',
                  position: 'middle',
                  color: 'success'
                });
                await (await alert).present();
              })
              .catch(async () => {
                alert = this.al.create({
                  message: 'Error al eliminar la orden',
                  color: 'danger',
                  position: 'middle'
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
