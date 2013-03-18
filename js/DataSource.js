function DataSource(){
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