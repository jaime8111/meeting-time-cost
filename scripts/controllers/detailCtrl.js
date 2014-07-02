'use strict';

angular.module('meetcost')
    .controller('DetailCtrl', function ($scope, $http, $routeParams, $rootScope, $location, meetServices) {
        setUserID();
        $scope.currentCost = 0;
        $scope.loaded = false;

        $rootScope.pageInfo = {
            'id': 'detailPage',
            'class': 'detailPage',
            'title': 'Meeting time & cost'
        };

        // hide fixed bar by default
        $rootScope.toggleBarVisibility = false;

        // start of TIMER
        var timer;

        function setTimer() {
            $scope.currentCost = $scope.costPerSecond * $scope.timer;
            $scope.currentCostPerPerson = $scope.costPerSecondAndAttender * $scope.timer;
        }

        function stopTimer() {
            $scope.disabledStart = false;
            clearInterval(timer);
            meetServices.updateMeeting($scope.detailMeeting.id,$scope.timer,false, $scope);

        }

        function startTimer() {
            if ( !$scope.disabledStart ) {
                $scope.disabledStart = true;
                timer = setInterval(function () {
                    $scope.timer++;

                    $scope.timerPerc = $scope.timer * 100 / $scope.detailMeeting.estimatedSeconds;

                    if ($scope.timerPerc >= 100) {
                        $scope.extratime = true;
                        $scope.timerPerc = $scope.timerPerc % 100;
                    }


                    $scope.timerRotation = 360/100*$scope.timerPerc;

                    $scope.$apply(function () {
                        setTimer();
                    });
                }, 1000);
            }
        }

        $scope.startTimer = function (){
            startTimer();
        };

        $scope.stopTimer = function (){
            stopTimer();
            $location.path('/list');
        };

        $scope.pauseTimer = function (){
            stopTimer();
        };
        // end of TIMER

        $scope.$watch('loaded', function() {
            setTimer();
        });

        $scope.updateMeeting = function(id, seconds, refresh, $scope) {
            meetServices.updateMeeting(id, seconds, refresh, $scope);
        }

        $scope.drawDetailMeeting = function(meeting) {
            $scope.detailMeeting = meeting;

            // SET TIMER
            $scope.timer = $scope.detailMeeting.meetSeconds;
            var ratePeriods = JSON.parse(meetServices.getRatePeriods()),
                costRate = meetServices.getCostRate(ratePeriods, $scope.detailMeeting.ratePeriod);

            meetServices.setMeetingCosts($scope, $scope.detailMeeting, costRate);

            $scope.estimatedCost = $scope.costPerSecond * $scope.detailMeeting.estimatedSeconds;
            $scope.estimatedCostByHour = $scope.costPerSecond * 60 * 60;

            $scope.timerPerc = $scope.timer * 100 / $scope.detailMeeting.estimatedSeconds;
            $scope.timerRotation = 360/100*$scope.timerPerc;

            $scope.loaded = true;
        }

        $rootScope.loading = true; // set preloading icon status
        // init load with data saved on localstorage
        if (localStorage.meetings && localStorage.meetings != "undefined") {
            var storagedMeetings = JSON.parse(localStorage.meetings);
            for ( var i in storagedMeetings ) {
                if ( storagedMeetings[i].id == $routeParams.id && storagedMeetings[i].owner === localStorage.owner ) {
                    $scope.drawDetailMeeting(storagedMeetings[i]);
                    $rootScope.loading = false; // set preloading icon status
                }
            }
        }

        /*
        $http({
                method: 'GET',
                url: apiURL + 'api/get/'+$routeParams.owner+'/'+$routeParams.id,
                cache: false
            }).
            success(function(data) {
                if (data.meeting && data.meetings[0]) {
                    $scope.detailMeeting = data.meetings;
                    $scope.drawDetailMeeting(data.meetings[0]);
                }


                $rootScope.loading = false; // set preloading icon status
            }).
            error(function() {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
              $scope.online = false;
        });
        */

    }).filter('secondsToClock', function () {
        function numberFixedLen(n,len) {
            var num = parseInt(n, 10);
            len = parseInt(len, 10);
            if (isNaN(num) || isNaN(len)) {
                return n;
            }
            num = ''+num;
            while (num.length < len) {
                num = '0'+num;
            }
            return num;
        }

        return function (timer) {
            var sym = '';
            if (timer < 0) {
                timer *= -1;
                sym = '-';
            }

            var forHours = parseInt(timer / 3600),
                remainder = timer % 3600,
                forMinutes = parseInt(remainder / 60),
                forSeconds = '<small class="sec">:'+numberFixedLen(parseInt(remainder % 60),2)+'</small>',
                result = forMinutes+forSeconds;

            if ( forHours > 0 ) {
                result = forHours+':'+numberFixedLen(forMinutes,2)+forSeconds;
            }

            return sym+''+result;
        };
    }).filter('customCurrency', function () {
        return function (value) {
            value = value+'';
            var parts = value.split('.');

            if ( parts[1] ) {
                parts[1] = parts[1]+'';
                parts[1] = parts[1].substring(0, 2);
            } else {
                parts[1] = '00';
            }
            return parts[0]+'<small class="sep">.</small><small class="dec">'+parts[1]+'</small>';
        };
    }).filter('timeago', function () {
        //time: the time
        //local: compared to what time? default: now
        //raw: wheter you want in a format of "5 minutes ago", or "5 minutes"
        return function (time, local, raw) {
            if (!time) return '';

            if (!local) {
                (local = Date.now());
            }

            if (angular.isDate(time)) {
                time = time.getTime();
            } else if (typeof time === 'string') {
                time = new Date(time).getTime();
            }

            if (angular.isDate(local)) {
                local = local.getTime();
            }else if (typeof local === 'string') {
                local = new Date(local).getTime();
            }

            if (typeof time !== 'number' || typeof local !== 'number') {
                return;
            }

            var offset = Math.abs((local - time) / 1000),
                span = [],
                MINUTE = 60,
                HOUR = 3600,
                DAY = 86400,
                WEEK = 604800,
                //MONTH = 2629744,
                YEAR = 31556926,
                DECADE = 315569260;

            //if (offset <= MINUTE)              span = [ '', raw ? 'now' : 'less than a minute' ];
            if (offset <= MINUTE)              span = [ '', raw ? 'now' : 'now' ];
            else if (offset < (MINUTE * 60))   span = [ Math.round(Math.abs(offset / MINUTE)), 'min' ];
            else if (offset < (HOUR * 24))     span = [ Math.round(Math.abs(offset / HOUR)), 'hr' ];
            else if (offset < (DAY * 7))       span = [ Math.round(Math.abs(offset / DAY)), 'day' ];
            else if (offset < (WEEK * 52))     span = [ Math.round(Math.abs(offset / WEEK)), 'week' ];
            else if (offset < (YEAR * 10))     span = [ Math.round(Math.abs(offset / YEAR)), 'year' ];
            else if (offset < (DECADE * 100))  span = [ Math.round(Math.abs(offset / DECADE)), 'decade' ];
            else                               span = [ '', 'a long time' ];

            span[1] += (span[0] === 0 || span[0] > 1) ? 's' : '';
            span = span.join(' ');

            if ( offset <= MINUTE ) {
                raw = true;
            }
            if (raw === true) {
                return span;
            }
            return (time <= local) ? span + ' ago' : 'in ' + span;
        };
    });


