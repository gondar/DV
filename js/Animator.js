function Animator(){
    var speed = 5000;
    var isEnabled = false;

    function Animate(){
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
