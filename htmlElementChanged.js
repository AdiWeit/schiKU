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
  if (preview.checked && settingsChanged) {
    if (showHistory.checked) recreatePupils();
    else recreatePupil(selectedElementId.parent);
  }
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
function printMode(checked) {
  if ((Array.from(document.querySelectorAll('input[type=date]')).map(x => x.valueAsDate).includes(null) && !confirm("Sie haben noch nicht das Datum aller Tests eingegeben! Sind Sie sich sicher, dass sie trotzdem drucken wollen?")) || (Array.from(document.getElementsByClassName("names")).map(x => x.value).includes('') && !confirm("Sie haben noch keinen Schülernamen eingegeben! Sicher dass Sie trotzdem drucken wollen?"))) {
    return;
  }
  if (checked) {
    printerMode.checked = true;
    alert('Bitte bestätigen Sie die folgenden Meldungen mit "OK" und haben Sie einen Augenblick Geduld, bis alle Auswertungsbögen auf das zum Ausdrucken benötigte Layout angepasst wurden. Ist dies geschehen, werden nur noch die auf dem Druck gewünschten Elemente zu sehen sein. Die Hinweise sind auch in der Anleitung (F1 drücken oder in den Einstellungen  auf "Hilfe (Anleitung)" klicken) unten auffindbar. ');
    alert('Der Browser Chrome wird empfohlen. Bitte wählen Sie unter "Ausrichtung" "Porträt" (hochformat). Bitte achten Sie zudem auf leere letzte Seiten. Falls eine vorhanden sein sollte, wählen sie unter "Seiten" "benutzerdefiniert" und geben sie beispielsweise wenn es insgesamt 4 Seiten sind und davon eine leer ist "1-3" ein.\n Wenn Sie die Seiten als PDF speichern wollen, wählen sie unter Ziel "als PDF speichern". Für lochbare Din A4 Seiten werden links mindestens 15 mm Rand benötigt. Um die Ränderbreiten manuell einzustellen, klicken Sie auf "weitere Einstellungen" und wählen Sie unter "Ränder" "benutzerdefiniert".');
    selections.style.display = "none";
    document.getElementById('addPupil').style.display = "none";
    document.getElementById('openEditorB').style.display = "none";
    for (const elm of document.getElementsByClassName("deleteButton")) {
      elm.style.display = "none";
    }
    arrowUp.style.display = "none";
    arrowDown.style.display = "none";
  }
  // recreatePupils(true);
  var list = [selectedElementId.parent];
  if (showHistory.checked) {
    list = Object.keys(inputs[selectedTest])
  }
  recreateOpenSheets();
  for (sheet of list) {
    sheetNr = sheet.split("Sheet")[1];
    // replacing input fields with text
    if (removeTextFields.checked) {
      while (document.getElementsByClassName('graphemtrefferGotPupilSheet' + sheetNr).length > 0) {
        elm = document.getElementsByClassName('graphemtrefferGotPupilSheet' + sheetNr)[0]
        elm.replaceWith(addElement({innerText: elm.value, style: "margin-left: 10px;"}, "b"));
      }
      while (document.getElementsByClassName('graphemtrefferPossiblePupilSheet' + sheetNr).length > 0) {
        elm = document.getElementsByClassName('graphemtrefferPossiblePupilSheet' + sheetNr)[0]
        addElement({innerText: " Graphemtreffer"}, "a", elm.parentElement, true)
        elm.replaceWith(addElement({innerText: elm.value}, "b"));
      }
      // TODO: padding 1, double-dashed border?
      elm = document.getElementById("name" + sheetNr)
      elm.replaceWith(addElement({innerText: elm.value, style: "margin-top: 3px;"}, "b"));
      elm = document.getElementById("class" + sheetNr)
      elm.replaceWith(addElement({innerText: elm.value, style: "margin-left: 11px; margin-bottom: 3px"}, "b"));
      elm = document.getElementById("date" + sheetNr)
      elm.replaceWith(addElement({innerText: `${elm.valueAsDate?.getDate()}.${elm.valueAsDate?.getMonth() + 1}.${elm.valueAsDate?.getFullYear()}`}, "b"));
    }
    while (document.getElementsByClassName("automaticGraphemTreffer").length) {
      document.getElementsByClassName("automaticGraphemTreffer")[0].remove();
    }
  }
  // TODO: checked gamz weg?
  if (checked) {
    setTimeout(() => {
      window.print();
    }, 1111);
  }
  return true;
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
    markErrors(id, selectedElementId.parent, true/*, verstehe nicht warum doNotMark true sein sollte*/);
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
  if (id == "comment" && !printerMode.checked) makeTextboxBigger();
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
function pupilInfoChanged({name, date, elm}) {
  // TODO mehrere Tests mit gleichen Daten
  var same = [];
  for (const testName of Object.keys(inputs)) {
    for (const sheetNr of Object.keys(inputs[testName])) {
      if (sheetNr != elm.parentElement.id) {
        if (inputs[testName][sheetNr]["name" + sheetNr.split("Sheet")[1]] == name) {
          same.push({testName: testName, sheetId: sheetNr, type: "name"});
        }
        if (inputs[testName][sheetNr]["date" + sheetNr.split("Sheet")[1]] == date) {
          same.push({testName: testName, sheetId: sheetNr, type: "date"});
        }
      }
    }
  }
  if (same.map(x => x.type).includes("name") && same.map(x => x.type).includes("date") && confirm("Es existiert bereits ein Test mit den eingegebenen Daten. Wollen Sie diesen laden? Ihre bisherigen Eingaben dieses Tests gehen dabei verloren. ")) {
    delete inputs[selectedTest][selectedElementId.parent];
    selectedTest = same[0].testName;
    recreatePupil(same[0].sheetId, selectedElementId.parent);
  }
}

function RefreshHistoryDisplay() {
  recreateOpenSheets();
  settingsClosed();
}
function restore_latest_test() {
  while (pupils > 0) {
    document.getElementById('pupilSheet' + pupils)?.remove();
    pupils--;
  }
  testsObj = inputs[selectedTest];
  recreatePupil(Object.keys(testsObj)[Object.keys(testsObj).length - 2]);
  settings.style.display = 'none';
}
function deleteTest(parent) {
  if (confirm(('Sind Sie sicher, dass Sie den Test von "' + inputs[selectedTest][parent]["name" + parent.split("Sheet")[1]] + '" löschen wollen?').replace("von undefined", "ohne Schülernamen"))) {
    delete inputs[selectedTest][parent];
    document.getElementById(parent).remove();
  }
}
var selectedGraphemtreffer = {possible: 0, got: 0};