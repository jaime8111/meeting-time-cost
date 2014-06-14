'use strict';

angular
  .module('meetcost', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/intro.html',
        controller: 'MainCtrl'
      })
      .when('/index', {
        templateUrl: 'views/intro.html',
        controller: 'MainCtrl'
      })
      .when('/create', {
        templateUrl: 'views/create.html',
        controller: 'CreateCtrl'
      })
      .when('/list', {
        templateUrl: 'views/list.html',
        controller: 'ListCtrl'
      })
      .when('/meeting/:owner/:id', {
        templateUrl: 'views/detail.html',
        controller: 'DetailCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .service('meetServices', function($http, $location){
    this.gotoMeeting= function(id){
        $location.path('meeting/'+localStorage.owner+'/'+id);
    };

    this.updateMeeting= function(id, seconds, refresh){
      var that = this;
      $http({method: 'PUT', url: apiURL + 'api/event/'+localStorage.owner+'/'+id+'/'+seconds}).
        success(function(data) {
            if(refresh) {
                that.gotoMeeting(id);
            }
        }).error(function() {

        });
    };

    this.updateFavourite= function(id, favourite){
      var that = this;
      $http({method: 'PUT', url: apiURL + 'api/event/favourite/'+localStorage.owner+'/'+id+'/'+favourite}).
        success(function(data) {

        }).error(function() {

        });
    };

    this.updateMeetingsLocalStorage= function (meetings) {
      localStorage.meetings = JSON.stringify(meetings); // save meetings on localstorage
    }

    this.getRatePeriods = function () {
      // fake rate periods. It is just for first app load (we don't have this info before receive the api data)
      if (!localStorage.ratePeriods) {
          localStorage.ratePeriods = '[{"id":"1","type":"hourly","rate":"1"},{"id":"2","type":"monthly","rate":"160"},{"id":"3","type":"yearly","rate":"1680"}]';
      }
      return localStorage.ratePeriods;
    }

    this.getCostRate = function (ratePeriods, meetingPeriod) {
      // get meeting rate period (to calculate cost per seccond)
      for(var i in ratePeriods){
        if ( ratePeriods[i].id == meetingPeriod ) {
          return ratePeriods[i].rate;
        }
      }
    }

    this.setMeetingCosts = function ($scope, meeting, costRate) {
      $scope.costPerHourAndAttender = meeting.averageRate / costRate;
      $scope.costPerSecondAndAttender = $scope.costPerHourAndAttender / 3600;
      $scope.costPerSecond = $scope.costPerSecondAndAttender * meeting.attenders;

      meeting.costPerHourAndAttender = $scope.costPerHourAndAttender;
      meeting.currentCost = $scope.costPerSecond * meeting.meetSeconds;
    }



  });

function guid() {
    var d = new Date(),
        initguid = d.getTime()+'-xxxx';
    return initguid.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

function setUserID() {
    // set user ID if it doesn't exist
    if ( !localStorage.owner ) {
        localStorage.owner = guid();
    }
    // localStorage.owner = '1400686582593-4bd1';
    // myRealID = 1400686582593-4bd1
    //console.log(localStorage.owner);
    return localStorage.owner;
}