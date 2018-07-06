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

        textFieldArray[setTextFieldIndex].onkeyup = function(e){
            var text = e.target.value;
            var match = text.match(regex);
            var length = match.join('').length;

            countFieldArray[setCountFieldIndex].value = length;
        };
    })

    kintone.events.on('app.record.index.show', function(event){
        //Get the unique part "value..." from the class names of user-set fields.
        //Use these variables to get the elements of user-set fields in the index record edit page
        setTextFieldClassName = kintone.app.getFieldElements(textFieldCode)[0].className.slice(56);
        setCountFieldClassName = kintone.app.getFieldElements(countFieldCode)[0].className.slice(45);
    })

    kintone.events.on('app.record.index.edit.show', function(event){
        //These arrays contain just the elements of user-set fields being editted.
        textFieldArray = Array.from(document.getElementsByClassName("recordlist-editcell-gaia recordlist-edit-multiple_line_text-gaia " + setTextFieldClassName));
        countFieldArray = Array.from(document.getElementsByClassName("recordlist-editcell-gaia recordlist-edit-decimal-gaia " + setCountFieldClassName));

        countFieldArray[0].children[0].children[0].children[1].children[0].disabled = true;

        textFieldArray[0].onkeyup = function(e){
            console.log("hey");
            var text = e.target.value;
            var match = text.match(regex);
            var length = match.join('').length;

            countFieldArray[0].children[0].children[0].children[1].children[0].value = length
        };

        //This recognizes just the user-set text field too since "setTextFieldClassName" is unique to that field
            //and keyup is triggered only on the field that is being editted
        // $("." + setTextFieldClassName).keyup(function(e){
        //     //This property holds the value
        //     var text = textFieldArray[0].children[0].children[0].value;
        //     var match = text.match(regex);
        //     var length = match.join('').length;
        //
        //     countFieldArray[0].children[0].children[0].children[1].children[0].value = length;
        // });
    })
})(jQuery, kintone.$PLUGIN_ID);
