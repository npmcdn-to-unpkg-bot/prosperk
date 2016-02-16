/**
 * Created by MrSingh on 1/17/16.
 */

pmApp.controller('loginCtrl',[ '$scope','$rootScope','$location','$http','toastr','pmAuth','localStorageService', function($scope, $rootScope,$location,$http,toastr,pmAuth, localStorageService){

    if($rootScope.loggedIn){
        $location.path('/');
    }


    $scope.signupUser = function (data) {
        console.log(data);
        var json = {
            'firstName'  :data.firstName,
            'lastName'   :data.lastName,
            'email'      :data.email,
            'password'   :data.password
        };

        console.log(json);

        $http.post('/api/v1/signup', json)
            .success(function(response){
                $rootScope.currentUser = response.user;
                $rootScope.loggedIn = true;
                localStorageService.set('user', response.user);
                localStorageService.set('token', response.token);

                pmAuth.validateSession();

                $location.url('/profile');
            })
            .error(function(response){
                console.log(response);
                $scope.signupError = response.message;
                toastr.error(response.message);
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
            })
    }




}]);