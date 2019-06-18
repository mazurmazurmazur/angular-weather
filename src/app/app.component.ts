import { Component } from '@angular/core';
import { WeatherService } from './weather.service';

import {
  filter,
  debounceTime,
  distinctUntilChanged,
  catchError
} from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [WeatherService]
})
export class AppComponent {
  searchControl = new FormControl();
  isLoading = false;
  cities;
  tLength;
  constructor(private _weatherService: WeatherService) {}

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        filter(text => text.length >= 2),
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.isLoading = true;

        this._weatherService.getWeatherData(value).subscribe(
          data => {
            this.isLoading = false;
            this.cities = data;
            this.tLength = JSON.stringify(data).length;
          },
          err => console.log((this.tLength = 0))
        );
      });
  }
}
