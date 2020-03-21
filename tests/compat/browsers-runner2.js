var data;
var xobj = new XMLHttpRequest();
xobj.overrideMimeType('application/json');
xobj.open('GET', '../../packages/core-js-compat/data.json', true);
xobj.onreadystatechange = function () {
  if (xobj.readyState === 4 && xobj.status === 200) {
    data = JSON.parse(xobj.responseText);
    init();
  }
};
xobj.send(null);

function getParam(parameterName) {
  var defaultValue = null;
  var tmp = [];
  var params = location.search.slice(1).split('&');
  for (var index = 0; index < params.length; index++) {
    tmp = params[index].split('=');
    if (tmp[0] === parameterName) {
      return decodeURIComponent(tmp[1]);
    }
  }
  return defaultValue;
}

function init() {
  var browser = getParam('browser');
  var table = document.getElementById('table');

  for (var key in window.tests) {
    var test = window.tests[key];
    var result = true;
    try {
      if (typeof test == 'function') {
        result = !!test();
      } else {
        for (var i = 0; i < test.length; i++) result = result && !!test[i].call(undefined);
      }
    } catch (error) {
      result = false;
    }

    var tr = document.createElement('tr');
    tr.className = result;
    var td1 = document.createElement('td');
    td1.innerHTML = key;
    tr.appendChild(td1);
    var td2 = document.createElement('td');
    td2.innerHTML = result ? 'not required' : 'required';
    tr.appendChild(td2);
    var td3 = document.createElement('td');
    td3.innerHTML = (result && data[key][browser] === undefined) ? 'changed' : '&nbsp;';
    tr.appendChild(td3);
    table.appendChild(tr);
  }
}
