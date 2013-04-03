function Animator(graphState, sigmaAdapter){
    var speed = 5000;
    var isEnabled = false;

    function BuildAnimation(param){
        return new Animation(param,function(){return isEnabled;}, graphState, sigmaAdapter, speed);
    }

    function BuildAnimationFlow(){
        //var flow = ["partnername","partysize","shiftdatetime","billingtype","restaurantname"];
        var flow = ["billingtype","restaurantname"];
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
                //Animate();
                BuildAnimationFlow().Start();
            }
        },
        Stop: function(){
            isEnabled = false;
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

    function startAnimation(after){
        $("#"+param+"EdgeSettings").trigger("click");
        EmphasizeGroup(param,0);
        setTimeout(after,speed);
    }

    function showMessage(groupId, after){
        EmphasizeGroup(param,groupId);
        setTimeout(after, speed);
    }

    function finishAnimation(after){
        $("#"+param+"EdgeSettings").trigger("click");
        $.notify.close();
        sigmaAdapter.RedrawAll();
        sigmaAdapter.ClearColor();
        setTimeout(after, speed);
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