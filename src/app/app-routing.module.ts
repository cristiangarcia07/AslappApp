/* eslint-disable max-len */
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RouteConstants } from './base/constants/routes';
import { UserResolver } from './base/resolver/user.resolver';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';
import { LayoutComponent } from './laoyuts/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: RouteConstants.USER_ENVIERONMENT, component: LayoutComponent, resolve: { user: UserResolver }, children: [
      { path: RouteConstants.DASHBOARD_PAGE, loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule) },
      { path: RouteConstants.EXAMS_LIST, loadChildren: () => import('./pages/lists/examsParent/exams/exams.module').then(m => m.ExamsPageModule) },
      { path: RouteConstants.ORDENS_LIST, loadChildren: () => import('./pages/lists/orders/orders.module').then(m => m.OrdersPageModule) },
      { path: RouteConstants.PACKAGES_LIST, loadChildren: () => import('./pages/lists/packagesParent/packages/packages.module').then(m => m.PackagesPageModule) },
      { path: RouteConstants.CART_PAGE, loadChildren: () => import('./pages/cartParent/tabscart/tabscart.module').then(m => m.TabscartPageModule) },
      { path: RouteConstants.EXAM_DETAIL, loadChildren: () => import('./pages/lists/examsParent/examdetail/examdetail.module').then(m => m.ExamdetailPageModule) },
      { path: RouteConstants.PACKAGE_DETAIL, loadChildren: () => import('./pages/lists/packagesParent/packagedetail/packagedetail.module').then(m => m.PackagedetailPageModule) }
    ], canActivate: [AuthGuard]
  },
  {
    path: RouteConstants.LOGIN_PAGE, loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule), canActivate: [NoAuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
