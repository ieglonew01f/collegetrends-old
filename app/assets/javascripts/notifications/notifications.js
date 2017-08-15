COLLEGETRENDS.NOTIFICATIONS = function() {
    'use strict';

    var utils = COLLEGETRENDS.UTILS;

    var init = function() {
        $('.notification-dropdown a').on('click', function() {
            get_notifications();
        });
    };

    var get_notifications = function() {
        var handlers = {
            beforeSend: function() {

            },
            success: function(data) {
                if (data.notifications && data.notifications.length > 0) {
                    display_notifications(data.notifications);
                }
            },
            error: function() {

            },
            complete: function() {

            }
        };

        var options = {
            requestType: 'GET',
            requestURL: '/notifications'
        };

        utils.sendAjax(options, handlers);
    };

    var display_notifications = function(notifications) {
        if (!notifications) return;

        var notif_template = utils.getTemplate($('#notifications-template'));

        $('.notification-dropdown ul.dropdown-menu').html(notif_template({
            notifications: notifications
        }));
    };

    init();
};
