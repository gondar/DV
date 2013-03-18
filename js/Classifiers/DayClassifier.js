function DayClassifier() {
    function parseDate(dateString){
        var parts = dateString.split("T");
        var dateParts = parts[0].split("-");
        var timeParts = parts[1].split(":");
        return new Date(dateParts[0],dateParts[1],dateParts[2],timeParts[0],timeParts[1],0);
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
