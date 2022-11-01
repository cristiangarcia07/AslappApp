import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExamdetailPageRoutingModule } from './examdetail-routing.module';

import { ExamdetailPage } from './examdetail.page';
import { HeaderComponentModule } from 'src/app/components/header/header.component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExamdetailPageRoutingModule,
    HeaderComponentModule
  ],
  declarations: [ExamdetailPage]
})
export class ExamdetailPageModule {}
