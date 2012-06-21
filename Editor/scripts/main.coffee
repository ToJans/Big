require ['jquery'],($) ->
  # upon loading initialize the codemirror windows and the persistence for the forms
  $ ->

    # first load all the supported mimetypes in the mimetype selector
    for mimetype in CodeMirror.listMIMEs()
      $('select[name=contenttype]').each ->
        $(this).append "<option>#{mimetype.mime}</option>"

    # enable persistence for all the forms of the class `persistable` and restore them if available
    $('form.persistable').each ->
        # load previous data and restore it into the relevant elements
        data = $(@).persisted();
        for name,value of data
          $(@).children("[name=#{name}]").val(value)

        # persist changes upon submitting
        $(@).submit -> 
          $(@).persist()
          false

    # enable codemirror for the textarea's of the class `code`
    $('textarea.codemirror').each ->
      # intercept mimetype changes and invoke them on the codemirrors; determine current contenttype
      contenttype=null
      $(@).closest('form').children('[name=contenttype]').each ->
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
      