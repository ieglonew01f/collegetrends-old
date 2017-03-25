COLLEGETRENDS = {};
COLLEGETRENDS.UTILS = {};

COLLEGETRENDS.UTILS = (function() {
    'use strict';

    var sendAjax = function(options, handlers) {
        return $.ajax({
            url: options.requestURL,
            data: options.requestData || {},
            dataType: options.dataType || "json",
            type: options.requestType || 'GET',
            cache: options.cache || false,
            beforeSend: function () {
                if(handlers && typeof handlers.beforeSend === 'function') {
                    handlers.beforeSend.apply(null, Array.prototype.slice.apply(arguments));
                }
            },
            success: function() {
                if(handlers && typeof handlers.success === 'function') {
                    handlers.success.apply(null, Array.prototype.slice.apply(arguments));
                }
            },
            error: function() {
                if(handlers && typeof handlers.error === 'function') {
                    handlers.error.apply(null, Array.prototype.slice.apply(arguments));
                }
            },
            complete: function() {
                if(handlers && typeof handlers.complete === 'function') {
                    handlers.complete.apply(null, Array.prototype.slice.apply(arguments));
                }
            }
        });
    };

    var getTemplate = function(elem) {
        return Handlebars.compile(elem.html());
    };

    return {
        sendAjax: sendAjax,
        getTemplate: getTemplate
    };
})();
