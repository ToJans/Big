require.config({
    paths: {
        main: 'main',
        cs: 'vendor/coffeescript/cs',
        CoffeeScript: 'vendor/coffeescript/CoffeeScript',
        coffeekup: "vendor/coffeekup/coffeekup",

        lscache: 'vendor/lscache/lscache',
        persistance: "utils/persistance",
        codemirrorwrapper: "utils/codemirrorwrapper",
        loader: 'utils/loader',
        events: 'utils/events',

        jquery: "vendor/jquery/jquery-1.7.2",
        jqueryserializeobject: "utils/jqueryserializeobject",

        codemirror: "vendor/codemirror/lib/codemirror",
        codemirrorcs: "vendor/codemirror/mode/coffeescript",
        codemirrorclike: "vendor/codemirror/mode/clike",
        codemirrorxml: "vendor/codemirror/mode/xml",
        codemirrorjavascript: "vendor/codemirror/mode/javascript",
        codemirrorcss: "vendor/codemirror/mode/css",
        codemirrorfolding: "vendor/codemirror/lib/util/foldcode",

        handsontable: "http://warpech.github.com/jquery-handsontable/jquery.handsontable",
        jquerycontextmenu: "http://warpech.github.com/jquery-handsontable/lib/jQuery-contextMenu/jquery.contextMenu",
        jqueryposition: "http://warpech.github.com/jquery-handsontable/lib/jQuery-contextMenu/jquery.ui.position",
        jqueryautoresize: "http://warpech.github.com/jquery-handsontable/lib/jquery.autoresize",

        git: "https://raw.github.com/danlucraft/git.js/master/lib/git.min",

        codeeditor: 'widgets/codeeditor',
        tableeditor: 'widgets/tableeditor',
        projectbrowser: 'widgets/projectbrowser'
    },
    shim: {
        'codemirrorwrapper': {
            exports: "CodeMirror",
            deps: ['codemirror', 'codemirrorxml', 'codemirrorjavascript', 'codemirrorcss', 'codemirrorcs',
                   'codemirrorclike', 'codemirrorfolding']
        },
        'codemirror': { exports: 'CodeMirror' },
        'codemirrorxml': { deps: ['codemirror'], exports: 'CodeMirror' },
        'codemirrorjavascript': { deps: ['codemirror'], exports: 'CodeMirror' },
        'codemirrorcss': { deps: ['codemirror'], exports: 'CodeMirror' },
        'codemirrorcs': { deps: ['codemirror'], exports: 'CodeMirror' },
        'codemirrorclike': { deps: ['codemirror'], exports: 'CodeMirror' },
        'codemirrorfolding': { deps: ['codemirror'], exports: 'CodeMirror' },
        'handsontable': { deps: ['jquery'], exports: '$.fn.handsontable' },
        'jquerycontextmenu': ['jquery'],
        'jqueryposition': ['jquery'],
        'jqueryautoresize': ['jquery'],

        'loader': { exports: 'loader' },
        'events': { exports: 'Events' }
    }
});

var global = global || window;

require(['main'], function (m) {});