function SigmaAdapter(classifierManager, dataManager) {
    var sigInst;
    var nodesCounter = 0;
    var lastSelectedEdges = {};
    var lastColorsProperty = "partnerid";

    function addEdges(selected) {
        if (selected == undefined)
            selected = lastSelectedEdges;
        lastSelectedEdges = selected;
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
                            var classifier = classifierManager.GetClassifier(prop);
                            var relation = classifier.Compare(node1.attr.reservation[prop], node2.attr.reservation[prop]);
                            if (relation != 0) {
                                sigInst.addEdge(i++, node1.id, node2.id, relation*weight);
                            }
                        }
                    }
                }
            });
        });
        setSize();
        sigInst.draw();
    }

    function reDrawAll(){
        sigInst.iterNodes(function(node){
            node.x = Math.random();
            node.y = Math.random();
        });
    }

    function addNodes(data) {
        var reservations = data;//.reservations;
        for (var reservationId in reservations) {
            var reservation = reservations[reservationId];
            sigInst.addNode(nodesCounter++, {
                color: "#ffffff",
                size: 1,
                x: Math.random(),
                y: Math.random(),
                reservation: reservation,
                label: ""
            });
        }
        sigInst.draw();
    }

    function updateNodes() {
//        sigInst.iterNodes(function(node){
//            sigInst.dropNode(node.id);
//        });
        sigInst.emptyGraph();
        nodesCounter=0;
        addNodes(dataManager.GetData());
    }

    function initSigma(data, selector) {
        var sigRoot = $(selector).get(0);
        sigInst = sigma.init(sigRoot);
        addNodes(dataManager.GetData());
        return sigInst;
    }

    function setSize(){
        var max = 4;
        sigInst.iterNodes(function(node) {
            node.size = node.inDegree/2+1;
            if (node.size > max)
                node.size = max;
        });
        sigInst.draw();
    }

    function bindPropertyToColor(property){
        if (property == undefined)
            property = lastColorsProperty;
        lastColorsProperty = property
        var colors = {};
        var colorsCount = 0;
        var classifier = classifierManager.GetClassifier(property);

        sigInst.iterNodes(function (node) {
            var propertyValue = classifier.GetKey(node.attr.reservation[property]);
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
        AddNodes: addNodes,
        UpdateNodes: updateNodes,
        AddEdges: addEdges,
        BindPropertToColor: bindPropertyToColor,
        RedrawAll: reDrawAll

    }
}

var Colors = ["006DCC","DA4F49","FAA732","5BB75B","8B008B","4848DA","6A48DA","4891DA","48DAD7","48DAAB","48DA54","BADA48","DAB848","DA7448"];