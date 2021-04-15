import { Injectable } from '@angular/core';
//import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from "@ionic/storage-angular";
import { ResponseLogin, ResponseRegister, ResponseUpdateUser, User } from '../interfaces/interfaces';
import { NavController } from '@ionic/angular';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _storage: Storage | null = null;

  token: string = null;
  user: User = {};

  constructor(private http: HttpClient, private storage: Storage, private navCtrl: NavController) { 
    this.init();
  }

  async init(){
    const storage = await this.storage.create();
    this._storage = storage;
  }

  login(username: string, password: string){
    let data = {username, password};
    
    return new Promise(resolve => {

      this.http.post<ResponseLogin>(`${URL}/v1/login`, data).subscribe(  async resp => {
        console.log(resp);
        if( resp['ok']){
          await this.saveToken(resp.token);
          resolve(true);
        }else {
          this.token = null;
          this.storage.clear();
          resolve(false);
        }
        
      });
    });
  }

  logout(){
    this.token = null;
    this.user = null;
    this.storage.clear();
    this.navCtrl.navigateRoot('/login', {animated: true});
  }

  register(user: User){

    return new Promise(resolve => {
      this.http.post<ResponseRegister>(`${URL}/v1/register`, user).subscribe( async resp => {
        console.log(resp);

        if(resp['ok']){
          await this.saveToken(resp.token);
          resolve(true);
        }else{
          this.token = null;
          this.storage.clear();
          resolve(false);
        }
      });
    });
  }

  getUser(){
    if(!this.user._id){
      this.validateToken();
    }
    return {...this.user}
  }

  async saveToken(token: string) {
    this.token = token;
    await this.storage.set('token', token);
    await this.validateToken();
  }

  async loadToken(){
    this.token = await this.storage.get('token') || null;
  }

  async validateToken():Promise<boolean>{

    await this.loadToken();

    if(!this.token){
      this.navCtrl.navigateRoot('/login');
      return Promise.resolve(false);
    }

    return new Promise<boolean>( resolve => {
      const headers = new HttpHeaders({
        'Authorization': this.token
      });

      this.http.get(`${URL}/v1/getUser`, {headers}).subscribe( resp => {
        if(resp['ok']){
          this.user = resp['user'];
          resolve(true);
        }else {
          this.navCtrl.navigateRoot('/login');
          resolve(false);
        }
      });

    }); 
  }

  updateUser(user: User){
    const headers = new HttpHeaders({
      'Authorization': this.token
    });

    return new Promise( resolve => {
      this.http.post<ResponseUpdateUser>(`${URL}/v1/updateUser/${user._id}`, user, {headers}).subscribe( resp => {
        console.log(resp);
        if(resp.ok){
          this.saveToken(resp.token);
          resolve(true);
        }else {
          resolve(false);
        }
      });

    });


  }

}
