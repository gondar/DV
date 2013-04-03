function ForceAtlasRunner(sigmaAdapter, selector){
    var isRunning = false;
    var isScheduled = false;
    var isForceStop = false;
    sigInst = sigmaAdapter.Sigma;

    function startForceAtlas() {
        if (isRunning || isForceStop)
            return;
        sigInst.startForceAtlas2();
        isRunning = true;
        $(selector).attr("value", "Stop");
        $(selector).removeClass("btn-success");
        $(selector).addClass("btn-danger");
    }

    function stopForceAtlas() {
        isScheduled = false;
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
        Stop: stopForceAtlas,
        ScheduleStart: function(){
            if (isScheduled || isRunning)
                return;

            isScheduled = true;
            setTimeout(function () {
                if (isScheduled)
                    startForceAtlas();
            }, 1000);
        },
        WhileForceStop: function(action){
            isForceStop = true;
            var wasRunning = isRunning;
            stopForceAtlas();
            action();
            isForceStop = false;
            if (wasRunning) {
                this.ScheduleStart();
            }
        }
    }
}