require ['jquery','projectbrowser'], ($,browser,eventmachine) ->
  # upon loading initialize the codemirror windows and the persistence for the forms
  $ ->
    browser.render('#index','index://root','#assets')
