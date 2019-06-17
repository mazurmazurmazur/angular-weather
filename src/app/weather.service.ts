import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

export interface WeatherUser {
  name: string;
}

@Injectable()
export class WeatherService {
  constructor(private _http: HttpClient) {}

  getWeatherData(_searchTerm): Observable<WeatherUser> {
    return this._http.get<WeatherUser>(
      'https://api.openweathermap.org/data/2.5/weather?q=' +
        _searchTerm +
        '&APPID=90f8114965195429f8a1f224ab83e494'
    );
  }
}
