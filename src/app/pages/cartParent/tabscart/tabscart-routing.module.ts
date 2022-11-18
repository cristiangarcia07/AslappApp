import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


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
        path: ':id',
        redirectTo: 'examsList/:id',
        pathMatch: 'full'
      },
      {
        path: 'examsList',
        loadChildren: () => import('../cart/cart.module').then(m => m.CartPageModule)
      },
      {
        path: 'examsList/:id',
        loadChildren: () => import('../cart/cart.module').then(m => m.CartPageModule)
      },
      {
        path: 'pacientForm/:id',
        loadChildren: () => import('../pacient/pacient.module').then(m => m.PacientPageModule)
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
