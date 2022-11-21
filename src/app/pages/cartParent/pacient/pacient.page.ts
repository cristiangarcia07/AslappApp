/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
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
  ordEdit: any;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AngularFireAuth,
    private afs: FirestoreService,
    private toast: ToastController,
    private rout: Router
  ) {

  }

  ngOnInit() {
    this.initPage();
    this.initForm();

  }

  async getEditExams() {
    const al = this.toast.create({
      message: 'Orden editada correctamente',
      color: 'primary',
      position: 'middle',
      duration: 1500
    });

    this.afs.updateDoc('ordenes', this.ordEdit.id, {
      paciente: this.form.value,
      exams: this.ordEdit.exams,
      observaciones: this.observaciones,
      total: this.total
    });

    await (await al).present();
    localStorage.removeItem('ordEdit');
    this.rout.navigateByUrl('user/ordens');
  }

  cancelEdit() {
    localStorage.removeItem('ordEdit');
    document.location.reload();
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
            if (localStorage.getItem('ordEdit')) {
              this.ordEdit = JSON.parse(localStorage.getItem('ordEdit'));
              this.initPacientForm();
            } else {
              this.user = resp;
              this.getCartData();
            }
          }
        );
      }
    );
  }

  initPacientForm() {
    this.form = this.formBuilder.group({
      NOMBRE: [this.ordEdit.paciente.NOMBRE, Validators.required],
      TIPOID: [this.ordEdit.paciente.TIPOID],
      NUMERO: [this.ordEdit.paciente.NUMERO],
      CORREO: [this.ordEdit.paciente.CORREO, Validators.required],
      DIRECCION: [this.ordEdit.paciente.DIRECCION],
      TELEFONO: [this.ordEdit.paciente.TELEFONO, Validators.required],
      GENERO: [this.ordEdit.paciente.GENERO, Validators.required],
      EDAD: this.calculateAge(this.ordEdit.paciente.FECHANAM),
      FECHANAM: [this.ordEdit.paciente.FECHANAM, Validators.required]
    });
    this.observaciones = this.ordEdit.observaciones;
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

  totalCalculate(){
    if(this.exams){
      let total = 0;

      this.exams.map(
        exam => {
          total += exam.item.PRECIO * exam.quantity;
          this.total = total;
        }
      );
    }

  }

  async createOrder() {
    const ordn = 'ORDN-' + this.refOrde();
    this.idOrdn = ordn;
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
            this.totalCalculate();
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
