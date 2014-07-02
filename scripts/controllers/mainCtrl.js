'use strict';

angular.module('meetcost')
    .controller('MainCtrl', function ($scope, $cookies, $rootScope) {

        // set page info
        $rootScope.pageInfo = {
            'id': 'indexPage',
            'class': 'indexPage',
            'title': 'Meeting time & cost'
        };

        // hide fixed bar by default
        $scope.toggleBarVisibility = false;

        // check localstorage support
        if(typeof(Storage)=="undefined") {
          alert("Sorry! No web storage support. You can not use this app.");
        }

        setUserID();

        $scope.toggleBar = function () {
            if ( $scope.toggleBarVisibility ) {
                $scope.toggleBarVisibility = false;
            } else {
                $scope.toggleBarVisibility = true;
            }
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
        setUserStorageStructure();
    }
    // localStorage.owner = '1400686582593-4bd1';
    // myRealID = 1400686582593-4bd1
    //console.log(localStorage.owner);
    return localStorage.owner;
}

function setUserStorageStructure() {
    // check if localstorage structure has been created already
    if (localStorage.getItem("meetings") === null) {
      //localStorage.meetings = '{"'+localStorage.owner+'": []}';
      localStorage.meetings = '[]';
      localStorage.ratePeriods = '[{"id":"1","type":"hourly","rate":"1"},{"id":"2","type":"monthly","rate":"160"},{"id":"3","type":"yearly","rate":"1680"}]'
    }
}