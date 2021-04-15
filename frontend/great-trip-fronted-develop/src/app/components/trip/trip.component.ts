import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';
import { Trip } from 'src/app/interfaces/interfaces';
import { TripsService } from 'src/app/services/trips.service';
import { TouristplaceDetailComponent } from '../touristplace-detail/touristplace-detail.component';
@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css'],
})
export class TripComponent implements OnInit {


  @ViewChild('mainSlide', {static: true}) slides: IonSlides;
  @Input() id;

  trip: Trip = {};
  hide = 200;

  constructor(private tripService: TripsService, private datepipe: DatePipe, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.tripService.getTrip(this.id).subscribe(resp => {
      this.trip = resp.trip;
      console.log(this.trip);
    }); 
  }


  showTrips(){
    this.slides.lockSwipes(false);
    this.slides.slideTo(0);
    this.slides.lockSwipes(false);
  }

  showDateInFormat(date): Date{
    date = this.datepipe.transform(this.trip.start_date, "dd/MM/yyyy");
    return date;
  }

  compareDates(sDate, eDate){
    sDate = this.showDateInFormat(sDate);
    eDate = this.showDateInFormat(eDate);
    return sDate === eDate;
  }

  closeTripModal(){
    this.modalCtrl.dismiss();
  }

  async showTPDetail(id){
    const modal = await this.modalCtrl.create({
      component: TouristplaceDetailComponent,
      componentProps: {id}
    });
    modal.present();
  }

}