import { Component, OnInit } from '@angular/core';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-pacient',
  templateUrl: './pacient.page.html',
  styleUrls: ['./pacient.page.scss'],
})
export class PacientPage implements OnInit {
  form: FormGroup;
  age = 0;
  fechaNam;

  constructor(
    private formBuilder: FormBuilder
  ) {

  }

  ngOnInit() {
    this.initForm();
  }

  isFormValid(): boolean {
    return this.form.disabled ? true : this.form.valid;
  }


  initForm() {
    this.form = this.formBuilder.group({
      nombre: ['',Validators.required],
      tipoId: [''],
      numero: [''],
      correo: ['', Validators.required],
      direccion: [''],
      telefono:['',Validators.required],
      genero:['',Validators.required],
      edad: this.age,
      fechaNam: [this.fechaNam,Validators.required]
    });
  }

  createOrder() {
    console.log(this.form.value);
  }

  calculateAge(data: any){
    const today = new Date();
    const birthDate = new Date(data);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

   this.age = age;
   this.fechaNam = birthDate.toLocaleDateString();
   console.log(this.fechaNam);
   console.log(this.age);

   this.form.patchValue({edad: this.age});

  }

}
