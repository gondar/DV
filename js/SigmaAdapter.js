function SigmaAdapter() {
    var sigInst;
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

    function addNodes(data) {
        var reservations = data.reservations;
        for (var reservationId in reservations) {
            var reservation = reservations[reservationId];
            sigInst.addNode(reservation.resid, {
                color: "#ffffff",
                size: 1,
                x: Math.random(),
                y: Math.random(),
                reservation: reservation,
                label: ""
            }).draw();
        }
    }

    function initSigma(data, selector) {
        var sigRoot = $(selector).get(0);
        sigInst = sigma.init(sigRoot);
        addNodes(data);
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
        Init: function(data,selector){
            this.Sigma = initSigma(data, selector);
            return this;
        },
        AddEdges: addEdges,
        BindPropertToColor: bindPropertyToColor,
        BindPropertToSize: bindPropertyToSize
    }
}

var Colors = ["006DCC","DA4F49","FAA732","5BB75B","8B008B","4848DA","6A48DA","4891DA","48DAD7","48DAAB","48DA54","BADA48","DAB848","DA7448"];