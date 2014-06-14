'use strict';

angular.module('meetcost')
    .controller('AboutCtrl', function ($rootScope) {
        setUserID();

        $rootScope.pageInfo = {
            'id': 'aboutPage',
            'class': 'aboutPage',
            'title': 'Meeting time & cost'
        };
    });

