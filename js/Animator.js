function Animator(graphState){
    var speed = 5000;
    var isEnabled = false;

    function BuildAnimation(param){
        return new Animation(param,function(){return isEnabled;}, graphState, speed);
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
                //Animate();
                BuildAnimationFlow().Start();
            }
        },
        Stop: function(){
            isEnabled = false;
        }

    }
}

function Animation(param, shouldContinueFunction, graphState, speed){
    var next = null;

    function GetMessage(param,setId){
        var popular = graphState.GetMostPopular(param);

        return "In the last "+graphState.GetTimeSpan()+" minutes we had <b>"+popular[setId].Count+" reservations</b> with <b>"+param+" equal "+popular[setId].Name+"</b>";
    }

    function startAnimation(after){
        $("#"+param+"EdgeSettings").trigger("click");
        $.notify.success(GetMessage(param,0));
        setTimeout(after,speed);
    }

    function showMessage(groupId, after){
        $.notify.success(GetMessage(param,groupId));
        setTimeout(after, speed);
    }

    function finishAnimation(after){
        $("#"+param+"EdgeSettings").trigger("click");
        $.notify.close();
        setTimeout(after, speed);
    }

    function scheduleNextAnimation()
    {
        setTimeout(function(){
            if (next != null && next != undefined && shouldContinueFunction()){
                next.Start();
            }
        },speed);
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