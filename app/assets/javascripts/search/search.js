COLLEGETRENDS.SEARCH = function() {
    'use strict';

    var utils = COLLEGETRENDS.UTILS,
        searchTemplate = utils.getTemplate($('#search-result-people-template')),
        noSearchResultsTemplate = utils.getTemplate($('#search-result-people-no-results-template')),
        loadingSearchResultsTemplate = utils.getTemplate($('#search-result-people-loading-results-template'));

    var init = function () {
        $('#search-input').keydown(function (e) {
            searchPeople($(this));
            e.stopPropagation();
        });

        $('#search-input').click(function (e) {
            if ($.trim($('.search-results-list').html()) !== '') {
                $('.search-result-container').removeClass('hidden');
                e.stopPropagation();
            }
        });

        $('.search-result-container').click(function (e) {
            e.stopPropagation();
        });

        $(window).on('click blur', function(e) {
            $('.search-result-container').addClass('hidden');
        });
    };

    var searchPeople = function (self) {

        if (self.val() === '') return;

        var options = {
            requestType: 'POST',
            requestURL: '/search/',
            requestData: {
                token: self.val()
            }
        };

        var handlers = {
            beforeSend: function() {
                $('.search-result-container').removeClass('hidden');
                $('.search-results-list').html(loadingSearchResultsTemplate());
            },
            success: function(response) {
                if(response && response.people) {
                    drawPeopleList(response.people);
                }
            },
            error: function() {

            },
            complete: function() {

            }
        };

        utils.sendAjax(options, handlers);
    };

    var drawPeopleList = function (people) {
        var peopleTemplate = [];

        //nil results
        if (people.length === 0) {
            $('.search-results-list').html(noSearchResultsTemplate());
            return;
        }

        $.each(people, function (i, person) {
            peopleTemplate.push(
                searchTemplate({
                    first_name: person.first_name,
                    last_name: person.last_name,
                    username: person.username,
                    college: person.college,
                    profile_picture: person.profile_picture
                })
            );
        });

        $('.search-results-list').html(peopleTemplate.join(''));
    };

    init();

    return {
        init: init
    }
};
