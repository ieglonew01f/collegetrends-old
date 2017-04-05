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

        $(window).bind("beforeunload", function() {
            App.room.disconnected();
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

                if ($.trim(message) !== '') {
                    sendMessage({
                        for_id: userId,
                        message: message
                    });

                    self.val('');
                    sendIsTyping($(this), false);
                }
            }

            if ($.trim($(this).val()) === '') {
                sendIsTyping($(this), false);
            }
            else {
                sendIsTyping($(this), true);
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
        var peopleListTemplate = utils.getTemplate($('#people-list-template')),
            peopleHtml = [];

        $.each(users, function (i, user) {
            if (user.id == $('.chat-panel').attr('data-current-user-id')) return true;

            peopleHtml.push(peopleListTemplate({
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.username,
                profile_picture: user.profile_picture,
                online: (!user.online || user.online !== 1) ? 'hidden' : 'online'
            }));
        });


        $('.chat-people-holder').html(peopleHtml.join(' '));
    };

    var openChatWindow = function (self) {
        var firstName = self.attr('data-first-name');
        var lastName = self.attr('data-last-name');
        var username = self.attr('data-username');
        var picture = self.attr('data-picture');
        var id = self.attr('data-user-id');

        if ($('.private-chat-box-holder').find('.private-chat-box[data-user-id="' + id + '"]').length > 0) return;

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

        $('.private-chat-box-holder')
            .find('.private-chat-box[data-user-id="' + id + '"]')
            .find('.message-input')
            .focus();
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
            connected: function() {
                return this.perform('connected', {
                    user_id: $('.chat-panel').attr('data-current-user-id')
                });
            },
            disconnected: function() {
                return this.perform('disconnected', {
                    user_id: $('.chat-panel').attr('data-current-user-id')
                });
            },
            received: function(data) {
                if (data && data.data && data.data.action === 'connected') {
                    setOnline(data.data.user_id);
                }
                else if (data && data.data && data.data.action === 'disconnected') {
                    setOffline(data.data.user_id);
                }
                else if (data && data.data && data.data.action === 'is_typing') {
                    toggleIsTyping(data.data.by_id, data.data.is_typing);
                }
                else {
                    recieveMessage(data);
                }
            },
            is_typing: function (for_id, is_typing) {
                return this.perform('is_typing', {
                    for_id: for_id,
                    by_id: $('.chat-panel').attr('data-current-user-id'),
                    is_typing: is_typing
                });
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

        //show message for self
        var thisChatPersonWindow = $('.private-chat-box-holder').find('.private-chat-box[data-user-id="' + options.for_id + '"]');

        thisChatPersonWindow.find('.messages .rows').append(
            $('<div/>')
                .addClass('outgoing-message text-message')
                .text(options.message)
        );

        thisChatPersonWindow.find('.messages').scrollTop(thisChatPersonWindow.find('.messages')[0].scrollHeight);
    };

    var recieveMessage = function(data) {
        var forId = data.message.for_id,
            byId = data.message.by_id,
            message = data.message.message;

        var thisPerson = $('.chat-people-holder').find('.person[data-user-id="' + byId + '"]'),
            thisChatPersonWindow = $('.private-chat-box-holder').find('.private-chat-box[data-user-id="' + byId + '"]');

        var isforIdChatAlreadyOpen = thisChatPersonWindow.length;

        //not already open then open it
        if (isforIdChatAlreadyOpen === 0) {
            openChatWindow(thisPerson);
        }

        $('.private-chat-box-holder')
            .find('.private-chat-box[data-user-id="' + byId + '"]')
            .find('.is-typing')
            .addClass('hidden');

        //otherwise find and append
        $('.private-chat-box-holder').find('.private-chat-box[data-user-id="' + byId + '"]').find('.messages .rows').append(
            $('<div/>')
                .addClass('incomming-message text-message')
                .text(message)
        );

        $('.private-chat-box-holder')
            .find('.private-chat-box[data-user-id="' + byId + '"]')
            .find('.messages')
            .scrollTop(
                $('.private-chat-box-holder')
                    .find('.private-chat-box[data-user-id="' + byId + '"]')
                    .find('.messages')[0].scrollHeight
            );
    };

    var setOnline = function (userId) {
        $('.chat-people-holder').find('.person[data-user-id="' + userId + '"]')
            .removeClass('online, hidden')
            .addClass('online');
    };

    var setOffline = function (userId) {
        $('.chat-people-holder').find('.person[data-user-id="' + userId + '"]')
            .removeClass('online, hidden')
            .addClass('hidden');
    };

    var sendIsTyping = function (self, isTyping) {
        App.room.is_typing(self.attr('data-user-id'), isTyping);
    };

    var toggleIsTyping = function (user_id, isTyping) {
        var thisChatBox = $('.private-chat-box-holder')
            .find('.private-chat-box[data-user-id="' + user_id + '"]');

        if (isTyping) {
            thisChatBox
                .find('.is-typing')
                .removeClass('hidden');
        }
        else {
            thisChatBox
                .find('.is-typing')
                .removeClass('hidden')
                .addClass('hidden');
        }

    };

    init();
};
