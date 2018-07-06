(function(){
    var timeFields = [];
    kintone.events.on(['app.record.create.show', 'app.record.edit.show', 'app.record.index.edit.show'], function(event) {
        timeFields = Array.from(document.getElementsByClassName("input-time-text-cybozu"));

        timeFields.forEach(function(element){
            element.onkeyup = function(e){
                if(e.keyCode === 8) {
                    e.target.value = "";
                }
            }   
        });
    });
})();