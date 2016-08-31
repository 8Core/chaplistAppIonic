angular.module('starter', ['ionic', 'ngCordova', 'appCtrl', 'offerCtrl', 'profileCtrl',
                           'actionFactory', 'facebookFactory', 'offerFactory', 'mapsFactory',
                           'ngStorage', 'jett.ionic.filter.bar', 'ionic-material'])

.run(function ($ionicPlatform, factory, $cordovaStatusbar) { //agrego el factory de GoogleMaps
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // Turn off caching for demo simplicity's sake
    $ionicConfigProvider.views.maxCache(0);
    $ionicConfigProvider.tabs.position("bottom"); //Places them at the bottom for all OS
    $ionicConfigProvider.tabs.style("standard"); //Makes them all look the same across all OS

    $stateProvider
        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'views/sidemenu.html',
            controller: 'AppCtrl'
        })
        .state('app.home', {
            url: '/home',
            views: {
                'menuContent': {
                    templateUrl: 'views/home.html',
                    controller: 'HomeCtrl'
                },
                'fabContent': {
                    template: ''
                }
            }
        })
        .state('app.detalle', {
            url: '/detalle',
            views: {
                'menuContent': {
                    templateUrl: 'views/detalle.html',
                    controller: 'DetalleCtrl'
                },
                'fabContent': {
                    template: '<button id="fab-profile" ng-click="OtherShare()" class="button button-fab button-fab-bottom-right button-assertive" ><i class="icon ion-share"></i></button>',
                    controller: 'ShareCtrl'
                }
            }
        })
        .state('app.products', {
            url: '/products',
            views: {
                'menuContent': {
                    templateUrl: 'views/products.html',
                    controller: 'ProductCtrl'
                },
                'fabContent': {
                    template: '<button id="fab-activity" class="button button-fab button-fab-top-right expanded button-assertive  flap" ng-click="showFilterBar();"><i class="icon ion-search"></i></button>',
                    controller: 'BuscarCtrl'
                }
            }
        })
        .state('app.offer', {
            url: '/offer',
            views: {
                'menuContent': {
                    templateUrl: 'views/offer.html',
                    controller: 'OfferCtrl as offer'
                },
                'fabContent': {
                    template: ''
                }
            }
        })

    .state('app.profile', {
            url: '/profile',
            views: {
                'menuContent': {
                    templateUrl: 'views/profile.html',
                    controller: 'ProfileCtrl'
                },
                'fabContent': {
                    template: '<button id="fab-profile" ng-click="facebookLogout()" class="button button-fab button-fab-bottom-right button-assertive" ><i class="icon ion-log-out"></i></button>',
                    controller: 'btnLogoutCtrl'
                }
            }
        })
        .state('app.map', {
            url: '/map',
            views: {
                'menuContent': {
                    templateUrl: 'views/map.html',
                    controller: 'MapCtrl'
                },
                'fabContent': {
                    template: '<button id="fab-activity" class="button button-fab button-fab-top-right expanded button-assertive flap" ng-click= "refreshMap()"><i class="icon ion-ios-refresh"></i></button>',
                    controller: 'btnRefreshCtrl'
                }
            }
        })
        .state('app.fav', {
            url: '/fav',
            views: {
                'menuContent': {
                    templateUrl: 'views/favorites.html',
                    controller: 'FavCtrl'
                },
                'fabContent': {
                    template: ''
                }
            }
        })
        .state('app.about', {
            url: '/about',
            views: {
                'menuContent': {
                    templateUrl: 'views/about.html',
                    controller: 'AboutCtrl'
                },
                'fabContent': {
                    template: ''
                }
            }
        })
        .state('app.search', {
            url: '/search',
            views: {
                'menuContent': {
                    templateUrl: 'views/search.html',
                    controller: 'SearchCtrl'
                },
                'fabContent': {
                    template: ''
                }
            }
        })
        .state('app.compare', {
            url: '/compare',
            views: {
                'menuContent': {
                    templateUrl: 'views/compare.html',
                    controller: 'compareCtrl'
                },
                'fabContent': {
                    template: ''
                }
            }
        })
        .state('app.category', {
            url: '/category',
            views: {
                'menuContent': {
                    templateUrl: 'views/category.html',
                    controller: 'categoryCtrl'
                },
                'fabContent': {
                    template: ''
                }
            }
        })
        // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.when('', '/app/home');
    $urlRouterProvider.otherwise('/app/home');
})
