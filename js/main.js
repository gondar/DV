function addEdges(sigInst) {
    var i =0;
    sigInst.iterNodes(function (node1) {
        sigInst.iterNodes(function (node2) {
            if (node1.attr.reservation.partnerid == node2.attr.reservation.partnerid) {
                sigInst.addEdge(i++, node1.id, node2.id);
            }
            if (node1.attr.reservation.partysize == node2.attr.reservation.partysize) {
                sigInst.addEdge(i++, node1.id, node2.id,8);
            }
        });
    });
}
$(document).ready(function(){
    var sigRoot = document.getElementById('graph');
    var sigInst = sigma.init(sigRoot);
    new PopUpManager(sigInst,'#graph').AddPopUp();
    var data = DataSource().GetData();
    for(var reservationId in data.reservations)
    {
        var reservation = data.reservations[reservationId];
        sigInst.addNode(reservation.resid, {
            color: partnerIdToColor(reservation.partnerid),
            size: reservation.partysize,
            x: Math.random(),
            y: Math.random(),
            reservation: reservation
        }).draw();
    }
    addEdges(sigInst);
    new ForceAtlasRunner(sigInst,"#start_stop").Run();
})

function ForceAtlasRunner(sigInst, selector){
    var isRunning = false;

    $(selector).click(function(){
        if (isRunning) {
            sigInst.stopForceAtlas2();
            isRunning = false;
            return;
        }
        sigInst.startForceAtlas2();
        isRunning = true;
    })
    return {
        Run: function(){
            sigInst.startForceAtlas2();
            isRunning = true;
        }
    }
}

function partnerIdToColor(partnerId){
    if (partnerId == 1)
        return "#ff0000";
    if (partnerId == 84)
        return "#00ff00";
    if (partnerId == 183)
        return "#0000ff";
    if (partnerId == 291)
        return "#ff00ff";
    return "#ffffff"
}