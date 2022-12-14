import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute } from '@angular/router';
import { Platform, ToastController } from '@ionic/angular';
import { Ordens, User } from 'src/app/base/models/generalModels';
import { FirestoreService } from 'src/app/base/services/firestore.service';
import { SpinnerService } from 'src/app/base/services/spinner.service';
import { MasterView } from 'src/app/base/views/masterView';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Cell, Img, ITable, PdfMakeWrapper, Table, Txt } from 'pdfmake-wrapper';
import { Cart } from '../../../base/models/generalModels';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@ionic-native/file-opener';

PdfMakeWrapper.setFonts(pdfFonts);
type TableRow = [string,string,string];

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
  ordEdit: any;

  constructor(
    private auth: AngularFireAuth,
    private afs: FirestoreService,
    private spinner: SpinnerService,
    private al: ToastController,
    plt: Platform
  ) {
    super(plt);
  }

  ngOnInit() {
    this.spinner.showLoader('Cargando Examenes');
    if (localStorage.getItem('ordEdit')) {
      this.ordEdit = JSON.parse(localStorage.getItem('ordEdit'));
      this.initPage();
      this.getCartExams();
    } else {
      this.observaciones = '';
      this.initPage();
      this.getCartData();
    }
  }

  getCartExams() {
    this.exams = this.ordEdit.exams;
    this.totalCalculate();
    this.spinner.hideSpinner();
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
    this.spinner.hideSpinner();

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
      this.totalCalculate();
      this.calculateComision();

    }
    this.spinner.hideSpinner();

  }

  async genCotiza(){
    const cotAl = this.al.create({
      message: 'Quiere generar la Cotizacion?',
      color: 'primary',
      position: 'middle',
      buttons: [
        {
          text: 'Generar',
          handler: async () => {
            const pdf = new PdfMakeWrapper();
            const data = this.exams;
            pdf.header(
              await new Img('https://i.ibb.co/5kz6xZg/HEADER-1.png')
               .width(600)
              .build()
            );
            pdf.add(
              this.headerTable()
            );
            pdf.add(
                this.tableExams(data),
            );
            pdf.add(this.recommendPdf(data));
            pdf.pageMargins([50,150]);
            if (this.plt.is('android') || this.plt.is('ios')) {
              pdf.create().getBase64(async (data) => {
                const path = 'CotizationCart.pdf'

                const result = await Filesystem.writeFile({
                  path,
                  data,
                  directory: Directory.Documents
                });

                FileOpener.open(`${result.uri}`, 'application/pdf');
              })
            } else {
              pdf.create().open();
            }
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: async () => {
            const al = this.al.create({
              message: 'Cotizacion cancelada',
              position: 'middle',
              duration: 2000,
              color: 'danger'
            });
            await (await al).present();
          }
        }
      ]
    });
    await (await cotAl).present();
  }

  tableExams(data: Cart[]): ITable{
    return new Table([
      ['EXAMEN','AYUNO','PRECIO'],
      ...this.extractExams(data),
      ['','TOTAL:',this.formatPrice(this.total)]
    ])
    .layout('lightHorizontalLines').
    widths('*')
    .alignment('center')
    .dontBreakRows(true)
    .fontSize(10)
    .end;
  }

  extractExams(data: Cart[]): TableRow[] {
    return data.map(row=>[row.item.NOMBRE_OMS,row.item.AYUNO,this.formatPrice(Number(row.item.PRECIO))]);
  }


  recommendPdf(data: Cart[]): ITable{
    return new Table([
      [new Cell(new Txt('RECOMENDACIONES').bold().alignment('center').fontSize(13).end).colSpan(2).end,null],
      ['EXAMEN','PREPARACION'],
      ...this.extractRecomend(data),
    ])
    .pageBreak('before')
    .layout('lightHorizontalLines').
    widths('*')
    .dontBreakRows(true)
    .fontSize(10)
    .end;
  }

  headerTable(): ITable{
    return new Table([
      [new Date().toLocaleDateString(),'']
    ])
    .layout('noBorders').
    widths('auto')
    .end;
  }

  onChangeQual(i: any, type: any) {
    const dataCar = this.exams;
    let cantd = dataCar[i].quantity;

    if (type) {
      if (!localStorage.getItem('ordEdit')) {
        cantd = cantd + 1;
        dataCar[i].quantity = cantd;
        this.exams = dataCar;
        localStorage.removeItem('cart');
        localStorage.setItem('cart', JSON.stringify(dataCar));
      } else {
        cantd = cantd + 1;
        dataCar[i].quantity = cantd;
        this.exams = dataCar;
        this.ordEdit.exams = this.exams;
        localStorage.setItem('ordEdit', JSON.stringify(this.ordEdit));
        this.totalCalculate();
        this.getCartExams();
        this.calculateComision();
      }
    }
    else if (type === false && cantd >= 2) {
      if (!localStorage.getItem('ordEdit')) {
        cantd = cantd - 1;
        dataCar[i].quantity = cantd;
        this.exams = dataCar;
        localStorage.removeItem('cart');
        localStorage.setItem('cart', JSON.stringify(dataCar));
      } else {
        cantd = cantd - 1;
        dataCar[i].quantity = cantd;
        this.exams = dataCar;
        this.ordEdit.exams = this.exams;
        localStorage.setItem('ordEdit', JSON.stringify(this.ordEdit));
        this.totalCalculate();
        this.getCartExams();
        this.calculateComision();
      }
    }
    else if (type === false && cantd === 1) {
      if (!localStorage.getItem('ordEdit')) {
        dataCar.splice(i, 1);
        this.exams = dataCar;
        localStorage.removeItem('cart');
        localStorage.setItem('cart', JSON.stringify(dataCar));
        this.total = 0;
        this.totalCalculate();
        this.getCartData();
        this.calculateComision();
        return;
      }
      dataCar.splice(i, 1);
      this.exams = dataCar;
      this.ordEdit.exams = this.exams;
      localStorage.setItem('ordEdit', JSON.stringify(this.ordEdit));
      this.total = 0;
      this.totalCalculate();
      this.getCartExams();
      this.calculateComision();
    }
  }

  emptyCart(): void {
    localStorage.setItem('cart', '[]');
    this.getCartData();
    this.total = 0;
  }
}
