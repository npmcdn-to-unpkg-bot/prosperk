/**
 * Created by MrSingh on 1/23/16.
 */
pmApp.config(function($routeProvider, $locationProvider){

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    }).hashPrefix('!');



    var _getBlueBg = function(templateUrlPath) {
        return {
            templateUrl: templateUrlPath,
            controller: function ($scope, $routeParams, $rootScope) {
                $rootScope.bgBlue = true;

                $rootScope.$on( "$routeChangeStart", function(event, next, current) {
                    //..do something  //if you don't want event to bubble up
                    $rootScope.bgBlue = false;
                });

            }
        };
    };


    $routeProvider
        .when('/', {
            templateUrl:'/partials/landing.html', controller: 'landingCtrl'
        })

        .when('/signup', {
            templateUrl:'/partials/signup.html', controller: 'loginCtrl'
        })

        .when('/login', {
            templateUrl:'/partials/login.html', controller: 'loginCtrl'
        })

        .when('/profile', {
            templateUrl:'/partials/user/profile.html', controller: 'profileCtrl'
        })

        .when('/404', _getBlueBg('/partials/404.html'))

        .otherwise({
            redirectTo: '/404'
        });

});