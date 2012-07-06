class Events
  constructor:(@eventListeners = {}) ->
  handle: (event, func) -> 
    (@eventListeners[event] ?= []).push {f: func, scope: @}
  handleOnce: (event,func) -> 
    newFunc = (data) ->
      func(data)
      @eventListeners.remove[event]
  emit: (event,data) -> 
    for func in @eventListeners[event]||[]
      func.f.call(func.scope,data)
this.Events = Events
