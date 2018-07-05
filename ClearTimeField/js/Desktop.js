(function($){
    kintone.events.on(['app.record.create.show', 'app.record.edit.show', 'app.record.index.edit.show'], function(event) {
        $(".input-time-text-cybozu").keyup(function(e){
            if(e.keyCode === 8) {
                e.currentTarget.value = "";
            }
        });
    });
})(jQuery);