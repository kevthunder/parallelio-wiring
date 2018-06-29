Element = require('spark-starter').Element

class SignalOperation extends Element
  constructor: () ->
    super()
    @queue = []
    @limiters = []
  addOperation: (funct, priority = 1) ->
    if priority
      @queue.unshift funct
    else
      @queue.push funct
  addLimiter: (connected) ->
    if !@findLimiter(connected)
      @limiters.push connected
  findLimiter: (connected) ->
    @limiters.indexOf(connected) > -1
  start: () ->
    while @queue.length
      @step()
  step: () ->
    if @queue.length == 0
      @done()
    else
      funct = @queue.shift(funct)
      funct(this)
  done: () ->
    