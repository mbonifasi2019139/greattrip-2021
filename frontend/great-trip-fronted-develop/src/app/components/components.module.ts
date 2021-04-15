import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarSelectorComponent } from './avatar-selector/avatar-selector.component';
import { TripsComponent } from './trips/trips.component';
import { TripComponent } from './trip/trip.component';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../pipes/pipes.module';
import { TouristplaceDetailComponent } from './touristplace-detail/touristplace-detail.component';
import { MapComponent } from './map/map.component';


@NgModule({
  entryComponents:[
    TripComponent,
    TouristplaceDetailComponent
  ],
  declarations: [
    AvatarSelectorComponent,
    TripsComponent,
    TripComponent,
    TouristplaceDetailComponent,
    MapComponent
  ],  
  imports: [
    CommonModule,
    IonicModule,
    PipesModule
  ],
  exports: [
    AvatarSelectorComponent,
    TripsComponent,
    TripComponent,
    TouristplaceDetailComponent,
    MapComponent
  ]
})
export class ComponentsModule { }
