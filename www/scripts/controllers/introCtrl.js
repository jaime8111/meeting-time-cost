'use strict';

angular.module('meetcost')
    .controller('AboutCtrl', function ($rootScope) {

        $rootScope.pageInfo = {
            'id': 'aboutPage',
            'class': 'aboutPage',
            'title': 'Meeting time & cost'
        };

        // hide fixed bar by default
        $rootScope.toggleBarVisibility = false;
    });

