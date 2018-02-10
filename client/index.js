var ejs = require('ejs');
var app = require('../server/server.js');
var inquirer = require('inquirer');
var inquirer = require('inquirer');
var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');
var async = require('async');
var fsExtra = require('fs-extra');

var lb_relation = new Array();
var templates = new Array();
var list_templates = new Array();
var model_schema = new Array();
var json_files = new Array();
var app_templates = new Array();
var app_temp_names = new Array();
var e2e_templates = new Array();
var e2e_temp_names = new Array();
var cli_templates = new Array();
var cli_temp_names = new Array();
var shared_temp_names = new Array();
var shared_templates = new Array();
var pages_temp_names = new Array();
var pages_templates = new Array();
var relationSchema;
var relation_data;

var model, template_path = './Component-Templates/';
var listing_templates = './Component-Listing-Templates/';
const lb_models = '../common/models/';
var relationSchemaPath = '../server/relation_schema.json';

//read a schema file from server side...
fs.readFile(relationSchemaPath, 'utf8', function(err, contents) {
    //now read model.json from directory ../common/models/...
    if (err) { //if relationSchema file not found or not read correctly...
        generateComponents();
    } else { //if relationSchema file found and read correctly...
        contents = JSON.parse(contents);
        relationSchema = JSON.parse(contents.schema);
        generateComponentsFromRelSchema();
    }
});

function generateComponents() {
    async.waterfall([
        deleteComponentDir,
        readModelDir,
        getModelSchema,
        createRelationSchema,
        function(schema, callback) {
            writeRelSchema(schema, callback)
        },
        readRelationSchema,
        getModelRelations,
        getRelSchemaProp,
        createCoreDirectories,
        readEjsFormTemplates,
        function(files, callback) {
            renderDataInEJSTemplates(files, callback);
        },
        readEjsListingTemplates,
        function(files, callback) {
            renderDataInListingTemplates(files, callback);
        },
        readAppTemplates,
        renderAppTemplates,
        readE2ETemplates,
        renderE2ETemplates,
        readCliTemplates,
        renderCliTemplates,
        readSharedTemplates,
        renderSharedTemplates,
        readPageTemplates,
        renderPageTemplates,
        function(callback) {
            fs.unlink('../server/relation_schema.json', (err) => {
                if (err) callback(new Error('Delete file manually if exists !' + err));
                else {
                    return callback(null, 'done');
                }
            });
        }

    ], function(err, result) {
        if (err) console.log(err)
        else console.log(result)
        return 0;
    });
}

function generateComponentsFromRelSchema() {
    async.waterfall([
        deleteComponentDir,
        readModelDir,
        getModelSchema,
        getModelRelations,
        getRelSchemaProp,
        createCoreDirectories,
        readEjsFormTemplates,
        function(files, callback) {
            renderDataInEJSTemplates(files, callback);
        },
        readEjsListingTemplates,
        function(files, callback) {
            renderDataInListingTemplates(files, callback);
        },
        readAppTemplates,
        renderAppTemplates,
        readE2ETemplates,
        renderE2ETemplates,
        readCliTemplates,
        renderCliTemplates,
        readSharedTemplates,
        renderSharedTemplates,
        readPageTemplates,
        renderPageTemplates
    ], function(err, result) {
        if (err) console.log(err)
    });
}

//get common/models/*.json and pushed in array => json
function readModelDir(callback) {
    fs.readdir(lb_models, (err, files) => {
        if (err) callback(new Error('common/models/*.json directory can not read successfully!'))
        files.forEach(function(file) {
            if (file.split('.').pop() == 'json')
                json_files.push(file);
        });
        callback();
    });
}

//get properties from relation schema and push these properties in model schema isntead of model properties...
function getRelSchemaProp(callback) {
    async.forEachOf(model_schema, function(model, key1, cb1) {
            async.forEachOf(relationSchema, function(relModel, key2, cb2) {
                    if (model.name.toLowerCase() == relModel.modelName) {
                        model_schema[key1].properties = {};
                        async.forEachOf(relationSchema[key2].properties, function(prop, key3, cb3) {
                            model_schema[key1].properties[prop.field] = prop;
                            cb3();
                        }, function(err) {
                            if (err) throw err;
                            else cb2();
                        });
                    } else cb2();
                },
                function(err) {
                    if (err) throw err;
                    else cb1();
                });
        },
        function(err) {
            if (err) throw err;
            callback();
        });
}

//read model.json files from common/models and pushed the Json data in array => model_schema
function getModelSchema(callback) {
    for (var i = 0; i < json_files.length; i++) {
        model_schema.push(require('../common/models/' + json_files[i]));
    }
    callback();
}

//find relations b/w models and pushed relations in array => lb_relation
function getModelRelations(callback) {
    var relation_name;
    for (var count = 0; count < model_schema.length; count++) {
        if (Object.keys(model_schema[count].relations).length > 0) {
            relation_name = Object.keys(model_schema[count].relations);
            for (var i = 0; i < relation_name.length; i++) {
                lb_relation.push({
                    "name": model_schema[count].name,
                    "relation_name": relation_name[i],
                    "relations": model_schema[count].relations[relation_name[i]]
                });
            }
        }
    }
    callback();
}

//create directories for angular app => (core directories required for angular app)
function createCoreDirectories(callback) {
    mkdirp.sync('./ng2app/e2e', function(err) {
        if (err) callback(new Error('ng2app/e2e directory not created successfully' + err))
        else console.log("Generating */ng2app/e2e directory!");
    });
    mkdirp.sync('./ng2app/src/assets', function(err) {
        if (err) callback(new Error('ng2app/src/assets directory not created successfully' + err))
        else console.log("Generating */ng2app/src/assets directory!");
    });
    mkdirp.sync('./ng2app/src/environments', function(err) {
        if (err) callback(new Error('ng2app/src/assets directory not created successfully' + err))
        else console.log("Generating */ng2app/src/environments directory!");
    });
    mkdirp.sync('ng2app/src/app', function(err) {
        if (err) callback(new Error('Error in creating app directory'))
        else console.log("Generating */ng2app/src/app directory!");
    });
    mkdirp.sync('ng2app/src/app/myComponents/login', function(err) {
        if (err) callback(new Error('Error in creating app directory'))
        else console.log("Generating */ng2app/src/app/myComponents/login directory!");
    });
    mkdirp.sync('ng2app/src/app/myComponents/signup', function(err) {
        if (err) callback(new Error('Error in creating app directory'))
        else console.log("Generating */ng2app/src/app/myComponents/signup directory!");
    });
    mkdirp.sync('ng2app/src/app/sharedLayout', function(err) {
        if (err) callback(new Error('Error in creating app directory'))
        else console.log("Generating */ng2app/src/app/myComponents/signup directory!");
    });
    callback();
}

//read ejs templatesand push these templates in array => templates
function readEjsFormTemplates(callback) {
    fs.readdir(template_path, (err, files) => {
        if (err) callback(new Error('Error in reading form components directory'))
        for (var i = 0; i < files.length; i++) {
            templates.push(fs.readFileSync(template_path + files[i], 'utf-8'));
        }
        callback(null, files);
    })
}

//render model.json data in ejs templates and generate forms and relations
function renderDataInEJSTemplates(files, callback) {
    for (var count = 0; count < model_schema.length; count++) {
        model = model_schema[count];
        for (var k = 0; k < relationSchema.length; k++) {
            if ((relationSchema[k].modelName == model.name.toLowerCase()) && relationSchema[k].operations.createOperation == true) {
                model.name = model.name.charAt(0).toUpperCase() + model.name.slice(1);

                var dir = path.join('./ng2app/src/app/myComponents/' + model.name + 'Component');

                mkdirp.sync(dir, function(err) {
                    if (err) callback(new Error('Error in creating form components directory'))
                    else console.log("Generating " + dir + " directory!");
                }); //end of mkdirp...
                for (var i = 0; i < files.length; i++) {
                    html = ejs.render(templates[i], {
                        model: model,
                        lb_relation: lb_relation,
                        relation_schema: relationSchema,
                        model_schema: model_schema
                    });

                    switch (files[i]) {
                        case 'css-template.ejs':
                            fs.writeFileSync(dir + '/' + model.name + '.component.css', html, 'utf-8')
                            console.log("Generating " + dir + '/' + model.name + ".component.css file!");
                            break;

                        case 'simple-html.ejs':
                            fs.writeFileSync(dir + '/' + model.name + '.component.html', html, 'utf-8')
                            console.log("Generating " + dir + '/' + model.name + ".component.html file!");
                            break;

                        case 'spec.ts-template.ejs':
                            fs.writeFileSync(dir + '/' + model.name + '.component.spec.ts', html, 'utf-8')
                            console.log("Generating " + dir + '/' + model.name + ".component.spec.ts file!");
                            break;

                        case 'ts-template.ejs':
                            fs.writeFileSync(dir + '/' + model.name + '.component.ts', html, 'utf-8')
                            console.log("Generating " + dir + '/' + model.name + ".component.ts file!");
                            break;
                    } //end of switch...
                } //end of for loop...
            } //end of if statement in relation_schema loop
        } //end of for-loop for relation_schema
    } //end of for loop => model_schema.length
    callback();
}

//reading listing templates from directory for display,edit and delete operations on model
function readEjsListingTemplates(callback) {
    fs.readdir(listing_templates, (err, files) => {
        if (err) callback(new Error('Error in reading listing components directory'))
        for (var i = 0; i < files.length; i++) {
            list_templates.push(fs.readFileSync(listing_templates + files[i], 'utf-8'));
        }
        callback(null, files)
    });
}

//render model.json data in listing ejs templates
function renderDataInListingTemplates(files, callback) {
    for (var count = 0; count < model_schema.length; count++) {
        model = model_schema[count];
        for (var k = 0; k < relationSchema.length; k++) {
            if ((relationSchema[k].modelName == model.name.toLowerCase()) && relationSchema[k].operations.readOperation == true) {
                model.name = model.name.charAt(0).toUpperCase() + model.name.slice(1);
                var listingDir = path.join('./ng2app/src/app/myComponents/' + model.name + 'ListingComponent');

                mkdirp.sync(listingDir, function(err) {
                    if (err) callback(new Error('Error in creating listing components directory'));
                    else console.log("Generating " + listingDir + " directory!");
                }); //end of mkdirp...

                for (var i = 0; i < files.length; i++) {
                    html = ejs.render(list_templates[i], {
                        model: model,
                        lb_relation: lb_relation,
                        relation_schema: relationSchema,
                        model_schema: model_schema
                    });

                    switch (files[i]) {
                        case 'css-listing-template.ejs':
                            fs.writeFileSync(listingDir + '/' + model.name + '.listing.component.css', html, 'utf-8')
                            console.log("Generating " + listingDir + '/' + model.name + ".component.css file!");
                            break;

                        case 'simple-listing-html.ejs':
                            fs.writeFileSync(listingDir + '/' + model.name + '.listing.component.html', html, 'utf-8')
                            console.log("Generating " + listingDir + '/' + model.name + ".component.html file!");
                            break;

                        case 'spec.ts-listing-template.ejs':
                            fs.writeFileSync(listingDir + '/' + model.name + '.listing.component.spec.ts', html, 'utf-8')
                            console.log("Generating " + listingDir + '/' + model.name + ".component.spec.ts file!");
                            break;

                        case 'ts-listing-template.ejs':
                            fs.writeFileSync(listingDir + '/' + model.name + '.listing.component.ts', html, 'utf-8')
                            console.log("Generating " + listingDir + '/' + model.name + ".component.ts file!");
                            break;
                    } //end of switch...
                } //end of for loop...
            } //end of for loop...
        }
    }
    callback();
}

//read app-template folder => angular core files and appComponent
function readAppTemplates(callback) {
    fs.readdir('./app-Templates', (err, files) => {
        if (err) callback(new Error('Error in reading appTemplates directory'));
        files.forEach(function(file) {
            app_temp_names.push(file);
            app_templates.push(fs.readFileSync('./app-Templates/' + file, 'utf-8'));
        });
        callback();
    });
}
//populate data in app templates...
function renderAppTemplates(callback) {
    for (var count = 0; count < app_templates.length; count++) {
        html = ejs.render(app_templates[count], {
            model_schema: model_schema,
            relation_schema: relationSchema,
            lb_relation: lb_relation
        });
        switch (app_temp_names[count]) {
            case 'app_html_template.ejs':
                fs.writeFileSync('./ng2app/src/app/app.component.html', html, 'utf-8')
                console.log("Generating */ng2app/src/app/app.component.html file!");
                break;

            case 'app_module_template.ejs':
                fs.writeFileSync('./ng2app/src/app/app.module.ts', html, 'utf-8')
                console.log("Generating */ng2app/src/app/app.module.ts file!");
                break;

            case 'app_spec_template.ejs':
                fs.writeFileSync('./ng2app/src/app/app.component.spec.ts', html, 'utf-8')
                console.log("Generating */ng2app/src/app/app.component.spec.ts file!");
                break;

            case 'app_ts_template.ejs':
                fs.writeFileSync('./ng2app/src/app/app.component.ts', html, 'utf-8')
                console.log("Generating */ng2app/src/app/app.component.ts file!");
                break;

            case 'routing_template.ejs':
                fs.writeFileSync('./ng2app/src/app/app.routing.ts', html, 'utf-8')
                console.log("Generating */ng2app/src/app/app.routing.ts file!");
                break;
            case 'app_html_template.ejs':
                fs.writeFileSync('./ng2app/src/app/app.component.html', html, 'utf-8')
                console.log("Generating */ng2app/src/app/app.component.html file!");
                break;

            case 'index.html-template.ejs':
                fs.writeFileSync('./ng2app/src/index.html', html, 'utf-8')
                console.log("Generating *./ng2app/src/index.html file!");
                break;

            case 'main.ts-template.ejs':
                fs.writeFileSync('./ng2app/src/main.ts', html, 'utf-8')
                console.log("Generating */ng2app/src/main.ts file!");
                break;

            case 'polyfills.ts-template.ejs':
                fs.writeFileSync('./ng2app/src/polyfills.ts', html, 'utf-8')
                console.log("Generating */ng2app/src/polyfills.ts file!");
                break;

            case 'styles.css-template.ejs':
                fs.writeFileSync('./ng2app/src/styles.css', html, 'utf-8')
                console.log("Generating */ng2app/src/styles.css file!");
                break;

            case 'test.ts-template.ejs':
                fs.writeFileSync('./ng2app/src/test.ts', html, 'utf-8')
                console.log("Generating /ng2app/src/test.ts file!");
                break;

            case 'tsconfig.app.json-template.ejs':
                fs.writeFileSync('./ng2app/src/tsconfig.app.json', html, 'utf-8')
                console.log("Generating */ng2app/src/tsconfig.app.json file!");
                break;

            case 'tsconfig.spec.json-template.ejs':
                fs.writeFileSync('./ng2app/src/tsconfig.spec.json', html, 'utf-8')
                console.log("Generating */ng2app/src/tsconfig.spec.json file!");
                break;

            case 'typings.d.ts-template.ejs':
                fs.writeFileSync('./ng2app/src/typings.d.ts', html, 'utf-8')
                console.log("Generating */ng2app/src/typings.d.ts file!");
                break;
            case 'full-layout.component.html.ejs':
                fs.writeFileSync('./ng2app/src/app/full-layout.component.html', html, 'utf-8')
                console.log("Generating */ng2app/src/app/full-layout.component.html file!");
                break;

            case 'full-layout.component.ts.ejs':
                fs.writeFileSync('./ng2app/src/app/full-layout.component.ts', html, 'utf-8')
                console.log("Generating */ng2app/src/app/full-layout.component.ts file!");
                break;
        } //end of switch...
    } // end of for...
    callback();
}

//read e2e-template folder => angular core files
function readE2ETemplates(callback) {
    fs.readdir('./e2e-Templates', (err, files) => {
        if (err) callback(new Error('e2eTemplate directory not read successfully'));
        files.forEach(function(file) {
            e2e_temp_names.push(file);
            e2e_templates.push(fs.readFileSync('./e2e-Templates/' + file, 'utf-8'));
        });
        callback();
    });
}

//function render e2e templates with data
function renderE2ETemplates(callback) {
    for (var count1 = 0; count1 < e2e_templates.length; count1++) {
        html = ejs.render(e2e_templates[count1], {
            model_schema: model_schema
        });
        switch (e2e_temp_names[count1]) {
            case 'app.e2e-spec.ts-template.ejs':
                fs.writeFileSync('./ng2app/e2e/app.e2e-spec.ts', html, 'utf-8')
                console.log("Generating */ng2app/e2e/app.e2e-spec.ts file!");
                break;

            case 'app.po.ts-template.ejs':
                fs.writeFileSync('./ng2app/e2e/app.po.ts', html, 'utf-8')
                console.log("Generating */ng2app/e2e/app.po.ts file!");
                break;

            case 'tsconfig.e2e.json-template.ejs':
                fs.writeFileSync('./ng2app/e2e/tsconfig.e2e.json', html, 'utf-8')
                console.log("Generating */ng2app/e2e/tsconfig.e2e.json file!");
                break;

        } //end of switch...
    } // end of for...
    callback();
}

//read cli-template folder => angular core files
function readCliTemplates(callback) {
    fs.readdir('./cli-Templates', (err, files) => {
        if (err) callback(new Error('cli-Templates directory not read successfully'));
        files.forEach(function(file) {
            cli_temp_names.push(file);
            cli_templates.push(fs.readFileSync('./cli-Templates/' + file, 'utf-8'));
        });
        callback();
    });
}

//populate data in cli-templates => angular core files
function renderCliTemplates(callback) {
    for (var count = 0; count < cli_templates.length; count++) {
        html = ejs.render(cli_templates[count], {
            model_schema: model_schema
        });
        switch (cli_temp_names[count]) {
            case '.editorconfig-template.ejs':
                fs.writeFileSync('./ng2app/.editorconfig', html, 'utf-8');
                console.log("Generating */ng2app/.editorconfig file!");
                break;

            case '.gitignore-template.ejs':
                fs.writeFileSync('./ng2app/.gitignore', html, 'utf-8');
                console.log("Generating */ng2app/.gitignore file!");
                break;

            case 'angular-cli.json-template.ejs':
                fs.writeFileSync('./ng2app/angular-cli.json', html, 'utf-8');
                console.log("Generating */ng2app/angular-cli.json file!");
                break;

            case 'karma.conf.js-template.ejs':
                fs.writeFileSync('./ng2app/karma.conf.js', html, 'utf-8');
                console.log("Generating */ng2app/karma.conf.js file!");
                break;

            case 'package.json-template.ejs':
                fs.writeFileSync('./ng2app/package.json', html, 'utf-8');
                console.log("Generating */ng2app/package.json file!");
                break;

            case 'protractor.conf.js-template.ejs':
                fs.writeFileSync('./ng2app/protractor.conf.js', html, 'utf-8');
                console.log("Generating */ng2app/protractor.conf.js file!");
                break;

            case 'readme.md-template.ejs':
                fs.writeFileSync('./ng2app/README1.md', html, 'utf-8');
                console.log("Generating */ng2app/README1.md file!");
                break;

            case 'tsconfig.json-template.ejs':
                fs.writeFileSync('./ng2app/tsconfig.json', html, 'utf-8');
                console.log("Generating */ng2app/tsconfig.json file!");
                break;

            case 'tslint.json-template.ejs':
                fs.writeFileSync('./ng2app/tslint.json', html, 'utf-8');
                console.log("Generating */ng2app/tslint.json file!");
                break;

            case 'environment.prod.ts-template.ejs':
                fs.writeFileSync('./ng2app/src/environments/environment.prod.ts', html, 'utf-8');
                console.log("Generating */ng2app/src/environments/environment.prod.ts file!");
                break;

            case 'environment.ts-template.ejs':
                fs.writeFileSync('./ng2app/src/environments/environment.ts', html, 'utf-8');
                console.log("Generating */ng2app/src/environments/environment.ts file!");
                break;
        } //end of switch...
    } // end of for...
    callback();
}

//creating relation schema => if relation schema is not already created
function createRelationSchema(callback) {
    var schema = new Array();
    relSchema = { schema: [] }
    for (var i = 0; i < model_schema.length; i++) {
        //push main model object inside relationSchema array...
        relSchema.schema.push({
            "modelName": model_schema[i].name.toLowerCase(),
            "properties": [],
            "operations": {
                "createOperation": true,
                "readOperation": true,
                "updateOperation": true,
                "deleateOperation": true
            },
            "relations": [],
            "ACL": []
        });

        for (var property in model_schema[i].properties) {
            var propertyObj = {
                'field': property,
                'type': model_schema[i].properties[property].type,
                'required': false
            };
            if (model_schema[i].properties[property].required == true) propertyObj.required = true;
            else propertyObj.required = true;
            relSchema.schema[i].properties.push(propertyObj);
        }
    }
    callback(null, relSchema);
}

//write relation_schema file on server side...
function writeRelSchema(schema, callback) {
    fs.writeFile('../server/relation_schema.json', JSON.stringify(schema), 'utf-8', function(err) {
        if (err) { callback(new Error("relation_schema file cant generated [Error]..." + err)) };
        console.log("Relation schema created successfully!");
        callback();
    })
}

//read relation Schema...
function readRelationSchema(callback) {
    fs.readFile(relationSchemaPath, 'utf8', function(err, contents) {
        if (err) { //if relationSchema file not found or not read correctly...
            callback(new Error("Error in reading relation schema" + err))
        } else { //if relationSchema file found and read correctly...
            console.log("Relation schema readed successfully!");
            contents = JSON.parse(contents);
            relationSchema = contents.schema;
            callback();
        }
    });
}

//delete component directory
function deleteComponentDir(callback) {
    fsExtra.remove('./ng2app/src/app/myComponents', function(err, res) {
        if (err) console.log("Component folder not exist" + err);
        else console.log("Component folder removed successfully!");
        callback();
    })
}
//read shared templates
function readSharedTemplates(callback) {
    fs.readdir('./shared-Templates', (err, files) => {
        if (err) callback(new Error('shared-Templates directory not read successfully'));
        files.forEach(function(file) {
            shared_temp_names.push(file);
            shared_templates.push(fs.readFileSync('./shared-Templates/' + file, 'utf-8'));
        });
        callback();
    });
}

//populate data in shared-templates => layout files
function renderSharedTemplates(callback) {
    for (var count = 0; count < shared_templates.length; count++) {
        html = ejs.render(shared_templates[count], {
            model_schema: model_schema
        });
        switch (shared_temp_names[count]) {
            case 'aside.directive.ts.ejs':
                fs.writeFileSync('./ng2app/src/app/sharedLayout/aside.directive.ts', html, 'utf-8');
                console.log("Generating */ng2app/src/app/sharedLayout/aside.directive.ts file!");
                break;

            case 'breadcrumb.component.ts.ejs':
                fs.writeFileSync('./ng2app/src/app/sharedLayout/breadcrumb.component.ts', html, 'utf-8');
                console.log("Generating */ng2app/src/app/sharedLayout/breadcrumb.component.ts file!");
                break;

            case 'nav-dropdown.directive.ts.ejs':
                fs.writeFileSync('./ng2app/src/app/sharedLayout/nav-dropdown.directive.ts', html, 'utf-8');
                console.log("Generating */ng2app/src/app/layout/sharedLayout/nav-dropdown.directive.ts file!");
                break;

            case 'sidebar.directive.ts.ejs':
                fs.writeFileSync('./ng2app/src/app/sharedLayout/sidebar.directive.ts', html, 'utf-8');
                console.log("Generating */ng2app/src/app/sharedLayout/sidebar.directive.ts file!");
                break;

        } //end of switch...
    } // end of for...
    callback();
}


//read pages templates
function readPageTemplates(callback) {
    fs.readdir('./pages-Templates', (err, files) => {
        if (err) callback(new Error('pages-Templates directory not read successfully'));
        files.forEach(function(file) {
            pages_temp_names.push(file);
            pages_templates.push(fs.readFileSync('./pages-Templates/' + file, 'utf-8'));
        });
        callback();
    });
}

//populate data in pages-templates => pages files
function renderPageTemplates(callback) {
    for (var count = 0; count < pages_templates.length; count++) {
        html = ejs.render(pages_templates[count], {
            model_schema: model_schema
        });

        switch (pages_temp_names[count]) {
            case 'login-html.ejs':
                fs.writeFileSync('./ng2app/src/app/myComponents/login/login.html', html, 'utf-8');
                console.log("Generating */ng2app/src/app/myComponents/login/login.html file!");
                break;

            case 'login.ts.ejs':
                fs.writeFileSync('./ng2app/src/app/myComponents/login/login.ts', html, 'utf-8');
                console.log("Generating */ng2app/src/app/myComponents/login/login.ts file!");
                break;

            case 'signup-html.ejs':
                fs.writeFileSync('./ng2app/src/app/myComponents/signup/signup.html', html, 'utf-8');
                console.log("Generating */ng2app/src/app/myComponents/signup/signup.html file!");
                break;

            case 'signup.ts.ejs':
                fs.writeFileSync('./ng2app/src/app/myComponents/signup/signup.ts', html, 'utf-8');
                console.log("Generating */ng2app/src/app/myComponents/signup/signup.ts file!");
                break;
            case 'auth-guard.ts.ejs':
                fs.writeFileSync('./ng2app/src/app/shared/sdk/services/core/auth-guard.ts', html, 'utf-8');
                console.log("Generating *./ng2app/src/app/shared/sdk/services/core/auth-guard.ts file!");
                break;

        } //end of switch...

        if (count == pages_templates.length - 1) {
            callback();
        }
    } // end of for...
}