import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { delay,tap,take,map,first,switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
  ){ }

  canActivate(){
    return this.auth.authState.pipe(
      take(1),
      switchMap(async (authState) => {
          if (authState) {
            console.log('Autenticado');
            this.router.navigate(['/user/dashboard']);
            return false;

          } else {
              return true;
          }
      }),
    );
  }

}

