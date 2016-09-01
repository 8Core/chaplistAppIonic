angular.module('profileCtrl', [])

.controller('ProfileCtrl', function ($scope, $state, $timeout, $ionicPopup, ionicMaterialMotion, ionicMaterialInk, FacebookFactory, ConnectivityMonitor) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
    $timeout(function () {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function () {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
    /*----------------------------------------------------------------------------------*/
    /*----------------------------------------------------------------------------------*/
    /*----------------------------------------------------------------------------------*/

    $scope.facebookProfile = FacebookFactory.getFacebookProfileLocal();
    FacebookFactory.getFacebookFriends(function (res) {
        $scope.facebookFriends = res;
    });

    $scope.facebookPost = function () {
        if(ConnectivityMonitor.ifOffline()){
                $scope.ionicMessage('Advertnecia', 'Debe estar conectado a internet para usar esta funcionalidad');
                return;
            }
        FacebookFactory.postFacebook();
    }

})
