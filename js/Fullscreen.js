function Fullscreen(){
    var fullscreen = false;
    return {
        On: function(){
            if (fullscreen) {
                return;
            }
            fullscreen = true;
            $('.sigma-parent').addClass('sigma-fullwindow');
            $('.sigma-parent').removeClass('sigma-parent');
            $('.sigma-fullwindow').width($(document).width());
            $('.sigma-fullwindow').height($(document).height()-50);
            $('#navigationBar').removeClass("navbar-fixed-top");
            $('#navigationBar').addClass("navbar-fixed-bottom");
            $("body").css("background-color","#222222");
        },
        Off: function(){
            if (!fullscreen) {
                return;
            }
            fullscreen = false;

            $('.sigma-fullwindow').addClass('sigma-parent');
            $('.sigma-fullwindow').width("100%");
            $('.sigma-fullwindow').height(300);
            $('.sigma-fullwindow').removeClass('sigma-fullwindow');
            $('#navigationBar').addClass("navbar-fixed-top");
            $('#navigationBar').removeClass("navbar-fixed-bottom");
            $("body").css("background-color","#ffffff");
        }

    }
}
