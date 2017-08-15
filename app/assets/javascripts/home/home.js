COLLEGETRENDS.HOME = {};

COLLEGETRENDS.HOME = (function() {
    'use strict';

    var init = function() {
        //init stuff
        COLLEGETRENDS.POST(
            {
                statusTextInput: $('#status-text-holder'),
                sharePostBtn: $('#share-post-btn'),
                postContainer: $('.posts-container'),
                root: $('.container')
            }
        );

        COLLEGETRENDS.CHAT();
        COLLEGETRENDS.SEARCH();
        COLLEGETRENDS.NOTIFICATIONS();
    };

    return {
        init: init
    };
})();


$(document).ready(function(){
    COLLEGETRENDS.HOME.init();
});
