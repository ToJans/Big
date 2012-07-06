(function() {
  var Events;

  Events = (function() {

    Events.name = 'Events';

    function Events(eventListeners) {
      this.eventListeners = eventListeners != null ? eventListeners : {};
    }

    Events.prototype.handle = function(event, func) {
      var _base, _ref;
      return ((_ref = (_base = this.eventListeners)[event]) != null ? _ref : _base[event] = []).push({
        f: func,
        scope: this
      });
    };

    Events.prototype.handleOnce = function(event, func) {
      var newFunc;
      return newFunc = function(data) {
        func(data);
        return this.eventListeners.remove[event];
      };
    };

    Events.prototype.emit = function(event, data) {
      var func, _i, _len, _ref, _results;
      _ref = this.eventListeners[event] || [];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        func = _ref[_i];
        _results.push(func.f.call(func.scope, data));
      }
      return _results;
    };

    return Events;

  })();

  this.Events = Events;

}).call(this);
