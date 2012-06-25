define ['lscache','jquery','jqueryserializeobject'],(store,$) -> 
  
  
  persistance = []

  persistance.getValue = (key) -> 
    store.get(key)
  persistance.setValue = (key,value) -> 
    store.set(key,value)
  persistance.persist = (form,key) -> 
    data = $(form).serializeObject()
    store.set(data.key,data)
  persistance.restore = (form,key) ->
    if (!key)
      key = $(form).find(":input[name=key]").val()
    data = persistance.getValue(key)
    if data
      for name,value of data
         $(form).find("[name=#{name}]").val(value)
  
  persistance.remove = (key) ->
    store.remove(key)

  persistance