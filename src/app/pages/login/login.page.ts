import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    ) { }

  ngOnInit(): void {
  }

  initForm(){  }

  login(){
    this.userServ.login(this.email,this.password)
    .then(
      (
      ) =>{
        this.route.navigateByUrl('/user/dashboard');
        localStorage.removeItem('cart');
      }
    );
  }

  resetPass(correo: string){
    this.userServ.resetPass(correo).then(res=>{
    })
    .catch(err=>{
      console.log(err);
    });
  }

}
