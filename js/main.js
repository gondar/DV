function ClassifiersManager(defaultClassifier){
    classifiers = {};

    function getClassifier(property){
        if (classifiers.hasOwnProperty(property))
            return classifiers[property];
        return defaultClassifier;
    }

    function setClassifier(property, classifier){
        classifiers[property] = classifier;
    }

    return {
        GetClassifier: getClassifier,
        SetClassifier: setClassifier
    }
}

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

function DayClassifier() {
    function parseDate(dateString){
        var parts = dateString.split("T");
        var dateParts = parts[0].split("-");
        var timeParts = parts[1].split(":");
        return new Date(dateParts[0],dateParts[1],dateParts[2],timeParts[0],timeParts[2],0);
    }
    return {
        Compare: function(val1, val2) {

            var date1 = parseDate(val1)
            var date2 = parseDate(val2);

            if (date1.getDay() == date2.getDay())
              return 1;
            return 0;
        },
        GetKey: function(val) {
            return parseDate(val).getDay();
        }
    }
}

$(document).ready(function(){
    var data = new DataSource().GetData();
    var classifierManager = new ClassifiersManager(new EqualClassifier());
    classifierManager.SetClassifier("longitude",new ApproximateClassifier(5));
    classifierManager.SetClassifier("latitude",new ApproximateClassifier(5));
    classifierManager.SetClassifier("shiftdatetime", new DayClassifier());
    classifierManager.SetClassifier("datemadeutc", new DayClassifier());
    var sigmaAdapter = new SigmaAdapter(classifierManager).Init(data, "#graph");
    new SettingsView().PopulateSettings(data).AddListeners(sigmaAdapter);
    new ForceAtlasRunner(sigmaAdapter, "#start_stop").Run();
    new PopUpManager(sigmaAdapter, '#graph').AddPopUp();
})

