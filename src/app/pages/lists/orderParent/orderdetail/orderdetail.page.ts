import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FileOriginal } from '@ionic-native/file';
import { FileOpenerOriginal } from '@ionic-native/file-opener';
import { Platform, ToastController } from '@ionic/angular';
import { MasterView } from 'src/app/base/views/masterView';
import pdfMake from 'pdfmake';

@Component({
  selector: 'app-orderdetail',
  templateUrl: './orderdetail.page.html',
  styleUrls: ['./orderdetail.page.scss'],
})
export class OrderdetailPage extends MasterView implements OnInit {
  orderDetail: any;
  pdfObject: any;

  constructor(
    private auth: AngularFireAuth,
    private al: ToastController,
    public ptl: Platform,
  ) {
    super(ptl);
  }

  ngOnInit() {
    this.initAll();
  }

  initAll() {
    this.auth.user.subscribe(
      () => {
        this.getOrder();
      }
    );
  }

  // createPdf(ord: any) {
  //   const header = {
  //     image: 'headerImg',
  //     width: 600
  //   };

  //   const headerTable = [
  //     {
  //       text: 'Orden: ', style: 'headerTabl',
  //     },
  //     {
  //       text: ord.numRef
  //     },
  //     {
  //       text: 'Fecha de Creacion', style: 'headerTabl'
  //     },
  //     {
  //       text: ord.fechaCrea
  //     }
  //   ];

  //   const table = {
  //     layout: 'lightHorizontalLines',
  //     table: {
  //       headerRows: 1,
  //       widths: [600, 600, 200, 200],
  //       dontBreakRows: true,
  //       fontSize: 10,
  //       alignnment: 'center',
  //       body: [
  //         ['EXAMEN', 'AYUNO', 'PRECIO'],
  //         // ord.exams.map((exam: any) => [exam.item.NOMBRE_OMS, exam.item.AYUNO, this.formatPrice(Number(exam.item.PRECIO))]),
  //         ['', 'TOTAL', this.formatPrice(ord.total)]
  //       ]
  //     }
  //   };

  //   const test = {
  //     layout: 'lightHorizontalLines', // optional
  //     table: {
  //       // headers are automatically repeated if the table spans over multiple pages
  //       // you can declare how many rows should be treated as headers
  //       headerRows: 1,
  //       widths: [ 'auto', 'auto', 'auto', 'auto' ],

  //       body: [
  //         [ 'First', 'Second', 'Third', 'The last one' ],
  //         [ 'Value 1', 'Value 2', 'Value 3', 'Value 4' ],
  //         [ { text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4' ]
  //       ]
  //     }
  //   };

  //   const recommendedTable = {
  //     layout: 'lightHorizontalLines',
  //     table: {
  //       header: ['RECOMENDACIONES'],
  //       headerRows: 1,
  //       widths: ['auto'],
  //       alignment: 'center',
  //       body: [
  //         ['EXAMEN', 'PREPARACION'],
  //         ord.exams.map((exam: any) => [exam.item.EXAMEN, exam.item.PREPARACION]),
  //         ['OBSERVACIONES', ord.observaciones]
  //       ]
  //     }
  //   };

  //   const docStructure = {
  //     header,
  //     content: [
  //       headerTable,
  //       table
  //     ],
  //     images: {
  //       headerImg: 'https://i.ibb.co/5kz6xZg/HEADER-1.png'
  //     }
  //   };

  //   this.pdfObject = pdfMake.createPdf(docStructure);

  //   if (this.ptl.is('capacitor')) {
  //     console.log('Funciona :D');
  //   } else {
  //     this.pdfObject.download(`${ord.numRef}.pdf`);
  //   }
  // }

  getOrder() {
    this.orderDetail = JSON.parse(localStorage.getItem('orden'));
    console.log(this.orderDetail);
  }

}
