$(document).ready(function(){
    var data = new DataSource().GetData();
    var graph = new SigmaAdapter().Init();
    var settingsView = new SettingsView();
    settingsView.PopulateSettings(data).AddListeners(graph);
})

