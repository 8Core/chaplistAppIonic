angular.module('appCtrl', [])


.controller('AppCtrl', function ($rootScope, $scope, $ionicModal, $ionicPopup, $state, $ionicPopover, $timeout, $ionicLoading,
    FacebookFactory, factory, ConnectivityMonitor) {
    // Form data for the login modal
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;
    factory.tokenVerified();

    $scope.uiRouterState = $state;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function () {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function () {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function () {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function () {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function (bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function (location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
        case 'left':
            hasHeaderFabLeft = true;
            break;
        case 'right':
            hasHeaderFabRight = true;
            break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function () {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.hideHeader = function () {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function () {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function () {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };
    /*----------------------------------------------------------------------------------*/
    /*----------------------------------------------------------------------------------*/
    /*----------------------------------------------------------------------------------*/

    $scope.facebook = function () {
            if (ConnectivityMonitor.ifOffline()) {
                $scope.ionicMessage('Advertnecia', 'Debe estar conectado a internet para usar esta funcionalidad');
                return;
            }
            if (!FacebookFactory.existFacebookToken()) {
                $scope.ionicMessage('Mensaje', 'Debe loguearse con su cuenta de Facebook.');
                $state.go('app.home');
            } else
                $state.go('app.profile');
        }
        /*
            Función para compartir un producto específico mediante fb
        */
    $scope.shareProduct = function (product) {
        //compruebo que exista un usuario logueado de lo contrario se redirige a la pantalla de inicio
        if (!FacebookFactory.existFacebookToken()) {
            if (ConnectivityMonitor.ifOffline()) {
                $scope.ionicMessage('Advertnecia', 'Debe estar conectado a internet para usar esta funcionalidad');
                return;
            }
            $ionicLoading.show({
                template: 'Autenticando...'
            });
            FacebookFactory.facebookLogin().then(
                function (res) {
                    FacebookFactory.shareProductFacebook(product);
                },
                function (error) {
                    $scope.ionicMessage('Error', 'Ha ocurrido un error durante la autenticación.');
                });
            $ionicLoading.hide();
        } else {
            FacebookFactory.shareProductFacebook(product);
        }
    }

    //función global para solicitar comprobación de internet
    $scope.isOnline = function () {
        return ConnectivityMonitor.isOnline();
    }

    $scope.isOffline = function () {
            return ConnectivityMonitor.ifOffline();
        }
        /*
            Función para mostrar un mensaje sencillo en la pantalla
        */
    $scope.ionicMessage = function (title, template) {
        $ionicPopup.alert({
            title: title,
            template: template
        });
    }
})

.controller('HomeCtrl', function ($ionicPlatform, $scope, $timeout, $state, $ionicLoading, ionicMaterialInk, FacebookFactory, ConnectivityMonitor, ionicMaterialMotion, factory, offerFactory, $ionicSlideBoxDelegate) {

    $scope.$parent.clearFabs();
    $scope.$on('ngLastRepeat.mylist', function (e) {
        $timeout(function () {
            $scope.$parent.hideHeader();
            ionicMaterialMotion.fadeSlideIn({
                selector: '.animate-fade-slide-in .item'
            });
            $ionicSlideBoxDelegate.update(); /*NECESARIO PARA CARGA DE LOS SLIDE-BOX, SIN ESTO NO FUNCIONA*/
        }, 0);
    });

    ionicMaterialInk.displayEffect();
    /*----------------------------------------------------------------------------------*/
    /*----------------------------------------------------------------------------------*/
    /*----------------------------------------------------------------------------------*/
    $scope.topOffers = factory.topFavs; //factory.getTopFavs();

    $ionicPlatform.ready(function () {
        loadTopFav();
    });

    /*if (factory.topFavs.length < 1) {
        $scope.$parent.ionicMessage('Bienvenido', 'Tire de la pantalla para ver nuestro top de ofertas.');
    }*/

    $scope.reload = function () {
        loadTopFav();
    };

    $scope.facebookLogin = function () {
            if (!FacebookFactory.existFacebookToken()) {
                if (ConnectivityMonitor.ifOffline()) {
                    $ionicPopup.alert({
                        title: 'Advertencia',
                        template: 'Debe estar conectado a internet para usar esta funcionalidad'
                    });
                    return;
                }
                $ionicLoading.show({
                    template: 'Autenticando...'
                });
                FacebookFactory.facebookLogin().then(
                    function (res) {
                        $state.go('app.profile');
                    },
                    function (error) {
                        $state.go('app.home');
                    });
                $ionicLoading.hide();

            } else {
                $state.go('app.profile');
                $ionicLoading.hide();
            }
        }
        /*
                Función para colocar un producto para su detalle
            */
    $scope.setProductDetail = function (productDetail) {
        var productDetail = {
            ProductStore: {
                image: productDetail.image,
                normalPrice: productDetail.normalPrice,
                offerPrice: productDetail.offerPrice,
                likes: productDetail.likes,
                offerId: productDetail.offerId,
                productId: productDetail.productId
            },
            description: productDetail.description,
            dateEnd: productDetail.dateEnd,
            dateInit: productDetail.dateInit,
            name: productDetail.name,
            id : productDetail['productId']
        }

        offerFactory.setProductDetail(productDetail);
    }

    function loadTopFav() {
        factory.getTopFavsAPI().then(function (data) {
            $scope.topOffers = data;
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$broadcast('scroll.refreshComplete');
            console.log($scope.topOffers);
        });
    }
})


.controller('MapCtrl', function ($scope, $state, $timeout, $ionicPopup, GoogleMaps, ionicMaterialMotion, ionicMaterialInk) {
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
        $scope.$parent.setHeaderFab('right');

        $timeout(function () {
            ionicMaterialMotion.fadeSlideIn({
                selector: '.animate-fade-slide-in '
            });
        }, 200);
        // Activate ink for controller
        ionicMaterialInk.displayEffect();

        if (!GoogleMaps.init()) {
            $ionicPopup.alert({
                title: 'Advertencia',
                template: 'Debe estar conectado a internet para usar esta funcionalidad'
            });
            $state.go('app.home');
        }
    })
    .controller('AboutCtrl', function ($scope, $state, $ionicPopup, ionicMaterialMotion, ionicMaterialInk) {
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab('right');

        $scope.openInExternalBrowser = function (url) {
            // Open in external browser
            window.open(url, '_system', 'location=yes');
        };

        $scope.sendFeedback = function () {
            if (window.plugins && window.plugins.emailComposer) {
                window.plugins.emailComposer.showEmailComposerWithCallback(function (result) {
                        console.log("Response -> " + result);
                    },
                    "Retroalimentacion ChapList", // Subject
                    "", // Body
            ["oktacore.team@gmail.com"], // To
                    null, // CC
                    null, // BCC
                    false, // isHTML
                    null, // Attachments
                    null); // Attachment Data
            }
        }

        $scope.OtherShare = function () {
            window.plugins.socialsharing.share('Descarga ChapList desde la Play Store', null, null, 'https://play.google.com/store/apps/details?id=com.ionicframework.chaplist21042016');
        }

    })
    .controller('btnLogoutCtrl', function ($scope, $state, $ionicActionSheet, $ionicLoading, FacebookFactory) {
        $scope.facebookLogout = function () {
            $ionicActionSheet.show({
                destructiveText: 'Salir',
                titleText: '¿Está seguro que desea salir?',
                cancelText: 'Cancel',
                cancel: function () {},
                buttonClicked: function (index) {
                    return true;
                },
                destructiveButtonClicked: function () {
                    $ionicLoading.show({
                        template: 'Logging out...'
                    });
                    facebookConnectPlugin.logout(function () {
                            $ionicLoading.hide();
                            FacebookFactory.facebookLogout();
                            $state.go('app.home');
                        },
                        function (fail) {
                            $ionicLoading.hide();
                        });
                }
            });
        }
    })

.controller('btnRefreshCtrl', function ($scope, $state, $ionicPopup, $timeout, GoogleMaps) {
        $timeout(function () {
            document.getElementById('fab-activity').classList.toggle('on');
        }, 300);

        $scope.refreshMap = function () {
            if (!GoogleMaps.init(1)) {
                $ionicPopup.alert({
                    title: 'Advertencia',
                    template: 'Debe estar conectado a internet para usar esta funcionalidad'
                });
                $state.go('app.home');
            }
        }
    })
    .directive('ngLastRepeat', function ($timeout) {

        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit('ngLastRepeat' + (attr.ngLastRepeat ? '.' + attr.ngLastRepeat : ''));
                    });
                }
            }
        };
    })
