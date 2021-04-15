import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/interfaces/interfaces';
import { UiServicesService } from 'src/app/services/ui-services.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{

  private user: User = {};

  constructor(private userService: UserService, private uiService: UiServicesService) {}

  ngOnInit(){

    this.user = this.userService.getUser();
  }

  logout(){
    this.userService.logout();
  }

  async updateUser(fUpdate: NgForm){
    if(!fUpdate.valid){
      const updated = await this.userService.updateUser(this.user);

      console.log(updated);

      if(updated){
        this.uiService.presentToast("Usuario actualizado");
      }else {
        this.uiService.presentToast("No se pudo actualizar");
      }

    }
  }

}
