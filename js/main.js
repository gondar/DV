$(document).ready(function(){
    var graph = new SigmaAdapter().Init();
    var edges = {};
    $(".edge-setting").click(function(){
        var prop = $(this).attr("data-property");
        if (!edges.hasOwnProperty(prop) || edges[prop] == 0) {
            $(this).addClass("btn-primary");
            edges[prop] = 1;
        } else {
            edges[prop] = 0;
            $(this).removeClass("btn-primary");
        }
        graph.AddEdges(edges);
    });
})