COLLEGETRENDS.PROFILE = {};

COLLEGETRENDS.PROFILE = (function() {
    'use strict';
    var utils = COLLEGETRENDS.UTILS,
        aboutCharLimit = 80;

    var init = function() {
        if (COLLEGETRENDS.POST !==  undefined) {
            var post = new COLLEGETRENDS.POST(
                {
                    statusTextInput: $('#status-text-holder'),
                    sharePostBtn: $('#share-post-btn'),
                    postContainer: $('.posts-container'),
                    root: $('.container')
                }
            );
        }

        eventListeners();
        setCharLimit();

        //init chat
        var chat = new COLLEGETRENDS.CHAT();
    };

    var setCharLimit = function() {
        if ($('#about').length === 0) return;

        $('.char-limit').text(
            aboutCharLimit - $('#about').val().length
        );
    };

    var eventListeners = function() {
        $('.follow-unfollow-user').on('click', function() {
            handleUserFollow($(this));
        });

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

    var handleUserFollow = function(self) {
        var action = self.attr('data-action'),
            followingId = self.attr('data-profile-id'),
            options,
            handlers;

        self.blur();

        if (action === 'follow') {
            handlers = {
                beforeSend: function() {
                    self.text('Following');
                    self.attr('data-action', 'following');
                },
                success: function(response) {

                },
                error: function() {

                },
                complete: function() {

                }
            };

            options = {
                requestType: 'POST',
                requestURL: '/followers',
                requestData: {
                    follower: {
                        following_id: followingId
                    }
                }
            };
        }
        else if (action === 'following') {
            handlers = {
                beforeSend: function() {
                    self.text('Follow');
                    self.attr('data-action', 'follow');
                },
                success: function(response) {

                },
                error: function() {

                },
                complete: function() {

                }
            };

            options = {
                requestType: 'DELETE',
                requestURL: '/followers/' + followingId,
                requestData: {
                    follower: {
                        following_id: followingId
                    }
                }
            };
        }

        utils.sendAjax(options, handlers);
    };

    return {
        init: init
    };
})();


$(document).ready(function(){
    COLLEGETRENDS.PROFILE.init();
});
