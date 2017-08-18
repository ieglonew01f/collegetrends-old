COLLEGETRENDS.POST = function(options) {
    'use strict';

    var statusTextInput = options.statusTextInput,
        sharePostBtn = options.sharePostBtn,
        postContainer = options.postContainer,
        root = options.root,
        utils = COLLEGETRENDS.UTILS,
        parsedLink;

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

        root.on('click', '.comment-btn', function() {
            var self = $(this),
                clicked = self.attr('data-clicked');

            if (!clicked) {
                listComments($(this));
            }

            self.attr('data-clicked', true);

            self.parents('.well-feed').find('.comments-container').toggle();
        });

        root.on('click', '.add-comment-btn', function() {
            addComment($(this));
        });

        root.on('click', '.load-more-comments', function() {
            loadMoreComments($(this));
        });

        statusTextInput.on('paste', function () {
            var self = $(this);
            setTimeout(function () {
                var link = $(self).val();
                //test if pasted value is a link
                if(utils.isLink(link)) {
                    //make ajax request to get link data
                    link_parser(link);
                }
            }, 100);
        });

        statusTextInput.on('focus', function() {
            $('.overlay').removeClass('hidden');
        });

        statusTextInput.on('blur', function() {
            $('.overlay').addClass('hidden');
        });
    };

    /*
        This method will make an ajax call to share a post

        Post type = 1 for normal text based posts
        Post type = 2 posts with meta (links/videos/images)
    */
    var sharePost = function(self) {
        var postType = self.attr('data-post-type'),
            postText = statusTextInput.val();

        if ($.trim(postText) !== '') {
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
                    $('.post-meta').hide();
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
                        post_meta: JSON.stringify(parsedLink), 
                        content: postTextPreserved
                    }
                }
            };

            utils.sendAjax(options, handlers);
        }
    };

    var renderPost = function(response) {
        var postCardTemplate = utils.getTemplate($('#post-card-template')),
            post_meta;

        var templateData = postCardTemplate({
              post: response.post,
              post_meta: JSON.parse(response.post.post_meta),
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
            self.find('.icon-heart').removeClass('text-danger');
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
            self.find('.icon-heart').removeClass('text-danger text-muted').addClass('text-danger');
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

    var link_parser = function(link) {
        var options = {
            requestType: 'PUT',
            requestURL: '/posts/parse_link/',
            requestData: {
                link: link
            }
        };

        var handlers = {
            beforeSend: function() {
                sharePostBtn.hide();
                $('#status-widget-loader').removeClass('hidden');
            },
            success: function(response) {
                var postCardMetaTemplate = utils.getTemplate($('#post-card-meta-template'));

                response.page_object.image = response.page_object.images[0].src;

                $('.post-meta')
                    .html(postCardMetaTemplate({
                        page_object: response.page_object
                    }))
                    .show();

                parsedLink = response.page_object;
                sharePostBtn.attr('data-post-type', '2');
            },
            error: function() {

            },
            complete: function() {
                sharePostBtn.show();
                $('#status-widget-loader').addClass('hidden');
            }
        };

        utils.sendAjax(options, handlers);
    };

    var addComment = function(self) {
        var commentText = self.parents('.well-feed').find('.comment-text'),
            comment = $.trim(commentText.val()),
            post_id = self.parents('.well-feed').attr('data-post-id'),
            comments_container = self.parents('.well-feed').find('.comments-list');

        if (comment === '' || post_id === '') return;

        var options = {
            requestType: 'POST',
            requestURL: '/posts/' + post_id + '/comments',
            requestData: {
                "comment[post_id]": post_id,
                "comment[comment_text]": comment
            }
        };

        var handlers = {
            beforeSend: function() {
                commentText.val('');
            },
            success: function(response) {
                if (!response || 
                    !response.comment ||
                    response.comment.length === 0) return;

                var commentsTemplate = utils.getTemplate($('#comments-template'));

                comments_container.prepend(commentsTemplate({
                    comments: response.comment
                }));
            },
            error: function() {

            },
            complete: function() {

            }
        };

        utils.sendAjax(options, handlers);
    };

    var listComments = function(self) {
        var post_id = self.parents('.well-feed').attr('data-post-id'),
            comments_container = self.parents('.well-feed').find('.comments-list');

        if (post_id === '') return;

        var options = {
            requestType: 'GET',
            requestURL: '/posts/' + post_id + '/comments'
        };

        var handlers = {
            beforeSend: function() {

            },
            success: function(response) {
                if (!response || 
                    !response.comments ||
                    response.comments.length === 0) return;

                var commentsTemplate = utils.getTemplate($('#comments-template'));

                comments_container.html(commentsTemplate({
                    comments: response.comments
                }));
            },
            error: function() {

            },
            complete: function() {

            }
        };

        utils.sendAjax(options, handlers);
    };

    var loadMoreComments = function(self) {
        var post_id = self.parents('.well-feed').attr('data-post-id'),
            comments_container = self.parents('.well-feed').find('.comments-list'),
            last_id = comments_container.find('.media.comment:last').attr('data-id');

        if (post_id === '' || last_id === '') return;

        var options = {
            requestType: 'GET',
            requestURL: '/posts/' + post_id + '/comments/load_more',
            requestData: {
                last_id: last_id
            }
        };

        var handlers = {
            beforeSend: function() {

            },
            success: function(response) {
                if (!response || 
                    !response.comments ||
                    response.comments.length === 0) return;

                var commentsTemplate = utils.getTemplate($('#comments-template'));

                comments_container.append(commentsTemplate({
                    comments: response.comments
                }));
            },
            error: function() {

            },
            complete: function() {

            }
        };

        utils.sendAjax(options, handlers);
    };

    init();
};
