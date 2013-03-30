function Animator(graphState){
    var speed = 5000;
    var isEnabled = false;

    function GetMessage(param){
        var popular = graphState.GetMostPopular(param);

        return "In the last "+graphState.GetTimeSpan()+" minutes we had <b>"+popular[0].Count+" reservations</b> with <b>"+param+" equal "+popular[0].Name+"</b>";
    }

    function Animate(){
        $("#partysizeEdgeSettings").trigger("click");
        $.notify.success(GetMessage("partysize"));
        setTimeout(function(){
            $("#partysizeEdgeSettings").trigger("click");
            $.notify.close();
            setTimeout(function(){
                $("#partnernameEdgeSettings").trigger("click");
                $.notify.success(GetMessage("partnername"));
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
