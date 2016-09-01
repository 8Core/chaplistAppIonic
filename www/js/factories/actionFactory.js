angular.module('actionFactory', [])
    //*************************************************************************************************************************
    .factory('factory', function ($http, $ionicPopup, $q, $cordovaDevice, $localStorage, ConnectivityMonitor, $timeout) {

        var comun = {};
        var packagaName = 'com.ionicframework.betasocial427641';
        var secretKey = 'b3445460e0b140be4e1105eb8836b16fdcf88f0daa03ac231d14635515a49bbd';
        /*var secretKey = 'ff19a665b11d832814bd6c94a89f5e921eb956ee0e9e63658571fada5759a4d9';*/
        comun.topFavs = [];
        comun.supermarketId = 1;
        comun.supermarketName = "Generico";
        /*
            Función para mostrar un mensaje sencillo en la pantalla
        */
        comun.ionicMessage = function (title, template) {
                $ionicPopup.alert({
                    title: title,
                    template: template
                });
            }
            /*
                Función para verificar el token al primer inicio de la aplicación
            */
        comun.tokenVerified = function () {
                var body = {};
                var tokenAux = {};
                var existe = false;

                if (comun.existsTokenAPI()) {
                    if (!existsSupermarketsLocal())
                        comun.getSupermarketsAPI(); //obtiene todos los supermercados actuales
                    existe = true;
                    return;
                }

                //de no existir un token se procede a solicitar uno a la API
                body.packageName = packagaName;
                body.secretKey = secretKey;

                try {
                    body.uuid = $cordovaDevice.getUUID();
                } catch (err) {
                    body.uuid = 'abcdefghijokl1234567'
                }
                return $http.post('http://chaplist.oktacore.com/api/Chap/tokenPetition', body)
                    //return $http.post('http://192.168.0.14:8080/api/Chap/tokenPetition', body)
                    .then(function (res) {
                        tokenAux = res.data.replace('"', '').replace('"', '');
                        if (res.status = 200 && tokenAux != 'null') {
                            $localStorage.tokenAPI = tokenAux;
                            $localStorage.favorites = [];
                            if (!existe)
                                comun.getSupermarketsAPI(); //obtiene todos los supermercados actuales
                            return tokenAux;
                        } else {
                            comun.ionicMessage('Advertencia', 'Las credenciales de la app no existen en la API');
                            return res;
                        }
                    }, function (err) {
                        return err;
                    });
            }
            /*
                Función para obtener todas las tiendas de un supermercado específico
            */
        comun.getStoresAPI = function (supermarketId) {
                var storesAux = [];
                var deferred = {};
                var result = {};
                if (ConnectivityMonitor.ifOffline()) { //verifico conectividad a internet
                    comun.ionicMessage('Mensaje', 'Para mejorar la experiencia, utilize internet');
                    return;
                }

                return $http.post('http://chaplist.oktacore.com/api/Chap/tokenPetition', body)
                    //return $http.post('http://192.168.0.14:8080/api/Chap/tokenPetition', body)
                    .then(function (res) {
                        tokenAux = res.data.replace('"', '').replace('"', '');
                        if (res.status = 200 && tokenAux != 'null') {
                            $localStorage.tokenAPI = tokenAux;
                            $localStorage.favorites = [];
                            if (!existe)
                                comun.getSupermarketsAPI(); //obtiene todos los supermercados actuales
                            return tokenAux;
                        } else {
                            comun.ionicMessage('Advertencia', 'Las credenciales de la app no existen en la API');
                            return res;
                        }
                    }, function (err) {
                        return err;
                    });
            }
            /*
                Función para obtener todas las tiendas de un supermercado específico
            */
        comun.getStoresAPI = function (supermarketId) {
                var storesAux = [];
                var deferred = {};
                var result = {};

                if (ConnectivityMonitor.ifOffline()) { //verifico conectividad a internet
                    deferred = $q.defer();
                    deferred.resolve([]);
                    return deferred.promise;
                }

                if (comun.existsTokenAPI())
                    return $http.get('http://chaplist.oktacore.com/api/Chap/Stores/' + supermarketId + '/' + getTokenAPI())
                        //return $http.get('http://192.168.0.14:8080/api/Chap/Stores/' + supermarketId + '/' + getTokenAPI())
                        .then(function (res) {
                            if (res.status = 200) {
                                result = transformToJson(res.data);
                                storesAux = result.stores;
                                compareToken(result.token);
                                return storesAux;
                            } else {
                                comun.ionicMessage('Advertencia', 'Las credenciales de la app no existen en la API');
                                return res;
                            }
                        }, function (err) {
                            return err;
                        });
                else
                    return [];
            }
            /*
                Función para obtener los productos en oferta vigentes para un supermercado seleccionado
            */
        comun.getProductsInOfferAPI = function (offset) {
                var deferred = {};
                var result = {};
                var products = [];

                if (ConnectivityMonitor.ifOffline()) { //verifico conectividad a internet
                    deferred = $q.defer();
                    deferred.resolve([]);
                    return deferred.promise;
                }

                if (comun.existsTokenAPI())
                    return $http.get('http://chaplist.oktacore.com/api/Chap/Offer/' + comun.supermarketId + '/' + offset + '/' + getTokenAPI())
                        //return $http.get('http://192.168.0.14:8080/api/Chap/Offer/' + comun.supermarketId + '/' + getTokenAPI())
                        .then(function (res) {
                            if (res.status = 200) {
                                result = transformToJson(res.data);
                                products = result.products;
                                for (var i = 0; i < products.length; i++) {
                                    products[i].dateInit = products[0].dateInit;
                                    products[i].dateEnd = products[0].dateEnd;
                                    products[i].name = comun.supermarketName;
                                }
                                compareToken(result.token);
                                return products;
                            } else {
                                comun.ionicMessage('Advertencia', 'Las credenciales de la app no existen en la API');
                                return [];
                            }
                        }, function (err) {
                            return [];
                        });
                else
                    comun.ionicMessage('Advertencia', 'Las credenciales de la app no existen en la API');
            }
            /*
                Función para obtener un producto específico en oferta
            */
        comun.getProductInOfferAPI = function (arrayProducts) {
                var products = [];
                var body = {
                    favProducts: arrayProducts
                };
                if (comun.existsTokenAPI())
                    return $http.post('http://chaplist.oktacore.com/api/Chap/Offer/favproducts/' + getTokenAPI(), body)
                        //return $http.get('http://192.168.0.14:8080/api/Chap/Offer/' + comun.supermarketId + '/' + getTokenAPI())
                        .then(function (res) {
                            if (res.status = 200) {
                                products = transformToJson(res.data);
                                return products;
                            } else {
                                comun.ionicMessage('Advertencia', 'Las credenciales de la app no existen en la API');
                                return [];
                            }
                        }, function (err) {
                            return [];
                        });
                else
                    comun.ionicMessage('Advertencia', 'Las credenciales de la app no existen en la API');
            }
            /*
                Función para agregar o remover likes de una aplicación
            */
        comun.addOrRemoveLikes = function (offerId, productId, type) {
                var body = {};
                var newOffer = {};
                //En este caso no es necesario realizar una promesa ya que las funciones que llaman
                //a esta funcionalidad no requieren un resultado de respuesta
                if (ConnectivityMonitor.ifOffline()) //verifico conectividad a internet
                    return;

                if (comun.existsTokenAPI()) {
                    body = {
                        offerId: offerId,
                        productId: productId,
                        type: type
                    };
                    return $http.post('http://chaplist.oktacore.com/api/Chap/Offer/likes/' + getTokenAPI(), body)
                        //return $http.get('http://192.168.0.14:8080/api/Chap/Offer/' + comun.supermarketId + '/' + getTokenAPI())
                        .then(function (res) {
                            if (res.status = 200) {
                                newOffer = transformToJson(res.data);
                                return newOffer;
                            } else {
                                comun.ionicMessage('Advertencia', 'Ocurrio algun problema con el servidor, comunicarse con el administrador');
                                return {};
                            }
                        }, function (err) {
                            return err;
                        });
                } else
                    comun.ionicMessage('Advertencia', 'Las credenciales de la app no existen en la API');
            }
            /*
                Función que verifica si existe un token válido
            */
        comun.existsTokenAPI = function () {
            if ($localStorage.hasOwnProperty("tokenAPI") === true)
                return true;
            else
                return false;
        }

        //*************************************************************************************************

        /*
            Función para obtener los supermerdados del almacenamiento local
        */
        comun.getSupermarketsAPI = function () {

            var result = {};
            return $http.get('http://192.9.200.24:8081/api/Chap/Supermarkets/guatemala')
                //return $http.get('http://192.168.0.14:8080/api/Chap/Supermarkets/' + getTokenAPI())
                .then(function (res) {
                    if (res.status = 200) {
                        console.log (res.data);//.res;
                    } else
                        return res.data.error;
                }, function (err) {
                    comun.ionicMessage('Advertencia', 'Ocurrio algun problema con el servidor, comunicarse con el administrador');
                    return err;
                });
        }
        /*
            Función para obtener las categoria de los productos
        */
        comun.getCategoriasAPI = function () {
            var result = {};
            return $http.get('http://192.9.200.24:8081/api/Chap/categories/')
                //return $http.get('http://192.168.0.14:8080/api/Chap/Supermarkets/' + getTokenAPI())
                .then(function (res) {
                    if (res.status = 200) {
                        return res.data.res;//.res;
                    } else
                        return res.data.error;
                }, function (err) {
                    comun.ionicMessage('Advertencia', 'Ocurrio algun problema con el servidor, comunicarse con el administrador');
                    return err;
                });
        }
            /*
                Función para obtener un top 5 de los favoritos en las ofertas vigentes
            */
        comun.getTopFavsAPI = function (callback) {
            return $http.get('http://192.9.200.24:8081/api/Chap/Offer/topfavs').then(function (res) {
                if (res.status == 200) {
                    return res.data.res;
                }
            }, function (err) {
                comun.ionicMessage('Advertencia', 'Ocurrio algun problema con el servidor, comunicarse con el administrador');
                return err;
            });

        }
            /**
             * Funcion que hace la peticion a la API y devuuleve los comentarios por oferta
             * 
             * @returns comments
             */
        comun.getComments = function getComments(callback) {
            var comments = [
                {
                    "name": "juan",
                    "image": "img/chapIcon.png",
                    "body": "muy buen producto! La torre tiene los mejores precios del mercado"
                },
                {
                    "name": "pedro",
                    "image": "img/chapIcon.png",
                    "body": "muy buen producto! Econo el mejor super"
                },
                {
                    "name": "pablo",
                    "image": "img/chapIcon.png",
                    "body": "muy buen producto!"
                },
                {
                    "name": "javier",
                    "image": "img/chapIcon.png",
                    "body": "muy buen producto!"
                },
                {
                    "name": "andres",
                    "image": "img/chapIcon.png",
                    "body": "muy buen producto!"
                }
            ];

            return comments;
        }

        /*
            Función para obtener el token actual en caso de existir sino, retorna null
        */
        function getTokenAPI() {
            return $localStorage.tokenAPI;
        }

        function setTopFavs(data) {
            comun.topFavs = [];
            data.forEach(function (offer) {
                console.log(offer.Offers[0])
                comun.topFavs.push({
                    Offers: offer.Offers,
                    createdAt: offer.createdAt,
                    description: offer.description,
                    id: offer.id,
                    upc: offer.upc,
                    updatedAt: offer.updatedAt,
                });
            });
        }

        function existsSupermarketsLocal() {
            if ($localStorage.hasOwnProperty("supermarkets") === true)
                return true;
            else
                return false;
        }
        comun.token = function () {
            return $localStorage.tokenAPI;
        }
        comun.getSupermarkets = function () {
                return $localStorage.supermarkets
            }
            /*
                Función para comparar el token actual y reemplazarlo en caso de que halla vencido
            */
        comun.getSupermarkets = function () {
                return $localStorage.supermarkets
            }
            /*
                Función para comparar el token actual y reemplazarlo en caso de que halla vencido
            */
        function compareToken(newToken) {
            if (getTokenAPI() != newToken) {
                setToken(newToken);
            }
        }
        /*
            Función para setear un token
        */
        function setToken(newToken) {
            $localStorage.tokenAPI = newToken;
        }
        /*
            Función que parsea un string a su formato JSON
        */
        function transformToJson(data) {
            return JSON.parse(data);
        }

        comun.getAllOffers = function (value, offset) {

            var deferred = {};
            var result = {};
            var products = [];

            if (ConnectivityMonitor.ifOffline()) { //verifico conectividad a internet
                deferred = $q.defer();
                deferred.resolve([]);
                return deferred.promise;
            }

            if (comun.existsTokenAPI()) {
                return $http.get('http://chaplist.oktacore.com/api/Chap/getAllOffers/' + value + '/' + offset + '/' + getTokenAPI())
                    .then(function (res) {
                        if (res.status = 200) {
                            result = transformToJson(res.data);
                            products = result.products
                            compareToken(result.token);
                            return products;
                        } else {
                            comun.ionicMessage('Advertencia', 'Las credenciales de la app no existen en la API');
                            return [];
                        }
                    }, function (err) {
                        return [];
                    });
            } else
                comun.ionicMessage('Advertencia', 'Las credenciales de la app no existen en la API');
        }


        return comun;
    })
