jQuery.noConflict();
(function($, PLUGIN_ID){
    "use strict";
 
    var config = kintone.plugin.app.getConfig(PLUGIN_ID);
    //activation
    if(config && config.activation !== 'active'){
        return;
    }

    var dateField = config.dateField; //dateField is the field code
    var dayField = config.dayField;

    kintone.events.on(['app.record.create.submit', 'app.record.edit.submit', 'app.record.index.edit.submit', 'app.record.index.edit.change.' + dateField, 'app.record.create.change.' + dateField, 'app.record.edit.change.' + dateField], function(event) {
        var day = moment(event['record'][dateField]['value']).format('dddd');
       
        event['record'][dayField]['value'] = day;
        return event;
    })

    kintone.events.on(['app.record.edit.show', 'app.record.create.show', 'app.record.index.edit.show'], function(event) {
        event['record'][dayField]['disabled'] = true;
        return event;
    })
})(jQuery, kintone.$PLUGIN_ID); 