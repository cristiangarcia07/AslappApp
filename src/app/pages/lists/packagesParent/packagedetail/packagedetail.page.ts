import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular';
import { FirestoreService } from 'src/app/base/services/firestore.service';
import { SpinnerService } from 'src/app/base/services/spinner.service';
import { MasterView } from 'src/app/base/views/masterView';

@Component({
  selector: 'app-packagedetail',
  templateUrl: './packagedetail.page.html',
  styleUrls: ['./packagedetail.page.scss'],
})
export class PackagedetailPage implements OnInit {
  exams: any;

  constructor(
    private auth: AngularFireAuth,
  ) {
  }

  ngOnInit() {
    this.initUser();
  }

  initUser() {
    this.auth.currentUser.then(
      res => {
        this.getPackageDetail();
      }
    );
  }

  getPackageDetail() {
    this.exams = JSON.parse(localStorage.getItem('examsList'));
  }


}
