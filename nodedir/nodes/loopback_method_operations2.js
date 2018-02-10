var loopback = require('loopback');
var app = require('../../server/server.js');
// var es = require('event-stream');
// var EventSource = require('eventsource');


module.exports = function (RED) {
  function method_operations2(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    this.on('input', function (msg) {
      var model_name = config.model;
      var verb = config.verb;

      if (!model_name || !verb ) {
        error  = "Model name and verb are not optional.";
        node.send([null, error]);

      } else {
        //get model 
        var model = app.models[model_name];
        if (verb == "find") {
          model.find(function (err, obj) {
            if (err) node.send([null, err]);
            node.send([obj, null]);
          })
        }
        //end of find...
        else if (verb == "create") {
          var data_post = msg.data;

          if (!data_post) {
            var error = "Data for post request is required for preceeding";
            node.send([null, error]);
          } else {
            model.create(data_post, function (err, obj) {
              if (err) node.send([null, err]);
              node.send([obj, null]);              
            })
          }
        }

        else if (verb == "findById" || verb == "deleteById" || verb == "updateById") {
          var object_id = config.object_id;
          var data_post = msg.data;

          if (object_id == undefined) {
            var error = "Object Id is required for preceeding with these methods";
            node.send([null, error]);
          } else {

            if (verb == "findById") {
              model.findById(object_id, function (err, obj) {
                if (err) node.send([null, err]);
                node.send([obj, null]);                
              })
            }
            //end of findById...

            if (verb == "deleteById") {
              model.deleteById(object_id, function (err, obj) {
                if (err) node.send([null, err]);
                node.send([obj, null]);                
              })
            }
            //end of deleteById...
            if (data_post) {
              if (verb == "updateById") {
                model.replaceById(object_id, data_post, function (err, obj) {
                  if (err) node.send([null, err]);
                  node.send([obj, null]);                  
                })
              }
            }
            else{
              var error = "data is required for updateById method";
              node.send([null, err]);
            }
            //end of updateById...
          }
        }
        //end of id verbs...
        else{
          var error = "Method name not exist";
          node.send([null, error]);
        }
      }
      //end of else...
    });

  }
  RED.nodes.registerType("lb_method_operation2", method_operations2);
}
