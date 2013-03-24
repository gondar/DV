function ForceAtlasRunner(sigmaAdapter, selector){
    var isRunning = false;
    sigInst = sigmaAdapter.Sigma;

    function startForceAtlas() {
        if (isRunning)
            return;
        sigInst.startForceAtlas2();
        isRunning = true;
        $(selector).attr("value", "Stop");
        $(selector).removeClass("btn-success");
        $(selector).addClass("btn-danger");
    }

    function stopForceAtlas() {
        if (!isRunning)
            return;
        sigInst.stopForceAtlas2();
        isRunning = false;
        $(selector).attr("value", "Start");
        $(selector).removeClass("btn-danger");
        $(selector).addClass("btn-success");
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
        Stop: stopForceAtlas
    }
}