import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExamsPageRoutingModule } from './exams-routing.module';

import { ExamsPage } from './exams.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExamsPageRoutingModule,
    Ng2SearchPipeModule
  ],
  declarations: [ExamsPage]
})
export class ExamsPageModule {}
