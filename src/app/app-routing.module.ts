import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RouteConstants } from './base/constants/routes';
import { LayoutComponent } from './laoyuts/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'user/dashboard',
    pathMatch: 'full'
  },

  {
    path: RouteConstants.USER_ENVIERONMENT, component: LayoutComponent, children: [
       {path: RouteConstants.DASHBOARD_PAGE, loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)},
       {path: 'examenes', loadChildren: () => import('./pages/lists/exams/exams.module').then( m => m.ExamsPageModule)},
    ]
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
