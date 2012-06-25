define ['persistance','jquery','handsontable'], (persistance,$) ->
  
  loader = {}

  loader.modify = (asset,func) ->
    val = persistance.getValue asset
    try
      func(val)
      persistance.setValue asset,val
    catch err
      alert "Modification failed; reason: #{err}"
  loader.modifyTable = (asset,func) ->
    $changefrm = $("form :input[name=key][value=\"#{asset}\"]").closest("form")
    table = $changefrm.find(".dataTable")
    
    newfunc = (data) ->
      # build the scope for the function call
      scope = {}
      # get the original values and convert them to a number if possible
      values = JSON.parse(data.values)
      original = JSON.parse(data.values)
      for rowdata,row in values
        for celldata,col in rowdata
          val = parseFloat(celldata)
          if isNaN(val)
            val = celldata
          original[row][col] = values[row][col] = val
      # parse for all cell references by name
      matches = (""+func).match(/this.[A-Z][0-9]+(_[A-Z][0-9]+)?/g) 
      if matches
        for match in matches 
          results = []
          range = match.split(".")[1]
          [fromc,toc] = range.split("_")
          if toc
            for row in [parseInt(fromc.substr(1))..parseInt(toc.substr(1))]
              for col in [fromc.charCodeAt(0)-65..toc.charCodeAt(0)-65]
                results.push values[row-1][col]
            scope[range] = results
          else
            scope[range] = values[parseInt(fromc.substr(1))-1][fromc.charCodeAt(0)-65]
      scope.isNumeric = (n) ->
         !isNaN(parseFloat(n)) && isFinite(n)
      scope.sum = (r) -> 
        res = 0
        res+=val for val in r when scope.isNumeric(val)
        res
      scope.min = (r) ->
        res = undefined
        for val in r when scope.isNumeric(val)
          if !res || val<res 
            res = val
        res
      scope.max = (r) ->
        res = undefined
        for val in r  when scope.isNumeric(val)
          if !res || val>res 
            res = val
        res
      scope.avg = (r) ->
        res = 0
        cnt = 0
        for val in r when scope.isNumeric(val)
          res+=val 
          cnt+=1
        res/cnt
      scope.count = (r) ->
        r.length

      scope.rows = []
      for drow,r in values when r>0
        record = {}
        for val,c in drow
          record[values[0][c]] = val if values[0][c]
        scope.rows.push(record)
      scope.values = values

      scope.report = (s) ->
        $("#assets .output").remove()
        $("#assets").append ("<div class='output'></div>")
        $("#assets .output").append(s)
      func.call(scope)
      for k,v of scope when /^[A-Z][0-9]+$/.test(k)
        row = parseInt(k.substr(1))-1
        col = k.charCodeAt(0)-65
        if (original[row][col] != v)
          values[row][col] = v
      for rowdata,row in scope.rows
        for caption,value of rowdata
          index = i for c,i in original[0] when c==caption
          if (value!=original[row+1][index])
            values[row+1][index] = value

      data.values = JSON.stringify(values)
      $(table).handsontable('updateSettings', 
        legend: [
          match: (r,c,data) -> 
            original[r][c] != values[r][c]
          style:
            color: 'green'
            fontWeight: 'bold'
            border: '2px green solid'
        ])
      $(table).handsontable('loadData',values)
    loader.modify asset, newfunc
    

  this.loader = loader
  
  loader