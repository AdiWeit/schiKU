// TODO: nur für veraltete Version (später löschen)
if (localStorage.getItem('words') && localStorage.getItem('words') != "undefined" && !Object.keys(JSON.parse(localStorage.getItem('words'))["Kreis Unna"]).includes("preComment")) localStorage.clear();
  categories.style.left = 166 + 22;
  var colours = {colour: {right: {chart: "rgba(0, 255, 0, 1)", text: "green"}, wrong: {dark: {chart: "red", text: "red"}, light: {text:"#FD6441"}}, doNotCount: {chart: "gray"}, spiegelverkehrt: {chart: "#00BFFF", text: "#00BFFF"}}, blackWhite: {right: {chart: pattern.draw('diamond-box', 'black'), text: "rgb(16,16,16)"}, wrong: {dark: {chart: pattern.draw('cross', 'rgb(56,56,56)'), text: "rgb(56,56,56)"}, light: "rgb(56,56,56)"} , doNotCount: {chart: pattern.draw('diagonal', 'gray'), text: "gray"}, spiegelverkehrt: {chart: pattern.draw('line-vertical', 'silver'), text: "silver"}}}
  document.getElementById('addPupil').style.left = 300 + "px";
  document.getElementById('addPupil').style.position = 'fixed';
  document.getElementById('testSelector').style.left = 388 + "px";
  document.getElementById('testSelector').style.position = 'fixed';
  document.getElementById('testTypeSelector').style.left = 300 + "px";
  document.getElementById('testTypeSelector').style.position = 'fixed';
  document.getElementById('openEditorB').style.left = 300 + "px";
  document.getElementById('openEditorB').style.position = 'fixed';
  window.scroll(0, 0);
// TODO: einzele pupilsheet zähler für verschiedene Tests?
// TODO: kategorien statt Kategorien
var neededTest = words['Kreis Unna']["Test 1"];
var pupils = 0;
var selectedElementId = {parent: 'pupilSheet1', element: 'pupilsWriting 1'};
var myBarChart = [];
var settingsChanged = false;
// kopiert den Code für die Tests, sodass ich be seriösen Quellen den Code direkt übernehmen kann
function copyCode() {
document.getElementById('message').style.display = "inline";
var copytext;
document.getElementById("message").value = replaceAll( replaceAll( replaceAll( replaceAll( replaceAll(JSON.stringify(words), '"Kategorien"', 'Kategorien'), '"words"', 'words' ),  '"words"', 'words'),  ':', ': '), ',', ', ');
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
pupils++;
if (!inputs[/*'Test ' + */testTypeSelector.value]) inputs[/*'Test ' + */testTypeSelector.value] = {};
if (!inputs[/*'Test ' + */testTypeSelector.value]['pupilSheet' + pupils]) inputs[/*'Test ' + */testTypeSelector.value]['pupilSheet' + pupils] = {};
if (!inputs[/*'Test ' + */testTypeSelector.value]['pupilSheet' + pupils].testName) inputs[/*'Test ' + */testTypeSelector.value]['pupilSheet' + pupils].testName = testSelector.value;
addElement({id: 'pupilSheet' + pupils, style: 'width:21cm; height:29.7cm'}, 'div');
addElement({id: 'testSelector' + pupils, onchange: 'inputs["' + testTypeSelector.value + '"]["pupilSheet' + pupils + '"]' + '.testName = value; recreatePupils();'}, 'select', 'pupilSheet' + pupils);
addElement({}, 'br', 'pupilSheet' + pupils);
for (test of Object.keys(words[selectedTestType])) {
  if (test != "einGraphemtreffer" && test != "preComment") addElement({value: test, innerText: test}, 'option', 'testSelector' + pupils);
}
document.getElementById('testSelector' + pupils).value = pSelectedTest;
addElement({placeholder: 'Name Schüler', id: 'name', oninput: 'selectedElementId.element = id; selectedElementId.parent = "pupilSheet' + pupils + '"; dataChanged(id, value);'}, 'input', 'pupilSheet' + pupils);
addElement({placeholder: 'Klasse', id: 'class' + pupils, style: 'width: 50;', oninput: 'selectedElementId.element = id; selectedElementId.parent = "pupilSheet' + pupils + '"; dataChanged(id, value);'}, 'input', 'pupilSheet' + pupils);
addElement({}, 'br', 'pupilSheet' + pupils);
addElement({placeholder: 'Datum', style: 'width: 208;', id: 'date' + pupils, oninput: 'selectedElementId.element = id; selectedElementId.parent = "pupilSheet' + pupils + '"; dataChanged(id, value);'}, 'input', 'pupilSheet' + pupils);
addElement({placeholder: 'Anmerkungen', style: 'position: absolute; right: 0px; height: 20px'/*50px*/, id: 'comment', oninput: 'selectedElementId.element = id; selectedElementId.parent = "pupilSheet' + pupils + '"; dataChanged(id, value);'}, 'textarea', 'pupilSheet' + pupils);
if (generateInfoText.checked) findChild("id", selectedElementId.parent, "comment").innerText = words[selectedTest].preComment;
addElement({id: 'divGraph' + pupils, style: 'position: absolute; right: 0px;'}, 'div', 'pupilSheet' + pupils);
addElement({}, 'br', 'pupilSheet' + pupils);
addElement({id: 'texturpupilSheet' + pupils}, 'canvas', 'divGraph' + pupils);
addElement({}, 'br', 'pupilSheet' + pupils);
for (var i = 0; i < neededTest.words.length; i++) {
  addElement({innerText: replaceAll(neededTest.words[i], '-', ''), id: 'word ' + (i + 1)}, 'a', 'pupilSheet' + pupils);
  addElement({id: 'pupilsWriting ' + (i + 1), style: '  color: white;', class: 'writingPupilSheet' + pupils, placeholder: 'Schreibung Schüler', oninput: 'markErrors(id, "pupilSheet' + pupils + '");', onchange: 'pupilsWritingFinished(id);', title: 'Die Eingabe wird automatisch "korrigiert". \nFalls die automatische Korrektur Fehler enthalten sollte, können Sie die Anzahl der Graphemtreffer korrigieren.\nWenn der Schüler das Wort komplett richtig geschrieben hat, geben Sie nur "r" für richtig ein!'}, 'input', 'pupilSheet' + pupils);
  addElement({id: 'correction ' + (i + 1), word: replaceAll(neededTest.words[i], '-', '')}, 'div', 'pupilSheet' + pupils);
  if (i != neededTest.words.length - 1) addElement({}, 'br', 'pupilSheet' + pupils);
}
addElement({id: 'allGraphemes' + pupils, style: 'font-size: 25'}, 'a', 'pupilSheet' + pupils);
addElement({}, 'br', 'pupilSheet' + pupils);
addElement({id: 'allCorrect' + pupils, style: 'font-size: 25'}, 'a', 'pupilSheet' + pupils);
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
if (localStorage.getItem('syncWithOfficials') == "undefined" || !localStorage.getItem('syncWithOfficials') || localStorage.getItem('syncWithOfficials') == "false") syncWithOfficialData();
else {
syncWithOfficialData(true);
syncDataCheckbox.checked = true;
}
// Anfragen, ob gespeicherter Fortschritt wiederhergestellt werden soll
if (localStorage.getItem('inputsSchiku') && localStorage.getItem('inputsSchiku') != 'undefined' && confirm('Wollen Sie zuletzt ausgefüllten Tests wiederherstellen? Wenn Sie auf abbrechen oder cancel klicken wird der Fortschritt verloren gehen.')) inputs = JSON.parse(localStorage.getItem('inputsSchiku'));
else if (!localStorage.getItem('inputsSchiku') || localStorage.getItem('inputsSchiku') == 'undefined' || confirm('Wenn Sie auf OK klicken gehen alle gespeicherten Eingaben von diesem Gerät verloren! Wollen Sie wirklich forfahren?')) localStorage.setItem('inputsSchiku', 'undefined');
else if (localStorage.getItem('inputsSchiku') || localStorage.getItem('inputsSchiku') != 'undefined') inputs = JSON.parse(localStorage.getItem('inputsSchiku'));
recreatePupils();
// aktuallisiert den Test, der aktuell genutzt wird
function refreshNeededTest() {
for (var i = 0; i < Object.keys(inputs).length; i++) {
  if (Object.keys(inputs[Object.keys(inputs)[i]]).includes(selectedElementId.parent) && Object.keys(inputs)[i] != "1. settings") {
    selectedTest = Object.keys(inputs)[i];
    for (var i1 = 0; selectedTest != "1. settings" && i1 < Object.keys(inputs[selectedTest]).length; i1++) {
      if (Object.keys(inputs[selectedTest])[i1] == selectedElementId.parent) neededTest = words[selectedTest][inputs[selectedTest][Object.keys(inputs[selectedTest])[i1]].testName];
    }
  }
}
}
var selectedColours = colours[colourSelector.value];
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
  if (testAktuell == "1. settings") {
    for (param of Object.keys(inputs["1. settings"][sheetAktuell])) {
      document.getElementById(sheetAktuell)[param] = inputs["1. settings"][sheetAktuell][param];
      if (sheetAktuell == "patterns" && param == "checked") patternSelected(inputs["1. settings"][sheetAktuell][param]);
    }
  }
  else {
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
  else if (idAktuell == "Graphemtreffer") {
    for (wordNow of Object.keys(inputs[testAktuell][sheetAktuell][idAktuell])) {
      findChild("id", findChild("word", sheetAktuell, wordNow), "graphemtrefferGot", true).value = inputs[testAktuell][sheetAktuell][idAktuell][wordNow].got;
      findChild("id", findChild("word", sheetAktuell, wordNow), "graphemtrefferPossible", true).value = inputs[testAktuell][sheetAktuell][idAktuell][wordNow].possible;
      getAllGraphemtreffer(true, wordNow, sheetAktuell);
    }
  }
  pupilsWritingFinished(idAktuell, true);
}
}
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
// kontrolliert die Größe des Felder für Anmerkungen (wird je nach Bedarf größer und verkleinert Grafik)
function makeTextboxBigger() {
findChild('id', selectedElementId.parent, 'comment').scroll(0, 1000);
while (findChild('id', selectedElementId.parent, 'comment').scrollTop > 0) {
  findChild('id', selectedElementId.parent, 'comment').style.height = JSON.parse(findChild('id', selectedElementId.parent, 'comment').style.height.replace('px', '')) + 1 + 'px';
  document.getElementById('divGraph' + selectedElementId.parent.replace('pupilSheet', '')).style.top = JSON.parse(document.getElementById('divGraph' + selectedElementId.parent.replace('pupilSheet', '')).style.top.replace('px', '')) + 1 + 'px';
  document.getElementById('divGraph' + selectedElementId.parent.replace('pupilSheet', '')).style.height = JSON.parse(document.getElementById('divGraph' + selectedElementId.parent.replace('pupilSheet', '')).style.height.replace('px', '')) - 1 + 'px';
}
}

  /*!
* Determine if an element is in the viewport
* (c) 2017 Chris Ferdinandi, MIT License, https://gomakethings.com
* @param  {Node}    elem The element
* @return {Boolean}      Returns true if element is in the viewport
*/
document.onkeydown = function(event) {
 if (event.key == 'Tab' && document.getElementById(selectedElementId.element.toString().split(' ')[0] + ' ' + (JSON.parse(selectedElementId.element.toString().split(' ')[1]) + 1))) {
   setTimeout(function () {
     if (selectedElementId.element.includes('pupilsWriting')) findChild('id', selectedElementId.parent, selectedElementId.element.toString().split(' ')[0] + ' ' + (JSON.parse(selectedElementId.element.toString().split(' ')[1]) + 1)).select();
   }, 10);
 }
 if (event.key == "p" && event.ctrlKey && printerMode.checked) {
   alert('Wenn Sie die Seiten als PDF speichern wollen, wählen sie unter Ziel "als PDF speichern".\n Rand, damit ein Schüler pro Blatt bleibt: links 17mm, oben 17,5mm (reicht aus zum Lochen), oder\nlinks 20mm, oben > 21mm\nwenn Sie andere Maße wollen, scrollen Sie bei der Vorschau bis zur letzten Seite und probieren Sie es selber aus, sodass der Name oben auf dem Blatt steht.\nTipp: stellen Sie eine Entfernung vom rechten Rand ein, die ihnen gefällt und verändern (meist vergrößern) Sie den Abstand vom oberen Rand so lange, bis der Name oben auf der Seite auftaucht. Wenn auch auf der ersten Steite die Grafik abgebildet ist, werden wahrscheinlich alle anderen Blätter korrekt sein.');
   setTimeout(function () {
     selections.style.display = "inline";
     document.getElementById('addPupil').style.display = "inline";
     document.getElementById('settings').style.display = "none";
     document.getElementById('openEditorB').style.display = "inline";
     printMode.checked = false;
     for (var i = 0; i < pupils; i++) {
       selectedElementId.parent = "pupilSheet" + (i + 1);
       refreshNeededTest();
       getEveryCategory(true);
     }
   }, 333000);
 }
 else if (event.key == "p" && event.ctrlKey && confirm('Der Druckermodus ist nicht aktiviert. Damit ein Schüler pro Seite gedruckt bzw. gepeichert wird, muss er jedoch aktiv sein. Wenn Sie ihn aktiveren wollen, klicken sie auf "OK" o.ä. \nFalls sie dies tun, sollten sie das Fenster zum Drucken wieder schließen oder wenn der Optionsbutton weg ist eine Einstellung ändern, damit der Druckermodus in das Fenster zum Drucken aufgenommen wird.')) printMode(true);
}