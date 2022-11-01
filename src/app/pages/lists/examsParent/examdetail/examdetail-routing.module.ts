import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExamdetailPage } from './examdetail.page';

const routes: Routes = [
  {
    path: '',
    component: ExamdetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExamdetailPageRoutingModule {}
