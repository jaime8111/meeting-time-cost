'use strict';

angular.module('meetcost')
    .controller('MainCtrl', function ($scope, $cookies, $rootScope) {
        setUserID();

        $rootScope.pageInfo = {
            'id': 'indexPage',
            'class': 'indexPage',
            'title': 'Meeting time & cost'
        };
    });

