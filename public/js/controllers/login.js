/**
 * Created by MrSingh on 1/17/16.
 */

pmApp.controller('loginCtrl',[ '$scope','$rootScope','$location','$http','toastr','pmAuth','localStorageService', function($scope, $rootScope,$location,$http,toastr,pmAuth, localStorageService){

    if($rootScope.loggedIn){
        $location.path('/');
    }


    $scope.signupUser = function (data) {
        pmAuth.signupUser(data)
            .then(function(success){
                if(success){
                    toastr.success('Account successfully created.');
                } else{
                    toastr.error('Bummer... there is an error registering');
                }
            });
    }

    $scope.loginUser = function (data) {
        pmAuth.authenticateUser(data)
            .then(function(success){
                if(success){
                    toastr.success('Log In Successful');
                } else{
                    toastr.error('Bummer... Incorrect username/password');
                }
            });
    }




}]);