function DataSource(){
    return {
        GetData: function(startFrom, end, executeWhenFinished){
            $.getJSON("http://localhost:4567/"+startFrom+"/"+end,function(data){
                executeWhenFinished({reservations:data});
            });
        }
    }
}