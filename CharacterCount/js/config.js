jQuery.noConflict();

(function($, PLUGIN_ID){
    "use strict"
    var terms = {
        'en': {
            cancelBtn: '     Cancel   ',
            configTitle: 'Settings',
            countField: 'Count Output Field',
            kintoneFieldConfig: 'Kintone field settings for the Character Count plugin',
            pluginActivation: 'Plug-in activation',
            pluginActive: 'Active',
            submitBtn: '     Save   ',
            textField: 'Text Input Field',
            textKintoneFields: 'Please create the following fields in your app form.'
        }
    }

    var lang = kintone.getLoginUser().language;
    var i18n = (lang in terms) ? terms[lang] : terms['en'];

    // append events
    var appendEvents = function appendEvents(fields) {
        // save plug-in settings
        $('#submit').click(function() {
            var config = {};
            config.activation = $('#activation').prop('checked') ? 'active' : 'deactive';
            config.textFieldCode = $('#textField').val();
            config.countFieldCode = $('#countField').val();

            fields.textField.forEach(function(e){
                if(config.textFieldCode === e.code){
                    config.textFieldLabel = e.label;
                }
            });
            fields.countField.forEach(function(e){
                if(config.countFieldCode === e.code){
                    config.countFieldLabel = e.label;
                }
            });

            kintone.plugin.app.setConfig(config);
        });
        // cancel plug-in settings
        $('#cancel').click(function() {
            history.back();
        });
    };

    // create HTML (call in renderHtml)
    var createHtml = function(fields) {
        // template & items settings
        // '#plugin-template' is defined in config.html
        var template = $.templates(document.querySelector('#plugin-template'));
        var templateItems = {
            configTitle: i18n.configTitle,
            // section1 activate plug-in
            pluginActivation: {
                pluginActivation: i18n.pluginActivation,
                pluginActive: i18n.pluginActive
            },
            kintoneFieldConfig: i18n.kintoneFieldConfig,
            textKintoneFields: i18n.textKintoneFields,
            kintoneFields: [{
                title: i18n.textField,
                require: '*',
                row: '',
                id: 'textField',
                fields: fields['textField']
            }, {
                title: i18n.countField,
                require: '*',
                row: '',
                id: 'countField',
                fields: fields['countField']
            }],
            // section4 buttons
            pluginSubmit: i18n.submitBtn,
            pluginCancel: i18n.cancelBtn
        };
        // render HTML
        $('#plugin-container').html(template(templateItems));
    }

    // render HTML
    var renderHtml = function() {
        kintone.api(kintone.api.url('/k/v1/preview/app/form/fields', true), 'GET', {
            'app': kintone.app.getId()
        }, function(resp) {
            var fields = {
                'textField': [],
                'countField': [],
            };
            for (var key in resp.properties) {
                var field = resp.properties[key];
                var item = {
                    label: field.label || field.code,
                    code: field.code,
                    type: field.type
                };
                switch (field.type) {
                    case 'MULTI_LINE_TEXT':
                        fields['textField'].push(item);
                        break;
                    case 'NUMBER':
                        fields['countField'].push(item);
                        break;
                    default:
                        break;
                }
            }
            Object.keys(fields).forEach(function(f) {
                fields[f].sort(function(a, b) {
                    var aa = a.label || a.code;
                    var bb = b.label || b.code;
                    aa = aa.toUpperCase();
                    bb = bb.toUpperCase();
                    if (aa < bb) {
                        return -1;
                    } else if (aa > bb) {
                        return 1;
                    }
                    return 0;
                });
            });
            createHtml(fields);
            // set existing values
            var config = kintone.plugin.app.getConfig(PLUGIN_ID);
            if (config) {
                $('#activation').prop('checked', config.activation === 'active');
                $('#textField').val(config.textFieldCode);
                $('#countField').val(config.countFieldCode);
            }
            // append events
            appendEvents(fields);
        });
    };

    // initiated
    $(document).ready(function() {
        renderHtml();
    });
})(jQuery, kintone.$PLUGIN_ID);
