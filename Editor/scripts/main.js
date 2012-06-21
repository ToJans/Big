(function() {

  require(['jquery'], function($) {
    var determineFoldingType;
    $(function() {
      var mimetype, _i, _len, _ref;
      _ref = CodeMirror.listMIMEs();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        mimetype = _ref[_i];
        $('select[name=contenttype]').each(function() {
          return $(this).append("<option>" + mimetype.mime + "</option>");
        });
      }
      $('form.persistable').each(function() {
        var data, name, value;
        data = $(this).persisted();
        for (name in data) {
          value = data[name];
          $(this).children("[name=" + name + "]").val(value);
        }
        return $(this).submit(function() {
          $(this).persist();
          return false;
        });
      });
      return $('textarea.codemirror').each(function() {
        var contenttype, mirr;
        contenttype = null;
        $(this).closest('form').children('[name=contenttype]').each(function() {
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
    });
    return determineFoldingType = function(mirr, contenttype) {
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
  });

}).call(this);
