var http = require('http');
var twitter_name = "thinkjson";
var app;

function get_stream() {
    http.get({
        host: "api.twitter.com",
        port: 80,
        path: "/1/statuses/user_timeline.json?screen_name=" + twitter_name
    }, function(res) {
        var data = "";
        
        res.on('data', function(chunk) {
            data += chunk;
        });
        
        res.on('end', function() {
            try {
                var tweets = JSON.parse(data);
            } catch(e) { 
                var tweets = {};
            }
            
            var selected_tweets = [];
            
            for (tweet in tweets) {
                if (tweets[tweet].text !== undefined
                    && tweets[tweet].text.substr(0,1) !== "@")
                    selected_tweets.push(tweets[tweet]);
            };
            
            app.helpers({
                twitter: selected_tweets.slice(0, 3),
                twitter_name: twitter_name
            });
        });
    });
}

exports.init = function(g_app) {
    app = g_app;
    setInterval(get_stream, 1000 * 60 * 5); // Reload twitter stream every five minutes
    
    app.helpers({
        twitter: []
    });
    
    get_stream();
};