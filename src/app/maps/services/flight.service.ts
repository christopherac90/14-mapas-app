import { Injectable, inject } from '@angular/core';
import { NewFlight } from '../interfaces/flight';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { MapService } from './map.service';
import { Response } from '../interfaces/response';
import { Observable } from 'rxjs';
import { ResponseFlights } from '../interfaces/responseFlights';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  private readonly baseUrl: string = environment
  .baseUrl;  
  private http = inject(HttpClient);
  private mapService = inject(MapService);

  

  constructor() { }

  saveFlight(newFlight: NewFlight):Observable<Response>{
    const url = `${ this.baseUrl }/Flight`;

    const body = { 
      name: newFlight.name,
      brand: newFlight.brand,
      flyType: newFlight.flyType,
      minutesFlyTime: newFlight.minutesFlyTime,
      latitude: this.mapService.getCurrentCords?.lat.toString(),
      longitude: this.mapService.getCurrentCords?.lng.toString()
     };
    
    return this.http.post<Response>(url, body);
  }

  getFlights():Observable<ResponseFlights>{
    const url = `${ this.baseUrl }/Flights`;    
    return this.http.get<ResponseFlights>(url);
  }
}
