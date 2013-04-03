function Animator(graphState, sigmaAdapter, forceRunner){
    var speed = 5000;
    var isEnabled = false;

    function BuildAnimation(param){
        return new Animation(param,function(){return isEnabled;}, graphState, sigmaAdapter, speed);
    }

    function BuildAnimationFlow(){
        var flow = ["partnername","partysize","shiftdatetime","billingtype","restaurantname"];
        var animations = [];
        for (var paramId in flow){
            var param = flow[paramId];
            var animation = BuildAnimation(param);
            animations.push(animation);
            if (paramId > 0){
                animation.SetNext(animations[paramId-1]);
            }
        }
        animations[0].SetNext(animations[animations.length-1]);
        return animations[0];
    }

    return {
        Start: function(){
            if (!isEnabled) {
                isEnabled = true;
                //sigmaAdapter.UpdateNodes(forceRunner);
                forceRunner.ScheduleStart();
                BuildAnimationFlow().Start();
            }
        },
        Stop: function(){
            isEnabled = false;
        },
        NewData: function(){
            $.notify.success("New Reservations coming...");
        },
        IsEnabled: function(){
            return isEnabled;
        }

    }
}

function Animation(param, shouldContinueFunction, graphState, sigmaAdapter, speed){
    var next = null;

    function EmphasizeGroup(param,setId){
        var popular = graphState.GetMostPopular(param);
        if (popular[setId] == undefined)
            return;

        var color = sigmaAdapter.ColourGroup(param, popular[setId].Name, setId);


        var msg = "In the last "+graphState.GetTimeSpan()+" minutes we had <b>"+popular[setId].Count+" reservations</b> with <b>"+param+" equal "+popular[setId].Name+"</b>";

        $.notify.custom(msg,undefined, setId);
    }

    function scheduleNext(after){
        if (after == undefined)
            return;
        if (shouldContinueFunction()){
            setTimeout(after,speed);
        } else {
            finishAnimation();
        }

    }

    function startAnimation(after){
        $("#"+param+"EdgeSettings").trigger("click");
        EmphasizeGroup(param,0);
        scheduleNext(after);
    }

    function showMessage(groupId, after){
        EmphasizeGroup(param,groupId);
        scheduleNext(after);
    }

    function finishAnimation(after){
        $("#"+param+"EdgeSettings").trigger("click");
        $.notify.close();
        sigmaAdapter.ClearColor();
        if (after != undefined) {
            after();
        }
    }

    function scheduleNextAnimation()
    {
        if (next != null && next != undefined && shouldContinueFunction()){
            next.Start();
        }
    }

    return {
        Start: function(){
            startAnimation(function(){
                showMessage(1,function(){
                    showMessage(2,function(){
                        finishAnimation(function(){
                            scheduleNextAnimation();
                        });
                    });
                });
            });
        },
        SetNext: function(newNext){
            next = newNext;
        }
    }
}