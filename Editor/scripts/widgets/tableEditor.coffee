define ['jquery','persistance','handsontable','jquerycontextmenu','jqueryposition','jqueryautoresize'] ,($,persistance) -> 
  template = (refname) ->
    "<form >
       <input type='hidden' name='type' value='application/json' />
       <input type='text' readonly='readonly' name='key' value='#{refname}' />
       <a class='close' href='#'>[x]</a>
       <input type='hidden' name='values' value='' />
       <input type='hidden' name='formulas' value='' />
       <div id='frm' class='dataTable'>
       </div>
     </form>"

  render = (target,key) ->
    rendered = template key
    $self = $($(rendered).appendTo(target))
    persistance.restore($self,key)

    data = [
      ["", "Kia", "Nissan", "Toyota", "Honda"]
      ["2008", 10, 11, 12, 13]
      ["2009", 20, 11, 14, 13]
      ["2010", 30, 15, 12, 13]
    ]

    $frm = $($self.find('#frm'))
    $formula = $self.find(':input[name=formula]');
    $frm.handsontable({
      rows: 2
      cols: 5
      minSpareCols: 2
      minSpareRows: 2
      rowHeaders: true
      colHeaders: true,
      contextMenu:true,
      onChange: (changes) -> # [[row, col, oldValue, newValue], ...]
        newdata = $frm.handsontable('getData')
        $data.val(JSON.stringify(newdata))
        persistance.persist($self)
      },data)
    $self.find('a.close').click ->
      $self.remove()
      false
    $data = $($self.find(':input[name=values]'))
    val = $data.val()
    data = JSON.parse(val) if val
    if data 
      $frm.handsontable('loadData',data)
  
  {render: render }

      
      


