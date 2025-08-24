function settingChanged(id, attrs, refresh) {
  if (!inputs["1. settings"]) inputs["1. settings"] = {};
  inputs["1. settings"][id] = {};
  if (id == "showEdit") showEditorSelected(attrs.checked);
  for (attr of Object.keys(attrs)) {
    inputs["1. settings"][id][attr] = attrs[attr];
  }
  if (refresh) settingsChanged = true;
  localStorage.setItem('inputsSchiku', JSON.stringify(inputs));
  // if (document.getElementsByClassName('pupilSheet').length <= 3) {
      // recreateOpenSheets();
      // recreatePupil(true, selectedElementId.parent);
  // }
}
function selectPrintColours(value) {
  if (value == "colour") blackWhiteSettings.style.display = "none";
  else blackWhiteSettings.style.display = "block";
  settingChanged("blackWhiteSettings", {style: "display: " + blackWhiteSettings.style.display});
  settingChanged("colourSelector", {value: value}, true);
}
var patterns = "chart";
function patternSelected(checked, recreate) {
  if (checked) patterns = "chart";
  else patterns = "text";
  if (!recreate) settingChanged("patterns", {checked: checked}, true);
}
// aktiviert den print mode
// @param checked: über Einstellungen aktiviert
       // pressed: Tastenkombination zum Drucken gedrückt
function printMode(checked, pupilSheets) {
  if ((Array.from(document.querySelectorAll('input[type=date]')).map(x => x.valueAsDate).includes(null) && !confirm("Sie haben noch nicht das Datum aller Tests eingegeben! Sind Sie sich sicher, dass sie trotzdem drucken wollen?")) || (Array.from(document.getElementsByClassName("names")).map(x => x.value).includes('') && !confirm("Sie haben noch keinen Schülernamen eingegeben! Sicher dass Sie trotzdem drucken wollen?"))) {
    return;
  }
  if (checked) {
    printerMode.checked = true;
    if (printAlerts.checked) {
      alert('Bitte bestätigen Sie die folgenden Meldungen mit "OK" und haben Sie einen Augenblick Geduld, bis alle Auswertungsbögen auf das zum Ausdrucken benötigte Layout angepasst wurden. Ist dies geschehen, werden nur noch die auf dem Druck gewünschten Elemente zu sehen sein. Die Hinweise sind auch in der Anleitung (F1 drücken oder in den Einstellungen  auf "Hilfe (Anleitung)" klicken) unten auffindbar. ');
      alert('Der Browser Chrome wird empfohlen. Bitte wählen Sie unter "Ausrichtung" "Porträt" (hochformat). Bitte achten Sie zudem auf leere Seiten. Falls die letzte Seite leer sein sollte, wählen Sie unter "Seiten" "benutzerdefiniert" und geben sie beispielsweise wenn es insgesamt 4 Seiten sind und davon die letzte leer ist "1-3" ein.\n Wenn Sie die Seiten als PDF speichern wollen, wählen sie unter Ziel "als PDF speichern". Für lochbare Din A4 Seiten werden links mindestens 15 mm Rand empfohlen. Um die Ränderbreiten manuell einzustellen, klicken Sie auf "weitere Einstellungen" und wählen Sie unter "Ränder" "benutzerdefiniert".');
    }
    toggleButtonsVis("none");
  }
  var list = [selectedElementId.parent];
  if (pupilSheets) list = pupilSheets;
  else {
    recreateOpenSheets();
  }
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
      elm.replaceWith(addElement({innerText: `${elm.valueAsDate?.getDate()}.${elm.valueAsDate?.getMonth() + 1}.${elm.valueAsDate?.getFullYear()}`.replace('undefined.NaN.undefined', '')}, "b"));
    }
    while (document.getElementsByClassName("automaticGraphemTreffer").length) {
      elm = document.getElementsByClassName("automaticGraphemTreffer")[0];
      if (elm.style.display == "inline") {
        while (elm.parentNode.firstElementChild.id == "correctionLetter") {
          elm.parentNode.firstElementChild.remove();
        }
        // elm.parentNode.appendChild(addElement({innerText: " (manuelle Korrektur)"}, "a", undefined, true));
      }
      elm.remove();
    }
  }
  // TODO: checked gamz weg?
  if (checked) {
    if (list.length == 1) {
      test = inputs[selectedTest][sheet];
      document.title=`SchiKU Test Schreiben ${test.testName.split(' ')[1]} Auswertungsformular_${test["name" + sheet.split("Sheet")[1]]}`;
    }
    else {
      sameInputs = {date: inputs[selectedTest][list[0]]["date" + list[0].split("Sheet")[1]], class: inputs[selectedTest][list[0]]["class" + list[0].split("Sheet")[1]], name: inputs[selectedTest][list[0]]["name" + list[0].split("Sheet")[1]]};
      for (const sheet of list) {
        var test = inputs[selectedTest][sheet]
        for (pType of Object.keys(sameInputs)) {
          if (test[pType + sheet.split("Sheet")[1]] != sameInputs[pType]) {
            sameInputs[pType] = false;
          }
        }
      }
      document.title=`SchiKU Test Auswertungsformulare`;
      var tests = list.map(x => inputs[selectedTest][x]);
      // check if all tests have the same test number (equal words)
      if (tests.every(x => x.testName === tests[0].testName)) {
        document.title += ` Schreiben ${test.testName.split(' ')[1]}`
      }
      if (sameInputs.class) {
        document.title +=` der Klasse ${sameInputs.class}`;
      }
      if (sameInputs.name) {
        document.title += ` des Schülers ${sameInputs.class}`;
      }
      if (sameInputs.date) {
        document.title += " vom " + sameInputs.date;
      }
    }
    setTimeout(() => {
      arrowUp.style.display = "none";
      arrowDown.style.display = "none";
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
  if (id.includes("pupilsWriting")) {
    document.getElementById('testSelector' + selectedElementId.parent.replace("pupilSheet", "")).style.display = "none";
    document.getElementById('testHeadline' + selectedElementId.parent.replace("pupilSheet", "")).style.display = "inline";
    document.getElementById('testHeadline' + selectedElementId.parent.replace("pupilSheet", "")).innerText = document.getElementById('testSelector' + selectedElementId.parent.replace("pupilSheet", "")).value;
  }
  var inputField = findChild('id', selectedElementId.parent, id);
  if (inputField?.value == "r") {
    inputField.value = findChild('id', selectedElementId.parent, "word " + id.replace("pupilsWriting ", "")).innerText;
    markErrors(id, selectedElementId.parent, true/*, verstehe nicht warum doNotMark true sein sollte*/);
    if (inputField.style.backgroundColor == inputField.style.color) {
      inputField.style.color = "white";
    }
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
  inputs[/*'Test ' + */selectedTest][selectedElementId.parent].completed = completed();
}
// gibt zurück, ob Test komplett ausgefüllt ist
function completed() {
  var pupilNr = selectedElementId.parent.replace("pupilSheet", "");
  var completed = true;
  // check if all pupil writings are filled out
  for (const elm of document.getElementsByClassName("writingPupilSheet" + pupilNr)) {
    if (elm.value == "") completed = false;
  }
  return (inputs[/*'Test ' + */selectedTest][selectedElementId.parent]["name" + pupilNr] != undefined && inputs[/*'Test ' + */selectedTest][selectedElementId.parent]["date" + pupilNr] != undefined && inputs[/*'Test ' + */selectedTest][selectedElementId.parent]["class" + pupilNr] != undefined && completed).toString().replace("true", "ja").replace("false", "nein");
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
  var letterElm = findChild('explicitId',  findChild('id', selectedElementId.parent, wordId.replace('pupilsWriting', 'correction')), 'correctionLetter' + index, true);
  var word = replaceAll(neededTest.words[wordId.replace('pupilsWriting ', '') - 1], '-', '');
  if (!inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror) inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror = {};
  if (!inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror[word]) {
    inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror[word] = [];
  }
  if (!inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror[word][index]) {
    inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror[word][index] = letterElm.style.backgroundColor;
    letterElm.style.backgroundColor = selectedColours.spiegelverkehrt.text;
    if (selectedColours.spiegelverkehrt.text == "rgb(219, 219, 219)") letterElm.style.color = "black";
    else letterElm.style.color = "white";
    if (mirrorLetter.checked) {
      letterElm.className += " mirrored";
    }
  }
  else {
  letterElm.style.backgroundColor = inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror[word][index];
  letterElm.style.color = "white";
  if (["white", "rgb(219, 219, 219)"].includes(inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror[word][index])) {
    letterElm.style.color = "black";
  }
  inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror[word][index] = undefined;
  letterElm.className = letterElm.className.replace(" mirrored", "");
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
    recreatePupil(true, same[0].sheetId, selectedElementId.parent);
  }
}

function restore_specific_test(type) {
  if (type == "newest" && Object.keys(inputs["Kreis Unna"]).length <= 1) {
    alert("Der angezeigte Test ist bereits der neuste. ");
    return;
  }
  while (pupils > 0) {
    document.getElementById('pupilSheet' + pupils)?.remove();
    pupils--;
  }
  testsObj = inputs[selectedTest];
  if (type == "newest") {
    recreatePupil(true, Object.keys(testsObj)[Object.keys(testsObj).length - 2]);
  }
  if (type == "oldest") {
    recreatePupil(true, Object.keys(testsObj)[0]);
  }
  alertCorrectionChanged();
  settings.style.display = 'none';
}
function deleteTest(parent, pConfirm=true) {
  if (!pConfirm || confirm(('Sind Sie sicher, dass Sie den Test von "' + inputs[selectedTest][parent]["name" + parent.split("Sheet")[1]] + '" löschen wollen?').replace("von undefined", "ohne Schülernamen"))) {
    delete inputs[selectedTest][parent];
    document.getElementById(parent)?.remove();
    if (alert_enough_storage) {
      var storage_full = false;
      try {
        localStorage.setItem('inputsSchiku', JSON.stringify(inputs));
      }
      catch(err) {
        alert("Der Speicherplatz ist leider immer noch zu voll. Bitte löschen Sie weitere Tests.");
        storage_full = true;
      }
      if (!storage_full) alert("Sie haben genug Speicherplatz frei gemacht, um den neuesten Test zu speichern. ");
    }
  }
}
var selectedGraphemtreffer = {possible: 0, got: 0};

function toggleTestSelection() {
  selectionGrid.height = Math.min(Object.keys(inputs["Kreis Unna"]).length*47 + 58, 500);
  var data = [];
  // var rowData = [
    //   { Datum: new Date("2024-03-01"), Klasse: "6a", Name: "Adrian of Hadrian", pupilSheet: "pupilSheet1" },
    // ];
  for (let i = 0; i < Object.keys(inputs["Kreis Unna"]).length; i++) {
    var sheet = Object.keys(inputs["Kreis Unna"])[i];
    var test = inputs["Kreis Unna"][sheet];
    data[i] = {Datum: test["date" + sheet.split("Sheet")[1]], Klasse: test["class" + sheet.split("Sheet")[1]], Name: test["name" + sheet.split("Sheet")[1]], pupilSheet: sheet, ausgefüllt: test.completed};
  }
  selectionGrid.contentWindow.postMessage("set data: " + JSON.stringify(data), "*")
  if (testSelection.style.display == "none") {
    testSelectionToggler.innerText = "Auswahl schließen";
    testSelection.style.display = "block";
  }
  else {
    testSelection.style.display = "none";
    testSelectionToggler.innerText = "Tests zum Öffnen/drucken(auch Speichern)/löschen auswählen";
  }
}

function openSelectedTests(type) {
  if (type == "print") printerMode.checked = true;
  if (type == "delete") deleteSelected.style.backgroundColor = "red";
  while (document.getElementsByClassName("pupilSheet").length > 0 && type != "delete") {
    document.getElementsByClassName("pupilSheet")[0].remove();
  }
  selectionGrid.contentWindow.postMessage("get data", "*");
}
var selectedTests = [];
window.addEventListener('message', function(event) {
  if (typeof event.data == "string" && event.data.includes("sendData")) {
    selectedTests = JSON.parse(event.data.split("sendData: ")[1]);
    pupilSheets = [];
    selectedTests.forEach((sheet, i) => {
    // nur Tests anzeigen, wenn diese nicht gelöscht werden sollen
    if (deleteSelected.style.backgroundColor != "red") {
      if (i < selectedTests.length - 1) recreatePupil(false, sheet.pupilSheet);
      else recreatePupil(true, sheet.pupilSheet);
    }
    else deleteTest(sheet.pupilSheet, false);
    pupilSheets.push(sheet.pupilSheet);
  });
  alertCorrectionChanged();
  testSelection.style.display = "none";
  testSelectionToggler.innerText = "Tests zum Öffnen/drucken(auch Speichern)/löschen auswählen";
  settings.style.display = 'none';
  if (printerMode.checked) printMode(true, pupilSheets);
  if (deleteSelected.style.backgroundColor == "red") {
    deleteSelected.style.backgroundColor = "";
  }
  printerMode.checked = false;
}
}, false);

function autoCorrectionSettingChanged(elm) {
  if (!Array.from(document.querySelectorAll('input[group="autoCorrection"]')).map(x => x.checked).includes(true)) {
    elm.checked = true;
    alert("Bitte verwenden Sie mindestens eine der zwei unten stehenden Arten falsche Buchstaben zu markieren!");
  }
}