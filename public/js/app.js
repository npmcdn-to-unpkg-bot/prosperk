/**
 * Created by MrSingh on 1/17/16.
 */
'use strict';

var pmApp = angular.module('personly',[
    'ngRoute',
    'ngCookies',
    'LocalStorageModule',
    'customFilters',
    'personly.factories',
    'toastr',
    'ngFileUpload',
    'ui.bootstrap'
]);

pmApp.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('pmHttpInterceptor');
}]);

pmApp.run(['$rootScope', '$location', '$window','pmAuth','$http',
    function($rootScope, $location, $window, pmAuth,$http) {

        $http.defaults.headers.common['x-access-token'] = pmAuth.getToken();

        $rootScope.$on('$routeChangeSuccess',
            function(event) {
                $window.scrollTo(0, 0);

                if (!$window.ga) {
                    return;
                }
                $window.ga('send', 'pageview', {
                    page: $location.path()
                });
            });

        $rootScope.$on('$routeChangeStart', function(event){
            angular.element('#navbar').removeClass('in');
        });




        // closing navbar collapse when content is loaded
        $rootScope.$on('$viewContentLoaded', function () {
            $(".nav a").click(function () {
                if ($(".navbar-collapse").hasClass("in")) {
                    $('[data-toggle="collapse"]').click();
                }
            });
        });


    }
]);

pmApp.config(function(toastrConfig) {
    angular.extend(toastrConfig, {
        autoDismiss: false,
        containerId: 'toast-container',
        maxOpened: 3,
        newestOnTop: true,
        positionClass: 'toast-bottom-left',
        preventDuplicates: false,
        preventOpenDuplicates: false,
        target: 'body'
    });
});

pmApp.factory('pmHttpInterceptor',['localStorageService', '$rootScope', '$location','toastr',
    function(localStorageService, $rootScope, $location,toastr){

        var interceptor = {};

        interceptor.request = function (config) {
            var token = localStorageService.get('token');

            if(token){
                config.headers['x-access-token'] = token;
            }

            return config;
        };

        interceptor.responseError = function (response) {
            console.log(response);
            if(response.status == 403){
                localStorageService.clearAll();
                $location.path('/login');
                $rootScope.currentUser = {};
                $rootScope.loggedIn = false;
                toastr.error('uh-oh! Something went wrong.\nPlease log back in again.')
            }

            return response;
        }

        return interceptor;

    }]);