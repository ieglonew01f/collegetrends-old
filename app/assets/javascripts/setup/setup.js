COLLEGETRENDS.SETUP = {};

COLLEGETRENDS.SETUP = (function() {
    'use strict';
    var aboutCharLimit = 80,
        utils = COLLEGETRENDS.UTILS;

    var init = function() {
        /*var post = new COLLEGETRENDS.POST(
            {
                statusTextInput: $('#status-text-holder'),
                sharePostBtn: $('#share-post-btn'),
                postContainer: $('.posts-container'),
                root: $('.container')
            }
        );*/

        eventListeners();
    };

    var eventListeners = function() {
        $('#about').on('keyup', function() {
            var value = $(this).val();

            $('.about').text(value);

            if (value.length > 80) {
                $('.char-limit')
                  .removeClass('text-danger')
                  .addClass('text-danger');

                $('.char-limit').text(
                    aboutCharLimit - value.length
                );
            }
            else if(value.length === 0) {
                $('.char-limit').text(80);
                $('.char-limit').removeClass('text-danger');
                aboutCharLimit = 80;
            }
            else {
                $(this).removeAttr('disabled');
                $('.char-limit').text(
                    aboutCharLimit - value.length
                );
                $('.char-limit').removeClass('text-danger');
            }
        });

        $('#save-setup').on('click', function() {
            saveSetupData($(this));
        });
    };

    var saveSetupData = function(self) {
        var college = $('#college').val(),
            homeTown = $('#home-town').val(),
            about = $('#about').val();

        $('#alert-char-limit').hide();
        self.blur();

        if (about.length > 80) {
            $('#alert-char-limit').show();
            return;
        }

        var handlers = {
            beforeSend: function() {
                self.text('Saving...');
            },
            success: function(response) {
                window.location = '/home/'
            },
            error: function() {

            },
            complete: function() {
                self.text('Save');
            }
        };

        var options = {
            requestType: 'POST',
            requestURL: '/setup/save',
            requestData: {
                setup: {
                    college: college,
                    home_town: homeTown,
                    about: about
                }
            }
        };

        utils.sendAjax(options, handlers);
    }

    return {
        init: init
    };
})();


$(document).ready(function(){
    COLLEGETRENDS.SETUP.init();
});
