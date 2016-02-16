/**
 * Created by MrSingh on 1/23/16.
 */
pmApp.config(function($routeProvider, $locationProvider){

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    }).hashPrefix('!');

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

        .when('/404', {
            templateUrl:'/partials/404.html'
        })

        .otherwise({
            redirectTo: '/404'
        });

});