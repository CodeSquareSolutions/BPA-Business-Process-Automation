var ejs = require('ejs');
var forEach = require('async-foreach').forEach;
var model_schema = new Array();
var json_files = new Array();
var mkdirp = require('mkdirp');

var fs = require('fs');

const testFolder = '../../common/models/';
var list_templates = new Array();
var lb_relation = new Array();


mkdirp.sync('./templates', function(error) {
    if (error) callback(new Error('setting/templates directory not created successfully' + error))
    else console.log("Generating setting/templates directory!");
});
fs.readdir(testFolder, (err, files) => {

    files.forEach(function(file) {
        if (file.split('.').pop() == 'json')
            json_files.push(file);
    });

    function ejsTemplateReadWrite() {
        //listing templates...
        fs.readdir('./template', (err, template) => {
            forEach(template, function(template) {
                list_templates.push(fs.readFileSync('./template/' + template, 'utf-8'));
            }, function() {
                for (var i = 0; i < template.length; i++) {
                    list_templates.push(fs.readFileSync('./template/' + template[i], 'utf-8'));
                    renderer = ejs.render(list_templates[i], {
                        model_schema: model_schema,
                        lb_relation: lb_relation
                    });
                    switch (template[i]) {
                        case 'html_temp.ejs':
                            fs.writeFileSync('./templates/index.html', renderer, 'utf-8');
                            break;
                        case 'modal_svg_template.ejs':
                            fs.writeFileSync('./scripts/modals-svg.js', renderer, 'utf-8');
                            break;
                        case 'index_js_template.ejs':
                            fs.writeFileSync('./scripts/index.js', renderer, 'utf-8');
                            break;
                    }
                } //end of for loop...
            });
        });
    }

    function findRelation() {
        var relation_name;
        forEach(model_schema, function(model_schema) {
            if (Object.keys(model_schema.relations).length > 0) {
                relation_name = Object.keys(model_schema.relations);
                for (var i = 0; i < relation_name.length; i++) {
                    lb_relation.push({
                        "name": model_schema.name,
                        "relation_name": relation_name[i],
                        "relations": model_schema.relations[relation_name[i]]
                    });
                }
            }
        }, ejsTemplateReadWrite);
    }
    forEach(json_files, function(item, index, arr) {
        model_schema.push(require('../../common/models/' + item));
    }, findRelation);
});