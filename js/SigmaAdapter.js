function SigmaAdapter() {
    var sigInst = null;
    function addEdges(selected) {
        sigInst.iterEdges(function (edge) {
            sigInst.dropEdge(edge.id);
        });
        var i =0;
        sigInst.iterNodes(function (node1) {
            sigInst.iterNodes(function (node2) {
                for (var prop in selected){
                    if (selected.hasOwnProperty(prop)) {
                        var weight = selected[prop];
                        if (weight != 0) {
                            if (node1.attr.reservation[prop] == node2.attr.reservation[prop]){
                                sigInst.addEdge(i++, node1.id, node2.id, weight);
                            }
                        }
                    }
                }
            });
        });
        sigInst.draw();
    }
    function initSigma() {
        var sigRoot = document.getElementById('graph');
        sigInst = sigma.init(sigRoot);
        new PopUpManager(sigInst, '#graph').AddPopUp();
        var data = DataSource().GetData();
        for (var reservationId in data.reservations) {
            var reservation = data.reservations[reservationId];
            sigInst.addNode(reservation.resid, {
                color: partnerIdToColor(reservation.partnerid),
                size: reservation.partysize,
                x: Math.random(),
                y: Math.random(),
                reservation: reservation
            }).draw();
        }
        new ForceAtlasRunner(sigInst, "#start_stop").Run();
        return sigInst;
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

    return {
        Init: function(){
            initSigma();
            return this;
        },
        AddEdges: function(edges) {
            addEdges(edges);
        }
    }
}
