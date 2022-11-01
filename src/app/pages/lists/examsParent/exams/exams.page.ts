import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { User  } from 'src/app/base/models/generalModels';
import { FirestoreService } from 'src/app/base/services/firestore.service';
import { SpinnerService } from 'src/app/base/services/spinner.service';
import { MasterView } from 'src/app/base/views/masterView';


@Component({
  selector: 'app-exams',
  templateUrl: './exams.page.html',
  styleUrls: ['./exams.page.scss'],
})
export class ExamsPage extends MasterView  implements OnInit {

  detailModal = false;
  exams: any[] = [];
  id = '';
  exam: any;
  searchText;

  searchMap = ['EXAMEN', 'CUP'];
  cloner = [];


  constructor(
    private afs: FirestoreService,
    private auth: AngularFireAuth,
    private spinner: SpinnerService,
    private al: AlertController,
    private rout: Router
  ) {
    super(al);
  }

  ngOnInit() {
    this.spinner.showLoader('Cargando Examenes');
    this.initAll();

    setTimeout(() => {
      this.spinner.hideSpinner();
    }, 1500);
  }


  initAll() {
    this.auth.user.subscribe(
      (res) => {
        this.afs.getDoc<User>('users', String(res?.uid)).subscribe(
          (resp) => {
            this.getallExam(String(resp.convenio));
          }
        );
      }
    );
  }

  getallExam(convenio: string) {

    if (convenio === 'undefined' || !convenio) {

      this.afs.getAllDoc('Exams_DB').subscribe(res => {
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
      this.afs.getAllDoc('exams-' + convenio).subscribe(res => {
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

  getExamData(exam: any) {
    localStorage.setItem('exam', JSON.stringify(exam));
    this.rout.navigateByUrl('/user/exam');
  }

}
