define ['jquery','persistance'], ($,persistance) ->
  
  template = (key) -> "
    <div>
      <form name='adder'>
        <label>Add new resource</label>
        <input type='hidden' name='key' value='#{key}' />
        <input type='text' name='newItem' />
        <select name='type'>
          <option value='code'>code</option>
          <option value='table'>table</option>
        </select>
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
        if $(assetTarget).find(":input[name=key][value=\"#{refname}\"]").length == 0
          renderAsset assetTarget,refname
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

  renderAsset = (assetTarget,refname) ->
    type = refname.substr(0,refname.indexOf("://"))
    require [type+'editor'], (ed) -> 
      ed.render(assetTarget,refname) if ed
      
      

  render = (target,key,assetTarget) ->
    rendered = template(key)
    $self=$(rendered).appendTo(target)
    $adder = $($self.find('form[name=adder]'))
    $newItem = $($adder.find('[name=newItem]'))
    $type = $($adder.find('[name=type]'))
    $modules = $($adder.find('[name=module]'))
    $browser = $($self.find('[name=browser]'))
    $adder.submit -> 
        name = $newItem.val()
        type = $type.val()
        refname = type+"://"+name
        if $adder.find(":input[name=module][value=\"#{refname}\"]").length>0
          alert "duplicate asset name!!"
        else
          $adder.append("<input type='hidden' name='module' value='#{refname}' />")
          persistance.persist($adder)
          appendLink $browser,refname,assetTarget
        renderAsset(assetTarget,refname)
        $newItem.val("")
        false
    for k,values of persistance.getValue(key) when k.indexOf('module')==0
      if ! $.isArray(values)
        values=[values]
      for value in values
        appendLink $browser,value,assetTarget
        $adder.append("<input type='hidden' name='module' value='#{value}' />")
  {
    render:render
    appendLink:appendLink
    }