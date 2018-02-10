var app = require('../../server/server.js');

module.exports = function (RED) {
  function loopback_events(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    // this.on('input', function (msg) {
    var model_name = config.model;
    if (model_name != undefined) {
      var model = app.models[model_name];

      model.on('set', function (object) {
        node.send([object , null]);
      });
    }
    else{
      var error = "Model name is required for set event on that model";
      node.send([null , error]);
    }
    // });
  }
  RED.nodes.registerType("lb_event_trigger", loopback_events);
}
