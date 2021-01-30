function settingChanged(id, attrs, refresh) {
  if (!inputs["1. settings"]) inputs["1. settings"] = {};
  inputs["1. settings"][id] = {};
  for (attr of Object.keys(attrs)) {
    inputs["1. settings"][id][attr] = attrs[attr];
  }
  if (refresh) settingsChanged = true;
  localStorage.setItem('inputsSchiku', JSON.stringify(inputs));
}
function settingsClosed() {
  settings.style.display = 'none';
  if (preview.checked && settingsChanged) recreatePupils();
  settingsChanged = false;
}
function selectColours(value) {
  if (value == "colour") showPatterns.style.display = "none";
  else showPatterns.style.display = "inline";
  settingChanged("showPatterns", {style: "display: " + showPatterns.style.display});
  settingChanged("colourSelector", {value: value}, true);
}
var patterns = "chart";
function patternSelected(checked) {
  if (checked) patterns = "chart";
  else patterns = "text";
  settingChanged("patterns", {checked: checked}, true);
}
function printMode(checked) {
  if (checked) {
    alert("drücken sie Str und p, um die Website ausdrucken zu können. Die Optionen erscheinen einige Zeit nach dem Druckauftrag, oder durch Neuladen der Seite wieder. Bevor sie die Tastenkombination drücken, warten sie jedoch bitte ab, bis die Optionen verschwunden sind. Wenn sie zuvor Druckeinstellungen aus den Optionen vornehmen wollen, tuen sie das bitte jetzt.");
    setTimeout(function () {
    selections.style.display = "none";
    document.getElementById('addPupil').style.display = "none";
    document.getElementById('openEditorB').style.display = "none";
  }, 3333);
  }
  setTimeout(function () {
    recreatePupils(true);
  }, 3333);
}
// wird aufgerufen, wenn Eingabe der Schreibweise des Schülers durch Abwählen der Textbox (onchange) beendet wurde..
// falls nur ein "r" eigegeben wurde, wird das Wort als korrekt anerkannt.
// @param id: id der bearbeiteten Textbox
       // restoringData: falls true werden die Eingaben des Lehrers wiederhergestellt, weshalb nicht nach jedem Wort die Grafik aktuallisiert wird.
function pupilsWritingFinished(id, restoringData) {
  if (findChild('id', selectedElementId.parent, id) && findChild('id', selectedElementId.parent, id).value == "r") {
    findChild('id', selectedElementId.parent, id).value = findChild('id', selectedElementId.parent, "word " + id.replace("pupilsWriting ", "")).innerText;
    markErrors(id, selectedElementId.parent, true, restoringData);
  }
  if (!restoringData) {
    setTimeout(function () {
      getEveryCategory();
    }, 50);
  }
}
// Angaben des Names, Schülers und Datums wird direkt nach Änderung gespeichert
// @param id: id der abgeänderten addTextbox
// @param value: Inhalt der Textbox
function dataChanged(id, value) {
  if (!inputs[/*'Test ' + */selectedTest]) inputs[/*'Test ' + */selectedTest] = {};
  if (!inputs[/*'Test ' + */selectedTest][selectedElementId.parent]) inputs[/*'Test ' + */selectedTest][selectedElementId.parent] = {};
  inputs[/*'Test ' + */selectedTest][selectedElementId.parent][id] = value;
  localStorage.setItem('inputsSchiku', JSON.stringify(inputs));
  if (id == "comment") makeTextboxBigger();
}
// setzt Graphemtreffer auf Auswertung des Programmes zurrück
function resetGraphemtreffer(element, parent) {
  for (var i = 0; i < auswertung.doNotCount[parent].length; i++) {
    if (auswertung.doNotCount[parent][i] == findChild('id', parent, element.replace('pupilsWriting', 'word')).innerText) {
      auswertung.doNotCount[parent].splice(i, 1);
    }
  }
  delete inputs[selectedTest][parent].Graphemtreffer[findChild('id', parent, element.replace('pupilsWriting', 'word')).innerText]
  markErrors(element, parent);
  getEveryCategory();
}
// Buchstaben, die grafisch gesehen falsch verschriftlicht wurden werden markiert oder abgewählt
function changeMirror(index, wordId) {
  var word = replaceAll(neededTest.words[wordId.replace('pupilsWriting ', '') - 1], '-', '');
  if (!inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror) inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror = {};
  if (!inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror[word]) {
    inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror[word] = [];
  }
  if (!inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror[word][index]) {
    inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror[word][index] = findChild('class',  findChild('id', selectedElementId.parent, wordId.replace('pupilsWriting', 'correction')), 'correctionLetter' + index, true).style.backgroundColor;
    findChild('class',  findChild('id', selectedElementId.parent, wordId.replace('pupilsWriting', 'correction')), 'correctionLetter' + index, true).style.backgroundColor = selectedColours.spiegelverkehrt.text;
    findChild('class',  findChild('id', selectedElementId.parent, wordId.replace('pupilsWriting', 'correction')), 'correctionLetter' + index, true).style.color = "white";
  }
  else {
  findChild('class',  findChild('id', selectedElementId.parent, wordId.replace('pupilsWriting', 'correction')), 'correctionLetter' + index, true).style.backgroundColor = inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror[word][index];
  findChild('class',  findChild('id', selectedElementId.parent, wordId.replace('pupilsWriting', 'correction')), 'correctionLetter' + index, true).style.color = "black";
  inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror[word][index] = undefined;
}
localStorage.setItem('inputsSchiku', JSON.stringify(inputs));
getEveryCategory();
}