function DataSource(){
    var proxy = "http://localhost:4567/proxy/?url=";
    var head = "http://feeds-na.otcorp.opentable.com/reservations/created/";
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
        }
    }
}

var count = 0
function GetCurrentData(dataSource, dataManager, settingsView) {
    dataSource.GetData(function (data) {
        dataManager.RemoveData();
        dataManager.AddData(data);
        settingsView.UpdateState();
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