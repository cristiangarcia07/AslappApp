import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { take, map, tap  } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from '../base/services/auth.service';
import { User } from '../base/models/generalModels';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private afs: AuthService, private route: Router){

  }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean > | Promise<boolean> | boolean {
    return this.afs.$user.pipe(
      take(1),
      map((user: User)=> user && this.afs.isAdmin(user) || this.afs.isGerente(user)),
      tap( canAdmin =>{
        if(!canAdmin){
          this.route.navigate(['/user/dashboard']);
        }
      })
    );
  }

}
