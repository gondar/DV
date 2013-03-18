function ForceAtlasRunner(sigmaAdapter, selector){
    var isRunning = false;
    sigInst = sigmaAdapter.Sigma;

    function startForceAtlas() {
        sigInst.startForceAtlas2();
        isRunning = true;
        $(this).attr("value", "Stop");
        $(this).removeClass("btn-success");
        $(this).addClass("btn-danger");
    }

    function stopForceAtlas() {
        sigInst.stopForceAtlas2();
        isRunning = false;
        $(this).attr("value", "Start");
        $(this).removeClass("btn-danger");
        $(this).addClass("btn-success");
    }

    $(selector).click(function(){
        if (isRunning) {
            stopForceAtlas.call(this);
            return;
        }
        startForceAtlas.call(this);
    })
    return {
        Run: function(){
            startForceAtlas();
            return this;
        },
        Stop: stopForceAtlas()
    }
}