import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
//importação formularios
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; 
import { UsuarioService } from '../servicos/usuario.service';

//para funcionar os formularios é preciso importar o modulo ReactiveFormModule no arquivo .module.ts
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public formLogin: FormGroup;

  public mensagem_validacao = {

    email:[
      {tipo: 'required', mensagem: 'o campo E-mail é obrigatorio.'},
      {tipo: 'email', mensagem: 'E-mail invalido'},
    ],
    senha: [
      {tipo: 'required', mensagem: 'senha é obrigatoria'},
      {tipo: 'minLength', mensagem: 'senha invalida, deve ter pelo menos mais 6 caracteres'},
      {tipo: 'maxLength', mensagem: 'senha invalida, deve ter no maximo 8 caracteres'}
    ]
  }

  constructor(public formBuilder: FormBuilder, public alertController: AlertController, public router: Router, public usuarioService: UsuarioService) {

    //Mostra formularioss
    this.formLogin = formBuilder.group({
      //declara os campos do formulario
      email: ['', Validators.compose([Validators.email, Validators.required])],
      senha: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(12), Validators.required])]
      

    })

  }
  public async login(){
    if (this.formLogin.valid){
      let email = this.formLogin.value.email;
      let senha = this.formLogin.value.senha;

      if (await this.usuarioService.login( email, senha)){
        this.router.navigateByUrl('painel-usuario');
      }else{
        this.alertUserInvalid();
      }

    }else{
      this.alertFormInvalid();
    }

    }


   async alertFormInvalid(){
     const alert = await this.alertController.create({
       header: "ERRO!",
       message: "formulario invalido",
       buttons: ['ok']
     })
    }
     async alertUserInvalid(){
      const alert = await this.alertController.create({
        header: "ERRO!",
        message: "E-mail ou Senha Não existe",
        buttons: ['ok']
      })
   }
}