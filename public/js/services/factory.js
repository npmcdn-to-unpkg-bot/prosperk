/**
 * Created by MrSingh on 1/30/16.
 */

'use strict';
var pmFac = angular.module('personly.factories',[]);


pmFac.factory('pmAuth',
    function($http, $q,localStorageService, $rootScope, $location){

        var cachedToken;

    return {
        authenticateUser: function (login) {
            var dfd = $q.defer();

            //converting email to all lowercase.
            login.username = login.username.toLowerCase();

            var json = {
                'username'   :login.username,
                'password'   :login.password
            };

            $http.post('/api/v1/login', json)
                .then(function(response){
                    if(response.data.success){
                        $rootScope.currentUser = response.data.user;
                        $rootScope.loggedIn = true;
                        localStorageService.set('user', response.data.user);
                        localStorageService.set('token', response.data.token);
                        cachedToken = response.data.token;
                        $location.url('/profile');
                        dfd.resolve(true);
                    } else{
                        dfd.resolve(false);
                    }
                });
            return dfd.promise;
        },
        logoutUser: function () {
            var dfd = $q.defer();
            localStorageService.clearAll();
            $rootScope.currentUser = null;
            $rootScope.loggedIn = false;
            $location.path('/');

            dfd.resolve();
            return dfd.promise;
        },
        /**
         * Helper function to check that the Session variable is in the local storage, and if it
         * is not, redirect to the Login page
         */
        validateSession: function() {

            var user = localStorageService.get('user');
            var token = localStorageService.get('token');
            
            if(token){
                if (!user) {
                    this.invalidateSession();
                }else{
                    $rootScope.currentUser = user;
                    $rootScope.loggedIn = true;
                }
            }else{
                this.invalidateSession();
            }
        },

        /**
         * Check if session is valid, return true/false accordingly.
         */
        isSessionValid: function() {
            var user = localStorageService.get('user');
            var token = localStorageService.get('token');

            if (!token && !user) {
                return false;
            }
            return true;
        },

        /**
         * Helper function to remove the Session variable from the local storage and redirect
         * to the Login page
         * @param {string} [redirectPath] Optional string to specify a redirect path
         */
        invalidateSession : function(redirectPath) {
            localStorageService.clearAll();
            $rootScope.loggedIn = false;

            if (redirectPath) {
                $location.path(redirectPath);
            } else {
                $location.path('/login');
            }
        },
        getToken : function() {
            if(!cachedToken){
                cachedToken = localStorageService.get('token');
            }
            return cachedToken;
        }
    }
});


pmFac.factory('pmAuthInterceptor',
    function(pmAuth){

        var interceptor = {};

        interceptor.request = function (config) {
            var token = pmAuth.getToken();

            if(token){
                config.headers['x-access-token'] = token;
            }

            return config;
        };

        interceptor.responseError = function (response) {
            if(response.status == 403){
                $location.path('/login');
                localStorageService.clearAll();
            }

            return response;

        }

    });