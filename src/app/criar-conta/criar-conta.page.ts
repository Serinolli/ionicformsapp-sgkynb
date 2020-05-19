import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; 
import { CpfValidator } from '../validators/cpf-validator';
import { ComparaValidator } from '../validators/compara-validator';
import { Usuario } from '../model/Usuario';
import { UsuarioService } from '../servicos/usuario.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-criar-conta',
  templateUrl: './criar-conta.page.html',
  styleUrls: ['./criar-conta.page.scss'],
})
export class CriarContaPage implements OnInit {

  public formCadastro: FormGroup;
  public usuario: Usuario;

  public mensagem_validacao = {

    email:[
      {tipo: 'required', mensagem: 'o campo E-mail é obrigatorio.'},
      {tipo: 'email', mensagem: 'E-mail invalido'},
    ],
    senha: [
      {tipo: 'required', mensagem: 'senha é obrigatoria'},
      {tipo: 'minLenght', mensagem: 'senha invalida, deve ter pelo menos mais 6 caracteres'},
      {tipo: 'maxLenght', mensagem: 'senha invalida, deve ter no maximo 8 caracteres'}
    ], 
    confSenha: [
      {tipo: 'required', mensagem: 'senha é obrigatoria'},
      {tipo: 'minLenght', mensagem: 'senha invalida, deve ter pelo menos mais 6 caracteres'},
      {tipo: 'maxLenght', mensagem: 'senha invalida, deve ter no maximo 8 caracteres'},
      {tipo: 'comparacao', mensagem: 'Este campo deve ser igual ao Campo Senha'}
    ], 

    DataDeNascimento: [
      {tipo: 'required', mensagem: 'Informe a data de nascimento'}
    ],
    sexo: [
      {tipo: 'required', mensagem: 'é necessario informar sexo'}
    ],
    nome: [
      {tipo: 'required', mensagem: 'é necessario informar nome'},
      {tipo: 'minLenght', mensagem: 'nome deve ter pelo menos 2 caracteres'}
    ]

  };
  constructor(public formBuilder: FormBuilder, public usuarioService: UsuarioService, public alertController: AlertController, public router: Router) { 
    this.formCadastro = formBuilder.group({
      //declara os campos do formulario
      email: ['', Validators.compose([Validators.email, Validators.required])],
      senha: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(12), Validators.required])],
      nome: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      cpf: ['', Validators.compose([Validators.required, CpfValidator.cpfValido])],
      sexo: ['', Validators.compose([Validators.required])],
      dataDeNascimento: ['', Validators.compose([Validators.required])],
      confSenha: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(12), Validators.required])]
      

    },{ validator: ComparaValidator('senha', 'confSenha' )})
  };

  ngOnInit() {
  }

   public async salvaUsuario(){
     if (this.formCadastro.valid){
     this.usuario = this.formCadastro.value as Usuario;
     delete this.usuario['confSenha'];
     if (await this.usuarioService.salvar(this.usuario)){
       this.alertCadastro('Sucesso', 'Sucesso ao salvar');
       this.router.navigateByUrl('/home');
     }else{

       this.alertCadastro('ERRO', 'FALHA AO SALVAR');
     }
   }else{

       this.alertCadastro('ERRO', 'CONFIRA O FORMULARIO, POIS O MESMO SE ENCONTRA INVALIDO');
     }
   }
   async alertCadastro(titulo, msg){
     const alert = await this.alertController.create({
       header: titulo,
       message: msg,
       buttons: ['ok']
     });
     await alert.present();
   }
  
   
}
