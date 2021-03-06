'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var RED = require('node-red');
var app = module.exports = loopback();

app.start = function() {
    // start the web server
    var server = app.listen(function() {
        app.emit('started', server);
        var baseUrl = app.get('url').replace(/\/$/, '');
        console.log('Web server listening at: %s', baseUrl);
        if (app.get('loopback-component-explorer')) {
            var explorerPath = app.get('loopback-component-explorer').mountPath;
            console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
        }
    });
    return server;
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
    if (err) throw err;

    // start the server if `$ node server.js`
    if (require.main === module) {
        var server = app.start();

        // Create the settings object - see default settings.js file for other options
        var settings = {
            // By default, the Node-RED UI is available at http://localhost:1880/
            // The following property can be used to specifiy a different root path.
            // If set to false, this is disabled.
            httpAdminRoot: "/red",
            // Some nodes, such as HTTP In, can be used to listen for incoming http requests.
            // By default, these are served relative to '/'. The following property
            // can be used to specifiy a different root path. If set to false, this is
            // disabled.
            httpNodeRoot: "/api",
            // By default, all user data is stored in the Node-RED install directory. To
            // use a different location, the following property can be used
            userDir: "nodedir/",
            // Node-RED scans the `nodes` directory in the install directory to find nodes.
            // The following property can be used to specify an additional directory to scan.
            nodesDir: '/nodedir/nodes/',
            // Anything in this hash is globally available to all functions.
            // It is accessed as context.global.
            // eg:
            //    functionGlobalContext: { os:require('os') }
            // can be accessed in a function block as:
            //    context.global.os
            functionGlobalContext: {
                fs: require('fs'),
                moment: require('moment'),
                loopback: app
            }
        };

        // Initialise the runtime with a server and settings
        RED.init(server, settings);

        // Serve the editor UI from /red
        app.use(settings.httpAdminRoot, RED.httpAdmin);

        // Serve the http nodes UI from /api
        app.use(settings.httpNodeRoot, RED.httpNode);

        // Start the runtime
        RED.start();
    }
});