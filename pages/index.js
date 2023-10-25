import MapAPI from '../components/MapAPI.js'
import { nycLATLNG as LOCATION } from '../utils/constants.js'

const mapElement = document.querySelector('.map');
let map
const promises = [
  google.maps.importLibrary('maps'),
  google.maps.importLibrary('geocoding')
];

function initGoogle() {
  return Promise.all(promises)
    .then(([Maps, Geocoding]) => {
      console.log(Maps);
      map = new Maps.Map(mapElement, {
        zoom: 9,
        center: LOCATION,
        mapId: "DEMO MAP ID"
      })
  })
}

const googleAPI = initGoogle()

