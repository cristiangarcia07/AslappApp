import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable, of, switchMap } from 'rxjs';
import { FirestoreService } from './firestore.service';
import { RoleValidator } from '../helpers/roleValidator';
import { User } from "src/app/models/class";

@Injectable({
  providedIn: 'root'
})
export class AuthService extends RoleValidator {
  uid!:string;
  $user!: Observable<any>;

  constructor(private auth: AngularFireAuth, private afs: AngularFirestore, private af: FirestoreService) {
    super();

    this.$user = this.auth.authState.pipe(
      switchMap(
        (user) =>{
          if(user){
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
          }

          return of(null);
        }
      )
    )
  }

  login(email:string,password: string): Promise<any>{
    return this.auth.signInWithEmailAndPassword(email,password);
  }

  register(email:string, password:string): Promise<any>{
    return this.auth.createUserWithEmailAndPassword(email,password);
  }

  getAuthWithProfile():Observable<any>{
    this.uid = String(localStorage.getItem('uidUser'))
    console.log(this.uid)
     return this.af.getDoc('user',this.uid);
  }

  resetPass(email:string){
    return this.auth.sendPasswordResetEmail(email)
  }
}
