// var app = require('../../server/server.js');

module.exports = function (RED) {
    function fetch_property(config) {
      RED.nodes.createNode(this, config);
      var node = this;
  
      this.on('input', function (msg) {
        var selector = config.selector;
        var obj = msg;
        
        if (typeof obj === 'object') {
            if (selector != undefined) {
                // obj = JSON.parse(obj);
                var property = obj[selector];

                node.send([property , null]);
            }
            else {
                console.log('\x1b[36m%s\x1b[0m', 'no selector defined');            
                node.send([msg , null]);
            }
          }
        else{
            console.log('\x1b[41m', 'given property on input port is not an object.');   
            var error = "given property on input port is not an object"         
            node.send([null , error]);
        }
        
  
  
      });
    }
    RED.nodes.registerType("object_property", fetch_property);
  }
  