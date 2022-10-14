import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {

  logo = '../../../assets/img/Aslapp-8.png';

  public appPages = [
    { title: 'Dashboard', url: '/user/dashboard', icon: 'home' },
    { title: 'Examenes', url: '/user/examenes', icon: 'fitness' },
    { title: 'Ordenes', url: '/user/ordenes', icon: 'document-attach' },
    { title: 'Paquetes', url: '/user/packages', icon: 'albums' },
    { title: 'Carrito', url: '/user/carrito', icon: 'cart' },
  ];
  constructor() { }

  ngOnInit() {}

}
