function InitEdgeSettings(graph) {
    var edges = {};
    $(".edge-setting").click(function () {
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
}

function InitColorSettings(graph) {
    var property = "partnerid";
    $(".color-setting").click(function () {
        property = $(this).attr("data-property");
        $(this).parent().parent().parent().children("a").html(property+" <span class='caret'></span>");
        graph.BindPropertToColor(property);
    });
    graph.BindPropertToColor(property);
}

function AddEdgesSelection(data) {
    var reservation = data.reservations[0];
    for (var k in reservation) {
        if (reservation.hasOwnProperty(k)) {
            var data = k;
            var name = k;
            var html = "<button class=\"btn btn-large edge-setting\" type=\"button\" data-property=\"" + data + "\">" + name + "</button>";
            $(".edge-settings").append(html);
        }
    }
}

function AddBindToColor(data) {
    var reservation = data.reservations[0];
    for (var k in reservation) {
        if (reservation.hasOwnProperty(k)) {
            var data = k;
            var name = k;
            //var html = "<button class=\"btn btn-large edge-setting\" type=\"button\" data-property=\"" + data + "\">" + name + "</button>";
            var html = "<li><a href='#' class='color-setting' data-property='"+data+"' tabindex='-1'>"+name+"</a></li>";
            $(".color-settings").append(html);
        }
    }
}
$(document).ready(function(){
    var data = new DataSource().GetData();
    var graph = new SigmaAdapter().Init();
    AddEdgesSelection(data);
    InitEdgeSettings(graph);
    AddBindToColor(data);
    InitColorSettings(graph);
})

function increase_brightness(hex, percent){
    // strip the leading # if it's there
    hex = hex.replace(/^\s*#|\s*$/g, '');

    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if(hex.length == 3){
        hex = hex.replace(/(.)/g, '$1$1');
    }

    var r = parseInt(hex.substr(0, 2), 16),
        g = parseInt(hex.substr(2, 2), 16),
        b = parseInt(hex.substr(4, 2), 16);

    return '#' +
        ((0|(1<<8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
        ((0|(1<<8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
        ((0|(1<<8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
}


