require ['jquery'], (jQuery) ->  
  jQuery.fn.serializeObject = ->
    arrayData = $(@).find(":input").serializeArray()
    objectData = {}
    $.each arrayData, ->
      if @value?
        value = @value
      else
        value = ''
      if objectData[@name]?
        unless objectData[@name].push
          objectData[@name] = [objectData[@name]]
        objectData[@name].push value
      else
          objectData[@name] = value
    return objectData
