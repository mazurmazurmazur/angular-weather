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
  styles: [
    `
      .img {
        position: relative;
        float: left;
        width: 100px;
        height: 100px;
        background-position: 50% 50%;
        background-repeat: no-repeat;
        background-size: cover;
      }

      input {
        border: 1px solid black;
      }
    `
  ],
  template: `
    <h3>TYPE IN THE NAME OF THE CITY</h3>

    <input class="form-control" type="search" [formControl]="searchControl" />
    <div *ngIf="isLoading">
      <i class="fa fa-spinner fa-spin fa-3x"></i>
    </div>
    <div *ngIf="!users || tLength < 1" class="media">
      <a>CITY NOT FOUND</a>
    </div>
    <div *ngIf="users && tLength > 100" class="media">
      <div>
        <a>
          <img
            class="media-object img"
            src="https://loremflickr.com/320/240/{{ users.name }}"
            alt="..."
          />
        </a>
      </div>
      <br /><br /><br /><br /><br /><br />
      <div class="media-body">
        <h2 class="media-heading">{{ users.name }}</h2>
        <h3>{{ users.weather.description }}</h3>
        <h2>Temperature: {{ users.main.temp }}</h2>
        <h2>Pressure: {{ users.main.pressure }}</h2>
        <h2>Humidity: {{ users.main.humidity }}</h2>
        <h2>Wind speed: {{ users.wind.speed }} m/s</h2>
      </div>
    </div>
  `,
  providers: [WeatherService]
})
export class AppComponent {
  searchControl = new FormControl();
  isLoading = false;
  users;
  tLength;
  constructor(private _weatherService: WeatherService) {}

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        filter(text => text.length >= 2), ///there are cities which names are no longer than 2 characters
        debounceTime(400), //400 ms delay for efficiency
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.isLoading = true;

        this._weatherService.getWeatherData(value).subscribe(
          data => {
            this.isLoading = false;
            this.users = data; //asssigning current city JSON to variable used in template
            this.tLength = JSON.stringify(data).length; //used to check if city is valid
          },
          err => console.log((this.tLength = 0)) //indicates that the city does not exist
        );
      });
  }
}
