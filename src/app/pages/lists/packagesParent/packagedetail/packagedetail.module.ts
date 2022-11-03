import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PackagedetailPageRoutingModule } from './packagedetail-routing.module';

import { PackagedetailPage } from './packagedetail.page';
import { HeaderComponentModule } from 'src/app/components/header/header.component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PackagedetailPageRoutingModule,
    HeaderComponentModule
  ],
  declarations: [PackagedetailPage]
})
export class PackagedetailPageModule {}
