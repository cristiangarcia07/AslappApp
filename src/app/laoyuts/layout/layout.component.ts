import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { User } from 'src/app/base/models/generalModels';
import { FirestoreService } from 'src/app/base/services/firestore.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {

  logo = '../../../assets/img/Aslapp-8.png';

  user: User;

  public appPages = [
    { title: 'Dashboard', url: '/user/dashboard', icon: 'home' },
    { title: 'Examenes', url: '/user/exams', icon: 'fitness' },
    { title: 'Ordenes', url: '/user/ordens', icon: 'document-attach' },
    { title: 'Paquetes', url: '/user/packages', icon: 'albums' },
    { title: 'Carrito', url: '/user/cart', icon: 'cart' },
  ];
  constructor(
    private router: Router,
    private auth: AngularFireAuth,
    private al: ToastController,
    private afs: FirestoreService
    ) { }

  ngOnInit() {
    this.auth.user.subscribe(
      res => {
        this.afs.getDoc<User>('users',res.uid).subscribe(resp =>{
          this.user = resp;
        });
      }
    );
  }

  initPage() {

  }

  logout(){
    this.auth.signOut()
    .then(
      async ()=>{
        const al = this.al.create({
          message: 'Hasta luego',
          color: 'danger',
          position: 'middle',
          duration: 1500
        });
        await (await al).present();
        window.localStorage.removeItem('currentUser');
        window.location.reload();
        this.router.navigate(['/login']);
    })
    .catch((err)=>{
      console.log(err);
    });
  }
}
