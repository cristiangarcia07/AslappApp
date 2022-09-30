import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  public appPages = [
    { title: 'Trash', url: '/user/dashboard', icon: 'home' },
  ];
  constructor() { }

  ngOnInit() {}

}
