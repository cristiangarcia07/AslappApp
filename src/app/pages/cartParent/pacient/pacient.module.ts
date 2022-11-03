import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PacientPageRoutingModule } from './pacient-routing.module';

import { PacientPage } from './pacient.page';
import { HeaderComponentModule } from 'src/app/components/header/header.component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PacientPageRoutingModule,
    HeaderComponentModule,
    ReactiveFormsModule
  ],
  declarations: [PacientPage]
})
export class PacientPageModule {}
