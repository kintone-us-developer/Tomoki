jQuery.noConflict();

(function($, PLUGIN_ID){
    "use strict"
    var terms = {
        'en': {
            configTitle: 'Settings',
            dateField: 'Date Input Field',
            dayField: 'Day Output Field',
            kintoneFieldConfig: 'Kintone field settings for the Day of the Week plugin',
            pluginActivation: 'Plug-in activation',
            pluginActive: 'Active',
            plugin_submit: '     Save   ',
            plugin_cancel: '     Cancel   ',
            textKintoneFields: 'Please create the following fields in your app form.'
        }
    }

    var lang = kintone.getLoginUser().language;
    var i18n = (lang in terms) ? terms[lang] : terms['en'];

    // append events
    var appendEvents = function appendEvents() {
        // save plug-in settings
        $('#submit').click(function() {
            var config = {};
            config.activation = $('#activation').prop('checked') ? 'active' : 'deactive';
            config.dateField = $('#dateField').val();
            config.dayField = $('#dayField').val();
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
                title: i18n.dateField,
                require: '*',
                row: '',
                id: 'dateField',
                fields: fields['dateField']
            }, {
                title: i18n.dayField,
                require: '*',
                row: '',
                id: 'dayField',
                fields: fields['dayField']
            }],
            // section4 buttons
            pluginSubmit: i18n.plugin_submit,
            pluginCancel: i18n.plugin_cancel
        };
        // render HTML
        $('#plugin-container').html(template(templateItems));
    };

    // render HTML
    var renderHtml = function() {
        kintone.api(kintone.api.url('/k/v1/preview/app/form/fields', true), 'GET', {
            'app': kintone.app.getId()
        }, function(resp) {
            var fields = {
                'dateField': [],
                'dayField': [],
            };
            for (var key in resp.properties) {
                var field = resp.properties[key];
                var item = {
                    label: field.label || field.code,
                    code: field.code,
                    type: field.type
                };
                switch (field.type) {
                    case 'DATE':
                        fields['dateField'].push(item);
                        break;
                    case 'SINGLE_LINE_TEXT':
                        fields['dayField'].push(item);
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
                $('#dateField').val(config.dateField);
                $('#dayField').val(config.dayField);
            }
            // append events
            appendEvents();
        });
    };

    // initiated
    $(document).ready(function() {
        renderHtml();
    });
})(jQuery, kintone.$PLUGIN_ID);