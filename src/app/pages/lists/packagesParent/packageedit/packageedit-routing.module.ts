import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PackageeditPage } from './packageedit.page';

const routes: Routes = [
  {
    path: '',
    component: PackageeditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PackageeditPageRoutingModule {}
