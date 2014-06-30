'use strict';

angular.module('meetcost')
    .controller('ListCtrl', function ($scope, $http, $rootScope, meetServices) {

        // set page info
        $rootScope.pageInfo = {
            'id': 'listPage',
            'class': 'listPage',
            'title': 'Saved meetings'
        };

        $scope.setMeetingsData = function(meetings) {
            console.log(meetings);
            for ( var i in meetings ) {
                var ratePeriods = JSON.parse(meetServices.getRatePeriods()),
                    costRate = meetServices.getCostRate(ratePeriods, meetings[i].ratePeriod);

                meetServices.setMeetingCosts($scope, meetings[i], costRate);
                meetings[i].selected = false; // prevent an element to be init selected
            }
            $scope.meetings = meetings; // saved meeting on scope
            meetServices.updateMeetingsLocalStorage(meetings); // save meetings on localstorage
        }

        // init load with data saved on localstorage
        if (localStorage.meetings && localStorage.meetings != 'undefined') {
            $scope.setMeetingsData(JSON.parse(localStorage.meetings));
        } else {
            $scope.emptyList = true;
        }

        /*
        // get data from database
        $rootScope.loading = true; // set preloading icon status
        $http({
            method: 'GET',
            url: apiURL + 'api/get/'+localStorage.owner,
            cache: false
            }).
            success(function(data) {
                localStorage.ratePeriods = JSON.stringify(data.ratePeriods);

                // check if there are meetings
                if(!data.meetings) {
                    $scope.emptyList = true;
                } else {
                    $scope.emptyList = false;
                }

                $scope.setMeetingsData(data.meetings);
                $rootScope.loading = false;
            }).
            error(function() {
              $scope.online = false;
              $rootScope.loading = false;
            });
        */



        // select item to show item actions
        $scope.toggleListItem = function(index) {
            for ( var i in $scope.meetings ) {
                $scope.meetings[i].selected = false;
            }
            if (index >= 0) {
                $scope.meetings[index].selected = true;
            }
            meetServices.updateMeetingsLocalStorage($scope.meetings); // save meetings on localstorage
        }

        $scope.setFavourite = function(index) {
            if($scope.meetings[index].favourite > 0) {
                $scope.meetings[index].favourite = 0;
            } else {
                $scope.meetings[index].favourite = 1;
            }
            $scope.meetings[index].selected = false;

            meetServices.updateFavourite($scope.meetings[index].id, $scope.meetings[index].favourite, $scope);
            //meetServices.updateMeetingsLocalStorage($scope.meetings); // save meetings on localstorage
        }

        $scope.deleteMeeting = function(index, id) {
            $scope.meetings[index].selected = false;
            $scope.meetings.splice(index, 1);
            meetServices.updateMeetingsLocalStorage($scope.meetings); // save meetings on localstorage
            /*
            //$http({method: 'DELETE', url: apiURL + 'api/event/'+localStorage.owner+'/'+id}).
            $http({
                method: 'GET',
                url: apiURL + 'api/event/delete/'+localStorage.owner+'/'+id,
                cache: false
                }).
                success(function(data) {
                    // delete object
                    $scope.meetings.splice(index, 1);
                    meetServices.updateMeetingsLocalStorage($scope.meetings); // save meetings on localstorage
                }).error(function() {});
            */
        }

        $scope.updateMeeting = function(id, seconds, refresh) {
            meetServices.updateMeeting(id, seconds, refresh, $scope);
        }

        $scope.gotoMeeting = function(id) {
            meetServices.gotoMeeting(id);
        }

    });


