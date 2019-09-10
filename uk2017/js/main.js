var colors = ['#4285f4', '#db4437', '#f4b400', '#0f9d58', '#ab47bc'];
var no_terms = 5;
var topics_csv = [];
var normalised = gup('normalised');
var json = "output_rarezero.tsv";
if (normalised === "true") {
    json = "output_nonrare_normalised.tsv";
}
$(function () {
    d3.tsv(json, function (error, data) {
        data.forEach(function (d) {
            if (d.date === "20170526") {
                topics_csv.push({
                    "value": d.topic,
                    "data": {"category": d.category, "popularity": Math.round(d.average_tweets)}
                });
            }
        });
        topics_csv.sort(sort_by('data', {
            name: 'value',
            primer: parseInt,
            reverse: true
        }));
        $('#topic').devbridgeAutocomplete({
            lookup: topics_csv,
            minChars: 0,
            beforeRender: function () {
                $('.autocomplete-suggestion').each(function () {
                    if ($(this).next().hasClass('autocomplete-group')) {
                        $(this).css('margin-bottom', '15px')
                    }
                });
            },
            onSelect: function (suggestion) {
                var $user_topics = $('#user_topics');
                var topics_number = $user_topics.find('ul li').length;
                var $topic = $('#topic');
                $topic.val("");
                $topic.blur();
                remove_topic(suggestion.value);
                if (topics_number === 0) {
                    $('.box-pad,#note_p').show();
                    $('#placeholder_img,#desc').hide();
                    $user_topics.find('ul').append('<li><div style="display: inline-block;"><div class="legendcolor" style="background-color:#4285f4;"></div><div class="legendtext">' + suggestion.value + '</div><p class="topic_count">Topic 1 out of 5</p></div><img class="delete_topic" data-category="' + suggestion.data.category + '" data-popularity="' + suggestion.data.popularity + '" src="imgs/delete-16.png" width="12"><div class="dropdown"> <div class="main_choice" data-name="tweets">Number of Tweets</div> <img src="imgs/arrow_down.png" alt="down" class="down"> <div class="menu" style="display: none;"> <p class="selected_metric" data-name="tweets"><img src="imgs/bullet.png" alt="down" class="icon-select">Number of Tweets</p> <p data-name="users"><img src="imgs/bullet.png" alt="down" class="icon-select">Number of Users</p> <p data-name="pos_tweets"><img src="imgs/bullet.png" alt="down" class="icon-select">Positive Sentiment</p> <p data-name="nrl_tweets"><img src="imgs/bullet.png" alt="down" class="icon-select">Neutral Sentiment</p> <p data-name="neg_tweets"><img src="imgs/bullet.png" alt="down" class="icon-select">Negative Sentiment</p> <p data-name="pos_users"><img src="imgs/bullet.png" alt="down" class="icon-select">Users expressing positive sentiment</p> <p data-name="nrl_users"><img src="imgs/bullet.png" alt="down" class="icon-select">Users expressing neutral sentiment</p> <p data-name="neg_users"><img src="imgs/bullet.png" alt="down" class="icon-select">Users expressing negative sentiment</p> </div> </div></li>');
                    $user_topics.slideDown();
                    $('.input-field').animate({
                        "margin-top": 20,
                        "max-width": "40rem"
                    }, 500);
                }
                else {
                    $user_topics.find('ul').append('<li><div style="display: inline-block;"><div class="legendcolor" style="background-color:' + colors[topics_number] + ';"></div><div class="legendtext">' + suggestion.value + '</div><p class="topic_count">Topic ' + (topics_number + 1) + ' out of 5</p></div><img class="delete_topic" data-category="' + suggestion.data.category + '" data-popularity="' + suggestion.data.popularity + '" src="imgs/delete-16.png" width="12"><div class="dropdown"> <div class="main_choice" data-name="'+$('.main_choice').eq(0).attr('data-name')+'">'+$('.main_choice').eq(0).text()+'</div> <img src="imgs/arrow_down.png" alt="down" class="down"> <div class="menu" style="display: none;"> <p data-name="tweets"><img src="imgs/bullet.png" alt="down" class="icon-select">Number of Tweets</p> <p data-name="users"><img src="imgs/bullet.png" alt="down" class="icon-select">Number of Users</p> <p data-name="pos_tweets"><img src="imgs/bullet.png" alt="down" class="icon-select">Positive Sentiment</p> <p data-name="nrl_tweets"><img src="imgs/bullet.png" alt="down" class="icon-select">Neutral Sentiment</p> <p data-name="neg_tweets"><img src="imgs/bullet.png" alt="down" class="icon-select">Negative Sentiment</p> <p data-name="pos_users"><img src="imgs/bullet.png" alt="down" class="icon-select">Users expressing positive sentiment</p> <p data-name="nrl_users"><img src="imgs/bullet.png" alt="down" class="icon-select">Users expressing neutral sentiment</p> <p data-name="neg_users"><img src="imgs/bullet.png" alt="down" class="icon-select">Users expressing negative sentiment</p> </div> </div></li>');
                    var p_selected=$('.selected_metric').eq(0).attr('data-name');
                    $('.menu').eq(topics_number).find('p[data-name='+p_selected+']').addClass('selected_metric');
                }
                drawChart();
                if (topics_number === no_terms - 1) {
                    $topic.blur();
                    $topic.attr('disabled', 'disabled');
                    $('.input-field').addClass('disabled');
                    $('.info').slideDown();
                }
            },
            showNoSuggestionNotice: true,
            noSuggestionNotice: 'Sorry, no matching results',
            groupBy: 'category'
        });
    });

});

var input_selector = 'input[type=text]';
$(document).on('focus', input_selector, function () {
    $(this).siblings('label, i').addClass('active');
    $('.search_icon').attr('src', 'imgs/search-blue.png');
});
$(document).on('blur', input_selector, function () {
    var $inputElement = $(this);
    if ($inputElement.val().length === 0 && $inputElement[0].validity.badInput !== true && $inputElement.attr('placeholder') === undefined) {
        $inputElement.siblings('label, i').removeClass('active');
    }
    $('.search_icon').attr('src', 'imgs/search-gray.png');
});
function remove_topic(term) {
    topics_csv = $.grep(topics_csv, function (e) {
        return e.value != term;
    });
    $('#topic').autocomplete('setOptions', {
        lookup: topics_csv
    });
}
function add_topic(term, category, popularity) {
    topics_csv.push({"value": term, "data": {"category": category, "popularity": popularity}});
    topics_csv.sort(sort_by('data', {
        name: 'value',
        primer: parseInt,
        reverse: true
    }));
    $('#topic').autocomplete('setOptions', {
        lookup: topics_csv
    });
}
$('#user_topics').on('click', '.delete_topic', function () {
    $("#topic").removeAttr('disabled');
    $('.input-field').removeClass('disabled');
    $('.info').slideUp();
    add_topic($(this).parent().find('.legendtext').text(), $(this).attr('data-category'), $(this).attr('data-popularity'));
    $(this).parent().remove();
    var $user_topics = $('#user_topics');
    if ($user_topics.find('ul li').length === 0) {
        $('.icon-x').click();
        $('.box-pad,#note_p').hide();
        $('#placeholder_img,#desc').show();
        $user_topics.hide();
        $('.input-field').animate({
            "margin-top": 100,
            "max-width": "64rem"
        }, 500);
    }
    else {
        drawChart();
        $('#user_topics').find("li").each(function (index) {
            $(this).find('.legendcolor').css("background-color", colors[index]);
            $(this).find('.topic_count').text("Topic " + (index + 1) + " out of 5");
        })
    }
});
$('#user_topics').on('click', '.main_choice,.down', function () {
    $('.icon-x').click();
    $(this).siblings('.menu').slideDown("fast");
    return false;
});
$('#user_topics').on('click', 'p:not(.selected_metric)', function () {
    $(this).addClass('selected_metric');
    $(this).siblings('p').removeClass("selected_metric");
    $(this).parent().siblings('.main_choice').text($(this).text()).attr('data-name', $(this).attr('data-name'));
    ;
    drawChart();
});
$(document).click(function () {
    $(".menu").slideUp("fast");
});

/*-------------------------------------CHART------------------------------------*/
var chart;
function drawChart() {
    var sentiment_selection = false;
    nv.addGraph(function () {
        chart = nv.models.lineChart()
            .interpolate("cardinal")
            .margin({right: 50, left: 50, bottom: 30})  //Adjust chart margins to give the x-axis some breathing room.
            .useInteractiveGuideline(false)  //We want nice looking tooltips and a guideline!
            .duration(1500)  //how fast do you want the lines to transition?
            .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
            .showYAxis(true)        //Show the y-axis
            .showXAxis(true);        //Show the x-axis
        chart.legend.updateState(false);
        chart.xAxis
            .tickFormat(function (d) {
                return d3.time.format('%d %b')(new Date(d))
            })
            .staggerLabels(true);
        chart.yAxis.tickPadding(10);
        chart.xScale(d3.time.scale());
        chart.yAxis.tickFormat(d3.format("d")).tickSubdivide(0).ticks(6);

        var yValueToPercentage = 1;
        if (normalised === "true") {
            chart.forceY([0, 100]);
        }
        var values = {
            "topic0": [],
            "sentiment0_pos": [],
            "sentiment0_nrl": [],
            "sentiment0_neg": [],
            "topic1": [],
            "sentiment1_pos": [],
            "sentiment1_nrl": [],
            "sentiment1_neg": [],
            "topic2": [],
            "sentiment2_pos": [],
            "sentiment2_nrl": [],
            "sentiment2_neg": [],
            "topic3": [],
            "sentiment3_pos": [],
            "sentiment3_nrl": [],
            "sentiment3_neg": [],
            "topic4": [],
            "sentiment4_pos": [],
            "sentiment4_nrl": [],
            "sentiment4_neg": []
        };
        var user_topics = [];
        $('#user_topics').find("li").each(function () {
            user_topics.push($(this).find('.legendtext').text());
        });
        var metrics = [];
        $('.main_choice').each(function () {
            var metric = $(this).attr('data-name');
            metrics.push(metric);
            if (((metric.indexOf('pos_') !== -1) || (metric.indexOf('neg_') !== -1) || (metric.indexOf('nrl_') !== -1)) && (!sentiment_selection)) {
                sentiment_selection = true;
                if (normalised === "true") {
                    chart.yAxis.tickFormat(d3.format(".1%")).tickSubdivide(0).ticks(6);
                    chart.forceY([0, 1]);
                    yValueToPercentage = 100;
                }
            }
        });

        var y_value = 0;
        d3.tsv(json, function (error, data) {
            var position = -1, pos_summary, neg_summary, nrl_summary, newDate;
            data.forEach(function (d) {
                position = jQuery.inArray(d.topic, user_topics);
                if (position !== -1) {
                    newDate = d.date.substring(4, 6) + "/" + d.date.substring(6, 8) + "/2017";

                    if ((d.pos_summary !== "<NONSENSESUMMARYTAG></NONSENSESUMMARYTAG>") && (d.pos_summary !== "0") && (d.pos_summary !== "")) {
                        values['sentiment' + position + '_pos'].push(true);
                        pos_summary = d.pos_summary.match(/<NONSENSESUMMARYTAG>(.*?)<\/NONSENSESUMMARYTAG>/g).map(function (val) {
                            return val.replace(/<\/?NONSENSESUMMARYTAG>/g, '');
                        });
                    }
                    else {
                        values['sentiment' + position + '_pos'].push(false);
                        pos_summary = [];
                    }

                    if ((d.neg_summary !== "<NONSENSESUMMARYTAG></NONSENSESUMMARYTAG>") && (d.pos_summary !== "0") && (d.pos_summary !== "")) {
                        values['sentiment' + position + '_neg'].push(true);
                        neg_summary = d.neg_summary.match(/<NONSENSESUMMARYTAG>(.*?)<\/NONSENSESUMMARYTAG>/g).map(function (val) {
                            return val.replace(/<\/?NONSENSESUMMARYTAG>/g, '');
                        });
                    }
                    else {
                        values['sentiment' + position + '_neg'].push(false);
                        neg_summary = [];
                    }

                    if ((d.nrl_summary !== "<NONSENSESUMMARYTAG></NONSENSESUMMARYTAG>") && (d.pos_summary !== "0") && (d.pos_summary !== "")) {
                        values['sentiment' + position + '_nrl'].push(true);
                        nrl_summary = d.nrl_summary.match(/<NONSENSESUMMARYTAG>(.*?)<\/NONSENSESUMMARYTAG>/g).map(function (val) {
                            return val.replace(/<\/?NONSENSESUMMARYTAG>/g, '');
                        });
                    }
                    else {
                        values['sentiment' + position + '_nrl'].push(false);
                        nrl_summary = [];
                    }
                    var metric = metrics[user_topics.indexOf(d.topic)];

                    if (sentiment_selection) {
                        y_value = parseFloat(d[metric]) / yValueToPercentage
                    }
                    else {
                        y_value = parseInt(d[metric]) / yValueToPercentage
                    }
                    values['topic' + position].push({
                        x: new Date(new Date(newDate).getTime()),
                        y: y_value,
                        pos_summary: pos_summary,
                        neg_summary: neg_summary,
                        nrl_summary: nrl_summary
                    });
                }
            });
            var result = [];
            for (var i = 0; i < 5; i++) {
                if (values['topic' + i].length > 0) {
                    result.push({
                        values: values['topic' + i],
                        key: user_topics[i],
                        color: colors[i],
                        strokeWidth: 3.5
                    })
                }
                else {
                    i = 5;//end loop
                }
            }
            d3.select('#chart1 svg')
                .datum(result)
                .call(chart);

            nv.utils.windowResize(function () {
                create_circles();
                chart.update();
                $('.icon-x').click();
            });

            chart.lines.dispatch.on('elementClick', function (e) {
                var $navigation = $('.navigation');
                $('#slides ul').empty().removeAttr('style');
                $navigation.eq(0).addClass('low_opacity');
                $navigation.eq(1).removeClass('low_opacity');
                var $tweet = $('#tweet');
                if ($('.nv-series-' + e.seriesIndex).find('.nv-point-' + e.pointIndex).attr('data-has_sentiment')) {
                    if (e.pos.top + $tweet.height() > $('#chart1').height()) {
                        e.pos.top = e.pos.top - $tweet.height() - 10;
                    }
                    if (e.pos.left + 410 > $('#chart1').width()) {
                        e.pos.left = e.pos.left - 430;
                    }
                    var date = e.point.x.toString().split(' ');
                    $('#tweet_topic').find('.legendcolor').css('background-color', colors[e.seriesIndex]);
                    $('#topic_title').text($('#user_topics ul li').eq(e.seriesIndex).find('.legendtext').text());
                    $tweet.show();
                    $tweet.animate({top: e.pos.top}, {duration: 800, queue: false});
                    $tweet.animate({left: e.pos.left + 10}, {duration: 800, queue: false});
                    var $tweet_count = $('#tweet_count');
                    var num = -1;
                    switch (true) {
                        case /pos_/.test(metrics[e.point.series]):
                            $tweet_count.text('1/' + e.point.pos_summary.length);
                            for (var i = 0; i < e.point.pos_summary.length; i++) {
                                $('#slides ul').append('<li class="slide"> <div class="quoteContainer"> <p class="quote-phrase"><span class="quote-marks">"</span>' + e.point.pos_summary[i] + '<span class="quote-marks">"</span> </p> </div> <div class="authorContainer"> <p class="quote-author">' + date[2] + ' ' + date[1] + ' ' + date[3] + '</p> </div> </li>');
                            }
                            if (e.point.pos_summary.length === 1) {
                                $navigation.addClass('low_opacity');
                                num = 0;
                            }
                            if (e.point.pos_summary.length === 2) {
                                $('#slides ul').append('<li class="slide"> <div class="quoteContainer"> <p class="quote-phrase"><span class="quote-marks">"</span>dummy<span class="quote-marks">"</span> </p> </div> <div class="authorContainer"> <p class="quote-author">dummy</p> </div> </li>');
                            }
                            break;
                        case /nrl_/.test(metrics[e.point.series]):
                            $tweet_count.text('1/' + e.point.nrl_summary.length);
                            for (var i = 0; i < e.point.nrl_summary.length; i++) {
                                $('#slides ul').append('<li class="slide"> <div class="quoteContainer"> <p class="quote-phrase"><span class="quote-marks">"</span>' + e.point.nrl_summary[i] + '<span class="quote-marks">"</span> </p> </div> <div class="authorContainer"> <p class="quote-author">' + date[2] + ' ' + date[1] + ' ' + date[3] + '</p> </div> </li>');
                            }
                            if (e.point.nrl_summary.length === 1) {
                                $navigation.addClass('low_opacity');
                                num = 0;
                            }
                            if (e.point.nrl_summary.length === 2) {
                                $('#slides ul').append('<li class="slide"> <div class="quoteContainer"> <p class="quote-phrase"><span class="quote-marks">"</span>dummy<span class="quote-marks">"</span> </p> </div> <div class="authorContainer"> <p class="quote-author">dummy</p> </div> </li>');
                            }
                            break;
                        case /neg_/.test(metrics[e.point.series]):
                            $tweet_count.text('1/' + e.point.neg_summary.length);
                            for (var i = 0; i < e.point.neg_summary.length; i++) {
                                $('#slides ul').append('<li class="slide"> <div class="quoteContainer"> <p class="quote-phrase"><span class="quote-marks">"</span>' + e.point.neg_summary[i] + '<span class="quote-marks">"</span> </p> </div> <div class="authorContainer"> <p class="quote-author">' + date[2] + ' ' + date[1] + ' ' + date[3] + '</p> </div> </li>');
                            }
                            if (e.point.neg_summary.length === 1) {
                                $navigation.addClass('low_opacity');
                                num = 0;
                            }
                            if (e.point.neg_summary.length === 2) {
                                $('#slides ul').append('<li class="slide"> <div class="quoteContainer"> <p class="quote-phrase"><span class="quote-marks">"</span>dummy<span class="quote-marks">"</span> </p> </div> <div class="authorContainer"> <p class="quote-author">dummy</p> </div> </li>');
                            }
                            break;
                    }

                    var slides = $('.slide');
                    var container = $('#slides ul');
                    container.width(slides.length * 398);
                    container.find('li:first').before(container.find('li:last'));
                    resetSlides(num);
                }
                else {
                    $('.icon-x').click();
                }
            });
            $('.icon-x').click();
            $('*[data-has_sentiment="true"]').removeAttr('data-has_sentiment');
            create_circles();
            function create_circles() {
                setTimeout(function () {
                    for (var i = 0; i < 5; i++) {
                        if (values['topic' + i].length > 0) {
                            switch (true) {
                                case /pos_/.test(metrics[i]):
                                    for (var j = 0; j < values['sentiment' + i + '_pos'].length; j++) {
                                        if (values['sentiment' + i + '_pos'][j]) {
                                            $('.nv-series-' + i).find('.nv-point-' + j).attr('data-has_sentiment', 'true');
                                            $('#nv-path-' + (i * values['sentiment' + i + '_pos'].length + j)).attr('style', 'cursor:pointer');
                                        }
                                    }
                                    break;
                                case /nrl_/.test(metrics[i]):
                                    for (var j = 0; j < values['sentiment' + i + '_nrl'].length; j++) {
                                        if (values['sentiment' + i + '_nrl'][j]) {
                                            $('.nv-series-' + i).find('.nv-point-' + j).attr('data-has_sentiment', 'true');
                                            $('#nv-path-' + (i * values['sentiment' + i + '_nrl'].length + j)).attr('style', 'cursor:pointer');
                                        }
                                    }
                                    break;
                                case /neg_/.test(metrics[i]):
                                    for (var j = 0; j < values['sentiment' + i + '_neg'].length; j++) {
                                        if (values['sentiment' + i + '_neg'][j]) {
                                            $('.nv-series-' + i).find('.nv-point-' + j).attr('data-has_sentiment', 'true');
                                            $('#nv-path-' + (i * values['sentiment' + i + '_neg'].length + j)).attr('style', 'cursor:pointer');
                                        }
                                    }
                                    break;
                            }
                        }
                        else {
                            i = 5;//end loop
                        }
                    }
                }, 800);
            }

            return chart;
        });
    });
}
$('.icon-x').click(function () {
    $("#tweet").hide(800);
});
$('.navigation').click(function (e) {
    var container = $('#slides ul');
    var $tweet_count = $('#tweet_count');
    var count;
    var $navigation = $('.navigation');
    var num = -1;
    if (container.is(':animated')) {
        return false;
    }
    if (e.target.id == 'prev') {
        $navigation.eq(1).removeClass('low_opacity');
        count = $tweet_count.text().split('/');
        $tweet_count.text((parseInt(count[0]) - 1) + '/' + count[1]);
        if ((parseInt(count[0])) === 2) {
            $navigation.eq(0).addClass('low_opacity');
        }
        container.stop().animate({
            'left': 0
        }, 1500, function () {
            container.find('li:first').before(container.find('li:last'));
            //if(parseInt(count[1]===1)){num=0;}
            resetSlides(num);
        });
    }

    if (e.target.id == 'next') {
        count = $tweet_count.text().split('/');
        $tweet_count.text((parseInt(count[0]) + 1) + '/' + count[1]);
        if ((parseInt(count[0]) + 1) === parseInt(count[1])) {
            $navigation.eq(1).addClass('low_opacity');
        }
        $navigation.eq(0).removeClass('low_opacity');
        container.stop().animate({
            'left': 398 * -2
        }, 1500, function () {
            container.find('li:last').after(container.find('li:first'));
            //if(parseInt(count[1]===1)){num=0;}
            resetSlides(num);
        });
    }
    return false;
});
function resetSlides(num) {
    $('#slides ul').css({
        'left': num * 398
    });
}
function gup(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null) return "";
    else return results[1];
}


var sort_by;
// utility functions
var default_cmp = function (a, b) {
        return (a > b) ? 1 : ((a < b) ? -1 : 0);
    },
    getCmpFunc = function (primer, reverse) {
        var cmp = default_cmp;
        if (primer) {
            cmp = function (a, b) {
                return default_cmp(primer(a), primer(b));
            };
        }
        if (reverse) {
            return function (a, b) {
                return -1 * cmp(a, b);
            };
        }
        return cmp;
    };

// actual implementation
sort_by = function () {
    var fields = [],
        n_fields = arguments.length,
        field, name, reverse, cmp;

    // preprocess sorting options
    for (var i = 0; i < n_fields; i++) {
        field = arguments[i];
        if (typeof field === 'string') {
            name = field;
            cmp = default_cmp;
        }
        else {
            name = field.name;
            cmp = getCmpFunc(field.primer, field.reverse);
        }
        fields.push({
            name: name,
            cmp: cmp
        });
    }

    return function (A, B) {
        var a, b, name, cmp, result;
        for (var i = 0, l = n_fields; i < l; i++) {
            result = 0;
            field = fields[i];
            name = field.name;
            cmp = field.cmp;
            if (name === "data") {
                result = cmp(A.data.category, B.data.category);
            }
            else {
                result = cmp(A.data.popularity, B.data.popularity);
            }

            if (result !== 0) break;
        }
        return result;
    }
};
