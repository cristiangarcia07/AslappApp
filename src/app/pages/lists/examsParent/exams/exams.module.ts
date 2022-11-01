import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExamsPageRoutingModule } from './exams-routing.module';

import { ExamsPage } from './exams.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { HeaderComponentModule } from 'src/app/components/header/header.component.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExamsPageRoutingModule,
    Ng2SearchPipeModule,
    HeaderComponentModule
  ],
  declarations: [ExamsPage]
})
export class ExamsPageModule {}
