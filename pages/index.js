import { nycLATLNG as LOCATION,  locationBias as BIAS} from '../utils/constants.js';

const request = {
  query: 'haunted house',
  fields: ['name', 'formatted_address', 'price_level'],
  locationBias: BIAS,
}

const mapElement = document.querySelector('.map');
let map;
let houses = [];
let NYC;
let service;
const promises = [
  google.maps.importLibrary('maps'),
  google.maps.importLibrary('places'),
  google.maps.importLibrary('marker'),
];

function initGoogle() {

  return Promise.all(promises)
    .then(([Maps, Place, Markers]) => {
      NYC = new google.maps.LatLng(LOCATION.lat, LOCATION.lng);
      map = new Maps.Map(mapElement, {
        zoom: 11,
        center: NYC,
        mapId: "Haunted House Map"
      })
      service = new google.maps.places.PlacesService(map);
      service.nearbySearch({location: NYC, radius: 20000, keyword: 'haunted house',}, placeCallback);
  })
}

function placeCallback(results, status){
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    console.log(results.length);
    for (let i = 0; i < results.length; i++) {
      console.log(results[i].name);
    }
  }
}

const googleAPI = initGoogle()

