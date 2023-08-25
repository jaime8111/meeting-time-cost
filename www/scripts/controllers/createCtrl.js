'use strict';

angular.module('meetcost')
    .controller('CreateCtrl', function ($scope, $http, $location, $rootScope, $window) {

        // set page info
        $rootScope.pageInfo = {
            'id': 'createPage',
            'class': 'createPage',
            'title': 'Create a new meeting'
        };

        // hide fixed bar by default
        $rootScope.toggleBarVisibility = false;

        var d = new Date();

        $scope.meetData = {};
        $scope.meetData.owner = setUserID();
        $scope.meetData.meetSeconds = 0;
        $scope.meetData.ratePeriod = 1;
        $scope.meetData.id = d.getTime(); // current timestamp
        $scope.meetData.meetDate = d.getTime();

        $scope.calculator = {
            'title': 'create a meeting',
            'description': '<strong>How many attenders</strong> will assist to the meeting?',
            'currentStep': 1,
            'error': '',
            'stepsInfo': [
                {
                'title': 'create a meeting',
                'description': '<strong>How many attenders</strong> will assist to the meeting?',
                'emptyError': 'Please, select how many persons will be in the meeting'
                },{
                'title': 'attenders rate',
                'description': 'What is the <strong>average attender rate?</strong>',
                'emptyError': 'Please, select the average attender rate in the meeting'
                },{
                'title': 'estimated time',
                'description': '<strong>How many minutes</strong> do you think the meeting will take?',
                'emptyError': 'Please, select how long is gonna be the meeting'
                }
            ]
        };

        $scope.calculatorVal = 0;

        $scope.insertKey = function (key) {
            if ( key != 'del' ) {
                if ( parseInt($scope.calculatorVal) ) {
                    $scope.calculatorVal = parseInt($scope.calculatorVal + '' + key);
                } else {
                    $scope.calculatorVal = parseInt(key);
                }

            } else {
                var str = $scope.calculatorVal+"";
                $scope.calculatorVal = parseInt(str.substring(0, str.length -1));
            }
        };

        $scope.checkCalulatorValue = function () {
            // check that user only insert numbers in calculator input
            $scope.calculatorVal = parseInt($scope.calculatorVal);
        }

        $scope.periodSelector = function (period) {
            $scope.meetData.ratePeriod = period;
        }

        $scope.movingTime = 300;

        $scope.nextStep = function (step) {
            if ( parseInt($scope.calculatorVal) && $scope.calculatorVal > 0 ) {
                $scope.calculator.isLeaving = true;
                $scope.calculator.isEntering = false;
                $scope.calculator.isMovingReverse = false;
                $scope.calculator.error = '';

                if ( step == 1 ) {
                    // attenders
                    $scope.meetData.attenders = $scope.calculatorVal;
                } else if ( step == 2) {
                    // average rate
                    $scope.meetData.averageRate = $scope.calculatorVal;
                } else if ( step == 3) {
                    // estimated time
                    $scope.meetData.estimatedSeconds = $scope.calculatorVal * 60;
                }

                setTimeout(function(){

                    $scope.calculatorVal = 0;

                    if ( step < 3 ) {
                        $scope.calculator.title = $scope.calculator.stepsInfo[step].title;
                        $scope.calculator.description = $scope.calculator.stepsInfo[step].description;
                        $scope.calculator.currentStep = step + 1;
                    }

                    $scope.$apply(function () {
                        $scope.calculator.isLeaving = false;
                        $scope.calculator.isEntering = true;
                    });
                }, $scope.movingTime);

                setTimeout(function(){
                    $scope.$apply(function () {
                        $scope.calculator.isEntering = false;
                    });
                }, $scope.movingTime * 2);
            } else {
                $scope.calculator.error = $scope.calculator.stepsInfo[step-1].emptyError;
            }

            $window.scrollTo(0,0);
        };

        $scope.prevStep = function (step) {

            $scope.calculator.isEntering = true;
            $scope.calculator.isLeaving = false;
            $scope.calculator.isMovingReverse = true;

            setTimeout(function(){

                if ( step == 1 ) {
                    // attenders
                    $scope.calculatorVal = $scope.meetData.attenders;
                } else if ( step == 2) {
                    // average rate
                    $scope.calculatorVal = $scope.meetData.averageRate;
                } else if ( step == 3) {
                    // estimated time
                    $scope.calculatorVal = $scope.meetData.estimatedSeconds / 60;
                }

                if ( step < 3 ) {
                    $scope.calculator.title = $scope.calculator.stepsInfo[step-1].title;
                    $scope.calculator.description = $scope.calculator.stepsInfo[step-1].description;
                    $scope.calculator.currentStep = step;
                }

                $scope.$apply(function () {
                    $scope.calculator.isEntering = false;
                    $scope.calculator.isLeaving = true;
                });
            }, $scope.movingTime);

            setTimeout(function(){
                $scope.$apply(function () {
                    $scope.calculator.isEntering = false;
                });
            }, $scope.movingTime * 2 );

            $window.scrollTo(0,0);

        };

        $rootScope.loading = false;
        $scope.addMeeting = function () {
            $scope.nextStep(3);

            if ( $scope.calculator.error == '') {
                console.log("NO HAY ERROR");
                $scope.meetData.status = 1;
                $rootScope.loading = true; // set preloading icon status

                // add new meeting to existing lists of meetings
                if (localStorage.meetings && localStorage.meetings != "undefined") {
                    // get user meetings from localstorage
                    $scope.meetings = JSON.parse(localStorage.meetings);

                    // insert new meeting
                    $scope.meetings.push($scope.meetData);

                    // update localstorage with new meeting
                    localStorage.meetings = JSON.stringify($scope.meetings);
                }

                /*
                // save new meeting on MySQL
                $http.post('api/save', $scope.meetData)
                    .success(function(data) {
                        // this callback will be called asynchronously
                        // when the response is available

                        if( data.error ) {
                            console.warn('ERROR:',data.error.text);
                            console.log('TODO: MENSAJE DE ERROR');
                        } else if ( data.success ) {
                            // redirect to detail page of new event
                            //$location.path('/meeting/'+$scope.meetData.owner+'/'+data.success.lastInsertId);
                        }
                        $rootScope.loading = false; // set preloading icon status
                    }).error(function() {
                      // called asynchronously if an error occurs
                      // or server returns response with an error status.
                      $rootScope.loading = false; // set preloading icon status
                });
                */
                $location.path('/meeting/'+$scope.meetData.owner+'/'+$scope.meetData.id);
            }


        };
    });


