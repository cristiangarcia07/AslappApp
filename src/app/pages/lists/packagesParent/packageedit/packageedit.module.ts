import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PackageeditPageRoutingModule } from './packageedit-routing.module';

import { PackageeditPage } from './packageedit.page';
import { HeaderComponentModule } from 'src/app/components/header/header.component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PackageeditPageRoutingModule,
    HeaderComponentModule
  ],
  declarations: [PackageeditPage]
})
export class PackageeditPageModule {}
