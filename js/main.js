function setClassifiers(classifierManager) {
    classifierManager.SetClassifier("longitude", new ApproximateClassifier(5));
    classifierManager.SetClassifier("latitude", new ApproximateClassifier(5));
    classifierManager.SetClassifier("shiftdatetime", new DayClassifier());
    classifierManager.SetClassifier("datemadeutc", new DayClassifier());
    classifierManager.SetClassifier("DateTime", new DayClassifier());
}

function DataManager(){
    var nodes = [];
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
            return nodes.slice(0,500);
        },
        AddFilter: function(filter){

        }
    }
}

$(document).ready(function(){
    var dataSource = new DataSource();
    dataSource.GetData(0,15000,function(data) {
        var classifierManager = new ClassifiersManager(new EqualClassifier());
        setClassifiers(classifierManager);
        var dataManager = new DataManager().AddData(data);
        var sigmaAdapter = new SigmaAdapter(classifierManager, dataManager).Init(data, "#graph");
        new SettingsView().PopulateSettings(data).AddListeners(sigmaAdapter);
        new ForceAtlasRunner(sigmaAdapter, "#start_stop").Run();
        new PopUpManager(sigmaAdapter, '#graph').AddPopUp();
    });
})

