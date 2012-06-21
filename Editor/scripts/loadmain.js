require({
    paths: {
        cs: './lib/cs',
        CoffeeScript: './lib/CoffeeScript',
        lscache: './lib/lscache',
        jquery: "http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery",
        codemirror: "http://codemirror.net/lib/codemirror",
        codemirrorcs: "http://codemirror.net/mode/coffeescript/coffeescript",
        codemirrorclike: "http://codemirror.net/mode/clike/clike",
        codemirrorxml: "http://codemirror.net/mode/xml/xml",
        codemirrorjavascript: "http://codemirror.net/mode/javascript/javascript",
        codemirrorcss: "http://codemirror.net/mode/css/css",
        codemirrorfolding: "http://codemirror.net/lib/util/foldcode",
        git: "https://raw.github.com/danlucraft/git.js/master/lib/git.min.js"
    }
}, ['cs!main', 'jquerypersisted', 'codemirror', 'codemirrorxml', 'codemirrorjavascript', 'codemirrorcss', 'codemirrorcs', 'codemirrorclike','codemirrorfolding']);