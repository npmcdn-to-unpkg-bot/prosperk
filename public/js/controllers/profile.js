/**
 * Created by MrSingh on 1/17/16.
 */

pmApp.controller('profileCtrl',[ '$scope', '$rootScope','$location','$http','pmAuth','Upload', function($scope, $rootScope, $location,$http,pmAuth,Upload){

    pmAuth.validateSession();

    if($rootScope.loggedIn){
        $location.path('/profile');
    }

    $scope.pageFullyLoaded=false;

    $scope.max = 100;
    $scope.progressPercentage = 0;
    $scope.designUploadSuccess = false;


    $scope.profileInit = function () {
        $http.get('/api/v1/my-designs')
            .success(function(response){
                console.log(response);
                $scope.allDesigns = response.designs;
                $scope.pageFullyLoaded=true;
            })
            .error(function(response){
                console.log(response);
                $scope.pageFullyLoaded=true;
            });
    };


    $scope.submitDesign = function(design) {

        if(!design || !design.name || !design.description || !design.tags){
            $scope.designError = "All the fields are mandatory.";
            return;
        }

        var tags = design.tags;
        tags = tags.split(',');
        var finalTags = [];

        angular.forEach(tags, function (tag, index) {
            if(tag.trim() !== ''){
                if(index < 13){
                    finalTags.push(tag.trim());
                }
            }
        });
        design.tags = finalTags;

        $scope.upload(design.file,design);
    };

    // upload on file select or drop
    $scope.upload = function (file,design) {
        console.log(design);
        Upload.upload({
            url: '/api/v1/user/upload',
            data: {file: file, 'data':design}
        }).then(function (res) {
            console.log(res.data);
            if(res.data.success){
                console.log('upload successful');
                $scope.designUploadSuccess = true;
                $scope.designUploadSuccessMsg = "Your Design have been uploaded successfully. It will be live as soon as one of our moderators approve the design.";
                $scope.uploadedDesign = res.data.design;
                $scope.allDesigns.push(res.data.design);
            }
            _clearFormData();
        }, function (res) {
            $scope.formLoading = false;
            console.log(res.data.message);
        }, function (evt) {
            $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + $scope.progressPercentage + '% ' + evt.config.data.file.name);
            if($scope.progressPercentage == 100){
                $scope.formLoading = true;
            }
        });
    };

    function _clearFormData() {
        $scope.design.name = '';
        $scope.design.tags = '';
        $scope.design.description = '';
        $scope.design.file = '';
        $scope.progressPercentage = 0;
        $scope.formLoading = false;
    }
    
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