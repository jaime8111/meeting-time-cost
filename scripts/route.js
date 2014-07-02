'use strict';

//var apiURL = 'http://www.vissit.com/projects/meeting-time-cost/';
var apiURL = '';

angular
  .module('meetcost', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ngRoute',
    'ngAnimate'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/intro.html',
        controller: 'IntroCtrl'
      })
      .when('/index', {
        templateUrl: 'views/intro.html',
        controller: 'IntroCtrl'
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

    this.updateMeeting= function(id, seconds, refresh, $scope){
      var that = this;

      // get & parse saved meetings
      $scope.meetings = JSON.parse(localStorage.meetings);

      // select selected meetings
      for (var i = 0; i < $scope.meetings.length; ++i) {
        if ( $scope.meetings[i].id == id ) {
          // update it
          $scope.meetings[i].meetSeconds = seconds;
          $scope.meetings[i].meetDate = new Date().getTime();
        }
      }

      // save again on local
      localStorage.meetings = JSON.stringify($scope.meetings);

      if(refresh) {
        that.gotoMeeting(id);
      }

      //$http({method: 'PUT', url: apiURL + 'api/event/'+localStorage.owner+'/'+id+'/'+seconds}).
      /*
      $http({
          method: 'GET',
          url: apiURL + 'api/event/update/'+localStorage.owner+'/'+id+'/'+seconds,
          cache: false
        }).
        success(function(data) {
            if(refresh) {
                that.gotoMeeting(id);
            }
        }).error(function() {

        });
      */
    };

    this.updateFavourite= function(id, favourite, $scope){
      var that = this;

      // get & parse saved meetings
      //$scope.meetings = JSON.parse(localStorage.meetings);

      // select selected meetings
      for (var i = 0; i < $scope.meetings.length; ++i) {
        if ( $scope.meetings[i].id == id ) {
          // update it
          $scope.meetings[i].favourite = favourite;
        }
      }

      // save again on local
      localStorage.meetings = JSON.stringify($scope.meetings);

      /*
      //$http({method: 'PUT', url: apiURL + 'api/event/favourite/'+localStorage.owner+'/'+id+'/'+favourite}).
      $http({
          method: 'GET',
          url: apiURL + 'api/event/favourite/'+localStorage.owner+'/'+id+'/'+favourite,
          cache: false
        }).
        success(function(data) {

        }).error(function() {

        });
      */
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

