import { Component } from '@angular/core';
import { PlacesService } from '../../services';

@Component({
  
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {

  private debouceTimer?:NodeJS.Timeout;

  constructor(private placesService: PlacesService){}

  onQueryChange(query: string=''){
    if(this.debouceTimer) clearTimeout(this.debouceTimer);
    this.debouceTimer = setTimeout(() => {
      this.placesService.getPlacesByQuery(query)  ;
    }, 500);
    

  }

}
