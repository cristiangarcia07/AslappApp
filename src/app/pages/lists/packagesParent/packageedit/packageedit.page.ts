import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { FirestoreService } from 'src/app/base/services/firestore.service';

@Component({
  selector: 'app-packageedit',
  templateUrl: './packageedit.page.html',
  styleUrls: ['./packageedit.page.scss'],
})
export class PackageeditPage implements OnInit {

  exams = [];

  constructor(
    private auth: AngularFireAuth,
    private al: ToastController,
    private afs: FirestoreService,
    private rout: Router
  ) {
  }

  ngOnInit() {
    this.initUser();
  }

  async edit() {
    const al = this.al.create({
      message: 'Quiere editar este paquete?',
      color: 'primary',
      position: 'middle',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Editar',
          handler: async () => {
            const ale = this.al.create({
              message: 'Paquete editado exitosamente',
              duration: 1500,
              color: 'success',
              position: 'middle'
            });
            const packageInfo = localStorage.getItem('packageInfo');
            this.afs.updateDoc('packages', packageInfo, {
              exams: this.exams
            });
            await (await ale).present();
            this.rout.navigateByUrl('user/packages');
          }
        }
      ]
    });
    await (await al).present();
  }

  async deleteExam(index: number) {
    const al = this.al.create({
      message: 'Estas seguro de borrar este examen?',
      color: 'danger',
      position: 'middle',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Borrar',
          handler: async () => {
            const aler = this.al.create({
              message: 'Examen eliminado con exito',
              duration: 1500,
              color: 'danger',
              position: 'middle'
            });
            this.exams.splice(index, 1);
            console.log(this.exams);
            await (await aler).present();
          }
        }
      ]
    });
    await (await al).present();
  }

  initUser() {
    this.auth.currentUser.then(
      res => {
        this.getPackageDetail();
      }
    );
  }

  async getPackageDetail() {
    const al = this.al.create({
      message: 'Desliza hacia la derecha para borrar paquetes',
      duration: 1800,
      color: 'primary',
      position: 'middle'
    });
    this.exams = JSON.parse(localStorage.getItem('examsList'));

    await (await al).present();
  }

}
