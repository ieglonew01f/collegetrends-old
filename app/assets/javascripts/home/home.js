COLLEGETRENDS.HOME = {};

COLLEGETRENDS.HOME = (function() {
    'use strict';

    var init = function() {
        //init posts
        var post = new COLLEGETRENDS.POST(
            {
                statusTextInput: $('#status-text-holder'),
                sharePostBtn: $('#share-post-btn'),
                postContainer: $('.posts-container'),
                root: $('.container')
            }
        );

        //init chat
        var chat = new COLLEGETRENDS.CHAT();
    };

    return {
        init: init
    };
})();


$(document).ready(function(){
    COLLEGETRENDS.HOME.init();
});
