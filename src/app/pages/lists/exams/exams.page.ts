/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User,ExamenModel } from 'src/app/base/models/generalModels';
import { FirestoreService } from 'src/app/base/services/firestore.service';
import { SpinnerService } from 'src/app/base/services/spinner.service';


@Component({
  selector: 'app-exams',
  templateUrl: './exams.page.html',
  styleUrls: ['./exams.page.scss'],
})
export class ExamsPage implements OnInit {

  detailModal = false;
  exams: any[] = [];
  id = '';
  exam: any;
  searchText;

  searchMap = ['EXAMEN', 'CUP'];
  cloner = [];


  constructor(
    private _afs: FirestoreService,
    private _auth: AngularFireAuth,
    private _spinner: SpinnerService
  ) { }

  ngOnInit() {
    this._spinner.showLoader('Cargando Examenes');
    this.initAll();

    setTimeout(() => {
      this._spinner.hideSpinner();
    }, 1500);
  }


  initAll() {
    this._auth.user.subscribe(
      (res) => {
        this._afs.getDoc<User>('users', String(res?.uid)).subscribe(
          // eslint-disable-next-line @typescript-eslint/no-shadow
          (res) => {
            this.getallExam(String(res?.convenio));
          }
        );
      }
    );
  }

  getallExam(convenio: string) {

    if (convenio === 'undefined' || !convenio) {

      this._afs.getAllDoc('Exams_DB').subscribe(res => {
        this.exams = [];
        res.forEach((data: any) => {
          this.exams.push({
            id: data.payload.doc.id,
            ...data.payload.doc.data()
          });
        });
        this.cloner.push(this.exams);
      });

    } else {
      this._afs.getAllDoc('exams-' + convenio).subscribe(res => {
        this.exams = [];
        res.forEach((data: any) => {
          this.exams.push({
            id: data.payload.doc.id,
            ...data.payload.doc.data()
          });
        });

        this.cloner.push(this.exams);
      });
    }

  }

}
