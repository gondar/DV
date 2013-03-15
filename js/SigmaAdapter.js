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
                color: "#ffffff",
                size: reservation.partysize,
                x: Math.random(),
                y: Math.random(),
                reservation: reservation
            }).draw();
        }
        new ForceAtlasRunner(sigInst, "#start_stop").Run();
        return sigInst;
    }

    function bindPropertyToColor(property){
        var colors = {};
        var colorsCount = 0;

        sigInst.iterNodes(function (node) {
            var propertyValue = node.attr.reservation[property];
            if (!colors.hasOwnProperty(propertyValue)){
                colors[propertyValue] = IntToColor(colorsCount);
                colorsCount++;
            }
            node.color = colors[propertyValue];
        });
        sigInst.draw();
    }

    function IntToColor(id){
        var colorId = id % Colors.length;
        return Colors[colorId].Rgb;
    }

    return {
        Init: function(){
            initSigma();
            return this;
        },
        AddEdges: addEdges,
        BindPropertToColor: bindPropertyToColor
    }
}

var Colors = [
        GetColor(0,"Blue","#006DCC"),
        GetColor(1,"Red","#DA4F49"),
        GetColor(2,"Yellow","#FAA732"),
        GetColor(3,"Green","#5BB75B"),
        GetColor(4,"Magneta","#8B008B")
    ];

function GetColor(id, name, rgb){
    return {Id: id, Name: name, Rgb: rgb};
}