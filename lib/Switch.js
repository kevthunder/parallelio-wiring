(function(definition){var Switch=definition(typeof Parallelio!=="undefined"?Parallelio:this.Parallelio);Switch.definition=definition;if(typeof module!=="undefined"&&module!==null){module.exports=Switch;}else{if(typeof Parallelio!=="undefined"&&Parallelio!==null){Parallelio.Switch=Switch;}else{if(this.Parallelio==null){this.Parallelio={};}this.Parallelio.Switch=Switch;}}})(function(dependencies){if(dependencies==null){dependencies={};}
var Connected = dependencies.hasOwnProperty("Connected") ? dependencies.Connected : require('Connected');
var Switch;
Switch = class Switch extends Connected {};

return(Switch);});