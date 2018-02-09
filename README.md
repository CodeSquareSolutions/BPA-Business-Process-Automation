# BPA-Business-Process-Automation
Business Process Automation is application which automate your business process and reduce the cost effect of
your developer from doing basic work. This Application automaticaly generate the Angular2-4 application. 
Tool and Technologies uses in this application :

EJS 
Node.js
Express
Angular 2-4
Red-Node 
Snap-svg 
Step for setting the application are : 
Getting start with BPA
Step 1: App generation
Create loopback app with api-server or empty server. 
Step 2: Data Source & Models
Create data source and loopback models 
Step 3: Configure the server app
•	Loopback sdk: npm install --save @mean-expert/{loopback-sdk-builder,loopback-component-realtime}
•	Editing server/server.js: app.start = function() {
    // start the web server
    var server = app.listen(function() {
        app.emit('started', server);
        var baseUrl = app.get('url').replace(/\/$/, '');
        console.log('Web server listening at: %s', baseUrl);
        if (app.get('loopback-component-explorer')) {
            var explorerPath = app.get('loopback-component-explorer').mountPath;
            console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
        }
    });
    return server;
};
•	Editing server/component-config.json: {
    "loopback-component-explorer": {
        "mountPath": "/explorer"
    },
    "@mean-expert/loopback-component-realtime": {
        "debug": false,
        "auth": true
    }
}
•	SDK Builder: Edit package.json
  "scripts": {
        
        "build:sdk": "./node_modules/.bin/lb-sdk server/server ./client/ng2app/src/app/shared/sdk"
    },
•	install dependency: 
"body-parser": "^1.18.0",
"ejs": "^2.5.7",
   	"express.js": "^1.0.0",
    	"fs": "0.0.1-security",
    	"fs-extra": "^4.0.2",
	"mkdirp": "^0.5.1",
•	Putting files on server side:
extendExpressApi.js and expressApi.js.
•	Running extendExpressApi.js:
Command node extendExpressApi.js 
•	Run server now

Step 4: Client side App
•	Putting Template:
Putting templates files/folder in client/
o	App-Templates
o	E2e-Templates
o	Cli-Templates
o	Components-Templates
o	Components-Listing-Template
o	Pages-templates
o	Index.js
o	Ejs.min.js
o	Setting
♣	Package.json
♣	Scripts
♣	Styles
♣	Template
Step 5: Setting 
•	Npm install
•	Npm node setting.js:
This will generate setting application.
Step 6: Cleint App
•	Generate angular 2 app
•	Cd to ng2app and install dependencies

