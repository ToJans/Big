(function() {

  define(['lscache', 'jquery', 'jqueryserializeobject'], function(store, $) {
    var persistance;
    persistance = [];
    persistance.getValue = function(key) {
      return store.get(key);
    };
    persistance.persist = function(form, key) {
      var data;
      data = $(form).serializeObject();
      return store.set(data.key, data);
    };
    persistance.restore = function(form, key) {
      var data, name, value, _results;
      if (!key) {
        key = $(form).find(":input[name=key]").val();
      }
      data = persistance.getValue(key);
      if (data) {
        _results = [];
        for (name in data) {
          value = data[name];
          _results.push($(form).find("[name=" + name + "]").val(value));
        }
        return _results;
      }
    };
    persistance.remove = function(key) {
      return store.remove(key);
    };
    return persistance;
  });

}).call(this);
