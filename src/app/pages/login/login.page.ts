import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { MessagesTS } from 'src/app/base/constants/messages';
import { AuthService } from 'src/app/base/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  modal=false;

  email = '';
  password = '';

  constructor(
    private userServ: AuthService,
    private route: Router,
    private al: ToastController
    ) { }

  ngOnInit(): void {
  }

  initForm(){  }

  login(){
    this.userServ.login(this.email,this.password)
    .then(
      async () =>{
        const al = this.al.create({
          message: `Bienvenido ${this.email}`,
          color: 'primary',
          position: 'middle',
          duration: 1500
        });
        this.route.navigateByUrl('/user/dashboard');
        localStorage.removeItem('cart');
        await (await al).present();
      }
    ).catch(async (err) => {
      const al = this.al.create({
        message: 'Hubo un error',
        color: 'danger',
        position: 'middle',
        duration: 1500
      });
      await (await al).present();
      console.log(err);
    });
  }

  resetPass(correo: string){
    this.userServ.resetPass(correo).then(res=>{
    })
    .catch(err=>{
      console.log(err);
    });
  }

}
