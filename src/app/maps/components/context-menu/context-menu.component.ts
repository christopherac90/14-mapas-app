import { Component, inject } from '@angular/core';
import { MapService } from '../../services';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css']
})
export class ContextMenuComponent {

  menuTopLeftPosition =  {x: '0px', y: '0px'} 

  private mapService = inject(MapService);
  
  get clickDerechoGetter(){
    return this.mapService.getclickDerecho;
  }

  getX(){
    const coordinate = this.mapService.getMouseCoordinates();
    return this.menuTopLeftPosition.x = `${coordinate.x}px`; 
  }

  getY(){
    const coordinate = this.mapService.getMouseCoordinates();
    return   this.menuTopLeftPosition.y = `${coordinate.y}px`;    
  }

  // nuevoVuelo(){
  //   this.mapService.setclickDerecho(false); 
  // }



  
}
