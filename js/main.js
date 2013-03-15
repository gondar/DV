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
        }
    }
}

function ApproximateClassifier(delta){
    return {
        Compare: function(val1, val2) {
            if (Math.abs(val1 - val2) < delta )
                return 1;
            return 0;
        }
    }
}

$(document).ready(function(){
    var data = new DataSource().GetData();
    var classifierManager = new ClassifiersManager(new EqualClassifier());
    classifierManager.SetClassifier("longitude",new ApproximateClassifier(10));
    classifierManager.SetClassifier("latitude",new ApproximateClassifier(10));
    var sigmaAdapter = new SigmaAdapter(classifierManager).Init(data, "#graph");
    new SettingsView().PopulateSettings(data).AddListeners(sigmaAdapter);
    new ForceAtlasRunner(sigmaAdapter, "#start_stop").Run();
    new PopUpManager(sigmaAdapter, '#graph').AddPopUp();
})

