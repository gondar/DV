function DataManager(classifierManager){
    var nodes = [];
    var filters = {};
    var maxNodesAllowed = 40;

    function SortByName(a, b){
        var aName = a.Name.toLowerCase();
        var bName = b.Name.toLowerCase();
        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    }

    function SortByCount(a,b){
        var aCount = a.Count;
        var bCount = b.Count;
        return ((aCount < bCount) ? -1 : ((aCount > bCount) ? 1 : 0));
    }

    function Group(property){
        groups = {}
        for (var reservationId in nodes) {
            var reservation = nodes[reservationId];
            var classifier = classifierManager.GetClassifier(property);
            var key = classifier.GetKey(reservation[property]);
            if (!groups.hasOwnProperty(key)) {
                groups[key] = 0;
            }
            groups[key]++;
        }
        groupsArray = [];
        for (var key in groups) {
            groupsArray.push({Name: key, Count: groups[key]})
        }
        return groupsArray;
    }

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
        },
        GetGroupsSortedByName: function(property){
            return Group(property).sort(SortByName).reverse();
        },
        GetGropusSortedByCount: function(property){
            return Group(property).sort(SortByCount).reverse();                 o
        }
    }
}