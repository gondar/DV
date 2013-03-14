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
    var i =0;
    sigInst.iterNodes(function(node1){
        sigInst.iterNodes(function(node2) {
            if (node1.attr.reservation == undefined)
                return;
            if (node1.attr.reservation.partnerid == node2.attr.reservation.partnerid) {
                sigInst.addEdge(i++,node1.id,node2.id);
            }
        });
    });
    sigInst.startForceAtlas2();
})

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