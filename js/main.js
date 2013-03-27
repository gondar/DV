function setClassifiers(classifierManager) {
    classifierManager.SetClassifier("longitude", new ApproximateClassifier(5));
    classifierManager.SetClassifier("latitude", new ApproximateClassifier(5));
    classifierManager.SetClassifier("shiftdatetime", new DayClassifier());
    classifierManager.SetClassifier("datemadeutc", new MinuteClassifier());
//    classifierManager.SetClassifier("DateTime", new DayClassifier());
}

function Animate(sigmaAdapter){
    var speed = 5000;
    $("#partysizeEdgeSettings").trigger("click");
    setTimeout(function(){
        $("#partysizeEdgeSettings").trigger("click");
        $("#partnernameEdgeSettings").trigger("click");
            setTimeout(function(){
                $("#partnernameEdgeSettings").trigger("click");
                Animate(sigmaAdapter);
            },speed);
    },speed)
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
        var settingsView = new SettingsView(forceRunner, dataManager, sigmaAdapter,classifierManager).PopulateSettings(data).AddListeners(sigmaAdapter);
        GetMoreData(dataSource, dataManager, function(){
            settingsView.UpdateState();
            Animate(sigmaAdapter);
        });
    });
})

