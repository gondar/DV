function SettingsView(forceRunner, dataManager, sigmaAdapter, classifierManager, animator, fullscreen, graphState){
    var edges = {};

    function InitEdgeSettings(graph) {
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

    function CleanEdges(graph){
        $(".edge-setting").each(function () {
                $(this).removeClass("btn-primary");
        });
        edges = {};
        graph.AddEdges({});
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

    function AddMaxNodes() {
        var html = "";
        $('#groupByDay').html("");
        html+= "<div class='input-append'><input class='span2' id='nodesCountTextBox' type='text' value='300'><span class='add-on'>nodes</span></div>"
        $('#groupByDay').append(html);
    }

    function AddListenerToMaxNodesCount(){
        function SortByName(a, b){
            var aName = a.Name.toLowerCase();
            var bName = b.Name.toLowerCase();
            return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
        }

        function Group(property, reservations, classifierManager){
            groups = {}
            for (var reservationId in reservations) {
                var reservation = reservations[reservationId];
                var classifier = classifierManager.GetClassifier(property);
                var key = classifier.GetKey(reservation[property]);
                if (!groups.hasOwnProperty(key)) {
                    groups[key] = 0;
                }
                groups[key]++;
            }
            groupsArray = [];
            for (var key in groups) {
                groupsArray.push({Name: key, Count: groups[key]})
            }

            return groupsArray.sort(SortByName).reverse();
        }

        $("#nodesCountTextBox").change(function(){
            var max = parseInt($(this).val());
            var groups = Group("datemadeutc",dataManager.GetAllData(),classifierManager);
            var i =0;
            var added = 0;
            dataManager.RemoveFilters();
            while(groups[i] != undefined && added+groups[i].Count < max) {
                added += groups[i].Count;
                dataManager.AddFilter("datemadeutc",groups[i].Name);
                i++;
            }
            $("#displayedTimes").html("<div>Added "+added+" nodes which show reservations in the last "+(i)+ " minutes</div>");
            graphState.SetTimeSpan(i);
            dataManager.SetMaxNodesAllowed(max);
            sigmaAdapter.UpdateNodes(forceRunner);
        });

        $("#nodesCountTextBox").trigger("change");
    }

    function AddAnimationStartStopListener(graph){
        var state = 0;
        $("#startStopAnimation").click(function () {
            if (state == 0) {
                state = 1;
                CleanEdges(graph)
                $(this).removeClass("btn-success");
                $(this).addClass("btn-warning");
                $(this).attr("value", "Stop Animation");
                animator.Start();
            } else {
                state = 0;
                $(this).removeClass("btn-warning");
                $(this).addClass("btn-success");
                $(this).attr("value", "Start Animation");
                animator.Stop();
            }
        });
    }

    function AddFullScreenListener(){
        var state = 0;
        $("#fullScreen").click(function () {
            if (state == 0) {
                state = 1;
                $(this).attr("value", "Window mode");
                fullscreen.On();
            } else {
                state = 0;
                $(this).attr("value", "Fullscreen");
                fullscreen.Off();
            }
        });
    }

    return {
        PopulateSettings: function(data){
            var reservation = data.reservations[0];
            AddEdgesSelection(reservation);
            AddBindToColor(reservation);
            AddMaxNodes();
            return this;
        },
        AddListeners: function(graph){
            InitEdgeSettings(graph);
            InitColorSettings(graph);
            AddListenerToMaxNodesCount();
            AddAnimationStartStopListener(graph);
            AddFullScreenListener();
            return this;
        },
        UpdateState: function(){
            $("#nodesCountTextBox").trigger("change");
        }
    }
}