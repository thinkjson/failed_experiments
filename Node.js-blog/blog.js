var mount_point = "/";
var yaml = require('yaml');
var md = require("node-markdown").Markdown;
var fs = require("fs");
var pages = [];

/**
 * Load front page
 */
function get_index(app) {
	// Get latest article and show excerpt
    app.get("/", function(req, res) {
        // Cache for a day
        res.header('Expires', new Date(
                (new Date()).getTime() + 1000*60*60*24));
        
        // Return home page
    	res.render("index", {
    		locals: {
    			title: "thinkjson.com"
    		}
    	});
    });
}

/**
 * Search pages and posts
 */
function search_pages(app) {
    var search_function = function(req, res) {
        var search = req.query.search || req.params.search;
        if (! search) {
            res.redirect("/");
            return;
        }
        
        var search_regex = new RegExp(search, "i");
        var search_results = pages.filter(function(e, i, arr) {
            return e.content.search(search_regex) !== -1;
        });
        
        // Cache for a day
        res.header('Expires', new Date(
                (new Date()).getTime() + 1000*60*60*24));
        
        // Render search results
        res.render("search", {
            locals: {
                title: "Search results for `" + search + "`",
                search_results: search_results,
                mount_point: mount_point
            }
        });
    };
    
    app.get("/search", search_function);
    app.get("/tag/:search", search_function);
}

/**
 * RSS feed for latest posts
 */
function rss_feed(app) {
    app.get("/feed", function(req, res) {
        res.header('Content-type', 'application/rss+xml');
        res.render("feed", {
            layout: false,
            locals: {
                title: "RSS Feed"
            }
        });
    });
}

/**
 * Attach endpoints for each page
 */
function get_content(page, app) {
    if (! page.uri) {
        return;
    }
    
	app.get(mount_point + page.uri, function(req, res) {
	    // Cache for a week
	    res.header('Expires', new Date(
	            (new Date()).getTime() + 1000*60*60*24*7));
	    
	    // Return page
        res.render(page.layout, {
            locals: {
                title: page.title,
                posted: (new Date(page.posted)).toLocaleDateString(),
                uri: page.uri,
                content: page.content
            }
        });
	});
}

/**
 * Read and parse file contents
 */
function parse_file(file) {
    var page = {};
    
    // Separate config from page
    var separator = file.indexOf("}") + 1;
    if (separator !== -1) {
        try {
            page = JSON.parse(file.substr(0, separator));
        } catch (e) {
            page = {};
        }
        page.content = md(
            file.substr(separator, file.length - (separator + 4))
        );
        page.excerpt = page.content.indexOf("<!--more-->") == -1 
            ? page.content 
            : page.content.substr(0, page.content.indexOf("<!--more-->"));
    }
    
    return page;
}

/**
 * Load pages into app
 */
exports.init = function(app) {
    // Set up templates
    app.set('view engine', 'ejs');
    
    // Attach endpoints for pages/posts
    fs.readdir(__dirname + "/posts", function(err, files) {
        if (! err) {
            // Loop over files in the /posts directory
            for (file_iterator in files) {
                var file = 
                    fs.readFileSync(__dirname + "/posts/" + files[file_iterator], "utf8");
                var page = parse_file(file);
                pages.push(page);
                get_content(page, app);
            }
            
            // Generate latest posts list
            var latest_posts = pages
            .sort(function(a, b) {
                var a_time = (new Date(a.posted)).getTime();
                var b_time = (new Date(b.posted)).getTime();
                if (isNaN(a_time)) a_time = 0;
                if (isNaN(b_time)) b_time = 0;
                return b_time - a_time;
            })
            .filter(function(e, i, arr) {
                return e.posted !== undefined;
            })
            .splice(0, 6);
            
            app.helpers({
                latest_posts: latest_posts
            });
            
            // Handle 404 errors
            app.get("*", function(req, res) {
                res.render("error", {
                    locals: {
                        title: "Not Found",
                        status: 404
                    }
                });
            });
        }
    });
    
    // Attach endpoint for index
    get_index(app);
    
    // Attach endpoint for feed
    rss_feed(app);
    
    // Set up endpoint for search
    search_pages(app);
};