function SettingsView(){
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
        graph.BindPropertToColor(property);
        $(".color-setting").click(function () {
            property = $(this).attr("data-property");
            $(this).parent().parent().parent().children("a").html(property+" <span class='caret'></span>");
            graph.BindPropertToColor(property);
        });
    }

    function AddEdgesSelection(reservation) {
        var template = Handlebars.compile($("#edge-setting-template").html());
        for (var k in reservation) {
            $(".edge-settings").append(template({data: k, name: k}));
        }
    }

    function AddBindToColor(reservation) {
        var template = Handlebars.compile($("#color-setting-template").html());
        for (var k in reservation) {
            $(".color-settings").append(template({data:k, name:k}));
        }
    }

    return {
        PopulateSettings: function(data){
            var reservation = data.reservations[0];
            AddEdgesSelection(reservation);
            AddBindToColor(reservation);
            return this;
        },
        AddListeners: function(graph){
            InitEdgeSettings(graph);
            InitColorSettings(graph);
            return this;
        }
    }
}