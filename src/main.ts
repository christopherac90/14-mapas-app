import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import Mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
 
Mapboxgl.accessToken = 'pk.eyJ1IjoiY3Jpc2FsdmFyYWRvIiwiYSI6ImNsaW00dW13MTAxdWYzbnM1anlrODA0ZmoifQ.NlVwKPbsAhn7g9gc_iV1sQ';


if(!navigator.geolocation){
  alert('Navegador no soporta la geolocalización')
  throw new Error('Navegador no soporta la geolocalización')
}


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
