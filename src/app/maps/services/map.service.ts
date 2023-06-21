import { Injectable } from '@angular/core';
import { AnySourceData, LngLat, LngLatBounds, LngLatLike, Map, Marker, Point, Popup } from 'mapbox-gl';
import { Feature } from '../interfaces/places';
import { DirectionsApiClient } from '../api';
import { DirectionsRespose, Route } from '../interfaces/directions';
import { NewFlight } from '../interfaces/flight';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map?: Map;
  private markers: Marker[] = [];
  private mainMarker?: Marker=undefined;
  private clickDerecho: boolean = false;
  private coordenadasClick?: Point = undefined;
  private menuTopLeftPosition =  {x: 0, y: 0} 
  private currentCords?:LngLat=undefined;


 
  

  constructor(private directionsApi: DirectionsApiClient){}

  get isMapReady(){
    return !!this.map;
  }

  setMap(map:Map){
    this.map = map;
  }


  get getclickDerecho(){
    return this.clickDerecho;
  }
  setclickDerecho(click:boolean){
    this.clickDerecho = click;
  }

  get getCurrentCords(){

    this.currentCords = this.mainMarker?.getLngLat();

    return this.currentCords;
  }

  flyTo(coords:LngLatLike ){
    if(!this.isMapReady) throw Error('El mapa no está inicializado');
    
    if(!this.map) throw Error('El mapa no existe');
    //this.markers.forEach(marker=> marker.remove());
    
    const coord: LngLat = LngLat.convert(coords);

    this.drawMarker([coord.lng, coord.lat], this.map);
    this.map?.flyTo({
      zoom:17,
      center: coords
    })

  }

  drawMarker(location:[number, number], map: Map){

    const popup = new Popup({closeButton:false})
    .setHTML(`
    <button href="#"  class="btn btn-primary float-end" aria-current="true"
      data-bs-toggle="modal" data-bs-target="#exampleModal"
      (click)="nuevoVuelo()"      
      >Nuevo Vuelo</button>
    `)
    
//     .on('open',(e)=>{
// //      console.log(e);
//       //this.setMouseCoordinate(new Point(..x, e.y));
//       this.setclickDerecho(true); 
//     })


    const newMarker = new Marker({ color:'red', draggable:true  })

      .setLngLat(location)
      .setPopup(popup)      
      .addTo(map);
      // map.on('contextmenu', (e) => {
      //   this.setMouseCoordinate(e.point);
      //   this.setclickDerecho(true);  
      // });
      map.on('click', (e) => {       
        this.setclickDerecho(false);  
      });

      /*newMarker.getElement().addEventListener('contextmenu', (e) => {
        
        this.setMouseCoordinate(new Point(e.x, e.y));
         this.setclickDerecho(true);  
      });*/
      this.mainMarker = newMarker;
      this.markers.push(newMarker);
  }

  setMouseCoordinate(point: Point){
    this.menuTopLeftPosition.x = point.x;
    this.menuTopLeftPosition.y = point.y;   
  }

  getMouseCoordinates(){
    return this.menuTopLeftPosition;
  }

  // createMarkersFromPlaces(places:Feature[], userLocation:[number, number] ){
  getActiveFlights(flights:NewFlight[]){
    if(!this.map) throw Error('Mapa no inicializado');
    //if(!userLocation) throw Error('No hay locación actual');
    
    //this.markers.forEach(marker=> marker.remove());
    const newMarkers = [];
    
    for(const flight of flights){
      const date = new Date(flight.flyDate);      

      const nuevo: LngLatLike= [Number(flight.longitude), Number(flight.latitude)];
      const popup = new Popup()
      .setHTML(`
      <h6>Nombre Piloto: ${flight.brand.toLocaleUpperCase() }</h6>
      <hr>
      <span>Drone: ${flight.name}</span> 
      <br>
      <span>Volaré aquí hasta: ${ date.toLocaleString()  }</span>      
      `)

      
      const newMarker= new Marker()
      .setLngLat(nuevo)
      .setPopup(popup)
      .addTo(this.map);

      this.markers.push(newMarker);
    }

    
    // }
    // this.markers = newMarkers;
    // if(places.length === 0) return;
    // //limites del mapa
    // const bounds = new LngLatBounds();
    // newMarkers.forEach(marker=> bounds.extend( marker.getLngLat()));
    // //const nuevo: LngLatLike();
    // bounds.extend(userLocation);

    // this.map.fitBounds(bounds, {
    //   padding: 200
    // });

  }

  // getRouteBetweenPoints(start:[number, number], end:[number, number]){
  //   this.directionsApi.get<DirectionsRespose>(`/${ start.join(',') };${end.join(',')}`)
  //   .subscribe(resp=> this.drawPolyline(resp.routes[0] ));
  // }

  // private drawPolyline(route:Route){

  //   if(!this.map) throw Error('Mapa no incializado');
  //   const coords = route.geometry.coordinates;

  //   const bounds = new LngLatBounds();

  //   coords.forEach( ([lng, lat ]) => {      
  //     bounds.extend([lng, lat])
  //   });

  //   this.map?.fitBounds(bounds, {
  //     padding: 200
  //   });

  //   const sourceData: AnySourceData = {
  //     type: 'geojson',
  //     data: {
  //       type: 'FeatureCollection',
  //       features: [
  //         {
  //           type:'Feature',
  //           properties: {},
  //           geometry:{
  //             type:'LineString',
  //             coordinates: coords
  //           }
  //         }
  //       ]       
  //     }
  //   }

  //   TODO: Limpiar ruta previa
  //   if(this.map.getLayer('RouteString')){
  //     this.map.removeLayer('RouteString');
  //     this.map.removeSource('RouteString');
  //   }
    

  //   this.map.addSource('RouteString', sourceData);
  //   this.map.addLayer({
  //     id:'RouteString',
  //     type:'line',
  //     source:'RouteString',
  //     layout: {
  //       'line-cap':'round',
  //       'line-join': 'round',
  //     },
  //     paint:{
  //       'line-color':'black',
  //       'line-width':3
  //     }
  //   });
  // }

}

