import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonSlides, NavController } from '@ionic/angular';
import { User } from 'src/app/interfaces/interfaces';
import { UiServicesService } from 'src/app/services/ui-services.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild('mainSlide', {static: true}) slides: IonSlides;

  loginUser = {
    username: "admin",
    password: "admin"
  }

  registerUser: User = {
    name: 'Marcos',
    lastname: 'Bonifasi',
    email: 'mbonifasi-2019130@kinal.edu.gt',
    nationality: 'Guatemala',
    identification: "3645707410115",
    phone: "4158-2149",
    birthday: "2002-11-26",
    avatar: "av-1.png",
    username: "mbonifasi",
    password: "mbonifasi",
  }

  constructor(private userService: UserService, private navCtl: NavController, private uiService: UiServicesService) { }

  ngOnInit() {
    this.slides.lockSwipes(true);
  }

  async login(fLogin: NgForm){
    if(!fLogin.valid) {
      this.uiService.informationAlert("Ingrese usuario y contraseña")
      return;
    }

    let valid = await this.userService.login(this.loginUser.username, this.loginUser.password);

    console.log(valid);

    if(valid) {
      this.navCtl.navigateRoot('/main/tabs/tab1', {animated: true});
    }else {
      this.uiService.informationAlert("Usuario/contraseña no son correctas");
    }
  }

 async register(fRegister: NgForm){

    if(fRegister.invalid){return;}

    const valid = await this.userService.register(this.registerUser);

    console.log(`Veamosss aca: ${valid}`);

    if(valid) {
      this.navCtl.navigateRoot('/main/tabs/tab1', {animated: true});
    }else {
      this.uiService.informationAlert(`El usuario ${this.registerUser.username} ya existe, por favor ingrese otro`);
    }

    console.log(fRegister.valid);
    console.log(this.registerUser);
  }

  showRegister(){
    this.slides.lockSwipes(false);
    this.slides.slideTo(0);
    this.slides.lockSwipes(true);
  }

  showLogin(){
    this.slides.lockSwipes(false);
    this.slides.slideTo(1);
    this.slides.lockSwipes(true);
  }

}
