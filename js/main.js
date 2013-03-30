function setClassifiers(classifierManager) {
    classifierManager.SetClassifier("longitude", new ApproximateClassifier(5));
    classifierManager.SetClassifier("latitude", new ApproximateClassifier(5));
    classifierManager.SetClassifier("shiftdatetime", new DayClassifier());
    classifierManager.SetClassifier("datemadeutc", new MinuteClassifier());
//    classifierManager.SetClassifier("DateTime", new DayClassifier());
}

function Animator(){
    var speed = 5000;
    var isEnabled = false;

    function Animate(){
        $('.sigma-parent').addClass('sigma-fullwindow');
        $('.sigma-parent').removeClass('sigma-parent');
        $('.sigma-fullwindow').width($(document).width());
        $('.sigma-fullwindow').height($(document).height()-50);
        $('#navigationBar').removeClass("navbar-fixed-top");
        $('#navigationBar').addClass("navbar-fixed-bottom");
        $("body").css("background-color","#222222");
        $("#partysizeEdgeSettings").trigger("click");
        $.notify.success('In the last X minutes we had Y reservations of party size Z and Q reservations of party size F.');
        setTimeout(function(){
            $("#partysizeEdgeSettings").trigger("click");
            $.notify.close();
            setTimeout(function(){
                $("#partnernameEdgeSettings").trigger("click");
                $.notify.success('In the last X minutes we had Y reservations from partner "Z" and Q reservations from partner "F".');
                setTimeout(function(){
                    $("#partnernameEdgeSettings").trigger("click");
                    $.notify.close();
                    if (isEnabled)
                        Animate();
                },speed);
            },3000);
        },speed);
    }

    return {
        Start: function(){
            if (!isEnabled) {
                isEnabled = true;
                Animate();
            }
        },
        Stop: function(){
            isEnabled = false;
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
        var animator = new Animator();
        var settingsView = new SettingsView(forceRunner, dataManager, sigmaAdapter,classifierManager, animator).PopulateSettings(data).AddListeners(sigmaAdapter);
        GetMoreData(dataSource, dataManager, function(){
            settingsView.UpdateState();
            //animator.Start();
        });
    });
})

