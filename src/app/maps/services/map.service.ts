import { Injectable } from '@angular/core';
import { AnySourceData, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { Feature } from '../interfaces/places';
import { DirectionsApiClient } from '../api';
import { DirectionsRespose, Route } from '../interfaces/directions';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map?: Map;
  private markers: Marker[] = [];

  constructor(private directionsApi: DirectionsApiClient){}

  get isMapReady(){
    return !!this.map;
  }

  setMap(map:Map){
    this.map = map;
  }

  flyTo(coords:LngLatLike ){
    if(!this.isMapReady) throw Error('El mapa no está inicializado');

    this.map?.flyTo({
      zoom:14,
      center: coords
    })

  }

  createMarkersFromPlaces(places:Feature[], userLocation:[number, number] ){
    if(!this.map) throw Error('Mapa no inicializado');
    console.log(userLocation)
    if(!userLocation) throw Error('No hay locación actual');
    
    
    this.markers.forEach(marker=> marker.remove());
    const newMarkers = [];
    
    for(const place of places){
      const [lng, lat]= place.center;
      const popup = new Popup()
      .setHTML(`
      <h5>${place.text}</h5>
      <span>${place.place_name}</span>      
      `)
      const newMarker= new Marker()
      .setLngLat([lng,lat])
      .setPopup(popup)
      .addTo(this.map);

      newMarkers.push(newMarker)
    }
    this.markers = newMarkers;
    if(places.length === 0) return;
    //limites del mapa
    const bounds = new LngLatBounds();
    newMarkers.forEach(marker=> bounds.extend( marker.getLngLat()));
    //const nuevo: LngLatLike();
    bounds.extend(userLocation);

    this.map.fitBounds(bounds, {
      padding: 200
    });

  }

  getRouteBetweenPoints(start:[number, number], end:[number, number]){
    this.directionsApi.get<DirectionsRespose>(`/${ start.join(',') };${end.join(',')}`)
    .subscribe(resp=> this.drawPolyline(resp.routes[0] ));
  }

  private drawPolyline(route:Route){

    if(!this.map) throw Error('Mapa no incializado');
    const coords = route.geometry.coordinates;

    const bounds = new LngLatBounds();

    coords.forEach( ([lng, lat ]) => {      
      bounds.extend([lng, lat])
    });

    this.map?.fitBounds(bounds, {
      padding: 200
    });

    const sourceData: AnySourceData = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type:'Feature',
            properties: {},
            geometry:{
              type:'LineString',
              coordinates: coords
            }
          }
        ]       
      }
    }

    //TODO: Limpiar ruta previa
    if(this.map.getLayer('RouteString')){
      this.map.removeLayer('RouteString');
      this.map.removeSource('RouteString');
    }
    

    this.map.addSource('RouteString', sourceData);
    this.map.addLayer({
      id:'RouteString',
      type:'line',
      source:'RouteString',
      layout: {
        'line-cap':'round',
        'line-join': 'round',
      },
      paint:{
        'line-color':'black',
        'line-width':3
      }
    });
  }

}
