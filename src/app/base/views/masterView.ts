import { AlertController, ToastController } from '@ionic/angular';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Cell, Img, ITable, PdfMakeWrapper, Table, Txt } from 'pdfmake-wrapper';
import { Cart } from '../models/generalModels';


PdfMakeWrapper.setFonts(pdfFonts);
type TableRow = [string,string,string];
type Row = [string,string];

export class MasterView {
  pdfObject: any;
  constructor(
  ) { }


  formatPrice(data: number) {
    const price = new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0
    });

    return price.format(data);
  }

  async generatePdf(orden: any){
    const pdf = new PdfMakeWrapper();

    pdf.header(
      await new Img('https://i.ibb.co/5kz6xZg/HEADER-1.png')
      .width(600)
      .build()

    );


    pdf.add(
      this.headerTable(orden)
    );

    pdf.add(
      this.createTable(orden.exams,orden)
    );

    pdf.add(
      this.tableRecomend(orden.exams,orden)
    );

    pdf.pageMargins([50,150]);


    pdf.create().download();

  }

  createTable(data: Cart[],orden: any): ITable{
    return new Table([
      ['EXAMEN','AYUNO','PRECIO'],
      ...this.extractData(data),
      ['','TOTAL:',this.formatPrice(orden.total)]
    ])
    .layout('lightHorizontalLines').
    widths('*')
    .alignment('center')
    .dontBreakRows(true)
    .fontSize(10)
    .end;
  }

  tableRecomend(data: Cart[],orden: any): ITable{
    return new Table([
      [new Cell(new Txt('RECOMENDACIONES').bold().alignment('center').fontSize(13).end).colSpan(2).end,null],
      ['EXAMEN','PREPARACION'],
      ...this.extractRecomend(data),
      ['OBSERVACIONES:',orden.observaciones]
    ])
    .pageBreak('before')
    .layout('lightHorizontalLines').
    widths('*')
    .dontBreakRows(true)
    .fontSize(10)
    .end;
  }

  extractData(data: Cart[]): TableRow[] {
    return data.map(row=>[row.item.NOMBRE_OMS,row.item.AYUNO,this.formatPrice(Number(row.item.PRECIO))]);
  }

  extractRecomend(data: Cart[]): Row[] {
    return data.map(row=>[row.item.EXAMEN,row.item.PREPARACION]);
  }

  headerTable(orden: any): ITable{
    return new Table([
      [orden.numRef,''],
      [orden.fechaCrea,''],
    ])
    .layout('noBorders').
    widths('auto')
    .end;
  }
}
