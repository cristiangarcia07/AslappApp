import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from 'src/app/base/models/generalModels';
import { FirestoreService } from 'src/app/base/services/firestore.service';

@Component({
  selector: 'app-exams',
  templateUrl: './exams.page.html',
  styleUrls: ['./exams.page.scss'],
})
export class ExamsPage implements OnInit {

  detailModal = false;
  exams: any[] = [];
  id = "";
  exam: any;
  results = [];

  constructor(
    private afs: FirestoreService,
    private auth: AngularFireAuth,
  ) { }

  ngOnInit() {
    this.initAll();
  }


  initAll() {
    this.auth.user.subscribe(
      (res) => {
        this.afs.getDoc<User>('users', String(res?.uid)).subscribe(
          (res) => {
            this.getallExam(String(res?.convenio));
          }
        )
      }
    )
  }

  getallExam(convenio: string) {

    if (convenio === "undefined" || !convenio) {

      this.afs.getAllDoc('Exams_DB').subscribe(res => {
        this.exams = []
        res.forEach((data: any) => {
          this.exams.push({
            id: data.payload.doc.id,
            ...data.payload.doc.data()
          })
        });
      })

    } else {
      this.afs.getAllDoc('exams-' + convenio).subscribe(res => {
        this.exams = []
        res.forEach((data: any) => {
          this.exams.push({
            id: data.payload.doc.id,
            ...data.payload.doc.data()
          })
        });
      })
    }

  }

  //FILTERS
  search(event) {
    const query = event.target.value.toLowerCase();
    this.results = this.exams.filter(d => d.EXAMEN.toLowerCase().indexOf(query) > -1);
  }

}
