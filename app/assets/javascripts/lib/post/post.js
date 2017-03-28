COLLEGETRENDS.POST = function(options) {
    'use strict';

    var statusTextInput = options.statusTextInput,
        sharePostBtn = options.sharePostBtn,
        postContainer = options.postContainer,
        root = options.root,
        utils = COLLEGETRENDS.UTILS;

    var init = function() {
        sharePostBtn.on('click', function() {
            sharePost($(this));
        });

        root.on('click', '.like-btn', function() {
            handlePostLikes($(this));
        });

        root.on('click', '.delete-post', function() {
            deletePost($(this));
        });
    };

    /*
        This method will make an ajax call to share a post

        Post type = 1 for normal text based posts
        Post type = 2 image based posts
    */
    var sharePost = function(self) {
        var postType = self.attr('data-post-type'),
            postText = statusTextInput.val();

        if ($.trim(postText) !== '' && postType === '1') {
            var handlers = {
                beforeSend: function() {
                    self.hide();
                    $('#status-widget-loader').removeClass('hidden');
                },
                success: function(response) {
                    renderPost(response);
                },
                error: function() {

                },
                complete: function() {
                    self.show();
                    statusTextInput.val('');
                    $('#status-widget-loader').addClass('hidden');
                }
            };

            // preserve line breaks
            var postTextPreserved = postText.replace(/(?:\r\n|\r|\n)/g, '<br/>');

            var options = {
                requestType: 'POST',
                requestURL: '/posts',
                requestData: {
                    post: {
                        post_type: postType,
                        content: postTextPreserved
                    }
                }
            };

            utils.sendAjax(options, handlers);
        }
    };

    var renderPost = function(response) {
        var postCardTemplate = utils.getTemplate($('#post-card-template'));

        var templateData = postCardTemplate({
              post: response.post,
              user: response.post_user
            }
        );

        postContainer.prepend(templateData);

    };

    /*
        Post Like/Unlike handler
    */

    var handlePostLikes = function(self) {
        var liked = self.attr('data-liked'),
            thisPostContainer = self.parents('.well-feed'),
            postId = thisPostContainer.attr('data-post-id'),
            currentLikes = parseInt(thisPostContainer.attr('data-post-likes-count')),
            options = {};

        /*
          Post is liked by session user unlike it
          else like the post
        */
        if (liked === "1") {
            self.removeClass('text-danger text-muted').addClass('text-muted');
            self.attr('data-liked', '0');

            if (currentLikes > 2) {
                thisPostContainer.find('.likes-count').text((currentLikes - 1) + ' likes');
            }
            else {
                thisPostContainer.find('.likes-count').text(0 + ' likes');
            }

            options = {
                requestType: 'DELETE',
                requestURL: '/post_likes/' + postId,
                requestData: {
                    post_like: {
                        post_id: postId
                    }
                }
            };
        }
        else {
            self.removeClass('text-danger text-muted').addClass('text-danger');
            self.attr('data-liked', '1');

            if (currentLikes >= 1) {
                thisPostContainer.find('.likes-count').text((currentLikes + 1) + ' likes');
            }
            else if (isNaN(currentLikes) || currentLikes === 0) {
                thisPostContainer.find('.likes-count').text('1 like');
            }

            options = {
                requestType: 'POST',
                requestURL: '/post_likes',
                requestData: {
                    post_like: {
                        post_id: postId
                    }
                }
            };
        }

        var handlers = {
            beforeSend: function() {

            },
            success: function(response) {

            },
            error: function() {

            },
            complete: function() {

            }
        };

        utils.sendAjax(options, handlers);
    };

    /*
      Handle delete post
    */

    var deletePost = function(self) {
        var thisPostContainer = self.parents('.well-feed'),
            postId = thisPostContainer.attr('data-post-id');

        options = {
            requestType: 'DELETE',
            requestURL: '/posts/' + postId,
            requestData: {
                post: {
                    id: postId
                }
            }
        };

        var handlers = {
            beforeSend: function() {
                self.hide();
                thisPostContainer.find('.post-operation-loader').removeClass('hidden');
            },
            success: function(response) {

            },
            error: function() {

            },
            complete: function() {
                thisPostContainer.remove();
            }
        };

        utils.sendAjax(options, handlers);
    };

    init();
};
