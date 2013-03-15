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
                size: 1,
                x: Math.random(),
                y: Math.random(),
                reservation: reservation,
                label: ""
            }).draw();
        }
        new ForceAtlasRunner(sigInst, "#start_stop").Run();
        return sigInst;
    }

    function bindPropertyToSize(property){
        var sizes = {};
        var currentSize = 1;

        sigInst.iterNodes(function (node) {
            var propertyValue = node.attr.reservation[property];
            if (!sizes.hasOwnProperty(propertyValue)){
                sizes[propertyValue] = currentSize;
                currentSize += 1;
            }
            node.size = sizes[propertyValue];
        });
        sigInst.draw();
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
        return "#"+Colors[colorId];
    }

    return {
        Init: function(){
            initSigma();
            return this;
        },
        AddEdges: addEdges,
        BindPropertToColor: bindPropertyToColor,
        BindPropertToSize: bindPropertyToSize
    }
}

var Colors = ["006DCC","DA4F49","FAA732","5BB75B","8B008B","4848DA","6A48DA","4891DA","48DAD7","48DAAB","48DA54","BADA48","DAB848","DA7448"];