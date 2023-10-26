import { nycLATLNG as LOCATION,  locationBias as BIAS} from '../utils/constants.js';


const dayOfWeek = new Date(Date.now()).getDay();
const mapElement = document.querySelector('.content__map');
const nameElement = document.getElementById('location-name');
const addressElement = document.getElementById('location-address');
const hoursElement = document.getElementById('location-hours');
const pricesElement = document.getElementById('location-prices');

let googleMap;
const hauntedHouses = {};

const mapMarkers = {};
let NYC;
let placeService;
const libraryImportPromises = [
  google.maps.importLibrary('maps'),
  google.maps.importLibrary('places'),
  google.maps.importLibrary('marker'),
  google.maps.importLibrary('geocoding'), //so far this hasn't been necessary. TODO: remove if it IS unnecessary
];

function callGoogle([Maps, Place]) {
  NYC = new google.maps.LatLng(LOCATION.lat, LOCATION.lng);
  const nearbyHousesRequest = {
    location: NYC, radius: 10000, keyword: 'haunted house',
  }
  googleMap = new Maps.Map(mapElement, {
    zoom: 12.5,
    center: NYC,
    mapId: "11f20905e0adeaa8",
  })
  placeService = new Place.PlacesService(googleMap);
  placeService.nearbySearch(nearbyHousesRequest, handleNearbyHousesRequest);
}

function handleNearbyHousesRequest(results, status){
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (let i = 0; i < results.length; i++) {
      const searchName = results[i]["name"]
      const house = results[i];
      house.details = {};
      const placeDetailRequest = {
        placeId: house.place_id,
        fields: ['opening_hours', 'website', 'formatted_address', 'price_level']
      }

      const markerRequest = {
        position: house.geometry.location,
        title: house.name,
        optimized: false,
        map: googleMap,
      }

      placeService.getDetails(placeDetailRequest, (response) => {
        house.details.opening_hours = response.opening_hours;
        house.details.website = response.website;
        house.details.formatted_address = response.formatted_address;
        house.details.price_level = response.price_level;
      })

      hauntedHouses[searchName] = house;
      const marker = new google.maps.Marker(markerRequest)

      if (i === 0) {
        const starterInfo = {
          name: house.name,
          address: house.details.formatted_address,
          hours: getPlaceHours(house),
          price: house.details.price_level,
        };
        setInfo(starterInfo);
      }

      mapMarkers[searchName] = marker;
      marker.addListener("click", handleIconClick)
    }
  }
}

function handleIconClick(evt) {
  const searchName = evt.domEvent.target.title;
  const markedHouse = hauntedHouses[searchName];
  //const mapMarker = mapMarkers[searchName];

  const name = markedHouse.name;
  const address = markedHouse.details.formatted_address;
  const hours = getPlaceHours(markedHouse);
  const priceLevel = markedHouse.details.price_level;

  setInfo({name, address, hours, priceLevel})
}

function setInfo({name, address, hours, price}){
  nameElement.textContent = name;
  addressElement.textContent = address;
  hoursElement.textContent = hours;
  pricesElement.textContent = price;
}

function getPlaceHours(place){
  const hoursObject = place.details.opening_hours;
  try{
    const openTime = hoursObject.periods[dayOfWeek].open.time;
    const closeTime = hoursObject.periods[dayOfWeek].close.time;
    return `Open from ${timeConvert(openTime)} to ${timeConvert(closeTime)} today!`
  } catch {
    return "No time information available."
  }
}

function timeConvert(time) {
  let hours = Number(time.slice(0, 2));
  const minutes = time.slice(-2);
  return `${hours % 12}:${minutes} ${hours < 13 ? 'AM' : 'PM'}`
}

Promise.all(libraryImportPromises).then(callGoogle);

