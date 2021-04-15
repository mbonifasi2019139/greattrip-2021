import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ReponsegetLngLatTPByTripID, ReponseTrip, ResponseTouristPlace, ResponseTrips } from '../interfaces/interfaces';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class TripsService {

  constructor(private http: HttpClient) { }

  getTrips(){
    return this.http.get<ResponseTrips>(`${ URL }/v1/getTrips`);
  }

  getTrip(idT){
    return this.http.post<ReponseTrip>(`${URL}/v1/getTrip/${idT}`, {});
  }

  getLngLatTPByTripID(idT){
    return this.http.post<ReponsegetLngLatTPByTripID>(`${URL}/v1/getLngLatTPByTripID/${idT}`, {});
  }

  getTouristPlaceDetail(idTP){
    return this.http.post<ResponseTouristPlace>(`${URL}/v1/getTouristPlace/${idTP}`,{});
  }
}
