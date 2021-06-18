// fügt der Auswertung die falsch geschriebenen Buchstaben hinzu
function addWrongLetter(correct, i) {
  try {
    // markiert Buchstaben des Wortes als falsch, damit die Anzahl der richtig geschriebenen Laute gezählt werden kann
    var currentLetter = correct[i].toLowerCase();
    for (lautNow of Object.keys(letterList)) {
      if (letterList[lautNow] && letterList[lautNow][currentLetter]) {
        letterList[lautNow][currentLetter] = false;
      }
    }
    graphemFehler++;
    // Speicherung des Fehlers und Erstellung der Datenstruktur falls nötig
    if (currentLetter == "e" && i == correct.length - 1) currentLetter = '<e>';
    if (!auswertung.wrongLetters[selectedElementId.parent]) auswertung.wrongLetters[selectedElementId.parent] = {};
    if (!auswertung.wrongLetters[selectedElementId.parent][correct]) auswertung.wrongLetters[selectedElementId.parent][correct] = {};
    if (!auswertung.wrongLetters[selectedElementId.parent][correct][currentLetter]) auswertung.wrongLetters[selectedElementId.parent][correct][currentLetter] = 0;
    auswertung.wrongLetters[selectedElementId.parent][correct][currentLetter]++;
  } catch (e) {}
}
var graphemFehler = 0;
var letterList;
var letterCounter;
var selectedTest = "Kreis Unna";
// überprüft Laute auf Richtigkeit und Anzahl
// @param correct: korrekte Schreibweise
//        i: aktueller Index (hier: Position im korrekten Wort)
function checkCategory(correct, i, last, pCorrect, possibleGraphemtreffer) {
  // alle Laute (aller Kategorien) in der Liste "strings" hinzufügen
  var justOneGraphemtreffer = [];
  if (!pCorrect) {
    var editedCategories = JSON.parse(JSON.stringify(neededTest.kategorien));
  for (laut of sortByStringLength(words[selectedTest].einGraphemtreffer)) {
    var strings = [];
    for (category of Object.keys(neededTest.kategorien)) {
      for (string of neededTest.kategorien[category]) {
        strings.push(string);
      }
    }
    // nur im Wort vorhandene Laute, die noch nicht vorhanden sind (also wenn z.B. "sch" bereits vorhanden ist wird nicht mehr "ch" hinzugefügt) in "justOneGraphemtreffer" hinzufügen
    // auskommentiert weil: alles unabhängig von Kategorien
    if (/*!strings.includes(laut) && */correct.toLowerCase().includes(laut) && !justOneGraphemtreffer.some(x => x.includes(laut))) {
      if (!editedCategories["trigger"]) editedCategories["trigger"] = [];
      editedCategories["trigger"].push(laut);
      justOneGraphemtreffer.push(laut);
    }
  }
}
  else {
    justOneGraphemtreffer = ["ei", "au", "eu", "sch", "ch"];
    if (correct.toLowerCase().includes("sch")) justOneGraphemtreffer.pop();
  }
  possibleGraphemtreffer = correct.length;
  if (i == 0) var firstLetter = correct[0];
  if (!pCorrect && Object.keys(editedCategories).length == 0) editedCategories["trigger"] = [];
  // alle Laute (aller Kategorien) durchlaufen
  for (var i1 = 0; (pCorrect && i1 < 1) || (editedCategories && i1 < Object.keys(editedCategories).length); i1++) {
    if (!pCorrect) var category = Object.keys(editedCategories)[i1];
    for (var i2 = 0; (pCorrect && i2 < justOneGraphemtreffer.length) || (!pCorrect && i2 < editedCategories[category].length); i2++) {
      if (!pCorrect) var letterString = editedCategories[category][i2];
      else var letterString = justOneGraphemtreffer[i2];
      // wenn Laut der im Wort vorkommt gefunden wurde
      if (correct.toLowerCase().includes(letterString)) {
        var originalCorrect = correct;
        // mögliche Graphemtreffer wegen Lauten wie "au", die als ein Graphemtreffer behandelt werden abziehen
        while (correct.toLowerCase().includes(letterString)) {
          for (var i3 = 0; justOneGraphemtreffer.includes(letterString) && (pCorrect || category == "trigger") && i3 < letterString.length - 1; i3++) {
            possibleGraphemtreffer--;
          }
          correct = correct.toLowerCase().replace(letterString, "");
        }
        correct = originalCorrect;
      if (!letterList[letterString]) letterList[letterString] = {};
      if (!letterCounter[letterString]) letterCounter[letterString] = [];
      // wenn der Index ein Buchstabe hinter einem Laut, der einzeln gezählt werden soll, ist
      if (/*letterCounter*/Object.keys(letterList[letterString]).length == letterString.length) {
        var string = Object.keys(letterList[letterString]).toString().replace(new RegExp(',', 'g'), '');
        var letterInMultiple = false;
        // Überprüfung, ob Buchstabe in mehreren Kategorien vorhanden ist und bereits gewertet wurde
        for (stringcompare of Object.keys(letterList)) {
          var stringTogether = Object.keys(letterList[stringcompare]).toString().replace(new RegExp(',', 'g'), '');
          for (var i4 = i; i4 < i + stringcompare.length; i4++) {
            if (stringcompare.includes(string) && string.length == 1 && stringcompare.length > 1 && stringTogether == stringcompare) letterInMultiple = true;
            if (correct[i4]) stringTogether += correct[i4];
            if (stringTogether.length > stringcompare.length) stringTogether = stringTogether.slice(1);
          }
        }
        // wenn vor dem aktuellen Index der gesuchte Laut vorhanden ist
        if (string == letterString && !(string == "e" && last) && !letterInMultiple) {
          if (category != "trigger" && !pCorrect/* !justOneGraphemtreffer.includes(string)*/) {
          // Erhöhe den Zähler für die Laute um einen und erstelle die nötige Datenstruktur, falls nicht vorhanden
          if (!auswertung.categories[selectedElementId.parent]) auswertung.categories[selectedElementId.parent] = {};
          if (!auswertung.categories[selectedElementId.parent][correct]) auswertung.categories[selectedElementId.parent][correct] = {};
          if (!auswertung.categories[selectedElementId.parent][correct][category]) auswertung.categories[selectedElementId.parent][correct][category] = {got: 0, possible: 0};
          if (!auswertung.categories[selectedElementId.parent][correct][category][letterString]) auswertung.categories[selectedElementId.parent][correct][category][letterString] = {possible: 0, got: 0};
          auswertung.categories[selectedElementId.parent][correct][category][letterString].possible++;
          auswertung.categories[selectedElementId.parent][correct][category].possible++;
        }
        var firstOne = false;
        var graphemFehlerBefore = graphemFehler;
        // Zählen der Graphemfehler des aktuellen Lautes
        for (letterNow of Object.keys(letterList[letterString])) {
          if (!letterList[letterString][letterNow] && !firstOne) {
            firstOne = true;
          }
          else if (!letterList[letterString][letterNow] && (pCorrect || category == "trigger") && justOneGraphemtreffer.includes(letterString)) {
            graphemFehler--;
          }
        }
        // Laut als richtig abspeichern, falls er keinen Fehler enthält
        if (!pCorrect && graphemFehlerBefore == graphemFehler && !firstOne && /*!justOneGraphemtreffer.includes(string)*/category != "trigger") {
          auswertung.categories[selectedElementId.parent][correct][category][letterString].got++;
          auswertung.categories[selectedElementId.parent][correct][category].got++;
        }
      }
      if (pCorrect || category == "trigger" || !justOneGraphemtreffer.includes(letterString)) {
        // Falls die Anzahl der Buchstaben des aktuelle Lautes erreicht wurde, wird der hinterste bzw. inaktuellste gelöscht, damit ein neuer Laut aus dem Folgenden und den anderen noch vorhandenen entsteht
        delete letterList[letterString][letterCounter[letterString][0]];
        letterCounter[letterString].shift();
      }
      }
      // fügt den nächsten Buchstaben zum aktuellen Laut hinzu, wodurch der Lauf um einen richtung Wortende rutscht
      // TODO: Problem: gleiche Buchstaben
      if (pCorrect || category == "trigger" || !justOneGraphemtreffer.includes(letterString)) {
      letterList[letterString][correct[i].toLowerCase()] = true;
      letterCounter[letterString].push(correct[i].toLowerCase());
    }
    }
  }
}
return {possible: possibleGraphemtreffer, errors: graphemFehler};
}
/*
 * ermittelt die Fehler des Schülers
 * Parameter: id - id des Textfeldes, wo die Schreibung des Schülers eingegeben wird
 *            parentId - Id des "Blattes" (div element) des Schülers
 *            doNotMark - wenn true wird die Anzeige für die Auswertung nicht erneuert, wodurch sie nicht zu sehen ist (bei korrekten Wörtern)
 *            doNotResetMirror -
 */
 function prepareCorrection(parentId, id, wordCorrectionChild) {
   if (adaptInputs.checked) {
   findChild("id", parentId, id).style.width = 1;
   findChild("id", parentId, id).scroll(100, 0)
   while (findChild("id", parentId, id).scrollLeft > 0) {
     findChild("id", parentId, id).style.width = JSON.parse(findChild("id", parentId, id).style.width.replace("px", "")) + 1 + "px";
   }
   }
   else findChild("id", parentId, id).style.width = 100;
   // Löschen der Elemente der letzten Korrektur des Wortes
   for (var i = 0; findChild('id', wordCorrectionChild, 'correctionLetter', true); i++) {
     findChild('id', wordCorrectionChild, 'correctionLetter', true).remove();
   }
   // Graphemtrefferanzeige löschen, da sie später mit den neuen Werten wieder hinzugefügt wird
   try {
     findChild('id', wordCorrectionChild, 'graphemtrefferGot', true).remove();
     findChild('id', wordCorrectionChild, 'graphemtrefferPossible', true).remove();
     findChild('id', wordCorrectionChild, 'graphemtrefferSlash', true).remove();
     findChild('id', wordCorrectionChild, 'automaticGraphemTreffer' + correct, true).remove();
   } catch (e) {}
 }
function markErrors(id, parentId, onchange, doNotMark, doNotResetMirror, pCorrect, wrong) {
  // TODO: Silben mit einbeziehen: siehe Eingabe "Dno"
  var possibleGraphemtreffer;
  selectedElementId = {parent: parentId, element: id};
  // var correct = findChild('id', selectedElementId.parent, 'word ' + id.replace('pupilsWriting ', '')).innerText;
  if (!pCorrect) {
    if (!auswertung.doNotCount[selectedElementId.parent]) auswertung.doNotCount[selectedElementId.parent] = [];
    refreshNeededTest();
    inputs[/*'Test ' + */selectedTest][parentId][id] = findChild('id', selectedElementId.parent, id).value;
    localStorage.setItem('inputsSchiku', JSON.stringify(inputs));
  for (var word of neededTest.words) {
    if (replaceAll(word, "-", "") == findChild('id', selectedElementId.parent, 'word ' + id.replace('pupilsWriting ', '')).innerText) correct = word;
  }
}
else correct = pCorrect;
  // var correct = neededTest.words[id.split(" ")[1]];
  if (!wrong) var wrong = findChild('id', selectedElementId.parent, 'pupilsWriting ' + id.replace('pupilsWriting ', '')).value;
  console.log(correct.replace(new RegExp('-', 'g'), '') + ' --> ' + wrong);
  /*if (!pCorrect) */var original = {correct: correct.replace(new RegExp("-", 'g'), ""), wrong: wrong.replace(new RegExp("-", 'g'), "")};
  // else var original = {correct: pCorrect, wrong: wrong};
  var originalSilben = {correct: correct, wrong: wrong};
  // findChild("id", parentId, id).style.width = wrong.length*8;
  for (var i = 0; !pCorrect && i < auswertung.doNotCount[selectedElementId.parent].length; i++) {
    if (auswertung.doNotCount[selectedElementId.parent][i] == correct) auswertung.doNotCount[selectedElementId.parent].splice(i, 1);
  }
  // Anpassung der Größe des Eingabefeldes falls in den Einstellungen aktiviert
  var wrongI = 0;
  var correctedString = [];
  var addI = 0;
  var doubleError = 0;
  graphemFehler = 0;
  letterList = {};
  letterCounter = {};
  if (!pCorrect) {
    if (!doNotResetMirror && inputs[/*'Test ' + */selectedTest] && inputs[/*'Test ' + */selectedTest][selectedElementId.parent] && inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror) inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror[original.correct] = [];
    if (auswertung.wrongLetters[selectedElementId.parent]) auswertung.wrongLetters[selectedElementId.parent][original.correct] = {};
    if (auswertung.categories[selectedElementId.parent]) auswertung.categories[selectedElementId.parent][original.correct] = {};
    var wordCorrectionChild = findChild('id', selectedElementId.parent, 'correction ' + id.replace('pupilsWriting ', ''));
    prepareCorrection(parentId, id, wordCorrectionChild);
  }
  // Liste mit allen Buchstaben und derem Aussehen
  for (var i = 0; i < wrong.length; i++) {
    correctedString.push({letter: wrong[i], colour: "white"});
  }
  correct = correct.toLowerCase();
  wrong = wrong.toLowerCase();
  // var totalI = 0;
  var silbeNow = -1;
  var allI = 0;
  var beforeBeginning = 0;
  if (((wrong[1] == correct[0])) && correct[0] != wrong[0] || ((wrong[2] == correct[1]) && correct[1] != wrong[1])) {
    /* if (wrong[0] == wrong[1]) correctedString[1].colour = selectedColours.wrong.dark.text
    else */if (!pCorrect) correctedString[0].colour = selectedColours.wrong.dark.text
    addI++;
    graphemFehler++;
    wrongI++;
    beforeBeginning++;
    doubleError++;
  }
  for (var correct of correct.split("-")) {
    silbeNow++;
    // wrongI = 0;
    // wrongI = correctIndex;
    if (wrong.includes(correct)) {
      // for (var i = 0; wrong[wrongI] && wrong[wrongI] != correct[0]; i++) {
      //   console.log(correctedString[wrongI + addI].letter + " müsste weg");
      //   correctedString[wrongI + addI].colour = selectedColours.wrong.dark.text;
      //   doubleError++;
      //   // addI++;
      //   graphemFehler++;
      //   wrongI++;
      // }
      var between = true;
      // console.log(err);
      while (between) {
        var stringlist = [];
        for (var i1 = 0; i1 < correct.length; i1++) {
          stringlist.push(wrong[wrongI + i1]);
        }
        if (stringlist.toString().replace(new RegExp(',', 'g'), '') == correct || stringlist.includes(undefined)) between = false;
        else {
            console.log(correctedString[wrongI + addI].letter + " müsste weg");
            if (!pCorrect) correctedString[wrongI + addI].colour = selectedColours.wrong.dark.text;
            doubleError++;
            // addI++;
            graphemFehler++;
          wrongI++;
      }
      }
      for (var i1 = 0; i1 < originalSilben.correct.split("-")[silbeNow].length; i1++) {
        if (!pCorrect && originalSilben.correct.split("-")[silbeNow][i1] != originalSilben.wrong[wrongI + i1] && originalSilben.correct.split("-")[silbeNow][i1].toLowerCase() == originalSilben.wrong[wrongI + i1] && correctedString[wrongI + i1 + addI]) {
          correctedString[wrongI + i1 + addI].colour = selectedColours.wrong.light.text;
        }
      }
      var lautList = "";
      while (lautList != correct && !lautList.includes(undefined)) {
        lautList = "";
        for (var i1 = 0; i1 < correct.length; i1++) {
          lautList += wrong[wrongI + i1];
        }
        wrongI++;
      }
      wrongI--;
      var allIBefore = allI;
      var wrongILetter = [];
      for (var i1 = allI; i1 < allIBefore + correct.length && wrong[wrongI]; i1++) {
        var graphemObj = checkCategory(original.correct, i1, null, pCorrect, possibleGraphemtreffer);
        graphemFehler = graphemObj.errors;
        possibleGraphemtreffer = graphemObj.possible
        allI++;
        wrongILetter.unshift(wrong[wrongI]);
        /*if (wrong[wrongI].toLowerCase() == original.correct[i1].toLowerCase()) */wrongI++;
      }
  }
    else {
      var wrongIBeginning = wrongI;
  for (var i = 0; i < correct.length && wrong[wrongI]; i++) {
    console.log("compare " + correct[i] + " with " + wrong[wrongI]);
    var ausgetauscht = 0;
    var nextLetter = correct[i + 1];
    if (i == correct.length - 1 && originalSilben.correct.split("-")[silbeNow + 1]) nextLetter = originalSilben.correct.split("-")[silbeNow + 1][0]
    var graphemObj = checkCategory(original.correct, allI + i/* + doubleError - beforeBeginning*/, null, pCorrect, possibleGraphemtreffer);
    graphemFehler = graphemObj.errors;
    possibleGraphemtreffer = graphemObj.possible;
    // check letter difference: following letter wrong
    var letterCorrect = correct[i] == wrong[wrongI];
    if (correct[i] != wrong[wrongI] && (!wrong[wrongI + 1] || (wrong[wrongI + 1] && wrong[wrongI + 1] != correct[i]))) {
      if ((/*wrong[wrongI] == wrong[wrongI] || */correct[i] != wrong[wrongI]/*capitalizeFirstLetter(correct[i]) == correct[i]*/)/* && !(capitalizeFirstLetter(correct[i]) == correct[i] && correct[i] == wrong[wrongI])*/) {
        addWrongLetter(original.correct, allI + i);
        // console.log(wrong[wrongI] + " statt " + correct[i]);
      }
      // console.log(correct[i] + " before " + wrong[wrongI]);
      // check if letter missing
      if ((!wrong[wrongI + 1] && (!wrong[wrongI] || wrong[wrongI] != nextLetter)) || (wrong[wrongI + 1] && wrong[wrongI + 1] == nextLetter)) {
        // console.log("remove " + wrong[wrongI] + " pos. " + wrongI);
        if (!pCorrect && correctedString[wrongI + addI - beforeBeginning]) correctedString[wrongI + addI - beforeBeginning].colour = selectedColours.wrong.dark.text;
        console.log(correctedString[wrongI + addI - beforeBeginning].letter + " statt " + correct[i]);
        // console.log(correctedString[wrongI + addI - beforeBeginning]?.letter + " missing");
        wrongI++;

        // check if doubleError: same letter 2 times in a row, so, it would not be a replacement, but an added wrong letter
        if (wrong[wrongI - 2] == wrong[wrongI - 1] && !beforeBeginning) {
          correctedString.splice(wrongI + addI, 0, {letter: '_', colour: "white"});
          console.log(original.correct[wrongI + addI] + " missing");
          addI++;
          doubleError++;
        }
}
else {
  if (wrong.includes(originalSilben.correct.split("-")[silbeNow + 1]) && wrong.split(originalSilben.correct.split("-")[silbeNow + 1])[0].length - wrongIBeginning == correct.length) {
    console.log(correctedString[wrongI + addI - beforeBeginning].letter + " statt " + correct[i]);
    correctedString[wrongI + addI - beforeBeginning].colour = selectedColours.wrong.dark.text;
    graphemFehler--;
    addWrongLetter(original.correct, allI + i);
    wrongI++;
  }
  else {
    console.log(original.correct[wrongI + addI] + " missing");
    correctedString.splice(wrongI + addI, 0, {letter: '_', colour: "white"});
    addI++;
  }
  // graphemFehler++;
}
    }
    // getauscht check (rausgenommen weil es mehr Fehler schafft als behebt)
    // else if (nextLetter == wrong[wrongI] && correct[i] == wrong[wrongI + 1] && correct[i] != nextLetter) {
    //   graphemFehler++;
    //   correctedString[wrongI + addI].colour = selectedColours.wrong.dark.text;
    //   correctedString[wrongI + 1 + addI].colour = selectedColours.wrong.dark.text;
    //   i++;
    //   ausgetauscht = 1;
    //   wrongI++;
    // }
    // too much before end
    else if (((wrong[wrongI + 1] && wrong[wrongI + 1] == correct[i])) && correct[i] != wrong[wrongI]) {
      // console.log("remove " + wrong[wrongI] + " pos. " + wrongI);
      console.log(correctedString[wrongI + addI].letter + " müsste weg");
      // if (correctedString[wrongI + addI - 1]?.letter == '_') alert('Es gab Buchstaben, die bei der Schreibung "' + original.wrong + '" des Wortes "' + original.correct.replace(new RegExp('-', 'g'), '') + '" vielleicht fäschlicherweise als falsch wahrgenommen wurden, obwohl sie nur teilweise falsch sind! Bitte gehen sie sicher, dass die automatische Fehlerkorrektur nicht zu wenig Graphemtreffer angibt!');
      if (!pCorrect) correctedString[wrongI + addI].colour = selectedColours.wrong.dark.text;
      doubleError++;
      // addI++;
      i--;
      graphemFehler++;
      wrongI++;
    }
    // markiere falsche Groß-Kleinschreibung
    else if (!pCorrect && originalSilben.correct.split("-")[silbeNow][i] != originalSilben.wrong[wrongI] && correctedString[wrongI + addI]) {
      correctedString[wrongI + addI].colour = selectedColours.wrong.light.text;
    }
    var wrongILetter = [];
    wrongILetter.unshift(wrong[wrongI]);
    if (letterCorrect/*correct[i] == wrong[wrongI - 1] && correct[i - 1] == wrong[wrongI] || (!(correct[i] != wrong[wrongI] && (!wrong[wrongI + 1] || wrongI > i || (wrong[wrongI + 1] && wrong[wrongI + 1] != correct[i]))) || (wrong[wrongI + 1] && wrong[wrongI + 1] == nextLetter))*/) wrongI++;
  }
  allI += i;
  // wrongI = i;
}
}
  // if (wrongI >= i && i != 0) i = original.correct.length;
  if (ausgetauscht) i--;
  // check end missing
  for (var i = allI; correctedString.length - doubleError/* - ausgetauscht*/ < original.correct.length; i++) {
    console.log(original.correct[correctedString.length] + " missing");
    correctedString.push({letter: '_', colour: "white"});
    var graphemObj = checkCategory(original.correct, /*correctedString.length - 1*/i, null, pCorrect, possibleGraphemtreffer);
    graphemFehler = graphemObj.errors;
    possibleGraphemtreffer = graphemObj.possible
    addWrongLetter(original.correct, /*correctedString.length - 1 - ausgetauscht*/i);
  }
  // check too much in the end
  var correctedStringLengthBefore = correctedString.length;
  for (var i = wrongI + addI - beforeBeginning; i < correctedStringLengthBefore && i >= original.correct.length; i++) {
    // console.log("remove " + wrong[i]);
    if (correctedString[wrongI + addI - beforeBeginning] && correctedString[wrongI + addI - beforeBeginning].letter != '_' && correctedString[wrongI + addI - beforeBeginning - 1] && correctedString[wrongI + addI - beforeBeginning - 1].letter != '_') {
      if (!pCorrect) correctedString[i].colour = selectedColours.wrong.dark.text;
      graphemFehler++;
    }
    else if (correctedString[wrongI + addI - beforeBeginning] && correctedString[wrongI + addI - beforeBeginning].letter != '_' && !pCorrect) {
        if (onchange && i == correctedStringLengthBefore - 1) alert('Es gab Buchstaben, die bei'/* der Schreibung "' + original.wrong + '" des Wortes "' + original.correct.replace(new RegExp('-', 'g'), '') + '"*/' dem zuletzt eingegebenen Wort wahrscheinlich nicht ausgewertet werden konnten! Bitte gehen Sie sicher, dass die automatische Fehlerkorrektur nicht zu wenige Graphemtreffer angibt!');
        correctedString.splice(wrongI + addI - beforeBeginning, 1);
    }
  }
  var graphemObj = checkCategory(original.correct, 0, true, pCorrect, possibleGraphemtreffer);
  graphemFehler = graphemObj.errors;
  possibleGraphemtreffer = graphemObj.possible
  // console.log(correctedString);
  // konvertiert Variablen in HTML Elemente
  if (possibleGraphemtreffer - graphemFehler < 0) graphemFehler = possibleGraphemtreffer;
  if (!pCorrect) {
    showCorrectedWord(correctedString, id, wordCorrectionChild, original, wrong, possibleGraphemtreffer);
    if ((doNotMark || original.correct == original.wrong) && !auswertung.wrongLetters[selectedElementId.parent]) auswertung.wrongLetters[selectedElementId.parent] = {};
    if ((doNotMark || original.correct == original.wrong)) auswertung.wrongLetters[selectedElementId.parent][original.correct] = {};
    getAllGraphemtreffer();
}
  console.log("possibleGraphemtreffer: " +  possibleGraphemtreffer );
  console.log("graphemFehler: " + graphemFehler);
  console.log("--> " + ((possibleGraphemtreffer - graphemFehler) + '/' + possibleGraphemtreffer) + " Graphemtreffer");
  return (possibleGraphemtreffer - graphemFehler) + '/' + possibleGraphemtreffer// JSON.stringify(correctedString);
}
function showCorrectedWord(correctedString, id, wordCorrectionChild, original, wrong, possibleGraphemtreffer) {
  for (var i = 0; i < correctedString.length/* && !doNotMark*//* && original.correct != original.wrong*//*graphemFehler > 0*/; i++) {
    var textColour = "black";
    if (correctedString[i].colour != "white") textColour = "white";
    addElement({id: 'correctionLetter', class: 'correctionLetter' + i, innerText: correctedString[i].letter, style: 'background-color:' + correctedString[i].colour + ';' + "color:" + textColour, title: 'klicken, um ' + correctedString[i].letter + ' als gespiegelt (blau) zu markieren, oder die Markierung wieder zu entfernen.\nBei Veränderung der Schreibweise des Schülers/der Schülerin wird das Wort nicht mehr als gespiegelt eingetragen sein.', onclick: 'changeMirror(' + i + ', "' + id + '");'}, 'strong', /*'correction ' + id.replace('pupilsWriting ', '')*/wordCorrectionChild, true);
  }
  // if (!doNotMark && graphemFehler > 0) {
    addElement({value: possibleGraphemtreffer - graphemFehler, id: 'graphemtrefferGot', onchange: 'getEveryCategory();', oninput: 'getAllGraphemtreffer(true, "' + original.correct + '", "' + selectedElementId.parent + '");', class: 'graphemtrefferGot' + capitalizeFirstLetter(selectedElementId.parent), style: 'width: 25;'}, 'input', wordCorrectionChild, true);
    addElement({innerText: '/', id: 'graphemtrefferSlash', style: 'width: 25;'}, 'a', wordCorrectionChild, true);
    addElement({value: possibleGraphemtreffer, id: 'graphemtrefferPossible',onchange: 'getEveryCategory();', oninput: 'getAllGraphemtreffer(true, "' + original.correct + '", "' + selectedElementId.parent + '");', class: 'graphemtrefferPossible' + capitalizeFirstLetter(selectedElementId.parent), style: 'width: 25;'}, 'input', wordCorrectionChild, true);
    addElement({innerText: '⟲automatische Auswertung', id: 'automaticGraphemTreffer' + original.correct, onclick: 'resetGraphemtreffer("' + selectedElementId.element + '", "' + selectedElementId.parent + '");', class: 'automaticGraphemTreffer' + capitalizeFirstLetter(selectedElementId.parent), style: 'width: 100; display: none;'}, 'button', wordCorrectionChild, true);
    findChild('id', selectedElementId.parent, id).style.backgroundColor = selectedColours.wrong.dark.text;
  // }
  // else {
    // addElement({style: 'display: none;', value: possibleGraphemtreffer - graphemFehler, id: 'graphemtrefferGot', class: 'graphemtrefferGot' + capitalizeFirstLetter(selectedElementId.parent)}, 'input', wordCorrectionChild, true);
    // addElement({style: 'display: none;', value: possibleGraphemtreffer, id: 'graphemtrefferPossible', class: 'graphemtrefferPossible' + capitalizeFirstLetter(selectedElementId.parent)}, 'input', wordCorrectionChild, true);
    if (original.wrong == original.correct) findChild('id', selectedElementId.parent, id).style.backgroundColor = selectedColours.right.text;
    else if (wrong == original.correct.toLowerCase()) findChild('id', selectedElementId.parent, id).style.backgroundColor = selectedColours.wrong.light.text;
  // }
}
module.exports = markErrors;
