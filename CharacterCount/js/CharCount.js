jQuery.noConflict();

(function($, PLUGIN_ID){
    "use strict"

    var config = kintone.plugin.app.getConfig(PLUGIN_ID);

    if(config && config.activation !== 'active'){
        return;
    }

    var textFieldCode = config.textFieldCode;
    var countFieldCode = config.countFieldCode;
    var textFieldLabel = config.textFieldLabel;
    var countFieldLabel = config.countFieldLabel;
    var regex = /[^_\W]+/g;
    var outerTextFieldArray, outerCountFieldArray,
        setTextFieldIndex, setCountFieldIndex,
        textFieldArray, countFieldArray,
        setTextFieldClassName, setCountFieldClassName;

    kintone.events.on(['app.record.create.show', 'app.record.edit.show'], function(event) {
        //These elements include the label name
        outerTextFieldArray = Array.from(document.getElementsByClassName("control-multiple_line_text-field-gaia"));
        //Using the config.label, find the index of the user-set-textField
        //This index indicates which field is set by an user.
        outerTextFieldArray.forEach(function(element, index){
            if(textFieldLabel === element.textContent){
                setTextFieldIndex = index;
            }
        })
        outerCountFieldArray = Array.from(document.getElementsByClassName("control-decimal-field-gaia"));
        outerCountFieldArray.forEach(function(element, index){
            if(countFieldLabel === element.textContent){
                setCountFieldIndex = index;
            }
        })

        //These elements store the values like texts/numbers
        textFieldArray = Array.from(document.getElementsByClassName("textarea-cybozu"));
        countFieldArray = Array.from(document.getElementsByClassName("input-text-cybozu input-number-cybozu"));
        countFieldArray[setCountFieldIndex].disabled = true;

        $(".textarea-cybozu").keyup(function(e){
            var text = textFieldArray[setTextFieldIndex].value;
            var match = text.match(regex);
            var length = match.join('').length;

            countFieldArray[setCountFieldIndex].value = length;
            //event['record'][countFieldCode]['value'] doesn't work 
                //because I have to return event after this keyup fired(Asynchronous behavior)
        });
    })

    kintone.events.on('app.record.index.show', function(event){
        //getting the unique part "value..." from the class name of set fields
        setTextFieldClassName = kintone.app.getFieldElements(textFieldCode)[0].className.slice(56);
        setCountFieldClassName = kintone.app.getFieldElements(countFieldCode)[0].className.slice(45);
    })

    kintone.events.on('app.record.index.edit.show', function(event){
        //These elements don't include the value like texts/nuymbers
        textFieldArray = Array.from(document.getElementsByClassName("recordlist-editcell-gaia recordlist-edit-multiple_line_text-gaia " + setTextFieldClassName));
        countFieldArray = Array.from(document.getElementsByClassName("recordlist-editcell-gaia recordlist-edit-decimal-gaia " + setCountFieldClassName));

        countFieldArray[0].children[0].children[0].children[1].children[0].disabled = true;
    
        $("." + setTextFieldClassName).keyup(function(e){
            //This property holds the value
            var text = textFieldArray[0].children[0].children[0].value;
            var match = text.match(regex);
            var length = match.join('').length;

            countFieldArray[0].children[0].children[0].children[1].children[0].value = length;
        });
    })
})(jQuery, kintone.$PLUGIN_ID);