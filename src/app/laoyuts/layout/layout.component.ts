import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {

  logo = '../../../assets/img/Aslapp-8.png';

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
    ) { }

  ngOnInit() {}

  logout(){
    this.auth.signOut()
    .then(
      ()=>{
        window.localStorage.removeItem('currentUser');
        window.location.reload();
        this.router.navigate(['/login']);
    })
    .catch((err)=>{
      console.log(err);
    });
  }
}
