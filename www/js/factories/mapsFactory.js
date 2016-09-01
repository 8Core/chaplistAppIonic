angular.module('mapsFactory', [])

.factory('GoogleMaps', function ($http, $cordovaGeolocation, $q, $ionicLoading, $cordovaNetwork, ConnectivityMonitor, factory) {
    var comun = {};
    var myPosition = {};
    var markers = [];
    var map = null;
    var icon = {
        size: new google.maps.Size(40, 35),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(0, 32)
    };
    /*
        Función que inicia el proceso de construcción del mapa
    */
    comun.init = function (val) {
            if (ConnectivityMonitor.isOnline()) {
                if (val && val == 1) {
                    removeMarkers();
                    console.log('eliminacion de markers');
                }
                initMap();
                return true;
            } else {
                return false;
            }
        }
        /*
            Función que carga el mapa y bloque la pantalla mientras carga
        */
    function initMap() {
        $ionicLoading.show({
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        });
        getInitPosition(function (res) {
            printMap(res);
            $ionicLoading.hide();
        });
    }
    /*
        Función que retorna la posición inicial de la siguiente forma:
        Si está habilitado el gps lo hace con la posición del usuario.
        Si no lo hace respecto a la primer tienda que encuentre en el listado de tiendas.
    */
    function getInitPosition(callback) {
        var coords = {};
        //opciones utilizadas para la API de google y definición en el tiempo de carga 10 seg. max.
        var options = {
            frequency: 1000,
            timeout: 10000,
            enableHighAccuracy: false
        };
        $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
            coords.latitude = position.coords.latitude;
            coords.longitude = position.coords.longitude;
            coords.name = 'Yo';
            coords.image = 'http://res.cloudinary.com/dtzhkqqms/image/upload/v1454544462/user_v4wbos.png'
            myPosition = coords;
            callback(coords);
        }, function (error) { //coordenas de econosuper central
            coords.latitude = 14.621280;
            coords.longitude = -90.545005;
            callback(coords);
        });
    }
    /*
        Función que instancia un nuevo mapa sobre el área
        y define el centro y el zoom del mismo al inicio
    */
    function printMap(coordsObject) {
        var latLng = new google.maps.LatLng(coordsObject.latitude, coordsObject.longitude);
        var mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById("map"), mapOptions);
        //Wait until the map is loaded
        google.maps.event.addListenerOnce(map, 'idle', function () {
            //Load the markers
            loadMarkers();
        });
    }
    /*
        Función para cargar todos los puntos en el mapa
    */
    function loadMarkers() {
        if (myPosition.name) {
            createMarker(myPosition.name, '', '', myPosition.latitude, myPosition.longitude, myPosition.image);
        }
        findAllStores();
    }
    /*
        Función que busca todas las tiendas
    */
    function findAllStores() {
        var supermarkets = factory.getSupermarkets();
            var stores = $http.get('http://192.9.200.24:8081/api/Chap/Stores').then(function (res) {
                if (res.status == 200) {
                    console.log(res.data.res);
                }
            });
            /*stores.forEach(function (store) {
                createMarker(store.name, store.address, store.phoneNumber, store.latitude, store.longitude, supermarket.image);
            });*/
    }
    /*
        Función que agrega el marcador al mapa
    */
    function createMarker(title, address, phoneNumber, latitude, longitude, image) {
        var record = {};
        var markerPos, marker, infoWindowContent;

        markerPos = new google.maps.LatLng(latitude, longitude);
        icon.url = image;
        // Add the markerto the map
        marker = new google.maps.Marker({
            map: map,
            title: name,
            animation: google.maps.Animation.DROP,
            position: markerPos,
            icon: icon
        });

        infoWindowContent = '<div><p><h4>' + title + '</h4></p></div>'
        if (title != 'Yo') {
            infoWindowContent += '<div id="bodyContent"><p><b>Dirección:</b> ' + address + '<br><b>Número de teléfono:</b> ' +
                phoneNumber + '</p>';
        }
        markers.push(marker);
        addInfoWindow(marker, infoWindowContent, record);
    }
    /*
        Función para agregar información específica a cada marcador agregado al mapa
    */
    function addInfoWindow(marker, message, record) {
        var infoWindow = new google.maps.InfoWindow({
            content: message,
            maxWidth: 200
        });

        google.maps.event.addListener(marker, 'click', function () {
            infoWindow.open(map, marker);
        });
    }
    /*
        Función para setear un mapa a un conjunto de markers
    */
    function setMarkersMap(map) {
        for (i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    }

    function removeMarkers() {
        setMarkersMap(null);
        markers = [];
    }
    return comun;
})

//*************************************************************************************************************************

.factory('ConnectivityMonitor', ['$cordovaNetwork', function ($cordovaNetwork) {
    var comun = {};

    /*
        Función que retorna true si existe conexión a internet
    */
    comun.isOnline = function () {
            if (ionic.Platform.isWebView()) {
                return $cordovaNetwork.isOnline();
            } else {
                return navigator.onLine;
            }

        }
        /*
            Función que retorna true si no existe conexión a internet
        */
    comun.ifOffline = function () {
        if (ionic.Platform.isWebView()) {
            return !$cordovaNetwork.isOnline();
        } else {
            return !navigator.onLine;
        }
    }

    return comun;
}])