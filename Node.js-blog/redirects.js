function redirect_uri(app, old_uri, new_uri) {
    app.get(old_uri, function(req, res) {
        res.redirect(new_uri, 301);
    });
}

exports.load = function(app) {
    var translation_table = [
        { old_uri: "/148", new_uri: "/limiting-choices-ManyToManyField" },
        { old_uri: "/a/278001/", new_uri: "/scalable-web-services" },
        { old_uri: "/a/180002/", new_uri: "/upgrading-django-1.2.1" },
        { old_uri: "/a/151002/", new_uri: "/group-permission-in-django" },
        { old_uri: "/a/153001/", new_uri: "/collatz-conjecture" },
        { old_uri: "/a/189001/", new_uri: "/limiting-choices-ManyToManyField" },
        { old_uri: "/a/125002/", new_uri: "/copy-ubuntu-setup" },
        { old_uri: "/58", new_uri: "/copy-ubuntu-setup" },        
        { old_uri: "/a/134001/", new_uri: "/insource-or-outsource" },
        { old_uri: "/a/174001/", new_uri: "/disk-space" },
        { old_uri: "/116", new_uri: "/group-permission-in-django" },
        { old_uri: "/a/158001", new_uri: "http://www.vimeo.com/7421152" }
    ];
    
    // Permanently redirect old uris to new ones
    for (var i = 0; i < translation_table.length; i++) {
        var old_uri = translation_table[i].old_uri;
        var new_uri = translation_table[i].new_uri;
        redirect_uri(app, old_uri, new_uri);
    }
};