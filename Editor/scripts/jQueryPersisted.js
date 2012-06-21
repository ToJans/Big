(function() {

  require(['lscache', 'jquery', 'jqueryserializeobject'], function(store, $) {
    var getdata;
    getdata = function(el) {
      return $(el).closest('form').serializeObject();
    };
    $.fn.persisted = function() {
      var data;
      data = getdata(this);
      return store.get(data.key) || data;
    };
    return $.fn.persist = function() {
      var data;
      data = getdata(this);
      return store.set(data.key, data);
    };
  });

}).call(this);
