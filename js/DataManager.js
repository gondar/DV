function DataManager(classifierManager){
    var nodes = [];
    var filters = {};
    var maxNodesAllowed = 40;
    return {
        AddData: function(data){
            var reservations = data.reservations;
            for (var reservationId in reservations) {
                var reservation = reservations[reservationId];
                nodes.push(reservation);
            }
            return this;
        },
        GetData: function(data) {
            return nodes.filter(function(node){
                for (var property in filters) {
                    var key = classifierManager.GetClassifier(property).GetKey(node[property]);
                    if ($.inArray(key.toString(), filters[property]) == -1) {
                        return false;
                    }
                }
                return true;
            }).slice(0,maxNodesAllowed);
        },
        GetAllData: function(data) {
            return nodes;
        },
        AddFilter: function(property, value){
            if (!filters.hasOwnProperty(property)){
                filters[property] = [];
            }
            filters[property].push(value);
        },
        RemoveFilter: function(property, value){
            if (filters[property] != undefined) {
                filters[property].splice($.inArray(value, filters[property]),1);
                if (filters[property].length ==0)
                    delete filters[property];
            }
        },
        SetMaxNodesAllowed: function(max) {
            maxNodesAllowed = max;
        }
    }
}