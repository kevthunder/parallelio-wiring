Connected = require('./Connected')
Signal = require('./Signal')
SignalOperation = require('./SignalOperation')

module.exports = class SignalSource extends Connected
  @properties
    activated:
      change: ->
        op = new SignalOperation()
        if @activated
          @forwardSignal(@signal, op)
        else
          @stopForwardedSignal(@signal, op)
        op.start()
    signal:
      calcul: -> 
        new Signal(this, 'power', true)
      

