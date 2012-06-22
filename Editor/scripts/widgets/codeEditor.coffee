define ['jquery','persistance'], ($,persistance) ->

  require ['CoffeeScript','coffeekup', 'codemirror', 'jqueryserializeobject'], ->
    require ['codemirrorxml', 'codemirrorjavascript', 'codemirrorcss', 'codemirrorcs', 'codemirrorclike','codemirrorfolding']

  
  template = (key) -> "
        <form class='persistable' method='post' action='#'>
          <input type='text' name='key' value='#{key}' readonly='readonly'  />
          <select name='type'>
        " + ("  <option>#{mime.mime}</option>" for mime in CodeMirror.listMIMEs()) + "
          </select>
          <input type='submit' value='Save changes'/>
          <a href='#' class='close'>[x]</a>
          <textarea class='codemirror' name='code' rows='12' cols='72'/>
        </form>"
  
  render = (target,key) ->
    if $(target).find("form input[name=key][value=\"#{key}\"]").length > 0
      return
    rendered = template key
    $self = $(rendered).appendTo(target)
    persistance.restore($self,key)
    contenttype = $self.find('[name=type]').val()
    $self.submit -> 
      persistance.persist($self)
      false
    $self.children('a.close').click ->
      $(@).closest('form').remove()
    $self.children('textarea').each ->
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
