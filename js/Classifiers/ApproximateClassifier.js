function ApproximateClassifier(delta){
    var groups = [];
    return {
        Compare: function(val1, val2) {
            var distance = Math.abs(val1 - val2);
            if ( distance < delta )
                return distance;
            return 0;
        },

        GetKey: function(val){
            for(var groupIndex in groups)
            {
                var group = groups[groupIndex];
                if (val >= group.min &&  val <= group.max)
                    return groupIndex;
            }
            groups.push({min: val, max: val+delta});
            return groups.length;

        }
    }
}
