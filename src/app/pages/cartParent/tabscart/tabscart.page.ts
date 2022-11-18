import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tabscart',
  templateUrl: './tabscart.page.html',
  styleUrls: ['./tabscart.page.scss'],
})
export class TabscartPage implements OnInit {
  idOrd: any;

  constructor(
    private actRout: ActivatedRoute
  ) { }

  ngOnInit() {
    this.idOrd = this.actRout.snapshot.params.id;
  }

}
