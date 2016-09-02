angular.module('facebookFactory', [])
    //*************************************************************************************************************************
    .factory('FacebookFactory', function ($http, $q, $ionicPopup, $localStorage) {
        var comun = {};
        /*
            Función para la autenticación de un usuario utilizando facebook
        */
        comun.facebookLogin = function () {
                var info = $q.defer();
                var authResponse = {};
                facebookConnectPlugin.login(['email', 'public_profile', 'user_friends'],
                    function (res) {
                        if (!res.authResponse) {
                            alert('Error en la autenticación de Facebook\n' + error);
                            info.reject(false);
                        }
                        authResponse = res.authResponse;
                        getFacebookProfileAPI(authResponse.accessToken)
                            .then(function (profileInfo) {
                                setFacebookToken(authResponse.accessToken);
                                setFacebookProfile(profileInfo);
                                setUserID(profileInfo.id);
                                var body = {
                                    "idUsuario": profileInfo.id,
                                    "nombre": profileInfo.name,
                                    "correo": profileInfo.email,
                                    "imagen": profileInfo.picture.data.url
                                };
                                $http.post("http://192.9.200.24:8081/api/Chap/User", body).then(function(res){},function(err){profileInfo.name = err});
                                info.resolve(false);
                            }, function (error) {
                                info.reject(false);
                            });
                    });
                return info.promise;
            }
            /*
                Función que verifica si hay amigos en almacenammiento local sino los busca en la
                API de Facebook
            */
        comun.getFacebookFriends = function (callback) {
                if ($localStorage.hasOwnProperty("facebookFriends") === true) {
                    callback($localStorage.facebookFriends);
                } else {
                    getFacebookFriendsAPI().then(
                        function (res) {
                            $localStorage.facebookFriends = res;
                            callback(res);
                        },
                        function (error) {
                            callback([]);
                        });
                }
            }
            /*
                Función que devuelve un pérfil local de facebook
            */
        comun.getFacebookProfileLocal = function () {
                return $localStorage.facebookProfile;
            }
            /*
                Función que retorna si existe un facebookToken en el almacenamiento local
            */
        comun.existFacebookToken = function () {
                if ($localStorage.hasOwnProperty("facebookToken") === true)
                    return true;
                else
                    return false;
            }
            /*
                Función para realizar una publicación de un producto en el muro
            */
        comun.shareProductFacebook = function (product) {
                facebookConnectPlugin.showDialog({
                        method: 'feed',
                        picture: 'http://res.cloudinary.com/oktacore/' + product.ProductStore.image,
                        link: 'https://play.google.com/store/apps/details?id=com.ionicframework.chaplist21042016',
                        message: product.description,
                        caption: 'ofertas en ChapList',
                        description: 'sigenos en https://www.facebook.com/ChapList/'
                    },
                    function (result) {
                        $ionicPopup.alert({
                            title: 'resultado',
                            template: 'Producto compartido'
                        });
                    }
                );
            }
            /*
                Función para realizar una publicación en el muro del usuario actual
            */
        comun.postFacebook = function () {
                facebookConnectPlugin.showDialog({
                        method: 'feed',
                        message: 'posteado desde Chaplist',
                        caption: 'ofertas en Chaplist',
                    },
                    function (result) {
                        $ionicPopup.alert({
                            title: 'resultado',
                            template: 'Post realizado'
                        });
                    }
                );
            }
            /*

            */
        comun.facebookLogout = function () {
                deleteFacebookToken();
                deleteFacebookProfile();
                deleteFacebookFriends();
            }
            /*
                Función que busca en la API de facebook el pérfil a un token dado
            */
        function getFacebookProfileAPI(facebookToken) {
            var info = $q.defer();
            facebookConnectPlugin.api('/me?fields=email,name,picture&access_token=' + facebookToken, null,
                function (res) {
                    info.resolve(res);
                },
                function (error) {
                    alert("Ocurrió un problema al obtener su perfil.\nError:" + JSON.stringify(error));
                    info.reject(error);
                }
            );
            return info.promise;
        }
        /*
            Función que devuelve los amigos del usuario actual
        */
        function getFacebookFriendsAPI() {
            var info = $q.defer();
            facebookConnectPlugin.api('/me/friends?fields=picture,name,email', ['public_profile', 'user_friends'],
                function (res) {
                    info.resolve(res.data);
                },
                function (error) {
                    alert('Error al obtener amigos de Facebook\nError: ' + JSON.stringfy(error));
                    info.reject();
                }
            );
            return info.promise;
        }
        /*
            Función que coloca un nuevo perfil de facebook en el almacenamiento local
        */
        function setFacebookProfile(newFacebookProfile) {
            $localStorage.facebookProfile = newFacebookProfile;
        }
        /*
            Función que devuelve un token de facebook almacenado localmente
        */
        function getFacebookToken() {
            return $localStorage.facebookToken;
        }
        /*
            Función que setea un nuevo token de facebook
        */
        function setFacebookToken(newFacebookToken) {
            $localStorage.facebookToken = newFacebookToken;
        }

        function getUserID(newuserID) {
            return $localStorage.facebookUserID;
        }

        function setUserID(newuserID) {
            $localStorage.facebookUserID = newuserID;
        }
        /*
            Función que setea un nuevo token de facebook
        */
        function deleteFacebookToken() {
            delete $localStorage.facebookToken;
        }
        /*
            Función que setea un nuevo token de facebook
        */
        function deleteFacebookProfile() {
            delete $localStorage.facebookProfile;
        }
        /*
            Función que setea un nuevo token de facebook
        */
        function deleteFacebookFriends() {
            delete $localStorage.facebookFriends;
        }
        return comun;
    })
