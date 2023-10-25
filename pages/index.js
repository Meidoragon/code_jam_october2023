import { nycLATLNG as LOCATION,  locationBias as BIAS} from '../utils/constants.js';




const mapElement = document.querySelector('.content__map');
let map;
let houses = [];
let NYC;
let service;
const promises = [
  google.maps.importLibrary('maps'),
  google.maps.importLibrary('places'),
  google.maps.importLibrary('marker'),
];

async function initGoogle() {

  return Promise.all(promises)
    .then(([Maps, Place, Markers]) => {
      NYC = new google.maps.LatLng(LOCATION.lat, LOCATION.lng);
      const nearbyHousesRequest = {
        location: NYC, radius: 20000, keyword: 'haunted house',
      }
      map = new Maps.Map(mapElement, {
        zoom: 11,
        center: NYC,
        mapId: "Haunted House Map"
      })
      service = new google.maps.places.PlacesService(map);
      service.nearbySearch(nearbyHousesRequest, handleNearbyHousesRequest);
  })
}

function handleNearbyHousesRequest(results, status){
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    console.log(results[0]);

    for (let i = 0; i < results.length; i++) {
      houses = results;
      const marker = new google.maps.Marker({
        position: results[i].geometry.location,
        label: String(i),
        title: houses[i].name,
        optimized: false,
        map: map,
      })
      marker.addListener("click", () => {
        console.log(houses[Number(marker.label)].name);
      })
    }
  }
}

const googleAPI = initGoogle()

