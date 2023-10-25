export default class MapAPI {
    #location
    #Map
    #AdvancedMarkerElement
    #mapElement

    constructor(options) {
        this.#location = options.location
        this.#mapElement = options.mapElement
        this.#Map = google.maps.importLibrary("maps")
        this.#AdvancedMarkerElement = google.maps.importLibrary("marker");

        Promise.all(this.#Map = google.maps.importLibrary("maps"), (res) => {
            console.log(res)
        })
    }

    createMap(){
        return new this.#Map(this.#mapElement, {
            zoom: 4,
            center: this.#location,
            mapId: "DEMO_MAP_ID"
        })
    }
}