function setClassifiers(classifierManager) {
    classifierManager.SetClassifier("longitude", new ApproximateClassifier(5));
    classifierManager.SetClassifier("latitude", new ApproximateClassifier(5));
    classifierManager.SetClassifier("shiftdatetime", new DayClassifier());
    classifierManager.SetClassifier("datemadeutc", new MinuteClassifier());
//    classifierManager.SetClassifier("DateTime", new DayClassifier());
}

function BuildGroupByDaySettings(dataManager) {
    var html = "";
    $('#groupByDay').html("");
    html+= "<div class='input-append'><input class='span2' id='nodesCountTextBox' type='text' value='40'><span class='add-on'>nodes</span></div>"
    $('#groupByDay').append(html);
}


function AddListenerToMaxNodesCount(forceRunner, dataManager, sigmaAdapter, classifierManager){
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
        var max = $(this).val();
        forceRunner.Stop();
        var groups = Group("datemadeutc",dataManager.GetAllData(),classifierManager);
        var i =0;
        var added = 0;
        while(groups[i] != undefined && added+groups[i].Count < max) {
            added += groups[i].Count;
            dataManager.AddFilter("datemadeutc",groups[i].Name);
            i++;
        }
        $("#displayedTimes").html("<div>Added "+added+" nodes which show reservations in the last "+(i)+ " minutes</div>");
        dataManager.SetMaxNodesAllowed(max);
        sigmaAdapter.UpdateNodes();
        setTimeout(function () {
            forceRunner.Run()
        }, 1000);
    });

    $("#nodesCountTextBox").trigger("change");
}

$(document).ready(function(){
    var dataSource = new DataSource();
    dataSource.GetData(function(data) {
        var classifierManager = new ClassifiersManager(new EqualClassifier());
        setClassifiers(classifierManager);
        var dataManager = new DataManager(classifierManager).AddData(data);
        var sigmaAdapter = new SigmaAdapter(classifierManager, dataManager).Init(data, "#graph");
        new PopUpManager(sigmaAdapter, '#graph').AddPopUp();
        var forceRunner = new ForceAtlasRunner(sigmaAdapter, "#start_stop").Run();
        new SettingsView().PopulateSettings(data).AddListeners(sigmaAdapter);
        GetMoreData(dataSource, dataManager, function(){
            BuildGroupByDaySettings(dataManager);
            AddListenerToMaxNodesCount(forceRunner, dataManager, sigmaAdapter,classifierManager);
            sigmaAdapter.UpdateNodes();
        });
    });
})

