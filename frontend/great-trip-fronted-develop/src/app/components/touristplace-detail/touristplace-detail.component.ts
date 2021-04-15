import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TouristPlace } from 'src/app/interfaces/interfaces';
import { TripsService } from 'src/app/services/trips.service';

@Component({
  selector: 'app-touristplace-detail',
  templateUrl: './touristplace-detail.component.html',
  styleUrls: ['./touristplace-detail.component.scss'],
})
export class TouristplaceDetailComponent implements OnInit {

  avatars = [
    {
      img: 'av-1.png',
      selected: true
    },
    {
      img: 'av-2.png',
      selected: false
    },
    {
      img: 'av-3.png',
      selected: false
    },
    {
      img: 'av-4.png',
      selected: false
    },
    {
      img: 'av-5.png',
      selected: false
    },
    {
      img: 'av-6.png',
      selected: false
    },
    {
      img: 'av-7.png',
      selected: false
    },
    {
      img: 'av-8.png',
      selected: false
    },
];

  constructor(private modalCtrl: ModalController, private tripService: TripsService) { }

  @Input() id;
  touristPlace: TouristPlace = {};

  ngOnInit() {
    console.log(`Este es el ID ${this.id}`);
    this.tripService.getTouristPlaceDetail(this.id).subscribe( resp => {
      this.touristPlace = resp.tpFound;
    });
  }

  closeTripModal(){
    this.modalCtrl.dismiss();
  }

}
