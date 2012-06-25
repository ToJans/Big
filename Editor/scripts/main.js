(function() {

  require(['jquery', 'projectbrowser'], function($, browser) {
    return $(function() {
      return browser.render('#index', 'index://root', '#assets');
    });
  });

}).call(this);
