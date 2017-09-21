'use strict';

/**
 * @ngdoc overview
 * @name inboxApp
 * @description
 * # inboxApp
 *
 * Main module of the application.
 */
angular
  .module('inboxApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });
  });
