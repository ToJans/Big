(function() {

  require(['jquery'], function(jQuery) {
    return jQuery.fn.serializeObject = function() {
      var arrayData, objectData;
      arrayData = $(this).find(":input").serializeArray();
      objectData = {};
      $.each(arrayData, function() {
        var value;
        if (this.value != null) {
          value = this.value;
        } else {
          value = '';
        }
        if (objectData[this.name] != null) {
          if (!objectData[this.name].push) {
            objectData[this.name] = [objectData[this.name]];
          }
          return objectData[this.name].push(value);
        } else {
          return objectData[this.name] = value;
        }
      });
      return objectData;
    };
  });

}).call(this);
