function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
// Objekt nach key sorieren
function sortObjectByKey(obj, categories) {
  var keys = [],
  k, i, len;
for (k in obj) {
  if (obj.hasOwnProperty(k)) {
    keys.push(k);
  }
}
keys.sort();
len = keys.length;
var sorted = {}
for (i = 0; i < len; i++) {
  k = keys[i];
  if (!categories) sorted[k + "/" + k.toUpperCase()] = obj[k];
  else sorted[k] = obj[k];
}
return sorted;
}
// Inhalte in Strings ersetzen
// @param str: string
//        find: was ersetzt werden soll
//        replace: womit es ersetzt werden soll
    function replaceAll(str, find, replace) {
      return str.replace(new RegExp(find, 'g'), replace);
    }
    // findet gesuchtes Unterelement, also Kind bzw. child
    // @param childType: Art des Attributes, wessen Inhalt gesucht wird
    //        idOfElement: Inhalt des gesuchten Attributes
    //        elementNotId: wenn true: Das ganze Element wurde übergeben, nicht nur der Inhalt eines Attributes für es
    function findChild(childType, idOfElement, idOfChild, elementNotId){
      if (!elementNotId) var element = document.getElementById(idOfElement);
      else var element = idOfElement;
      return element.querySelector('[' + childType + '="' + idOfChild + '"]');
    }
    // sortiert eine Liste nach ihrer Länge
    function sortByStringLength(array) {
      return array.sort(function(b, a) {
        return a.length - b.length || // sort by length, if equal then
               a.localeCompare(b);    // sort by dictionary order
      })
    }

function findLetter(word, letter) {
  for (var cat of Object.keys(auswertung.categories[selectedElementId.parent][word])) {
    if (Object.keys(auswertung.categories[selectedElementId.parent][word][cat]).includes(letter)) return auswertung.categories[selectedElementId.parent][word][cat][letter];
  }
}
function getLastLetterStyle(i, pupilSheet) {
  for (var i1 = 0; findChild('class', findChild('id', pupilSheet, 'correction ' + (i + 1)), 'correctionLetter' + i1, true); i1++) {}
  return {letter: findChild('class', findChild('id', pupilSheet, 'correction ' + (i + 1)), 'correctionLetter' + (i1 - 1), true).innerHTML, color: findChild('class', findChild('id', pupilSheet, 'correction ' + (i + 1)), 'correctionLetter' + (i1 - 1), true).style.backgroundColor};
}
