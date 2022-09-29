import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { finalize, Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  
  constructor(
    private spinner: NgxSpinnerService,
    private afs: AngularFirestore,
    private aft:AngularFireStorage  
  ) { }
  
  createDoc(data:any,path:string,id:string){
    const collection = this.afs.collection(path);
    return collection.doc(id).set(data);
  }

  createDocFrist<tipo>(data:any,path:string):Promise<any>{
    return this.afs.collection(path).doc<tipo>().set(data)
  }

  getDoc<tipo>(path: string, id: string){
    return this.afs.collection(path).doc<tipo>(id).valueChanges();
  }

  docNoType(path: string, id: string){
    return this.afs.collection(path).doc(id).valueChanges;
  }

  getAllDoc(data:string): Observable<any>{
    return this.afs.collection(data).snapshotChanges();
  }

  getAllDocWithParams(data:string,from:string,where:string): Observable<any>{
    return this.afs.collection(data,ref => ref.where(from, "==", where)).snapshotChanges();
  }

  updateDoc(path: string, id:string,data:any):Promise<any>{
    return this.afs.collection(path).doc(id).update(data)
  }

  deleteDoc(path:string, id:string):Promise<any>{
    return this.afs.collection(path).doc(id).delete();
  }

  getAllOrdensLastet(data:string,from:string,where:string,limit:number): Observable<any>{
    return this.afs.collection(data,ref => ref.where(from, "==", where).limit(limit).orderBy('createdDate','desc')).snapshotChanges();
  }

  uploadArchive(file:any,path:string,category:string):Promise<any>{
    return new Promise(
      resolve=>{
        this.spinner.show();
        const filePath = path +'/'+ category+Date.now().toString();
        const ref  = this.aft.ref(filePath);
        const task = ref.put(file);
        task.snapshotChanges().pipe(
          finalize(()=>{
            ref.getDownloadURL().subscribe(res =>{
              const URL = res;
              resolve(URL);
              this.spinner.hide();
              return;
            });
          })
        )
      .subscribe();
      }
    )
  }

}
