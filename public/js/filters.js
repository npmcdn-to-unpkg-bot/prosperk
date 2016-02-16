/**
 * Created by MrSingh on 1/17/16.
 */
'use strict';

var cf = angular.module('customFilters', []);

cf.filter('trusted', ['$sce', function($sce){
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}]);
