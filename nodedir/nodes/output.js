module.exports = function (RED) {
  function output_console(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    this.on('input', function (msg) {
        var data = config.data;

        if (data){
            this.send(data);
        }
        else if (msg != null){
            this.send(msg);
        }
        else{
            var error = "No data for output";
            this.send(error);
        }
    });
  }
  RED.nodes.registerType("output_console", output_console);
}
