import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as Mapboxgl from "mapbox-gl";
import { TripsService } from 'src/app/services/trips.service';
import { TouristPlace, Trip, TPCoordinates } from '../../interfaces/interfaces';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {

  @Input() tripId;
  map: Mapboxgl.Map;

  constructor(private tripService: TripsService) { }

  ngOnInit() {

    this.tripService.getLngLatTPByTripID(this.tripId).subscribe(resp => {
        resp.lngLat.forEach( coord => {

          let coordinates = coord.split("/");
          let lng = parseFloat(coordinates[0]);
          let lat = parseFloat(coordinates[1]);

          
          this.createMarker(lng, lat);
        });
    });

    (Mapboxgl as any).accessToken = environment.mapboxKey;
    this.map = new Mapboxgl.Map({
    container: 'map-mapbox', // container id
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-90.3017672 ,16.912033], // starting position  
    zoom: 10 // starting zoom
    });
  }

  createMarker(lng: number, lat: number){
    let marker = new Mapboxgl.Marker({
      draggable: true
    }).setLngLat([lng, lat]).addTo(this.map);;

    marker.on('drag', () => {
      console.log(marker.getLngLat());
      });
  }
}
