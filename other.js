// if (localStorage.getItem('words') && localStorage.getItem('words') != "undefined" && !angular.equals(JSON.parse(localStorage.getItem('words')), officialData)/*Object.keys(JSON.parse(localStorage.getItem('words'))["Kreis Unna"]).includes("preComment")*/) localStorage.clear();
  categories.style.left = 166 + 22;
  var colours = {colour: {right: {chart: "rgba(0, 255, 0, 1)", text: "green"}, wrong: {dark: {chart: "red", text: "red"}, light: {text:"#FD6441"}}, doNotCount: {chart: "gray"}, spiegelverkehrt: {chart: "#00BFFF", text: "#00BFFF"}}, blackWhite: {right: {chart: pattern.draw('diamond-box', 'black'), text: "rgb(16,16,16)"}, wrong: {dark: {chart: pattern.draw('cross', 'rgb(56,56,56)'), text: "rgb(56,56,56)"}, light: {text: "gray"}} , doNotCount: {chart: pattern.draw('diagonal', 'gray'), text: "gray"}, spiegelverkehrt: {chart: pattern.draw('line-vertical', 'silver'), text: "silver"}}}
  document.getElementById('addPupil').style.left = 300 + "px";
  document.getElementById('addPupil').style.position = 'fixed';
  document.getElementById('testSelector').style.left = 388 + "px";
  document.getElementById('testSelector').style.position = 'fixed';
  document.getElementById('testTypeSelector').style.left = 300 + "px";
  document.getElementById('testTypeSelector').style.position = 'fixed';
  document.getElementById('openEditorB').style.left = 300 + "px";
  document.getElementById('openEditorB').style.position = 'fixed';
  document.getElementById('settingsButton').style.left = 300 + "px";
  document.getElementById('settingsButton').style.position = 'fixed';
  document.getElementById('settings').style.left = 300 + "px";
  document.getElementById('settings').style.top = 83 + "px";
  document.getElementById('settings').style.position = 'fixed';
  window.scroll(0, 0);
var neededTest = words['Kreis Unna']["Test 1"];
var pupils = 0;
var selectedElementId = {parent: 'pupilSheet1', element: 'pupilsWriting 1'};
var myBarChart = [];
var settingsChanged = false;
// kopiert den Code für die Tests, sodass ich be seriösen Quellen den Code direkt übernehmen kann
function copyCode() {
document.getElementById('message').style.display = "inline";
var copytext;
document.getElementById("message").value = replaceAll( replaceAll( replaceAll( replaceAll( replaceAll(JSON.stringify(words), '"kategorien"', 'kategorien'), '"words"', 'words' ),  '"words"', 'words'),  ':', ': '), ',', ', ');
copytext = document.getElementById("message")
copytext.select();
try{
successful = document.execCommand("copy")
message = successful ? "successful" : "unsuccessful"
}
catch(err){
document.getElementById("message").value = "Ein Fehler ist aufgetreten!!!"
}
document.getElementById('message').style.display = "none";
}
// fügt alle Elemente für einen neuen Schüler hinzu
function addPupil(selectedTestType, pSelectedTest) {
  neededTest = words[selectedTestType][pSelectedTest];
pupils = 0;
for (i=1; pupils == 0; i++) { 
  if (inputs[selectedTest]["pupilSheet" + i] == undefined) {
    pupils = i;
  }
}
  if (sheetNr == undefined) {
    sheetNr = pupils
  }
if (!inputs[/*'Test ' + */selectedTestType]) inputs[/*'Test ' + */selectedTestType] = {};
if (!inputs[/*'Test ' + */selectedTestType]['pupilSheet' + sheetNr]) inputs[/*'Test ' + */selectedTestType]['pupilSheet' + sheetNr] = {};
for (test of Object.keys(words[selectedTestType])) {
  if (test != "einGraphemtreffer" && test != "preComment") addElement({value: test, innerText: test}, 'option', 'testSelector' + pupils);
}
document.getElementById('testSelector' + pupils).value = pSelectedTest;
addElement({placeholder: 'Name Schüler/in', id: 'name', class: 'names', oninput: 'selectedElementId.element = id; selectedElementId.parent = "pupilSheet' + pupils + '"; dataChanged(id, value);'}, 'input', 'pupilSheet' + pupils);
addElement({placeholder: 'Klasse', id: 'class' + pupils, style: 'width: 50;', oninput: 'selectedElementId.element = id; selectedElementId.parent = "pupilSheet' + pupils + '"; dataChanged(id, value);'}, 'input', 'pupilSheet' + pupils);
addElement({}, 'br', 'pupilSheet' + pupils);
addElement({placeholder: 'Datum', style: 'width: 208;', id: 'date' + pupils, oninput: 'selectedElementId.element = id; selectedElementId.parent = "pupilSheet' + pupils + '"; dataChanged(id, value);'}, 'input', 'pupilSheet' + pupils);
addElement({placeholder: 'Anmerkungen', style: 'position: absolute; right: 0px; height: 20px'/*50px*/, id: 'comment', oninput: 'selectedElementId.element = id; selectedElementId.parent = "pupilSheet' + pupils + '"; dataChanged(id, value);'}, 'textarea', 'pupilSheet' + pupils);
if (generateInfoText.checked && words[selectedTestType].preComment) findChild("id", 'pupilSheet' + pupils, "comment").innerText = words[selectedTestType].preComment;
addElement({id: 'divGraph' + pupils, style: 'position: absolute; right: 0px;'}, 'div', 'pupilSheet' + pupils);
addElement({}, 'br', 'pupilSheet' + pupils);
addElement({id: 'texturpupilSheet' + pupils}, 'canvas', 'divGraph' + pupils);
addElement({}, 'br', 'pupilSheet' + pupils);
var mostRight = 0;
for (var i = 0; i < neededTest.words.length; i++) {
  addElement({innerText: replaceAll(neededTest.words[i], '-', ''), id: 'word ' + (i + 1), style: "font-size:23px; font-style:arial"}, 'a', 'pupilSheet' + pupils);
  addElement({id: 'pupilsWriting ' + (i + 1), style: '  color: white;', class: 'writingPupilSheet' + pupils, placeholder: 'Schreibung Schüler/in', oninput: 'markErrors(id, "pupilSheet' + pupils + '");', onchange: 'markErrors(id, "pupilSheet' + pupils + '", true); pupilsWritingFinished(id);', title: 'Wenn der Schüler/die Schülerin das Wort komplett richtig geschrieben hat, geben Sie nur "r" für richtig ein!\nDie Eingabe wird automatisch "korrigiert". \nFalls die automatische Korrektur falsch sein sollte, können Sie die Anzahl der Graphemtreffer über die Anzeige der Graphemtreffer korrigieren.'}, 'input', 'pupilSheet' + pupils);
  if (document.getElementsByClassName("writingPupilSheet" + pupils)[i].getBoundingClientRect().left > mostRight) mostRight = document.getElementsByClassName("writingPupilSheet" + pupils)[i].getBoundingClientRect().left;
  addElement({id: 'correction ' + (i + 1), word: replaceAll(neededTest.words[i], '-', '')}, 'div', 'pupilSheet' + pupils);
  if (i != neededTest.words.length - 1) addElement({}, 'br', 'pupilSheet' + pupils);
}
  for (var textBox of document.getElementsByClassName("writingPupilSheet" + pupils)) {
    if (inputsParallel.checked) {
    textBox.style.position = "absolute";
    textBox.style.left = mostRight;
    }
    else textBox.style.position = "";
  }
addElement({}, 'br', 'pupilSheet' + pupils);
addElement({id: 'allGraphemes' + pupils, style: 'font-size: 25'}, 'a', 'pupilSheet' + pupils);
addElement({}, 'br', 'pupilSheet' + pupils);
addElement({id: 'allCorrect' + pupils, style: 'font-size: 25'}, 'a', 'pupilSheet' + pupils);
document.getElementById('pupilSheet' + pupils).scrollIntoView();
}
else {
  alert("Bitte geben sie zuerst den Namen des Schülers/der Schülerin an!");
  document.getElementsByClassName('names')[document.getElementsByClassName('names').length - 1].select();
  document.getElementById('pupilSheet' + pupils).scrollIntoView();
}
}
// synchronisation mit von mir hinzugefügten Tests
// @param sync: wenn true wird sychronisiert, sonst erscheint nur ein Button dafür
function syncWithOfficialData(sync) {
for (nameTypeNow of Object.keys(officialData)) {
  for (nameTestNow of Object.keys(officialData[nameTypeNow])) {
    if (sync) words[nameTypeNow][nameTestNow] = officialData[nameTypeNow][nameTestNow];
    else if (!angular.equals(words[nameTypeNow][nameTestNow], officialData[nameTypeNow][nameTestNow])) syncWithOfficialDataButton.style.display = 'inline';
  }
}
localStorage.setItem('words', JSON.stringify(words));
}
var auswertung = {allGraphemtreffer: {possible: 0, got: 0}, wrongLetters: {}, letter: {}, categories: {}, byCategories: {}, doNotCount: {}};
var inputs = {};
// eigen hinzugefügte Tests oder Test Typen, die nich vorprogrammiert sind werden hinzugefügt
if (localStorage.getItem('words') != "undefined" && localStorage.getItem('words')) {
var wordsInport = JSON.parse(localStorage.getItem('words'));
for (nameTypeNow of Object.keys(words)) {
  if (!(Object.keys(wordsInport).includes(nameTypeNow))) wordsInport[nameTypeNow] = words[nameTypeNow];
  for (nameTestNow of Object.keys(words[nameTypeNow])) {
    if (!(Object.keys(wordsInport[nameTypeNow]))) wordsInport[nameTypeNow][nameTest] = words[nameTypeNow][nameTestNow];
  }
}
words = wordsInport;
refreshWords();
}
if (/*localStorage.getItem('syncWithOfficials') == "undefined" || !localStorage.getItem('syncWithOfficials') || */localStorage.getItem('syncWithOfficials') == "false") {
  syncWithOfficialData();
  syncDataCheckbox.checked = false;
}
else syncWithOfficialData(true);
var selectedColours = colours[colourSelector.value];
// Anfragen, ob gespeicherter Fortschritt wiederhergestellt werden soll
if (localStorage.getItem('inputsSchiku') && localStorage.getItem('inputsSchiku') != 'undefined' && confirm('Wollen Sie ihre zuletzt ausgefüllten Tests wiederherstellen? Wenn Sie auf abbrechen oder cancel klicken und danach bestätigen, wird der Fortschritt verloren gehen.')) inputs = JSON.parse(localStorage.getItem('inputsSchiku'));
else if (!localStorage.getItem('inputsSchiku') || localStorage.getItem('inputsSchiku') == 'undefined' || confirm('Wenn Sie auf OK klicken, gehen alle gespeicherten Eingaben von diesem Gerät verloren! Wollen Sie wirklich forfahren?')) localStorage.setItem('inputsSchiku', 'undefined');
else if (localStorage.getItem('inputsSchiku') || localStorage.getItem('inputsSchiku') != 'undefined') inputs = JSON.parse(localStorage.getItem('inputsSchiku'));
recreatePupils();
// aktuallisiert den Test, der aktuell genutzt wird
function refreshNeededTest() {
for (testType of Object.keys(inputs)) {
  if (Object.keys(inputs[testType]).includes(selectedElementId.parent) && testType != "1. settings") {
    for (var i1 = 0; testType != "1. settings" && i1 < Object.keys(inputs[testType]).length; i1++) {
      if (Object.keys(inputs[testType])[i1] == selectedElementId.parent) neededTest = words[testType][inputs[testType][Object.keys(inputs[testType])[i1]].testName];
    }
  }
}
}
// stellt gespeicherten Fortschritt wieder her
function recreatePupils(printMode) {
while (pupils > 0) {
  document.getElementById('pupilSheet' + pupils).remove();
  pupils--;
}
selectedElementId.parent = 'pupilSheet1';
inputs = sortObjectByKey(inputs, true);
for (testAktuell of Object.keys(inputs)) {
  selectedTest = testAktuell;//.replace('Test ', '');
for (sheetAktuell of Object.keys(inputs[testAktuell])) {
  selectedElementId.parent = sheetAktuell;
  if (testAktuell == "1. settings" && !printMode) {
    // gespeicherte Einstellungen wiederherstellen
    for (param of Object.keys(inputs["1. settings"][sheetAktuell])) {
      document.getElementById(sheetAktuell)[param] = inputs["1. settings"][sheetAktuell][param];
      if (sheetAktuell == "patterns" && param == "checked") patternSelected(inputs["1. settings"][sheetAktuell][param]);
      if (sheetAktuell == "showEdit") showEditorSelected(inputs["1. settings"][sheetAktuell][param]);
    }
  }
  else if (testAktuell != "1. settings") {
    // gespeicherte Eingaben der Schreibungen des Schülers wiederherstellen
    selectedColours = colours[colourSelector.value];
    if (!printMode && alwaysShowColoured.checked) {
      selectedColours = colours.colour; // colourSelector.value = "colour";
      patterns = "chart";
    }
  neededTest = words[selectedTest][inputs[testAktuell][sheetAktuell].testName];
  addPupil(selectedTest, inputs[testAktuell][sheetAktuell].testName);
  // var minusI = 0;
  for (idAktuell of Object.keys(inputs[testAktuell][sheetAktuell])) {
    if (!(idAktuell.includes('mirror'))) {
    if (idAktuell.includes('pupilsWriting') && findChild('id', sheetAktuell, idAktuell)) {
    findChild('id', sheetAktuell, idAktuell).value = inputs[testAktuell][sheetAktuell][idAktuell];
    markErrors(idAktuell, sheetAktuell, undefined, true);
    pupilsWritingFinished(idAktuell, true);
  }
  else if (findChild('id', sheetAktuell, idAktuell)) {
    findChild('id', sheetAktuell, idAktuell).value = inputs[testAktuell][sheetAktuell][ idAktuell];
    if (idAktuell == "comment" && !generateInfoText.checked) findChild('id', sheetAktuell, idAktuell).value = findChild('id', sheetAktuell, idAktuell).value.replace(words[testAktuell].preComment, "");
    // minusI++;
  }
  pupilsWritingFinished(idAktuell, true);
}
}
// manuell abgeänderte Graphemtrefferanzahl wiederherstellen
if (Object.keys(inputs[testAktuell][sheetAktuell]).includes("Graphemtreffer")) {
  for (wordNow of Object.keys(inputs[testAktuell][sheetAktuell]["Graphemtreffer"])) {
    if (findChild("id", findChild("word", sheetAktuell, wordNow), "graphemtrefferGot", true)) {
    findChild("id", findChild("word", sheetAktuell, wordNow), "graphemtrefferGot", true).value = inputs[testAktuell][sheetAktuell]["Graphemtreffer"][wordNow].got;
    findChild("id", findChild("word", sheetAktuell, wordNow), "graphemtrefferPossible", true).value = inputs[testAktuell][sheetAktuell]["Graphemtreffer"][wordNow].possible;
    getAllGraphemtreffer(true, wordNow, sheetAktuell);
    if (!auswertung.doNotCount[sheetAktuell].includes(wordNow)) auswertung.doNotCount[sheetAktuell].push(wordNow);
  }
  }
}
// Die gespiegelten Buchstaben wiederherstellen
for (var i2 = 0; inputs[testAktuell][sheetAktuell].mirror && i2 < Object.keys(inputs[testAktuell][sheetAktuell].mirror).length; i2++) {
  var wordsIn = Object.keys(inputs[testAktuell][sheetAktuell].mirror)[i2];
  for (var i4 = 0; i4 < inputs[testAktuell][sheetAktuell].mirror[wordsIn].length; i4++) {
    if (inputs[testAktuell][sheetAktuell].mirror[wordsIn][i4]) {
    // findChild('word', sheetAktuell,wordsIn);
    findChild('class', findChild('word', sheetAktuell,wordsIn), 'correctionLetter' + i4, true).style.backgroundColor = selectedColours.spiegelverkehrt.text;
    findChild('class', findChild('word', sheetAktuell,wordsIn), 'correctionLetter' + i4, true).style.color = "white";
  }
  }
}
pupilsWritingFinished(idAktuell, true);
getEveryCategory(printMode);
  makeTextboxBigger();
}
}
}
}
// Öffnen des Editors ermöglichen/verstecken bzw. vermeiden
function showEditorSelected(checked) {
  if (checked) {
    openEditorB.style.display = "inline";
    refreshWords(null, true);
  }
  else {
    openEditorB.style.display = "none";
    refreshWords(true, true);
  }
}
// kontrolliert die Größe des Feldes für Anmerkungen (wird je nach Bedarf größer und verkleinert Grafik)
function makeTextboxBigger() {
findChild('id', selectedElementId.parent, 'comment').scroll(0, 1000);
while (findChild('id', selectedElementId.parent, 'comment').scrollTop > 0) {
  findChild('id', selectedElementId.parent, 'comment').style.height = JSON.parse(findChild('id', selectedElementId.parent, 'comment').style.height.replace('px', '')) + 1 + 'px';
  document.getElementById('divGraph' + selectedElementId.parent.replace('pupilSheet', '')).style.top = JSON.parse(document.getElementById('divGraph' + selectedElementId.parent.replace('pupilSheet', '')).style.top.replace('px', '')) + 1 + 'px';
  document.getElementById('divGraph' + selectedElementId.parent.replace('pupilSheet', '')).style.height = JSON.parse(document.getElementById('divGraph' + selectedElementId.parent.replace('pupilSheet', '')).style.height.replace('px', '')) - 1 + 'px';
}
}

document.onkeydown = function(event) {
  // Anwählen des nächsten Textfeldes bei Drücken von Tab (wegen Textfeldern für Grapemtreffer nicht automatisch)
 if (event.key == 'Tab' && document.getElementById(selectedElementId.element.toString().split(' ')[0] + ' ' + (JSON.parse(selectedElementId.element.toString().split(' ')[1]) + 1))) {
   setTimeout(function () {
     if (selectedElementId.element.includes('pupilsWriting')) findChild('id', selectedElementId.parent, selectedElementId.element.toString().split(' ')[0] + ' ' + (JSON.parse(selectedElementId.element.toString().split(' ')[1]) + 1)).select();
   }, 10);
 }
 // Erkennung der Tastenkomination zum Öffnen der Druckeinstellungen
if (!printerMode.checked && event.key == "p" && event.ctrlKey && confirm('Wollen Sie die ausgewerteten Blätter drucken? Wenn Sie die folgenden Informationen bestätigt haben, warten Sie bitte bis ein Fenster mit der Übersicht der zu druckenden Seiten erscheint.')) {
   if (printMode(true, true)) {
     printerMode.checked = true;
   }
 }
  if (event.key == "p" && event.ctrlKey) {
    event.preventDefault();
  }
}
/*
 * PURPOSE : generiert ein neues HTML Element
 *  PARAMS : attr - Attribute des Elements
 *           elm - Typ des Elements
 *           childOf - in welchem HTML Element soll das neue eingefügt werden? (wenn nicht angegeben wird es ganz außen unten eingefügt)
 */
  function addElement(attr, elm, childOf, asElement) {
      var newElement = document.createElement(/*'span'*/elm);
      if (childOf && !asElement) document.getElementById(childOf).appendChild(newElement);
      else if (childOf) childOf.appendChild(newElement);
      else tests.appendChild(newElement);
      for (attrNow of Object.keys(attr)) {
        if (attrNow == 'innerText') newElement.innerText = attr[attrNow];
        else newElement.setAttribute(attrNow/*'style'*/, /*'color:' + word[i].colour*/attr[attrNow]);
      }
    }
printerMode.checked = false;
var isInViewport = function (elem) {
  var bounding = elem.getBoundingClientRect();
  return (
      bounding.top >= 0 &&
      bounding.left >= 0 &&
      bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};
window.onscroll = function (e) {  
  // arrow up visibility
  if (!showHistory.checked || isInViewport(document.getElementById("name" + Object.keys(inputs[selectedTest])[0].split("Sheet")[1]))) {
    arrowUp.style.display = "none";
  }
  else {
    arrowUp.style.display = "block";
  }
  test_name = inputs[selectedTest][Object.keys(inputs[selectedTest])[Object.keys(inputs[selectedTest]).length - 1]].testName;
  // arrow down visibility
  if (!showHistory.checked || isInViewport(findChild("id", Object.keys(inputs[selectedTest])[Object.keys(inputs[selectedTest]).length - 1], "pupilsWriting " + Math.round(officialData[selectedTest][test_name].words.length/2)))) {
    arrowDown.style.display = "none";
  }
  else {
    arrowDown.style.display = "block";
  }
}
var isInViewport = function (elem) {
  try {
    var bounding = elem.getBoundingClientRect();
    return (
      bounding.top >= 0 &&
      bounding.left >= 0 &&
      bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    } catch (err) {
      console.log("element not found: " + err);
      return true;
    }
};
function clearHistory() {
  if (!confirm("Sind Sie sich sicher, dass Sie alle alten gespeicherten Tests löschen wollen? Nur der letzte (sichtbare) Test wird verbleiben!")) return;
  while (Object.keys(inputs[selectedTest]).length > 1) {
    delete inputs[selectedTest][Object.keys(inputs[selectedTest])[0]];
  }
  localStorage.setItem('inputsSchiku', JSON.stringify(inputs));
}
window.onafterprint = function(){
  // TODO: optional oder so?
  window.location.reload();
}
function recreateOpenSheets() {
  while (document.getElementsByClassName("pupilSheet").length > 0) {
    document.getElementsByClassName("pupilSheet")[0].remove();
  }
  if (selectedTest == "1. settings") selectedTest = "Kreis Unna";
    if (showHistory.checked) {
      recreatePupils();
    }
    else {
      // recreatePupil(Object.keys(inputs[selectedTest])[Object.keys(inputs[selectedTest]).length - 1]);
      recreatePupil(selectedElementId.parent);
    }
}