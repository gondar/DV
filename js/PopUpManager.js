function PopUpManager(graph, selector){
    var popUp;
    var sigInst = graph.Sigma;

    function attributesToString(attr) {
        var res ="";
        for (var k in attr){
            if (attr.hasOwnProperty(k)) {
                res += k + ": " + attr[k]+"<br/>";
            }
        }
        return res;
    }

    function showNodeInfo(event) {
        popUp && popUp.remove();

        var node;
        sigInst.iterNodes(function(n){
            node = n;
        },[event.content[0]]);

        popUp = $(
            "<div>"+attributesToString(node.attr.reservation)+"</div>"
        ).attr(
                'id',
                'node-info'+sigInst.getID()
            ).css({
                'display': 'inline-block',
                'border-radius': 3,
                'padding': 5,
                'background': '#fff',
                'color': '#000',
                'box-shadow': '0 0 4px #666',
                'position': 'absolute',
                'left': node.displayX,
                'top': node.displayY+15,
                'z-index': 10
            });

        $('ul',popUp).css('margin','0 0 0 20px');

        $(selector).append(popUp);
    }

    function hideNodeInfo(event) {
        popUp && popUp.remove();
        popUp = false;
    }

    return {
        AddPopUp: function(){
            sigInst.bind('overnodes',showNodeInfo).bind('outnodes',hideNodeInfo).draw();
        }
    }
}
