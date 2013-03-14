$(document).ready(function(){
    var sigRoot = document.getElementById('graph');
    var sigInst = sigma.init(sigRoot);
    //hw(sigInst);
    AddPopUp(sigInst);
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


function AddPopUp(sigInst){
    var popUp;

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
            'top': node.displayY+15
        });

    $('ul',popUp).css('margin','0 0 0 20px');

    $('#graph').append(popUp);
    }

    function hideNodeInfo(event) {
        popUp && popUp.remove();
        popUp = false;
    }

    sigInst.bind('overnodes',showNodeInfo).bind('outnodes',hideNodeInfo).draw();
}

function hw(sigInst){
    sigInst.addNode('hello',{
        label: 'Hello',
        color: '#ff0000',
        x:0.01
    }).addNode('world',{
            label: 'World !',
            color: '#00ff00',
            size: 1
        }).addEdge('hello_world','hello','world').draw();
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