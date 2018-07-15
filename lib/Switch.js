(function(definition){var Switch=definition(typeof Parallelio!=="undefined"?Parallelio:this.Parallelio);Switch.definition=definition;if(typeof module!=="undefined"&&module!==null){module.exports=Switch;}else{if(typeof Parallelio!=="undefined"&&Parallelio!==null){Parallelio.Switch=Switch;}else{if(this.Parallelio==null){this.Parallelio={};}this.Parallelio.Switch=Switch;}}})(function(dependencies){if(dependencies==null){dependencies={};}
var Connected = dependencies.hasOwnProperty("Connected") ? dependencies.Connected : require('Connected');
var Switch, extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;
Switch = (function(superClass) {
  extend(Switch, superClass);

  function Switch() {
    return Switch.__super__.constructor.apply(this, arguments);
  }

  return Switch;

})(Connected);

return(Switch);});