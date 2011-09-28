/*globals $ window document */
var tiemonster = {
    // define your oft-used settings below
    settings: {

    },
    
    path_specs: [
        { path: "open-source", init: "fetch_github_projects" },
        { path: "contact", init: "select_name" }
    ],

    fetch_github_projects: function () {
        $(document).ready(function () {
            $projects = $("#projects");
            $projects.html("Initializing...");
            $.getScript("/js/gh.js", function() {
                $projects.html("Scanning github projects...");
                gh.user("thinkjson").repos(function(data) {
                    $projects.html("");
                    $.each(data.repositories, function (project_iterator, project) {
                        $("<a />").text(project.name)
                            .attr({ href: project.url })
                            .appendTo($projects);
                        $("<span>").html(" " + project.description + "<br />").appendTo($projects);
                    });
                });
            });
        });
    },
    
    select_name: function() {
        $('input[name="name"]').focus();
    },
    
    init: function() {
        for (var i in tiemonster.path_specs) {
            if (window.location.pathname.toLowerCase()
                    .indexOf(tiemonster.path_specs[i].path) !== -1) {
                tiemonster[tiemonster.path_specs[i].init]();
            }
        }
    }
};

tiemonster.init();

$(document).ready(function() {
        document.getElementById("search").focus();
});