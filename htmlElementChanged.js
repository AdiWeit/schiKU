function settingChanged(id, attrs, refresh) {
  if (!inputs["1. settings"]) inputs["1. settings"] = {};
  inputs["1. settings"][id] = {};
  if (id == "showEdit") showEditorSelected(attrs.checked);
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
function selectPrintColours(value) {
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
// aktiviert den print mode
// @param checked: über Einstellungen aktiviert
       // pressed: Tastenkombination zum Drucken gedrückt
function printMode(checked, pressed) {
  if (checked) {
    printerMode.checked = true;
    if (!pressed) alert("drücken sie Str und p, um die Auswertungen auszudrucken. Die Optionen (drucken, als PDF speichern, Grafikeinstellungen etc.) erscheinen einige Zeit nach dem Druckauftrag, oder durch Neuladen (erneutes Aufrufen) der Seite wieder. Bitte haben Sie einen Augenblick Geduld, bis alle Auswertungsbögen auf das zum Ausdrucken benötigte Layout angepasst wurden. Ist dies geschehen, werden die Druckereinstellungen verschwunden sein.");
    else {
      alert('Der Browser Chrome wird empfohlen. Bitte wählen Sie unter Ausrichtung" Hochformat. Bitte achten Sie zudem auf leere letzte Seiten. Falls eine vorhanden sein sollte, wählen sie unter "Seiten" "benutzerdefiniert" und geben sie beispielsweise wenn es insgesamt 4 Seiten sind und davon eine leer ist "1-3" ein.\n Wenn Sie die Seiten als PDF speichern wollen, wählen sie unter Ziel "als PDF speichern". Für lochbare Din A4 Seiten oder ein richtiges Format werden links und oben mindestens 15 mm Rand benötigt. Um die Ränderbreiten manuell einzustellen, klicken Sie auf "weitere Einstellungen" und wählen Sie unter "Ränder" "benutzerdefiniert".');
      alert('Andere mögliche Maße, damit es ein Schüler/eine Schülerin pro Blatt bleibt: links 17mm, oben 17,5mm oder links 20mm, oben > 21mm. Für andere Maße, scrollen Sie runter bis zur letzten Auswertung und probieren Sie selber andere Maße aus, bei denen das Feld mit dem Namen oben auf dem Blatt steht. Tipp: stellen Sie eine Entfernung vom rechten Rand ein, die ihnen gefällt und verändern (meist vergrößern) Sie den Abstand vom oberen Rand so lange, bis alle Informationen über den Test (Personenname, Klasse, Datum) auftaucht. Wenn auf der ersten und letzten Seite die Grafik abgebildet ist, wird wahrscheinlich ein Schüler pro Blatt gedruckt.');
    }
    selections.style.display = "none";
    document.getElementById('addPupil').style.display = "none";
    document.getElementById('openEditorB').style.display = "none";
  }
    recreatePupils(true);
}
// wird aufgerufen, wenn Eingabe der Schreibweise des Schülers durch Abwählen der Textbox (onchange) beendet wurde..
// falls nur ein "r" eigegeben wurde, wird das Wort als korrekt anerkannt.
// @param id: id der bearbeiteten Textbox
       // restoringData: falls true werden die Eingaben des Lehrers wiederhergestellt, weshalb nicht nach jedem Wort die Grafik aktuallisiert wird.
function pupilsWritingFinished(id, restoringData) {
  document.getElementById('testSelector' + selectedElementId.parent.replace("pupilSheet", "")).style.display = "none";
  document.getElementById('testHeadline' + selectedElementId.parent.replace("pupilSheet", "")).style.display = "inline";
  document.getElementById('testHeadline' + selectedElementId.parent.replace("pupilSheet", "")).innerText = document.getElementById('testSelector' + selectedElementId.parent.replace("pupilSheet", "")).value;
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
  findChild('class',  findChild('id', selectedElementId.parent, wordId.replace('pupilsWriting', 'correction')), 'correctionLetter' + index, true).style.color = "white";
  if (inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror[word][index] == "white") findChild('class',  findChild('id', selectedElementId.parent, wordId.replace('pupilsWriting', 'correction')), 'correctionLetter' + index, true).style.color = "black";
  inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror[word][index] = undefined;
}
localStorage.setItem('inputsSchiku', JSON.stringify(inputs));
getEveryCategory();
}
