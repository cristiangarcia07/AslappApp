import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { User } from 'src/app/base/models/generalModels';
import { FirestoreService } from 'src/app/base/services/firestore.service';
import { SpinnerService } from 'src/app/base/services/spinner.service';
import { MasterView } from 'src/app/base/views/masterView';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage  extends MasterView implements OnInit {
  idOrdn!: string;
  uidUser!: any;
  user!: User | any;
  rolUser!: string;
  examsList: any;
  exams: any;
  comision = 0;
  total = 0;
  uidOrd: any;
  observaciones: any;

  constructor(
    private auth: AngularFireAuth,
    private afs: FirestoreService,
    private spinner: SpinnerService,
    private actRout: ActivatedRoute,
    private al: AlertController
  ) {
    super(al);
  }

  ngOnInit() {
    this.spinner.showLoader('Cargando Examenes');
    if(this.actRout.snapshot.params.uid){
      setTimeout(() => {
        this.uidOrd = String(this.actRout.snapshot.params.uid);
        this.getCartData();
        this.spinner.hideSpinner();
      }, 1000);
    }else{
      setTimeout(() => {
        this.observaciones = '';
        this.initPage();
        this.getCartData();
        this.spinner.hideSpinner();
      }, 1000);
    }
  }

  initPage(){
    this.auth.currentUser.then(
      res=>{
        this.uidUser = res?.uid;
        this.afs.getDoc<User>('users',this.uidUser).subscribe(
          (resp)=>{
            this.user = resp;
            this.rolUser = String(resp?.rol);
          }
        );
      }
    );
  }

  totalCalculate(){
    if(this.exams){
      this.exams.map(
        exam => {
          this.total += (exam.item.PRECIO * exam.quantity);
        }
      );
    }
  }

  calculateComision(){
    if(localStorage.getItem('cart')){

      this.exams.map(
        exam => {
          this.comision += (exam.item.PRECIO * (exam.item.COMISION / 100)) * exam.quantity;
        }
      );
      console.log('COMISION->>>>>>> '+this.comision);
    }
  }

  getCartData(){
    if(localStorage.getItem('cart')){
      this.exams = JSON.parse(localStorage.getItem('cart'));
      this.totalCalculate();
      this.calculateComision();
    }else{
      localStorage.setItem('cart','[]');
    }
  }


  onChangeQual(i: any, type: any) {
    const dataCar = this.exams;
    let cantd = dataCar[i].quantity;

    if (type) {
      cantd = cantd + 1;
      dataCar[i].quantity = cantd;
      this.exams = dataCar;
      localStorage.removeItem('cart');
      localStorage.setItem('cart', JSON.stringify(dataCar));
    }
    else if (type === false && cantd >= 2) {
      cantd = cantd - 1;
      dataCar[i].quantity = cantd;
      this.exams = dataCar;
      localStorage.removeItem('cart');
      localStorage.setItem('cart', JSON.stringify(dataCar));
    }
    else if (type === false && cantd === 1) {
      dataCar.splice(i, 1);
      this.exams = dataCar;
      localStorage.removeItem('cart');
      localStorage.setItem('cart', JSON.stringify(dataCar));
    }
    this.totalCalculate();
    this.getCartData();
    this.calculateComision();
  }
}
