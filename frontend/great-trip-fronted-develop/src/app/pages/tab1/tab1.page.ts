import { Component, OnInit, ViewChild } from '@angular/core';
import { Trip, ReponseTrip } from 'src/app/interfaces/interfaces';
import { TripsService } from 'src/app/services/trips.service';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  trips: Trip[] = [];
  trip: Trip = {};

  @ViewChild('mainSlide', {static: true}) slides: IonSlides;

  constructor(private tripsService: TripsService) {}

  ngOnInit(){
    // this.slides.lockSwipes(true);
    this.tripsService.getTrips().subscribe(resp => {
      //console.log(resp);
      this.trips.push( ...resp.trips );
    });
  }

}
