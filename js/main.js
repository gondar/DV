function setClassifiers(classifierManager) {
    classifierManager.SetClassifier("longitude", new ApproximateClassifier(5));
    classifierManager.SetClassifier("latitude", new ApproximateClassifier(5));
    classifierManager.SetClassifier("shiftdatetime", new DayClassifier());
    classifierManager.SetClassifier("datemadeutc", new MinuteClassifier());
//    classifierManager.SetClassifier("DateTime", new DayClassifier());
}

function DataManager(classifierManager){
    var nodes = [];
    var filters = {};
    return {
        AddData: function(data){
            var reservations = data.reservations;
            for (var reservationId in reservations) {
                var reservation = reservations[reservationId];
                nodes.push(reservation);
            }
            return this;
        },
        GetData: function(data) {
            return nodes.filter(function(node){
                for (var property in filters) {
                    var key = classifierManager.GetClassifier(property).GetKey(node[property]);
                    if ($.inArray(key.toString(), filters[property]) == -1) {
                        return false;
                    }
                }
                return true;
            }).slice(0,100);
        },
        GetAllData: function(data) {
            return nodes;
        },
        AddFilter: function(property, value){
            if (!filters.hasOwnProperty(property)){
                filters[property] = [];
            }
            filters[property].push(value);
        }
    }
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
    return groups;
 }

function BuildGroupByDaySettings(dataManager, classifierManager) {
    var html = "";
    $('#groupByDay').html("");
    var groups = Group("datemadeutc", dataManager.GetAllData(),classifierManager);
    for (var groupId in groups) {
        var group = groups[groupId];
        html += "<button class='btn btn-block group-datetime' data-group-id='" + groupId + "'>" + groupId + "(" + group + ")</button>";
    }
    $('#groupByDay').append(html);
}

function AddListenerToFilters(forceRunner, dataManager, sigmaAdapter) {
    $('.group-datetime').click(function () {
        forceRunner.Stop();
        var groupId = $(this).attr("data-group-id");
        dataManager.AddFilter("datemadeutc", groupId);
        sigmaAdapter.UpdateNodes();
        setTimeout(function () {
            forceRunner.Run()
        }, 1000);
    });
}

var count = 0
function GetMoreData(dataSource, dataManager, actionToExecute) {
    dataSource.GetMoreData(function (data) {
        dataManager.AddData(data);
        if (count++ <4) {
            GetMoreData(dataSource, dataManager, actionToExecute);
        } else {
            actionToExecute();
        }

    });
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
            BuildGroupByDaySettings(dataManager,classifierManager);
            AddListenerToFilters(forceRunner, dataManager, sigmaAdapter);
            sigmaAdapter.UpdateNodes();
        });
    });
})

