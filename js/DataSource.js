function DataSource(){
    var proxy = "http://192.168.7.111:4567/proxy/?url=";
    //var head = "http://feeds-na.otcorp.opentable.com/reservations/created/";
    var head = "http://feeds-eu.otcorp.opentable.com/reservations/created/";
    var last = "";

    return {
        GetData: function(executeWhenFinished){
            $.getJSON(proxy+head,function(data){
                if (last !== data.href_self) {
                    last = data.href_self;
                    console.log(data.href_self);
                    executeWhenFinished(data);
                }
            });
        },
        GetBigData: function(dataRequested,dataManager, executeWhenFoundData,executeWhenFinished){
            var url = $("#feedUrl").val();
            var self = this;
            $.getJSON(proxy+url,function(data){
                    if (last !== data.href_self) {
                        executeWhenFoundData();
                        last = data.href_self;
                        dataManager.AddData(data);
                        if (dataManager.GetAllData().length < dataRequested) {
                            self.GetMoreData(dataRequested,dataManager, executeWhenFinished, data.href_prev);
                        } else {
                            executeWhenFinished(data);
                        }
                    }
            });
        },
        GetMoreData: function(dataRequested,dataManager,executeWhenFinished, previous)
        {
            var self = this;
            $.getJSON(proxy+previous,function(data){
                dataManager.AddData(data);
                if (dataManager.GetAllData().length < dataRequested) {
                    self.GetMoreData(dataRequested,dataManager, executeWhenFinished, data.href_prev);
                } else {
                    executeWhenFinished(data);
                }
            });
        }
    }
}

var count = 0
function RunAll(settingsView, wasEnabled, animator) {

}
function GetCurrentData(dataSource, dataManager, settingsView, animator) {
    var wasEnabled = false;
    dataSource.GetBigData(100,dataManager, function(){
        wasEnabled = animator.IsEnabled();
        animator.Stop();
        animator.NewData();
        dataManager.RemoveData();
    }, function (data) {
        settingsView.UpdateState();
        if (wasEnabled) {
            setTimeout(function () {
                animator.Start();
            }, 5000);
        }
    });
}


function EUMongoDataSource(){
    return {
        GetData: function(startFrom, end, executeWhenFinished){
            $.getJSON("http://localhost:4567/"+startFrom+"/"+end,function(data){
                executeWhenFinished({reservations:data});
            });
        }
    }
}

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

var dataCount = 0;