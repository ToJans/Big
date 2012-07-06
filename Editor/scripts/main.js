(function() {

  require(['jquery', 'projectbrowser'], function($, browser, eventmachine) {
    return $(function() {
      return browser.render('#index', 'index://root', '#assets');
    });
  });

}).call(this);
