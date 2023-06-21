import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { PlacesService } from '../../services/places.service';
import { Map, Marker, Popup } from 'mapbox-gl';
import { MapService } from '../../services/map.service';
import { FlightService } from '../../services';


@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit {

  @ViewChild('mapDiv') mapDivElement!: ElementRef;

  constructor(
    private placesService: PlacesService,
    private mapsService: MapService,
    private flightService: FlightService
    ){  }

  ngAfterViewInit(): void {
    if(!this.placesService.useLocation) throw Error('No hay placesServices.userLocation');
    
    const map = new Map({
      container: this.mapDivElement.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/light-v10', // style URL
      center: this.placesService.useLocation,
      zoom: 14,
      });

      this.flightService.getFlights()
      .subscribe({
        next: (res)=>{
          this.mapsService.getActiveFlights(res.list);
        }

      })
      ;


      this.mapsService.drawMarker(this.placesService.useLocation, map);

      
      
      
      this.mapsService.setMap(map);
  }

}




      
            // const popup = new Popup()
      // .setHTML(`
      // <h6>Aquí estoy</h6>
      // <span>Estoy en este lugar del mundo</span>
      
      // `)

      // new Marker({ color:'red', draggable:true })
      // .setLngLat()
      // //.setPopup(popup)
      // .addTo(map);
      // map.on('contextmenu', function(e){
      //   console.log(e)
      // })