import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Trip } from 'src/app/interfaces/interfaces';
import { TripComponent } from '../trip/trip.component';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.scss'],
})
export class TripsComponent implements OnInit {

  @Input() trips: Trip[] = [];
  @Input() tripDetail: Trip = {};
  @Output() sendTripID = new EventEmitter<Trip>();

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  async showTripDetail(id){
    const modal = await this.modalCtrl.create({
      component: TripComponent,
      componentProps: {id}
    });
    modal.present();
  }

}
