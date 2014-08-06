(function () {
// shimz
if (!document.getElementsByClassName) {
    document.getElementsByClassName=function(cn) {
        var allT=document.getElementsByTagName('*'), allCN=[], i=0, a;
        while(a=allT[i++]) {
            a.className==cn ? allCN[allCN.length]=a : null;
        }
        return allCN
    }
}
function hasClass(element, cls) {
  return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}
// if we press up or down, don't move in the input
function noMoveOnDownUp(e)
{
    if (e.keyCode == 38 || e.keyCode == 40)
    {
        var pos = this.selectionStart;
        //this.value = (e.keyCode == 38?1:-1)+parseInt(this.value,10);
        this.selectionStart = pos; this.selectionEnd = pos;
        e.preventDefault();
    }
}
google.maps.Map.prototype.clearMarkers = function() {
    for(var i=0; i < this.markers.length; i++){
        this.markers[i].setMap(null);
    }
    this.markers = new Array();
};
google.maps.Map.prototype.addMarker = function(location) {
  this.setCenter(location);
  var marker = new google.maps.Marker({
    map: this,
    position: location
  });
  this.markers.push(marker);
};
// end shimz


var geocoder = new google.maps.Geocoder();

function go() {
  geocode_suggest_divs = document.getElementsByClassName("geocode-suggest");
  //console.log(geocode_suggest_divs);

  // add input and map to each div
  for (var i = 0; i < geocode_suggest_divs.length; i++) {
    var div, id, input, results, map, gMap, latlng, mapOptions, textarea;
    div = geocode_suggest_divs[i];
    name = div.getAttribute("data-name");

    // input
    var input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("class", "geocode-suggest-input");
    input.onkeyup = inputKeyUp;
    input.addEventListener('keydown', noMoveOnDownUp, false);
    input.addEventListener('keypress', noMoveOnDownUp, false);
    div.appendChild(input);

    // results
    var results = document.createElement("div");
    //results.setAttribute("style", "position: absolute; z-index: 1;");
    results.setAttribute("class", "geocode-suggest-results");
    div.appendChild(results);

    // map
    map = document.createElement("div");
    map.setAttribute("class", "geocode-suggest-map");
    latlng = new google.maps.LatLng(-34.397, 150.644);
    mapOptions = {
      zoom: 5,
      center: latlng
    }
    gMap = new google.maps.Map(map, mapOptions);
    gMap.markers = [];
    div.gMap = gMap;
    div.appendChild(map);

    // how does django use id?
    // textarea ?? -- Django ..
    textarea = document.createElement("textarea");
    textarea.setAttribute("name", name);
    //textarea.setAttribute("style", "display: none;");
    div.appendChild(textarea);

  }

}

function handleUp(ev) {
  //console.log("up");
  //console.log(ev);
  results_div = ev.target.nextSibling;
  //console.log(results_div.childNodes);

  if (results_div.childNodes.length == 0) {
    return;
  }

  for (i = 0; i < results_div.childNodes.length; i++) {
    var toseti;
    var node = results_div.childNodes[i];
    if (hasClass(node, "geocode-suggest-result-selected")) {
      //console.log("HAS", i);
      node.setAttribute("class", "");

      if (i == 0) {
        toseti = results_div.childNodes.length - 1;
      } else {
        toseti = i - 1;
      }
      //console.log(toseti);
      results_div.childNodes[toseti].setAttribute(
        "class", "geocode-suggest-result-selected");
      return
    }
    if (i == results_div.childNodes.length - 1) {
      results_div.childNodes[i].setAttribute(
        "class", "geocode-suggest-result-selected");
    }
  }
}

function handleDown(ev) {
  //console.log("down");
  //console.log(ev);
  results_div = ev.target.nextSibling;
  //console.log(results_div.childNodes);
  if (results_div.childNodes.length == 0) {
    return;
  }
  for (i = 0; i < results_div.childNodes.length; i++) {
    var toseti;
    var node = results_div.childNodes[i];
    if (hasClass(node, "geocode-suggest-result-selected")) {
      //console.log("HAS", i);
      node.setAttribute("class", "");

      if (i == results_div.childNodes.length - 1) {
        toseti = 0;
      } else {
        toseti = i + 1;
      }
      //console.log(toseti);
      results_div.childNodes[toseti].setAttribute(
        "class", "geocode-suggest-result-selected");
      return
    }
    if (i == results_div.childNodes.length - 1) {
      results_div.childNodes[0].setAttribute(
          "class", "geocode-suggest-result-selected");
    }
  }
}

function handleEnter(ev) {
  var map, results_div, selected, loc, textarea;
  map = ev.target.parentNode.gMap;
  results_div = ev.target.nextSibling;
  textarea = results_div.nextSibling.nextSibling;
  if (results_div.childNodes.length == 0) {
    return;
  }
  selected = results_div.getElementsByClassName("geocode-suggest-result-selected");
  if (selected.length > 0) {
    loc = selected[0].result.geometry.location;
  } else {
    // None are selected, take the first one.
    loc = results_div.childNodes[0].result.geometry.location;
  }
  setLocation(loc, map, textarea);
  results_div.innerHTML = "";
}

function inputKeyUp(ev) {
  pos = this.selectionStart;
  //console.log(ev);
  target = ev.target;
  address = ev.target.value;
  //console.log(this.selectionStart);

  if (ev.which == 38) {

    handleUp(ev);
    //ev.stopPropagation();
    this.selectionStart = pos; this.selectionEnd = pos;
    return;
  }

  if (ev.which == 40) {
    handleDown(ev);
    //ev.stopPropagation();
    this.selectionStart = pos; this.selectionEnd = pos;
    return;
  }

  if (ev.which == 13) {
    handleEnter(ev);
    //ev.stopPropagation();
    //this.selectionStart = pos; this.selectionEnd = pos;
    return;
  }

  //console.log(address);
  if (address.length < 4) {
    return;
  }

  // find results div and clear
  results_div = target.parentNode.getElementsByClassName("geocode-suggest-results")[0];
  results_div.innerHTML = "";

  geocoder.geocode({'address': address}, function(results) {

    //console.log(results);

    if (results == null || results.length < 1) {
      return;
    }

    for (var i = 0; i < results.length; i++) {
      res = results[i];
      resEl = document.createElement("div");
      resEl.setAttribute("style", "cursor: pointer;");
      resEl.innerHTML = res.formatted_address;

      //console.log("adding onclick to ");
      //console.log(res);
      resEl.result = res;
      resEl.onclick = resOnClick;

      results_div.appendChild(resEl);
    }
  });
}

function setLocation(loc, map, textarea) {
  map.clearMarkers();
  map.addMarker(loc);
  textarea.value = "POINT" + loc.toString();
}

function resOnClick(ev) {
  var loc, map, textarea;
  // fragile
  loc = ev.target.result.geometry.location;
  map = ev.target.parentNode.parentNode.gMap;
  textarea = ev.target.parentNode.nextSibling.nextSibling;
  setLocation(loc, map, textarea);
  ev.target.parentNode.innerHTML = "";
}

window.onload = go;

})();
