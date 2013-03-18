function EqualClassifier(){
    return {
        Compare: function(val1, val2) {
            if (val1 == val2)
                return 1;
            return 0;
        },

        GetKey: function(val) {
            return val;
        }
    }
}