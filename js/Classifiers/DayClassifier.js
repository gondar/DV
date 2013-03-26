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

            if (date1.getDate() == date2.getDate())
                return 1;
            return 0;
        },
        GetKey: function(val) {
            return parseDate(val).getDate();
        }
    }
}


function MinuteClassifier() {
    function parseDateWithoutSeconds(dateString){
        var parts = dateString.split("T");
        var dateParts = parts[0].split("-");
        var timeParts = parts[1].split(":");
        return new Date(dateParts[0],dateParts[1],dateParts[2],timeParts[0],timeParts[1],0);
    }
    return {
        Compare: function(val1, val2) {

            var date1 = parseDateWithoutSeconds(val1)
            var date2 = parseDateWithoutSeconds(val2);

            if (date1 == date2)
                    return 1;
            return 0;
        },
        GetKey: function(val) {
            var date1 =parseDateWithoutSeconds(val);
            return date1.getDate()+date1.getHours()+":"+date1.getMinutes();
        }
    }
}
