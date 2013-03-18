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
