require ['lscache','jquery','jqueryserializeobject'],(store,$) -> 
  getdata = (el) -> $(el).closest('form').serializeObject()
  $.fn.persisted = -> 
    data = getdata(@)
    store.get(data.key)||data
  $.fn.persist = -> 
    data = getdata(@)
    store.set(data.key,data)