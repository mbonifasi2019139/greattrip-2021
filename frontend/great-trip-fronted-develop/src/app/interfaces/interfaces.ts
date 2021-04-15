export interface Trip {
  title?: String;
  _id?: String;
  description?: String;
  price?: Number;
  country?: String;
  start_date?: Date;
  end_date?: Date;
  imageUrl?: String;
  type_of_trip?: String;
  coupons?: Number;
  tourists_places?: [];
  tourists_guide?: [];
}
export interface ResponseLogin {
  ok?: Boolean,
  message?: String,
  token?: string,
  user?: String,
}

export interface ResponseUpdateUser {
  ok?: Boolean,
  message?: String,
  token?: string,
  userUpdated?: User
}

export interface ResponseTrips {
  message?: String;
  trips?: Trip[]
}

export interface ReponseTrip {
  ok?: Boolean,
  message?: String,
  trip?: Trip
}

export interface ResponseRegister{
  ok?: Boolean,
  message?: String,
  token?: string,
  userSaved?: User
}

export interface ResponseTouristPlace {
  ok?: Boolean,
  message?: String,
  tpFound?: TouristPlace
}

export interface TouristPlace {
  _v?: Number,
  _id?: String,
  address?: String,
  country?: String,
  description?: String,
  name?: String,
  reviews?: Array<any>,
  urlsImages?: Array<any>
}

export interface ReponsegetLngLatTPByTripID {
  ok?: Boolean,
  message?: String,
  lngLat?: [String]
}

export interface TPCoordinates {
  idTP?: String,
  coordinate?: String,
}
  export interface User {
    _id?: String,
    name?: string,
    lastname?: string,
    email?: string,
    nationality?: string,
    identification?: string,
    phone?: string,
    birthday?: string,
    avatar?: string,
    username?: string,
    password?: string
  }