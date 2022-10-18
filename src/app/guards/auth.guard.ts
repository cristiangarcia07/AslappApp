import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {   take,switchMap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
  ){ }

  canActivate(){
    return this.auth.authState.pipe(
      take(1),
      switchMap(async (authState) => {
          if (authState) {

            return true;

          } else {
              console.log('No autenticado');
              this.router.navigate(['/login']);
              return false;
          }
      }),
    );
  }

}
