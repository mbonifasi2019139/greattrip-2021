import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UiServicesService {

  constructor(private alertController: AlertController, private toastController: ToastController) { }

  async informationAlert( message: string ) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      position: "top",
      message,  
      duration: 1500,
      color: 'dark'
    });
    toast.present();
  }

}
