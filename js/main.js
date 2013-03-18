function setClassifiers(classifierManager) {
    classifierManager.SetClassifier("longitude", new ApproximateClassifier(5));
    classifierManager.SetClassifier("latitude", new ApproximateClassifier(5));
    classifierManager.SetClassifier("shiftdatetime", new DayClassifier());
    classifierManager.SetClassifier("datemadeutc", new DayClassifier());
}
var dataCount = 0;

function loadData(dataSource, sigmaAdapter) {
    var step = 500;
    dataSource.GetData(dataCount+1, dataCount+step, function (data) {
        if (data.reservations != null) {
            sigmaAdapter.AddNodes(data);
            sigmaAdapter.AddEdges();
            sigmaAdapter.BindPropertToColor();
        }
    });
}
$(document).ready(function(){
    var dataSource = new DataSource();
    dataCount = 500;
    dataSource.GetData(0,dataCount,function(data) {
        var classifierManager = new ClassifiersManager(new EqualClassifier());
        setClassifiers(classifierManager);
        var sigmaAdapter = new SigmaAdapter(classifierManager).Init(data, "#graph");
        new SettingsView().PopulateSettings(data).AddListeners(sigmaAdapter);
        new ForceAtlasRunner(sigmaAdapter, "#start_stop").Run();
        new PopUpManager(sigmaAdapter, '#graph').AddPopUp();
        //loadData(dataSource, sigmaAdapter);
    });
})

