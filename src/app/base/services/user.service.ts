/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import {map,tap} from 'rxjs/operators';
import { User } from '../models/generalModels';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _user: BehaviorSubject<User> = new BehaviorSubject(null);

  constructor(private authService: AngularFireAuth, private afs: FirestoreService) { }

  get user$(): Observable<User>
  {
    return this._user.asObservable();
  }

  obtenerUser(): Observable<any>{
    const uid = this.authService.user.subscribe(res=>res.uid);

    return this.afs.getDoc<User>('Users',String(uid)).pipe(
     tap((res)=>{this._user.next(res);})
    );
  }
}
