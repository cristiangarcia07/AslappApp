/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { User } from 'src/app/base/models/generalModels';
import { FirestoreService } from 'src/app/base/services/firestore.service';


@Component({
  selector: 'app-pacient',
  templateUrl: './pacient.page.html',
  styleUrls: ['./pacient.page.scss'],
})
export class PacientPage implements OnInit {
  form: FormGroup;
  age = 0;
  fechaNam;
  uidUser!: any;
  uidOrd = '';
  user!: User | any;
  total = 0;
  comision = 0;
  observaciones = '';
  filterDoc = 'number';
  pagoRef = '';
  idOrdn: any;
  exams = [];

  constructor(
    private formBuilder: FormBuilder,
    private auth: AngularFireAuth,
    private afs: FirestoreService,
    private toast: ToastController,
    private rout: Router,
  ) {

  }

  ngOnInit() {
    this.initForm();
    this.initPage();
  }

  getCartData(){
    if(!localStorage.getItem('cart')){
      localStorage.setItem('cart','[]');
      return ;
    }
    this.exams = JSON.parse(localStorage.getItem('cart'));
  }

  initPage(){
    this.auth.currentUser.then(
      res=>{
        this.uidUser = res?.uid;
        this.afs.getDoc<User>('users',this.uidUser).subscribe(
          (resp)=>{
            this.user = resp;
            this.getCartData();
          }
        );
      }
    );
  }

  initForm() {
    this.form = this.formBuilder.group({
      NOMBRE: ['', Validators.required],
      TIPOID: [''],
      NUMERO: [''],
      CORREO: ['', Validators.required],
      DIRECCION: [''],
      TELEFONO: ['', Validators.required],
      GENERO: ['', Validators.required],
      EDAD: this.age,
      FECHANAM: [this.fechaNam, Validators.required],
    });
  }

  async createOrder() {
    const ordn = 'ORDN-' + this.refOrde();
    this.idOrdn = ordn;
    console.log(ordn);
    console.log(this.idOrdn);

    const ordAl = this.toast.create({
      header: 'Crear Orden',
      message: 'Quiere crear la orden?',
      color: 'primary',
      position: 'middle',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: async () => {
            const cancel = this.toast.create({
              color: 'danger',
              message: 'La creacion de la orden se ha cancelado',
              duration: 1500
            });

            await (await cancel).present();
          }
        },
        {
          text: 'Crear',
          handler: () => {
            this.afs.createDocFrist({
              paciente: this.form.value,
              exams: this.exams,
              estado: 'pendiente',
              doctor: this.user,
              created: this.uidUser,
              fechaCrea: new Date().toLocaleDateString(),
              createdDate: new Date(),
              total: this.total,
              numRef: ordn,
              comision: this.comision,
              linkvital: '',
              pagoRef: '',
              adjunto: '',
              observaciones: this.observaciones,
            }, 'ordenes').then(
              async () => {
                localStorage.setItem('cart', '[]');
                console.log('id--->' + this.idOrdn);
                const alert = this.toast.create({
                  message: 'La orden fue creada exitosamente',
                  position: 'top',
                  color: 'success',
                  duration: 1500
                });
                await (await alert).present();
                document.location.reload();
              }
            );
          }
        }
      ]
    });

    await (await ordAl).present();
  }

  calculateAge(data: any) {
    const today = new Date();
    const birthDate = new Date(data);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    this.age = age;
    this.fechaNam = birthDate.toLocaleDateString();
    console.log(this.fechaNam);
    console.log(this.age);

    this.form.patchValue({ edad: this.age });

  }

  refOrde() {
    const data = new Date();
    console.log(String(data));
    const ref = String(data.getFullYear()) + String(data.getDate())
      + String(data.getMonth()) + String(data.getHours() +
        String(data.getSeconds()) + String(data.getMinutes())
      );

    return String(ref);
  }

}
