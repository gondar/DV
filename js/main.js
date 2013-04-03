function setClassifiers(classifierManager) {
    classifierManager.SetClassifier("longitude", new ApproximateClassifier(5));
    classifierManager.SetClassifier("latitude", new ApproximateClassifier(5));
    classifierManager.SetClassifier("shiftdatetime", new DayClassifier());
    classifierManager.SetClassifier("datemadeutc", new MinuteClassifier());
//    classifierManager.SetClassifier("DateTime", new DayClassifier());
}

function GraphState(dataManager){
    var timespan = NaN;
    return {
        GetTimeSpan: function(){
            return timespan;
        },
        SetTimeSpan: function(newTimespan){
            timespan = newTimespan;
        },
        GetMostPopular: function(property){
            return dataManager.GetFilteredGroupsSortedByCount(property);
        }
    }
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
        var graphState = new GraphState(dataManager);
        var animator = new Animator(graphState, sigmaAdapter, forceRunner);
        var fullScreen = new Fullscreen();
        var settingsView = new SettingsView(forceRunner, dataManager, sigmaAdapter,classifierManager, animator, fullScreen, graphState).PopulateSettings(data).AddListeners(sigmaAdapter);
        GetCurrentData(dataSource, dataManager, settingsView, animator);
        setInterval( function(){
            GetCurrentData(dataSource, dataManager, settingsView, animator);
        }, 20000);

    });
})

