var app = require('../../server/server.js');

module.exports = function (RED) {
  function lb_operation_hooks(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    var model = config.model;
    var hook = config.hook;
    if (model && hook){
      if(app.models[model]){
        var modelName = app.models[model];
        modelName.observe(hook, function filterProperties(ctx, next) {
          node.send([ctx  , null]);
          next();
        });
        
      }else{
        var error = model + "model name is not valid => check case of model name or */models/model directory";
        node.send([null  , error]);
      }
    }else{
      var error =  "valid model name and operation hook is required";
      node.send([null  , error]);      
    }
  }
  RED.nodes.registerType("lb_operation_hooks", lb_operation_hooks);
}