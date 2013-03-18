function setClassifiers(classifierManager) {
    classifierManager.SetClassifier("longitude", new ApproximateClassifier(5));
    classifierManager.SetClassifier("latitude", new ApproximateClassifier(5));
    classifierManager.SetClassifier("shiftdatetime", new DayClassifier());
    classifierManager.SetClassifier("datemadeutc", new DayClassifier());
    classifierManager.SetClassifier("DateTime", new DayClassifier());
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
            }).slice(0,500);
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

function GroupByDay(reservations){
    groups = {}
    var classifier = new DayClassifier();
    for (var reservationId in reservations) {
        var reservation = reservations[reservationId];
        var key = classifier.GetKey(reservation.DateTime);
        if (!groups.hasOwnProperty(key)) {
            groups[key] = 0;
        }
        groups[key]++;
    }
    return groups;
 }

function BuildGroupByDaySettings(dataManager) {
    var html = "";
    var groups = GroupByDay(dataManager.GetAllData());
    for (var groupId in groups) {
        var group = groups[groupId];
        html += "<button class='btn btn-block group-datetime' data-group-id='" + groupId + "'>" + groupId + "(" + group + ")</button>";
    }
    $('#groupByDay').append(html);
}

$(document).ready(function(){
    var dataSource = new DataSource();
    dataSource.GetData(0,10000,function(data) {
        var classifierManager = new ClassifiersManager(new EqualClassifier());
        setClassifiers(classifierManager);
        var dataManager = new DataManager(classifierManager).AddData(data);
        dataManager.AddFilter("DateTime","16");
        dataManager.AddFilter("DateTime","17");
        var sigmaAdapter = new SigmaAdapter(classifierManager, dataManager).Init(data, "#graph");
        new SettingsView().PopulateSettings(data).AddListeners(sigmaAdapter);
        var forceRunner = new ForceAtlasRunner(sigmaAdapter, "#start_stop").Run();
        new PopUpManager(sigmaAdapter, '#graph').AddPopUp();
        BuildGroupByDaySettings(dataManager);
        $('.group-datetime').click(function(){
             forceRunner.Stop();
//            var groupId = $(this).attr("data-group-id");
//            dataManager.AddFilter("DateTime",groupId);
            sigmaAdapter.UpdateNodes();
        });
    });
})

