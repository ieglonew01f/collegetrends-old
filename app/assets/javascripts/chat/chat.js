COLLEGETRENDS.CHAT = function() {
    'use strict';

    var utils = COLLEGETRENDS.UTILS,
        root = $('.chat-panel');

    var init = function() {
        /*
            Load list of people on side bar on page load
            Todo: yet to make this configurable
         */
        fetchAndLoadPeople();

        /*
            Initialize chat websocket
         */
        initChatWebsocket();


        /*
            Clicking on a person would bring up the chat window
         */
        root.on('click', '.person', function () {
            openChatWindow($(this));
        });

        /*
            User types something in the chat box
         */
        root.on('keydown', '.message-input', function (e) {
            var keyCode = e.keyCode || e.which;

            if (keyCode == 13) {
                var self = $(this);
                var message = self.val();
                var userId = self.attr('data-user-id');

                sendMessage({
                    for_id: userId,
                    message: message
                });

                self.val('');
            }
        });
    };

    /*
        Load people list on page load
    */

    var fetchAndLoadPeople = function(self) {
        var options = {
            requestType: 'GET',
            requestURL: '/users/'
        };

        var handlers = {
            beforeSend: function() {

            },
            success: function(response) {
                if(response && response.users) {
                    drawPeopleList(response.users);
                }
            },
            error: function() {

            },
            complete: function() {

            }
        };

        utils.sendAjax(options, handlers);
    };

    var drawPeopleList = function(users) {
        var peopleListTemplate = utils.getTemplate($('#people-list-template'));
        var peopleHtml = peopleListTemplate({
            users: users
        });

        $('.chat-people-holder').html(peopleHtml);
    };

    var openChatWindow = function (self) {
        var firstName = self.attr('data-first-name');
        var lastName = self.attr('data-last-name');
        var username = self.attr('data-username');
        var picture = self.attr('data-picture');
        var id = self.attr('data-user-id');

        var privateChatBoxTemplate = utils.getTemplate($('#private-chat-box-template'));

        var chatBoxHtml = privateChatBoxTemplate({
            firstName: firstName,
            lastName: lastName,
            username: username,
            picture: picture,
            id: id,
            position: getChatDrawPosition()
        });

        $('.private-chat-box-holder ').append(chatBoxHtml);
    };

    var getChatDrawPosition = function () {
        //get number of chat divs already present
        var chatBoxesCount = $('.private-chat-box-holder .private-chat-box').length;

        //if non are open then its very simple
        if (chatBoxesCount === 0) {
            return 265;
        }
        else {
            //here 260 is the width of the chat panel
            //here 265 is the width of the previous chat div
            //here 50 will add a little space between two divs
            return 260 + ((50 + 265)*chatBoxesCount);
        }
    };

    /* WEB SOCKETS MAGIC STARTS HERE */
    var initChatWebsocket = function () {
        App.room = App.cable.subscriptions.create({
            channel: "RoomChannel",
            conversation_id: $('.chat-panel').attr('data-current-user-id') //need to make this more safe prob replace with a unique user hash
        }, {
            connected: function() {},
            disconnected: function() {},
            received: function(data) {
                root.find('.messages .rows').append(
                    data.message
                );
            },
            speak: function(message, for_id) {
                return this.perform('speak', {
                    message: message,
                    for_id: for_id,
                    by_id: $('.chat-panel').attr('data-current-user-id')
                });
            }
        });
    };

    var sendMessage = function (options) {
        App.room.speak(options.message, options.for_id);
    };

    init();
};
