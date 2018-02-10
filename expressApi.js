'use strict';

var bodyParser = require('body-parser');
var fs = require('fs');
var async = require('async');
module.exports = function(server) {
    // Install a `/` route that returns server status
    var router = server.loopback.Router();
    router.get('/', server.loopback.status());
    server.use(router);

    server.get('/retrieve_relation_schema', function(req, res) {
        fs.readFile('./server/relation_schema.json', function read(err, data) {
            if (err) {
                res.send(err);
            }
            res.send(data);
        });
    });
    server.use(bodyParser.urlencoded({ extended: true }));

    var jsonParser = bodyParser.json()
    server.post('/save_schema', jsonParser, function(req, res) {
        fs.writeFile('./server/relation_schema.json', JSON.stringify(req.body), 'utf-8', function(err) {
            if (err) res.send("relation_schema file cant generated [Error]..." + err);
            else {
                res.send("relation_schema file successfully generated...");
            }
        });

        var relationSchema = req.body.schema;
        relationSchema = JSON.parse(relationSchema);
        var json_files = new Array(),
            model_schema = new Array();
        var modelsDirectory = './common/models/';


        async.waterfall([
            function(callback) {
                fs.readdir(modelsDirectory, (err, files) => {
                    if (err) throw err;
                    else callback(null, files);
                });
            },
            function(files, callback) {
                async.forEachOf(files, function(file, key, cb) {
                    if (file.split('.').pop() == 'json') {
                        json_files.push(file);
                        cb();
                    } else {
                        cb();
                    }
                }, function(err) {
                    if (err) throw err;
                    callback();
                });
            },
            function(callback) {
                async.forEachOf(json_files, function(file, key, cb) {
                    model_schema.push(require('../../common/models/' + file));
                    cb();
                }, function(err) {
                    if (err) throw err;
                    callback();
                });
            },
            function(callback) {
                async.forEachOf(model_schema, function(model, count, cb) {
                    async.forEachOf(relationSchema, function(relModel, key, ctx) {
                        if (model.name.toLowerCase() == relModel.modelName.toLowerCase()) {
                            async.forEachOf(relModel.ACL, function(acl, key, callb) {
                                model.acls.push(acl);
                                callb();
                            }, function(err) {
                                if (err) throw err;
                                fs.writeFile(modelsDirectory + json_files[count], JSON.stringify(model, 0, 4), function(err) {
                                    if (err) throw err;
                                    else ctx();
                                });
                            });
                        } else ctx();
                    }, function(err) {
                        if (err) throw err;
                        cb();
                    });
                }, function(err) {
                    if (err) throw err;
                    callback();
                });
            }
        ], function(err, result) {
            if (err) throw err;
            else console.log("Successfully pushed ACLS");
        });
    });
}