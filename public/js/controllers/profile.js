/**
 * Created by MrSingh on 1/17/16.
 */

pmApp.controller('profileCtrl',[ '$scope', '$rootScope','$location','$http','pmAuth','Upload', function($scope, $rootScope, $location,$http,pmAuth,Upload){

    pmAuth.validateSession();

    if($rootScope.loggedIn){
        $location.path('/profile');
    }

    $scope.pageFullyLoaded=false;

    $scope.profileInit = function () {
        $http.get('/api/v1/users')
            .success(function(response){
                console.log(response);
                $scope.allUsers = response;
                $scope.pageFullyLoaded=true;
            })
            .error(function(response){
                console.log(response);
            });
    };


    $scope.submit = function() {
        if ($scope.form.file.$valid && $scope.file) {
            $scope.upload($scope.file);
        }
    };

    // upload on file select or drop
    $scope.upload = function (file) {
        Upload.upload({
            url: '/api/v1/user/upload',
            data: {file: file}
        }).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        }, function (resp) {
            console.log(resp.data.message);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };
    
    $scope.imageUpload = function (image) {
      console.log(image);
    };
    

    $scope.sendEmail = function (email) {
        console.log(email);
        var json = {
            'name'      :email.name,
            'email'     :email.email,
            'subject'   :email.subject,
            'message'   :email.message
        };

        $http.post('/api/v1/submitEmail', json)
            .success(function(response){
                console.log(response);
            })
            .error(function(response){
                console.log(response);
            });

    }




}]);