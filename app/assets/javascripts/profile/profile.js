COLLEGETRENDS.PROFILE = {};

COLLEGETRENDS.PROFILE = (function() {
    'use strict';
    var utils = COLLEGETRENDS.UTILS,
        aboutCharLimit = 80;

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
        setCharLimit();
    };

    var setCharLimit = function() {
        $('.char-limit').text(
            aboutCharLimit - $('#about').val().length
        );
    };

    var eventListeners = function() {
        $("#update-profile").on('click', function() {
            updateProfile($(this));
        });

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
    };

    var updateProfile = function(self) {
        var firstName = $('#first_name').val(),
            lastName = $('#last_name').val(),
            userName = $('#username').val(),
            homeTown = $('#home_town').val(),
            location = $('#location').val(),
            about = $('#about').val();

        $('#alert-char-limit').hide();
        self.blur();

        if (about.length > 80) {
            $('#alert-char-limit').show();
            return;
        }

        $('.well-profile-sm h4').text(firstName + ' ' + lastName);

        var handlers = {
            beforeSend: function() {
                self.text('Updating profile ...');
                $('#alert-update-success').hide();
            },
            success: function(response) {
                if (response.status === '200' || response.status === 200) {
                    $('#alert-update-success').show();
                }
            },
            error: function() {

            },
            complete: function() {
                self.text('Update Profile');
            }
        };

        var options = {
            requestType: 'PATCH',
            requestURL: '/profile/update',
            requestData: {
                profile: {
                    first_name: firstName,
                    last_name: lastName,
                    username: userName,
                    location: location,
                    home_town: homeTown,
                    about: about
                }
            }
        };

        utils.sendAjax(options, handlers);
    };

    return {
        init: init
    };
})();


$(document).ready(function(){
    COLLEGETRENDS.PROFILE.init();
});
