(function() {

  define(['jquery', 'persistance'], function($, persistance) {
    var determineFoldingType, render, template;
    require(['CoffeeScript', 'coffeekup', 'codemirror', 'jqueryserializeobject'], function() {
      return require(['codemirrorxml', 'codemirrorjavascript', 'codemirrorcss', 'codemirrorcs', 'codemirrorclike', 'codemirrorfolding']);
    });
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
      })()) + "          </select>          <input type='submit' value='Save changes'/>          <a href='#' class='close'>[x]</a>          <textarea class='codemirror' name='code' rows='12' cols='72'/>        </form>";
    };
    render = function(target, key) {
      var $self, contenttype, rendered;
      if ($(target).find("form input[name=key][value=\"" + key + "\"]").length > 0) {
        return;
      }
      rendered = template(key);
      $self = $(rendered).appendTo(target);
      persistance.restore($self, key);
      contenttype = $self.find('[name=type]').val();
      $self.submit(function() {
        persistance.persist($self);
        return false;
      });
      $self.children('a.close').click(function() {
        return $(this).closest('form').remove();
      });
      return $self.children('textarea').each(function() {
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
