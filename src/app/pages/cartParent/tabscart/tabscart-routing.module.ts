import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CartPage } from '../cart/cart.page';
import { PacientPage } from '../pacient/pacient.page';

import { TabscartPage } from './tabscart.page';

const routes: Routes = [
  {
    path: '',
    component: TabscartPage,
    children: [
      {
        path: '',
        redirectTo: 'examsList',
        pathMatch: 'full'
      },
      {
        path: 'examsList',
        loadChildren: () => import('../cart/cart.module').then(m => m.CartPageModule)
      },
      {
        path: 'pacientForm',
        loadChildren: () => import('../pacient/pacient.module').then(m => m.PacientPageModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabscartPageRoutingModule {}
