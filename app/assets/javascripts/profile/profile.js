COLLEGETRENDS.PROFILE = {};

COLLEGETRENDS.PROFILE = (function() {
    'use strict';

    var init = function() {
        /*var post = new COLLEGETRENDS.POST(
            {
                statusTextInput: $('#status-text-holder'),
                sharePostBtn: $('#share-post-btn'),
                postContainer: $('.posts-container'),
                root: $('.container')
            }
        );*/
    };

    return {
        init: init
    };
})();


$(document).ready(function(){
    COLLEGETRENDS.PROFILE.init();
});
