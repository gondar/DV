function ForceAtlasRunner(sigmaAdapter, selector){
    var isRunning = false;
    sigInst = sigmaAdapter.Sigma;

    $(selector).click(function(){
        if (isRunning) {
            sigInst.stopForceAtlas2();
            isRunning = false;
            $(this).attr("value", "Start");
            $(this).removeClass("btn-danger");
            $(this).addClass("btn-success");
            return;
        }
        sigInst.startForceAtlas2();
        isRunning = true;
        $(this).attr("value", "Stop");
        $(this).removeClass("btn-success");
        $(this).addClass("btn-danger");
    })
    return {
        Run: function(){
            sigInst.startForceAtlas2();
            isRunning = true;
        }
    }
}