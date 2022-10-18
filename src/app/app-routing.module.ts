import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RouteConstants } from './base/constants/routes';
import { UserResolver } from './base/resolver/user.resolver';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';
import { LayoutComponent } from './laoyuts/layout/layout.component';
import { LoginPage } from './pages/login/login.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: RouteConstants.USER_ENVIERONMENT, component: LayoutComponent, resolve:{user: UserResolver}, children: [
       {path: RouteConstants.DASHBOARD_PAGE, loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)},
       {path: RouteConstants.EXAMS_LIST, loadChildren: () => import('./pages/lists/exams/exams.module').then( m => m.ExamsPageModule)},
       {path: RouteConstants.ORDENS_LIST, loadChildren: () => import('./pages/lists/orders/orders.module').then(m => m.OrdersPageModule)},
       // eslint-disable-next-line max-len
       {path: RouteConstants.PACKAGES_LIST, loadChildren: () => import('./pages/lists/packages/packages.module').then(m => m.PackagesPageModule)},
    ], canActivate: [AuthGuard]
  },
  {
    // eslint-disable-next-line max-len
    path: RouteConstants.LOGIN_PAGE, loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule), canActivate: [NoAuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
