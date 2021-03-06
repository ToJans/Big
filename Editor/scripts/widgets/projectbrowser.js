(function() {

  define(['jquery', 'persistance'], function($, persistance) {
    var appendLink, linktemplate, render, renderAsset, template;
    template = function(key) {
      return "    <div>      <form name='adder'>        <label>Add new resource</label>        <input type='hidden' name='key' value='" + key + "' />        <input type='text' name='newItem' />        <select name='type'>          <option value='code'>code</option>          <option value='table'>table</option>        </select>        <input type='submit' name='Add' />      </form>      <ul name='browser'>      </ul>   </div>";
    };
    linktemplate = function(refname) {
      var name;
      name = refname.substr(refname.indexOf("://") + 3);
      return "<li><a href='" + refname + "' class='assetref'>" + name + "</a> <a href='" + refname + "' class='delete'>[remove]</a></li>";
    };
    appendLink = function(target, refs, assetTarget) {
      var el, refname, _i, _len, _results;
      if (!$.isArray(refs)) {
        refs = [refs];
      }
      _results = [];
      for (_i = 0, _len = refs.length; _i < _len; _i++) {
        refname = refs[_i];
        el = $(linktemplate(refname)).appendTo(target);
        el.find('a.assetref').click(function() {
          if ($(assetTarget).find(":input[name=key][value=\"" + refname + "\"]").length === 0) {
            renderAsset(assetTarget, refname);
          }
          return false;
        });
        _results.push(el.find('a.delete').click(function() {
          var frm;
          if (confirm("Do you want to remove " + refname + " ?")) {
            persistance.remove(refname);
            $(assetTarget).find(":input[name=key][value=\"" + refname + "\"]").closest("form").remove();
            frm = $(el).closest("div").find("form[name=adder]");
            frm.find(":input[name=module][value=\"" + refname + "\"]").remove();
            persistance.persist(frm);
            $(el).closest("li").remove();
          }
          return false;
        }));
      }
      return _results;
    };
    renderAsset = function(assetTarget, refname) {
      var type;
      type = refname.substr(0, refname.indexOf("://"));
      return require([type + 'editor'], function(ed) {
        if (ed) {
          return ed.render(assetTarget, refname);
        }
      });
    };
    render = function(target, key, assetTarget) {
      var $adder, $browser, $modules, $newItem, $self, $type, k, rendered, value, values, _ref, _results;
      rendered = template(key);
      $self = $(rendered).appendTo(target);
      $adder = $($self.find('form[name=adder]'));
      $newItem = $($adder.find('[name=newItem]'));
      $type = $($adder.find('[name=type]'));
      $modules = $($adder.find('[name=module]'));
      $browser = $($self.find('[name=browser]'));
      $adder.submit(function() {
        var name, refname, type;
        name = $newItem.val();
        type = $type.val();
        refname = type + "://" + name;
        if ($adder.find(":input[name=module][value=\"" + refname + "\"]").length > 0) {
          alert("duplicate asset name!!");
        } else {
          $adder.append("<input type='hidden' name='module' value='" + refname + "' />");
          persistance.persist($adder);
          appendLink($browser, refname, assetTarget);
        }
        renderAsset(assetTarget, refname);
        $newItem.val("");
        return false;
      });
      _ref = persistance.getValue(key);
      _results = [];
      for (k in _ref) {
        values = _ref[k];
        if (!(k.indexOf('module') === 0)) {
          continue;
        }
        if (!$.isArray(values)) {
          values = [values];
        }
        _results.push((function() {
          var _i, _len, _results1;
          _results1 = [];
          for (_i = 0, _len = values.length; _i < _len; _i++) {
            value = values[_i];
            appendLink($browser, value, assetTarget);
            _results1.push($adder.append("<input type='hidden' name='module' value='" + value + "' />"));
          }
          return _results1;
        })());
      }
      return _results;
    };
    return {
      render: render,
      appendLink: appendLink
    };
  });

}).call(this);
