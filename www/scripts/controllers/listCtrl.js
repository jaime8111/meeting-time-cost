'use strict';

angular.module('meetcost')
    .controller('ListCtrl', function ($scope, $http, $rootScope, meetServices) {

        // set page info
        $rootScope.pageInfo = {
            'id': 'listPage',
            'class': 'listPage',
            'title': 'Saved meetings'
        };

        // hide fixed bar by default
        $rootScope.toggleBarVisibility = false;

        $scope.setMeetingsData = function(meetings) {

            for ( var i in meetings ) {
                var ratePeriods = JSON.parse(meetServices.getRatePeriods()),
                    costRate = meetServices.getCostRate(ratePeriods, meetings[i].ratePeriod);

                meetServices.setMeetingCosts($scope, meetings[i], costRate);
                meetings[i].selected = false; // prevent an element to be init selected
            }
            $scope.meetings = meetings; // saved meeting on scope
            //meetServices.updateMeetingsLocalStorage(meetings); // save meetings on localstorage
        }

        // init load with data saved on localstorage
        if (localStorage.meetings && localStorage.meetings != 'undefined' && JSON.parse(localStorage.meetings).length) {
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
        $scope.toggleListItem = function(id) {
            for ( var i in $scope.meetings ) {
                if ( id && id == $scope.meetings[i].id ) {
                    $scope.meetings[i].selected = true;
                } else {
                    $scope.meetings[i].selected = false;
                }
            }
            /*
            if (id >= 0) {
                $scope.meetings[index].selected = true;
            }
            */
            //meetServices.updateMeetingsLocalStorage($scope.meetings); // save meetings on localstorage
        }

        $scope.setFavourite = function(id) {
            var fav = 0;
            for ( var i in $scope.meetings ) {
                if ( $scope.meetings[i].id == id ) {
                    if($scope.meetings[i].favourite > 0) {
                        $scope.meetings[i].favourite = 0;
                    } else {
                        $scope.meetings[i].favourite = 1;
                        fav = 1;
                    }
                }

                $scope.meetings[i].selected = false;
            }

            meetServices.updateFavourite(id, fav, $scope);
            //meetServices.updateMeetingsLocalStorage($scope.meetings); // save meetings on localstorage
        }

        $scope.deleteMeeting = function(id) {

            for ( var i in $scope.meetings ) {
                if ( $scope.meetings[i].id == id ) {
                    var index = i;
                }
            }
            if ( index ) {
                $scope.meetings.splice(index, 1);
            }

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


