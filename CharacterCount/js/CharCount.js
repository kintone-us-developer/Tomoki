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
    var textFieldArray, countFieldArray,
        setTextField, setCountField,
        setTextFieldClassName, setCountFieldClassName;

    kintone.events.on(['app.record.create.show', 'app.record.edit.show'], function(event) {
        //These elements include the label names
        textFieldArray = Array.from(document.getElementsByClassName("control-multiple_line_text-field-gaia"));
        //Using the config.label, get the element of the user-set-textField
        textFieldArray.forEach(function(element, index){
            if(textFieldLabel === element.textContent){
                setTextField = textFieldArray[index];
            }
        });

        countFieldArray = Array.from(document.getElementsByClassName("control-decimal-field-gaia"));
        countFieldArray.forEach(function(element, index){
            if(countFieldLabel === element.textContent){
                setCountField = countFieldArray[index];
            }
        });

        setCountField.children[1].children[0].children[1].children[0].children[0].disabled = true;

        setTextField.onkeyup = function(e){
            var text = e.target.value;
            var match = text.match(regex);
            var length = match.join('').length;

            setCountField.children[1].children[0].children[1].children[0].children[0].value = length;
        };
    })

    kintone.events.on('app.record.index.show', function(event){
        //Get the unique part "value..." from the class names of user-set fields.
        //Use these variables to get the elements of user-set fields in the index record edit page
        setTextFieldClassName = kintone.app.getFieldElements(textFieldCode)[0].className.slice(56);
        setCountFieldClassName = kintone.app.getFieldElements(countFieldCode)[0].className.slice(45);
    })

    kintone.events.on('app.record.index.edit.show', function(event){
        //Get the element of the user-set-textField
        setTextField = document.getElementsByClassName("recordlist-editcell-gaia recordlist-edit-multiple_line_text-gaia " + setTextFieldClassName)[0];
        setCountField = document.getElementsByClassName("recordlist-editcell-gaia recordlist-edit-decimal-gaia " + setCountFieldClassName)[0];

        setCountField.children[0].children[0].children[1].children[0].disabled = true;

        setTextField.onkeyup = function(e){
            var text = e.target.value;
            var match = text.match(regex);
            var length = match.join('').length;

            setCountField.children[0].children[0].children[1].children[0].value = length;
        };
    })
})(jQuery, kintone.$PLUGIN_ID);
