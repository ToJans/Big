(function() {

  define(['persistance', 'jquery', 'handsontable'], function(persistance, $) {
    var loader;
    loader = {};
    loader.modify = function(asset, func) {
      var val;
      val = persistance.getValue(asset);
      try {
        func(val);
        return persistance.setValue(asset, val);
      } catch (err) {
        return alert("Modification failed; reason: " + err);
      }
    };
    loader.modifyTable = function(asset, func) {
      var $changefrm, newfunc, table;
      $changefrm = $("form :input[name=key][value=\"" + asset + "\"]").closest("form");
      table = $changefrm.find(".dataTable");
      newfunc = function(data) {
        var c, caption, celldata, col, drow, fromc, i, index, k, match, matches, original, r, range, record, results, row, rowdata, scope, toc, v, val, value, values, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _len6, _m, _n, _o, _p, _q, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
        scope = {};
        values = JSON.parse(data.values);
        original = JSON.parse(data.values);
        for (row = _i = 0, _len = values.length; _i < _len; row = ++_i) {
          rowdata = values[row];
          for (col = _j = 0, _len1 = rowdata.length; _j < _len1; col = ++_j) {
            celldata = rowdata[col];
            val = parseFloat(celldata);
            if (isNaN(val)) {
              val = celldata;
            }
            original[row][col] = values[row][col] = val;
          }
        }
        matches = ("" + func).match(/this.[A-Z][0-9]+(_[A-Z][0-9]+)?/g);
        if (matches) {
          for (_k = 0, _len2 = matches.length; _k < _len2; _k++) {
            match = matches[_k];
            results = [];
            range = match.split(".")[1];
            _ref = range.split("_"), fromc = _ref[0], toc = _ref[1];
            if (toc) {
              for (row = _l = _ref1 = parseInt(fromc.substr(1)), _ref2 = parseInt(toc.substr(1)); _ref1 <= _ref2 ? _l <= _ref2 : _l >= _ref2; row = _ref1 <= _ref2 ? ++_l : --_l) {
                for (col = _m = _ref3 = fromc.charCodeAt(0) - 65, _ref4 = toc.charCodeAt(0) - 65; _ref3 <= _ref4 ? _m <= _ref4 : _m >= _ref4; col = _ref3 <= _ref4 ? ++_m : --_m) {
                  results.push(values[row - 1][col]);
                }
              }
              scope[range] = results;
            } else {
              scope[range] = values[parseInt(fromc.substr(1)) - 1][fromc.charCodeAt(0) - 65];
            }
          }
        }
        scope.isNumeric = function(n) {
          return !isNaN(parseFloat(n)) && isFinite(n);
        };
        scope.sum = function(r) {
          var res, val, _len3, _n;
          res = 0;
          for (_n = 0, _len3 = r.length; _n < _len3; _n++) {
            val = r[_n];
            if (scope.isNumeric(val)) {
              res += val;
            }
          }
          return res;
        };
        scope.min = function(r) {
          var res, val, _len3, _n;
          res = void 0;
          for (_n = 0, _len3 = r.length; _n < _len3; _n++) {
            val = r[_n];
            if (scope.isNumeric(val)) {
              if (!res || val < res) {
                res = val;
              }
            }
          }
          return res;
        };
        scope.max = function(r) {
          var res, val, _len3, _n;
          res = void 0;
          for (_n = 0, _len3 = r.length; _n < _len3; _n++) {
            val = r[_n];
            if (scope.isNumeric(val)) {
              if (!res || val > res) {
                res = val;
              }
            }
          }
          return res;
        };
        scope.avg = function(r) {
          var cnt, res, val, _len3, _n;
          res = 0;
          cnt = 0;
          for (_n = 0, _len3 = r.length; _n < _len3; _n++) {
            val = r[_n];
            if (!(scope.isNumeric(val))) {
              continue;
            }
            res += val;
            cnt += 1;
          }
          return res / cnt;
        };
        scope.count = function(r) {
          return r.length;
        };
        scope.rows = [];
        for (r = _n = 0, _len3 = values.length; _n < _len3; r = ++_n) {
          drow = values[r];
          if (!(r > 0)) {
            continue;
          }
          record = {};
          for (c = _o = 0, _len4 = drow.length; _o < _len4; c = ++_o) {
            val = drow[c];
            if (values[0][c]) {
              record[values[0][c]] = val;
            }
          }
          scope.rows.push(record);
        }
        scope.values = values;
        scope.report = function(s) {
          $("#assets .output").remove();
          $("#assets").append("<div class='output'></div>");
          return $("#assets .output").append(s);
        };
        func.call(scope);
        for (k in scope) {
          v = scope[k];
          if (!(/^[A-Z][0-9]+$/.test(k))) {
            continue;
          }
          row = parseInt(k.substr(1)) - 1;
          col = k.charCodeAt(0) - 65;
          if (original[row][col] !== v) {
            values[row][col] = v;
          }
        }
        _ref5 = scope.rows;
        for (row = _p = 0, _len5 = _ref5.length; _p < _len5; row = ++_p) {
          rowdata = _ref5[row];
          for (caption in rowdata) {
            value = rowdata[caption];
            _ref6 = original[0];
            for (i = _q = 0, _len6 = _ref6.length; _q < _len6; i = ++_q) {
              c = _ref6[i];
              if (c === caption) {
                index = i;
              }
            }
            if (value !== original[row + 1][index]) {
              values[row + 1][index] = value;
            }
          }
        }
        data.values = JSON.stringify(values);
        $(table).handsontable('updateSettings', {
          legend: [
            {
              match: function(r, c, data) {
                return original[r][c] !== values[r][c];
              },
              style: {
                color: 'green',
                fontWeight: 'bold',
                border: '2px green solid'
              }
            }
          ]
        });
        return $(table).handsontable('loadData', values);
      };
      return loader.modify(asset, newfunc);
    };
    this.loader = loader;
    return loader;
  });

}).call(this);
