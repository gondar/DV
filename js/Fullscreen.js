function Fullscreen(){
    var fullscreen = false;

    function requestFullScreen(element) {
        // Supports most browsers and their versions.
        var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

        if (requestMethod) { // Native full screen.
            requestMethod.call(element);
        } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }
    }

    function closeFullScreen(){
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
        else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }

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
            requestFullScreen(document.body);
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
            closeFullScreen();
        }

    }
}
