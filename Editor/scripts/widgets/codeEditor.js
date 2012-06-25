(function() {

  define(['jquery', 'persistance', 'CoffeeScript', 'loader', 'codemirrorwrapper', 'jqueryserializeobject'], function($, persistance, CoffeeScript, loader) {
    var determineFoldingType, render, template;
    template = function(key) {
      var mime;
      return ("        <form class='persistable' method='post' action='#'>          <input type='text' name='key' value='" + key + "' readonly='readonly'  />          <select name='type'>        ") + ((function() {
        var _i, _len, _ref, _results;
        _ref = CodeMirror.listMIMEs();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          mime = _ref[_i];
          _results.push("  <option>" + mime.mime + "</option>");
        }
        return _results;
      })()) + "          </select>          <input type='submit' value='Save changes'/>          <a href='#' class='close'>[x]</a>          <textarea class='codemirror' name='code' rows='12' cols='72'/>          <input type='submit' value='Run' class='run' />        </form>";
    };
    render = function(target, key) {
      var $self, contenttype, rendered;
      rendered = template(key);
      $self = $(rendered).appendTo(target);
      persistance.restore($self, key);
      contenttype = $self.find('[name=type]').val();
      $self.submit(function() {
        persistance.persist($self);
        return false;
      });
      $self.find('a.close').click(function() {
        return $(this).closest('form').remove();
      });
      $self.find('textarea').each(function() {
        var mirr;
        contenttype = null;
        $(this).closest('form').find('[name=type]').each(function() {
          $(this).change(function() {
            contenttype = $(this).val();
            mirr.setOption('mode', contenttype);
            return determineFoldingType(mirr, contenttype);
          });
          return contenttype = $(this).val();
        });
        mirr = CodeMirror.fromTextArea(this, {
          autoMatchParens: true,
          lineNumbers: true,
          mode: contenttype,
          passDelay: 50,
          path: "lib/coffeescript/",
          tabMode: "shift"
        });
        mirr.setOption('onBlur', function() {
          return mirr.save();
        });
        return determineFoldingType(mirr, contenttype);
      });
      return $self.find('input.run').click(function() {
        var code, js, oc, oldcode, type, _i, _len;
        type = $(this).closest('form').find('[name=type]').val();
        code = $(this).closest('form').find('[name=code]').val();
        js = function() {
          return alert("" + type + " is currently not runnable from the browser");
        };
        if (type === "text/javascript") {
          js = new Function(code);
        } else if (type === "text/x-coffeescript") {
          oldcode = code.split(/[\n\r]/g);
          code = "";
          for (_i = 0, _len = oldcode.length; _i < _len; _i++) {
            oc = oldcode[_i];
            if (oc.indexOf("table://") === 0) {
              oc = "loader.modifyTable '" + oc + "', ->";
            }
            code += oc + "\n\r";
          }
          js = new Function(CoffeeScript.compile(code));
        }
        try {
          js.call(this);
        } catch (err) {
          alert("execution error: " + err);
        }
        return false;
      });
    };
    determineFoldingType = function(mirr, contenttype) {
      var ff, foldFunc;
      ff = null;
      if (contenttype === 'text/html' || contenttype === 'application/xml') {
        ff = CodeMirror.tagRangeFinder;
      } else if (contenttype === 'text/plain' || contenttype === 'text/x-coffeescript') {
        ff = CodeMirror.indentRangeFinder;
      } else {
        ff = CodeMirror.braceRangeFinder;
      }
      foldFunc = CodeMirror.newFoldFunction(ff);
      return mirr.setOption('onGutterClick', foldFunc);
    };
    return {
      render: render
    };
  });

}).call(this);
