'use strict';

/**
 * @ngdoc function
 * @name inboxApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the inboxApp
 */
angular.module('inboxApp').controller('InboxCtrl', function ($scope, $http) {
    $scope.messages = [];
    $scope.for_id;

    var message_poller_interval = 3000, //3sec interval
        msgs_poller;

    var utils = COLLEGETRENDS.UTILS;

    //init
    //get all user messages list
    //on load
    $scope.init = function() {
        //fetch users with messages from database
        $http({
            method : "GET",
            url : "/followers/get_following.json",
            type: "json"
        }).then(function mySuccess(response) {
            $scope.followings = response.data.followings_data;
        }, function myError(response) {

        });
    };

    //poller for message updates
    var message_updates_poller = function() {
        $.get("/messages/get_messages.json?for_id=" + $scope.for_id, function(response) {
            //new message arrived  
            console.log('poller started')
            console.log(response.messages);

            if (response.messages) {
                $scope.$apply(function() {
                    $scope.messages = response.messages;
                });
            }

            msgs_poller = setTimeout(message_updates_poller, message_poller_interval);
        });
    };

    //when the user tries to send a message
    $scope.send_message = function($event) {
        var keyCode = $event.keyCode || $event.which;

        //if carriage return is pressed
        //send message
        if (keyCode == 13) {
            //save to db
            var handlers = {
                beforeSend: function() {
                    //append message in dom
                    $scope.messages.push({
                        'message': {
                            'message': $scope.textMessage
                        },
                        'outbound': true
                    });
                    $scope.textMessage = null;
                },
                success: function(response) {

                },
                error: function() {

                },
                complete: function() {

                }
            };

            // preserve line breaks
            var textMessagePreserved = $scope.textMessage.replace(/(?:\r\n|\r|\n)/g, '<br/>');

            var options = {
                requestType: 'POST',
                requestURL: '/messages',
                requestData: {
                    'message': textMessagePreserved,
                    'for_id': $scope.for_id
                }
            };

            utils.sendAjax(options, handlers);
        }
    };

    //when the user switches between different messages
    //from different users
    $scope.switch_user = function($event) {
        $('.message-reply-box').removeClass('hide');
        $scope.contactSelected = true;
        $('.media.message').removeClass('selected');
        $($event.currentTarget).addClass('selected');

        $scope.for_id =  $($event.currentTarget).attr('data-for-id');

        //fetch messages from database
        $http({
            method : "GET",
            url : "/messages/get_messages.json?for_id=" + $scope.for_id
        }).then(function mySuccess(response) {
            $scope.messages = response.data.messages;

            clearTimeout(message_poller_interval);
            //start polling
            message_updates_poller();
        }, function myError(response) {

        });
    };
  });
