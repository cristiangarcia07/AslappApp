/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(
    private afs: AngularFirestore,
    private aft: AngularFireStorage,
  ) { }

  createDoc(data: any,path: string,id: string){
    const collection = this.afs.collection(path);
    return collection.doc(id).set(data);
  }

  createDocFrist<tipo>(data: any,path: string): Promise<any>{
    return this.afs.collection(path).doc<tipo>().set(data);
  }

  getDoc<tipo>(path: string, id: string){
    return this.afs.collection(path).doc<tipo>(id).valueChanges();
  }

  docNoType(path: string, id: string){
    return this.afs.collection(path).doc(id).valueChanges;
  }

  getAllDoc(data: string): Observable<any>{
    return this.afs.collection(data).snapshotChanges();
  }

  getAllDocWithParams(data: string,from: string,where: string): Observable<any>{
    return this.afs.collection(data,ref => ref.where(from, '==', where)).snapshotChanges();
  }

  updateDoc(path: string, id: string,data: any): Promise<any>{
    return this.afs.collection(path).doc(id).update(data);
  }

  deleteDoc(path: string, id: string): Promise<any>{
    return this.afs.collection(path).doc(id).delete();
  }

  getAllOrdensLastet(data: string,from: string,where: string,limit: number): Observable<any>{
    return this.afs.collection(data,ref => ref.where(from, '==', where).limit(limit).orderBy('createdDate','desc')).snapshotChanges();
  }


}
