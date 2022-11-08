import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/base/models/generalModels';
import { FirestoreService } from 'src/app/base/services/firestore.service';

@Component({
  selector: 'app-examdetail',
  templateUrl: './examdetail.page.html',
  styleUrls: ['./examdetail.page.scss'],
})
export class ExamdetailPage implements OnInit {
  examDetail: any;

  constructor(
    private auth: AngularFireAuth,
  ) { }

  ngOnInit() {
    this.initAll();
  }

  getExam() {
    this.examDetail = JSON.parse(localStorage.getItem('exam'));
  }

  initAll() {
    this.auth.user.subscribe(
      () => {
        this.getExam();
      }
    );
  }

  trimString(text, length: any) {
    return text.length > length ?
           text.substring(0, length) + '...' :
           text;
}
}

