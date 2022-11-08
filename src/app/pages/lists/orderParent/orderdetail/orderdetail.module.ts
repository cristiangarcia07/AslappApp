import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderdetailPageRoutingModule } from './orderdetail-routing.module';

import { OrderdetailPage } from './orderdetail.page';
import { HeaderComponentModule } from 'src/app/components/header/header.component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderdetailPageRoutingModule,
    HeaderComponentModule
  ],
  declarations: [OrderdetailPage]
})
export class OrderdetailPageModule {}
