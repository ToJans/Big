define ['jquery','persistance','CoffeeScript','loader','events','codemirrorwrapper', 'jqueryserializeobject'],($,persistance,CoffeeScript,loader,Events) ->

  template = (key) -> "
        <form class='persistable' method='post' action='#'>
          <input type='text' name='key' value='#{key}' readonly='readonly'  />
          <select name='type'>
        " + ("  <option>#{mime.mime}</option>" for mime in CodeMirror.listMIMEs()) + "
          </select>
          <input type='submit' value='Save changes'/>
          <a href='#' class='close'>[x]</a>
          <textarea class='codemirror' name='code' rows='12' cols='72'/>
          <input type='submit' value='Run' class='run' />
        </form>"
  
  render = (target,key) ->
    rendered = template key
    $self = $(rendered).appendTo(target)
    persistance.restore($self,key)
    contenttype = $self.find('[name=type]').val()
    $self.submit -> 
      persistance.persist($self)
      false
    $self.find('a.close').click ->
      $(@).closest('form').remove()
    $self.find('textarea').each ->
      # intercept mimetype changes and invoke them on the codemirrors; determine current contenttype
      contenttype=null
      $(@).closest('form').find('[name=type]').each ->
        $(@).change ->
          contenttype=$(@).val()
          mirr.setOption 'mode',contenttype
          determineFoldingType(mirr,contenttype)
        contenttype = $(@).val()

      # enable codemirror with the correct mimetype
      mirr = CodeMirror.fromTextArea(@,
        autoMatchParens: true
        lineNumbers: true
        mode: contenttype
        passDelay: 50
        path: "lib/coffeescript/"
        tabMode: "shift"
        )

      # make sure the textarea value gets updated when focus is lost
      mirr.setOption 'onBlur', -> mirr.save()
      determineFoldingType(mirr,contenttype)
    $self.find('input.run').click ->
      type=$(@).closest('form').find('[name=type]').val()
      code= $(@).closest('form').find('[name=code]').val()
      js= -> alert "#{type} is currently not runnable from the browser"
      
      if type=="text/javascript"
        js = new Function(code)
      else if type=="text/x-coffeescript"
        oldcode = code.split(/[\n\r]/g)
        code = ""
        for oc in oldcode
          if (oc.indexOf("code://") == 0)
            oc = persistance.getValue(oc).code
          code+=oc+"\n\r"
        oldcode = code.split(/[\n\r]/g)
        code=""
        for oc in oldcode
          if (oc.indexOf("table://") == 0)
            oc = "loader.modifyTable '"+oc+"', ->"
          code+=oc+"\n\r"
        prefix = "_____e = new Events()\n"
        for name,func of new Events()
          prefix+="#{name} = (msg,data) -> _____e.#{name}(msg,data)\n"
        js = new Function(CoffeeScript.compile(prefix+code))
      try
        scope = {}
        js.call(scope)
      catch err
        alert "execution error: "+err
      false

  determineFoldingType=(mirr,contenttype) ->
    ff = null
    if contenttype in ['text/html','application/xml'] 
      ff=CodeMirror.tagRangeFinder
    else if contenttype in ['text/plain','text/x-coffeescript'] 
      ff=CodeMirror.indentRangeFinder
    else 
      ff=CodeMirror.braceRangeFinder
    foldFunc = CodeMirror.newFoldFunction ff
    mirr.setOption 'onGutterClick',foldFunc

  return render:render
