define ['jquery','codeeditor','persistance'], ($,codeeditor,persistance) ->
  
  template = (key) -> "
    <div>
      <form name='adder'>
        <label>Add new resource</label>
        <input type='hidden' name='key' value='#{key}' />
        <input type='text' name='newItem' />
        <input type='submit' name='Add' />
      </form>
      <ul name='browser'>
      </ul>
   </div>"
  linktemplate = (refname) ->
    name = refname.substr(refname.indexOf("://")+3)
    "<li><a href='#{refname}' class='assetref'>#{name}</a> <a href='#{refname}' class='delete'>[remove]</a></li>"

  appendLink = (target,refs,assetTarget) ->
    if ! $.isArray(refs)
      refs = [refs]
    for refname in refs
      el = $(linktemplate(refname)).appendTo(target)
      el.find('a.assetref').click ->
        link = $(@).attr('href')
        if (link.indexOf("asset://")==0)
          codeeditor.render(assetTarget,link)
        else
          alert "Only inline assets are currently supported"
        false
      el.find('a.delete').click ->
        if confirm "Do you want to remove #{refname} ?"
          persistance.remove(refname) 
          $(assetTarget).find(":input[name=key][value=\"#{refname}\"]").closest("form").remove()
          frm = $(el).closest("div").find("form[name=adder]");
          frm.find(":input[name=module][value=\"#{refname}\"]").remove()
          persistance.persist(frm)
          $(el).closest("li").remove()
        false

  render = (target,key,assetTarget) ->
    rendered = template(key)
    $self=$(rendered).appendTo(target)
    $adder = $($self.find('[name=adder]'))
    $newItem = $($adder.find('[name=newItem]'))
    $modules = $($adder.find('[name=module]'))
    $browser = $($self.find('[name=browser]'))
    $adder.submit -> 
        name = $newItem.val()
        refname = name
        if (name.indexOf("://") == -1)
          refname = "asset://"+name
        if $adder.find("[name=module][value=\"#{refname}\"]").length>0
          alert "duplicate asset name!!"
        else
          $adder.append("<input type='hidden' name='module' value='#{refname}' />")
          persistance.persist($adder)
          appendLink $browser,refname,assetTarget
        codeeditor.render(assetTarget,refname)
        $newItem.val("")
        false
    for key,values of persistance.getValue(key) when key.indexOf('module')==0
      if ! $.isArray(values)
        values=[values]
      for value in values
        appendLink $browser,value,assetTarget
        $adder.append("<input type='hidden' name='#{key}' value='#{value}' />")
  {
    render:render
    appendLink:appendLink
    }