function DataSource(){
    var head = "http://localhost:4567/reservations/created";
    var prev = head;
    var downloaded = [];

    function GetMoreData(executeWhenFinished, url){
        if (url == undefined || url == null || url == "") {
            url = head;
        }
        $.getJSON(url,function(data){
            if ($.inArray(data.href_self, downloaded) != -1){
                GetMoreData(executeWhenFinished,data.href_prev);
                return;
            }
            downloaded.push(data.href_self);
            executeWhenFinished(data);
        });
    };

    return {
        GetData: function(executeWhenFinished){
            $.getJSON(head,function(data){
                downloaded.push(data.href_self);
                executeWhenFinished(data);
            });
        },

        GetMoreData: GetMoreData
    }
}

var count = 0
function GetMoreData(dataSource, dataManager, actionToExecute) {
    dataSource.GetMoreData(function (data) {
        dataManager.AddData(data);
        if (count++ <4) {
            GetMoreData(dataSource, dataManager, actionToExecute);
        } else {
            actionToExecute();
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