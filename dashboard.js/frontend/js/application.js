var dashboard = {
    name: "",
    
    init: function(name) {
        dashboard.name = name;
        
        now.init(name, function(data) {
            alert(data);
        });
    }
};

$(document).ready(function() {
    // Load dashboard if one is selected
    if (window.location.hash) {
        dashboard.init(window.location.hash.replace("#", ""));
    }
    
    // Create a new dashboard
    $("#create").submit(function() {
        var hash = $("#create input[name='url']")
            .val()
            .replace(/[^a-zA-Z \-_0-9]+/g, "");
        window.location.href = window.location.origin + 
            window.origin.pathname + "#" + hash;
    });
});