$(document).ready(function(){
    var data = new DataSource().GetData();
    var sigmaAdapter = new SigmaAdapter().Init(data, "#graph");
    new SettingsView().PopulateSettings(data).AddListeners(sigmaAdapter);
    new ForceAtlasRunner(sigmaAdapter, "#start_stop").Run();
    new PopUpManager(sigmaAdapter, '#graph').AddPopUp();
})

