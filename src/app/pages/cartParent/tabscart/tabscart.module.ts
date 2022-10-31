import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabscartPageRoutingModule } from './tabscart-routing.module';

import { TabscartPage } from './tabscart.page';
import { HeaderComponentModule } from '../../../components/header/header.component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabscartPageRoutingModule,
    HeaderComponentModule
  ],
  declarations: [TabscartPage]
})
export class TabscartPageModule {}
