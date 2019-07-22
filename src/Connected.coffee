Element = require('spark-starter').Element
SignalOperation = require('./SignalOperation')
CollectionPropertyWatcher = require('spark-starter').Invalidated.CollectionPropertyWatcher

module.exports = class Connected extends Element
  @properties
    signals:
      collection: true
    inputs:
      collection: true
    outputs:
      collection: true
    forwardedSignals :
      collection: true


  canConnectTo: (target) ->
    typeof target.addSignal == "function"
  acceptSignal: (signal) ->
    true
  onAddConnection: (conn)->
  onRemoveConnection: (conn)->
  onNewSignalType: (signal) ->
  onAddSignal: (signal, op) ->
  onRemoveSignal: (signal, op) ->
  onRemoveSignalType: (signal, op) ->
  onReplaceSignal: (oldSignal, newSignal, op) ->

  containsSignal: (signal, checkLast = false, checkOrigin)->
    @signals.find (c)->
      c.match(signal, checkLast, checkOrigin)
  addSignal: (signal, op) ->
    unless op?.findLimiter(this)
      unless op
        op = new SignalOperation()
        autoStart = true
      op.addOperation =>
        if !@containsSignal(signal, true) and @acceptSignal(signal)
          similar = @containsSignal(signal)
          @signals.push(signal)
          @onAddSignal(signal, op)
          unless similar
            @onNewSignalType(signal, op)
      if autoStart
        op.start()
    signal
  removeSignal: (signal, op) ->
    unless op?.findLimiter(this)
      unless op
        op = new SignalOperation
        autoStart = true
      op.addOperation =>
        if (existing = @containsSignal(signal, true)) and @acceptSignal(signal)
          @signals.splice(@signals.indexOf(existing), 1)
          @onRemoveSignal(signal, op)
          op.addOperation =>
              similar = @containsSignal(signal)
              if similar
                @onReplaceSignal(signal, similar, op)
              else
                @onRemoveSignalType(signal, op)
            , 0
        if stepByStep
          op.step()
      if autoStart
        return op.start()
  prepForwardedSignal: (signal) ->
    if signal.last == this then signal else signal.withLast(this)
  checkForwardWatcher: ()->
    unless @forwardWatcher
      @forwardWatcher = new CollectionPropertyWatcher({
        scope: this
        property: 'outputs'
        onAdded: (output,i)->
          @forwardedSignals.forEach (signal)=>
            @forwardSignalTo(signal,output)
        onRemoved: (output,i)->
          @forwardedSignals.forEach (signal)=>
            @stopForwardedSignalTo(signal,output)
      })
      @forwardWatcher.bind()
  forwardSignal: (signal, op) ->
    @forwardedSignals.add(signal)
    next = @prepForwardedSignal(signal)
    @outputs.forEach (conn)->
      if signal.last != conn
        conn.addSignal(next, op)
    @checkForwardWatcher()
  forwardAllSignalsTo: (conn, op) ->
    @signals.forEach (signal)=>
      next = @prepForwardedSignal(signal)
      conn.addSignal(next, op)
  stopForwardedSignal: (signal, op) ->
    @forwardedSignals.remove(signal)
    next = @prepForwardedSignal(signal)
    @outputs.forEach (conn)->
      if signal.last != conn
        conn.removeSignal(next, op)
  stopAllForwardedSignalTo: (conn, op) ->
    @signals.forEach (signal)=>
      next = @prepForwardedSignal(signal)
      conn.removeSignal(next, op)
  forwardSignalTo: (signal, conn, op) ->
    next = @prepForwardedSignal(signal)
    if signal.last != conn
      conn.addSignal(next, op)
  stopForwardedSignalTo: (signal, conn, op) ->
    next = @prepForwardedSignal(signal)
    if signal.last != conn
      conn.removeSignal(next, op)