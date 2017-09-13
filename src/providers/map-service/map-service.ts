import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';


import * as mapboxgl from '../../../node_modules/mapbox-gl/dist/mapbox-gl.js';
import { Map } from '../../../node_modules/mapbox-gl/dist/mapbox-gl.js';

@Injectable()
export class MapService {

  map: Map<any, any>;

  constructor() {
    (mapboxgl as any).accessToken = 'pk.eyJ1IjoiY29ucXVlciIsImEiOiJjajN3eWd3ZGswMDhlMnFyeWplMDVpdjNxIn0.Jj7LeikoSKgUiqar41JFpw';
  }

}
