// unit tests last commit: 11 failed
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
var letterListBefore = {};
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
  var letterInCategoriesNotDone = {};
  for (var editedCategory of Object.keys(editedCategories)) {
    for (var editedLaut of editedCategories[editedCategory]) {
      if (!letterInCategoriesNotDone[editedLaut]) letterInCategoriesNotDone[editedLaut] = 0;
      letterInCategoriesNotDone[editedLaut]++;
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
      if (Object.keys(letterList[letterString]).length > letterString.length) {
        delete letterList[letterString][Object.keys(letterList[letterString])[0]]
      }
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
          if ((category != "Endungen" || last) && (category != "Doppelkonsonanten" || (correct[i - 2] && correct[i - 2] == letterString && neededTest.betonung[JSON.parse(selectedElementId.element.replace('pupilsWriting ', '')) - 1][i - 3] == "kurz")) && category != "trigger" && !pCorrect/* !justOneGraphemtreffer.includes(string)*/) {
          // Erhöhe den Zähler für die Laute um einen und erstelle die nötige Datenstruktur, falls nicht vorhanden
          var auswertungCategory = JSON.parse(JSON.stringify(category));
          if (category == "sonstige" && letterString == "ck") auswertungCategory = "Doppelkonsonanten";
          if (!auswertung.categories[selectedElementId.parent]) auswertung.categories[selectedElementId.parent] = {};
          if (!auswertung.categories[selectedElementId.parent][correct]) auswertung.categories[selectedElementId.parent][correct] = {};
          if (!auswertung.categories[selectedElementId.parent][correct][auswertungCategory]) auswertung.categories[selectedElementId.parent][correct][auswertungCategory] = {got: 0, possible: 0};
          if (!auswertung.categories[selectedElementId.parent][correct][auswertungCategory][letterString]) auswertung.categories[selectedElementId.parent][correct][auswertungCategory][letterString] = {possible: 0, got: 0};
          auswertung.categories[selectedElementId.parent][correct][auswertungCategory][letterString].possible++;
          auswertung.categories[selectedElementId.parent][correct][auswertungCategory].possible++;
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
        if ((category != "Endungen" || last) && (category != "Doppelkonsonanten" || (correct[i - 2] && correct[i - 2] == letterString && neededTest.betonung[JSON.parse(selectedElementId.element.replace('pupilsWriting ', '')) - 1][i - 3] == "kurz" && letterListBefore[letterString][letterString] == true)) && !pCorrect && graphemFehlerBefore == graphemFehler && !firstOne && /*!justOneGraphemtreffer.includes(string)*/category != "trigger") {
          auswertung.categories[selectedElementId.parent][correct][auswertungCategory][letterString].got++;
          auswertung.categories[selectedElementId.parent][correct][auswertungCategory].got++;
        }
      }
      if (letterInCategoriesNotDone) letterInCategoriesNotDone[letterString]--;
      letterListBefore = JSON.parse(JSON.stringify(letterList));
      if ((!letterInCategoriesNotDone || letterInCategoriesNotDone[letterString] < 1) && (pCorrect || category == "trigger" || !justOneGraphemtreffer.includes(letterString))) {
        // Falls die Anzahl der Buchstaben des aktuelle Lautes erreicht wurde, wird der hinterste bzw. inaktuellste gelöscht, damit ein neuer Laut aus dem Folgenden und den anderen noch vorhandenen entsteht
        delete letterList[letterString][letterCounter[letterString][0]];
        letterCounter[letterString].shift();
      }
      }
      else if (letterInCategoriesNotDone) letterInCategoriesNotDone[letterString]--;
      // fügt den nächsten Buchstaben zum aktuellen Laut hinzu, wodurch der Lauf um einen richtung Wortende rutscht
      // TODO: Problem: gleiche Buchstaben
      if ((!letterInCategoriesNotDone || letterInCategoriesNotDone[letterString] < 1) && (pCorrect || category == "trigger" || !justOneGraphemtreffer.includes(letterString)) && correct[i] != undefined) {
      // packt aktuelle rein und füllt Buchstaben auf
        letterList[letterString][correct[i].toLowerCase()] = true;
        letterCounter[letterString].push(correct[i].toLowerCase());
    }
    }
  }
}
return {possible: possibleGraphemtreffer/*, errors: graphemFehler*/};
}
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
   while (findChild('id', wordCorrectionChild, 'correctionLetter', true)) {
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
 /*
 * ermittelt die Fehler des Schülers
 * Parameter: id - id des Textfeldes, wo die Schreibung des Schülers eingegeben wird
 *            parentId - Id des "Blattes" (div element) des Schülers
 *            doNotMark - wenn true wird die Anzeige für die Auswertung nicht erneuert, wodurch sie nicht zu sehen ist (bei korrekten Wörtern)
 *            doNotResetMirror -
 *            isDoNotCount: true wenn das Wort das korrigiert wird manuell korrigiert wurde (doNotCount) (trotzdem wird automatische Korrektur durchgeführt, um die vom dem Programm kalkulierte Graphemtrefferanzahl festzustellen)
 */
function markErrors(id, parentId, onchange, doNotMark, doNotResetMirror, pCorrect, wrong, isDoNotCount, recreatingSheets, unitTesting) {
 if (unitTesting) selectedColours = {wrong: {dark: {text: "red"}}};
  var possibleGraphemtreffer;
  selectedElementId = {parent: parentId, element: id};
  // var correct = findChild('id', selectedElementId.parent, 'word ' + id.replace('pupilsWriting ', '')).innerText;
  if (!pCorrect) {
    if (!auswertung.doNotCount[selectedElementId.parent]) auswertung.doNotCount[selectedElementId.parent] = [];
    refreshNeededTest();
    inputs[/*'Test ' + */selectedTest][parentId][id] = findChild('id', selectedElementId.parent, id).value;
    storeSchiKUInputs();
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

  // removes word from doNotCount when the writing is autocorrected again because of pupils writing change
  if (!pCorrect) {
    elm = auswertung.doNotCount[selectedElementId.parent];
    for (var i = 0; i < elm.length; i++) {
      if (elm[i] == correct) elm.splice(i, 1);
    }
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
  for (var letter of wrong) {
    if (unitTesting || markWrong.checked) correctedString.push({letter: letter, colour: "white"});
    else correctedString.push({letter: letter, colour: "black"});
  }
  correct = correct.toLowerCase();
  wrong = wrong.toLowerCase();
  // var totalI = 0;
  var silbeNow = -1;
  var allI = 0;
  var beforeBeginning = 0;
  if (((wrong[1] == correct[0])) && (correct[0] != wrong[0] || ((wrong[2] == correct[1]) && correct[1] != wrong[1]))) {
    /* if (wrong[0] == wrong[1]) correctedString[1].colour = selectedColours.wrong.dark.text
    else */if (!pCorrect) correctedString[0].colour = selectedColours.wrong.dark.text
    addI++;
    graphemFehler++;
    wrongI++;
    beforeBeginning++;
    doubleError++;
  }
  var wrongCut = JSON.parse(JSON.stringify(wrong));
  var skipLetters = 0;
  for (var correct of correct.split("-")) {
    if (wrongString != "") wrongCut = wrongCut.replace(wrongString, '');
    var wrongString = "";
    silbeNow++;
    var iMinus = false
    // wrongI = 0;
    // wrongI = correctIndex;
    if (wrongCut.includes(correct)) {
      wrongCut = wrongCut.replace(correct, '');
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
            console.log(correctedString[wrongI + addI - beforeBeginning].letter + " müsste weg");
            if (!pCorrect && !unitTesting) correctedString[wrongI + addI - beforeBeginning].colour = selectedColours.wrong.dark.text;
            doubleError++;
            // addI++;
            graphemFehler++;
          wrongI++;
      }
      }
      originalSilben.correct.split("-")[silbeNow].split('').forEach((syllable, i1) => {
        if (!pCorrect && syllable != originalSilben.wrong[wrongI + i1] && originalSilben.wrong[wrongI + i1] && syllable.toLowerCase() == originalSilben.wrong[wrongI + i1].toLowerCase() && correctedString[wrongI + i1 + addI - beforeBeginning] && !unitTesting) {
          correctedString[wrongI + i1 + addI - beforeBeginning].colour = selectedColours.wrong.light.text;
        }

      });
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
        // graphemFehler = graphemObj.errors;
        possibleGraphemtreffer = graphemObj.possible
        allI++;
        wrongILetter.unshift(wrong[wrongI]);
        /*if (wrong[wrongI].toLowerCase() == original.correct[i1].toLowerCase()) */wrongI++;
      }
  }
    else {
      var wrongIBeginning = wrongI;
  for (var i = 0; i < correct.length && wrong[wrongI]; i++) {
    if (skipLetters > 0) i += skipLetters;
    console.log("compare " + correct[i] + " with " + wrong[wrongI]);
    wrongString += wrong[wrongI];
    var ausgetauscht = 0;
    var nextLetter = correct[i + 1];
    if (i == correct.length - 1 && originalSilben.correct.split("-")[silbeNow + 1]) nextLetter = originalSilben.correct.split("-")[silbeNow + 1][0]
    if (!iMinus) var graphemObj = checkCategory(original.correct, allI + i/* + doubleError - beforeBeginning*/, null, pCorrect, possibleGraphemtreffer);
    var iMinus = false;
    // graphemFehler = graphemObj.errors;
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
    // getauscht/vertauscht check (TODO: mehr oder weniger Fehler als ohne?)
    else if (nextLetter == wrong[wrongI] && correct[i] == wrong[wrongI + 1] && correct[i] != nextLetter && allI + i == wrongI) {
      // insgesamt für vertauscht graphemFehler++, aber addWrongLetter erhöht graphemFehler um einen
      graphemFehler--;
      correctedString[wrongI + addI].colour = selectedColours.wrong.dark.text;
      addWrongLetter(original.correct, wrongI);
      correctedString[wrongI + 1 + addI].colour = selectedColours.wrong.dark.text;
      addWrongLetter(original.correct, wrongI + 1);
      // da ein i übersprungen, wird dieses manuell hinzugefügt (vergessen wie es sonst geht :) )
      if (!unitTesting) {
      // checkCategory(original.correct, allI + i + 1/* + doubleError - beforeBeginning*/, null, pCorrect, possibleGraphemtreffer);
      var completeCorrect = replaceAll(originalSilben.correct, "-", "");
      for (const category of Object.keys(neededTest.kategorien)) {
        for (const letter of neededTest.kategorien[category]) {
          for (const elm of neededTest.words) {
            if (replaceAll(elm, "-", "") == completeCorrect && letter == completeCorrect[allI + i + 1]) {
              if (!auswertung.categories[selectedElementId.parent]) auswertung.categories[selectedElementId.parent] = {};
              if (!auswertung.categories[selectedElementId.parent][completeCorrect]) auswertung.categories[selectedElementId.parent][completeCorrect] = {};
              if (!auswertung.categories[selectedElementId.parent][completeCorrect][category]) auswertung.categories[selectedElementId.parent][completeCorrect][category] = {got: 0, possible: 0};
              if (!auswertung.categories[selectedElementId.parent][completeCorrect][category][letter]) auswertung.categories[selectedElementId.parent][completeCorrect][category][letter] = {possible: 0, got: 0};
              auswertung.categories[selectedElementId.parent][completeCorrect][category][letter].possible++;
              auswertung.categories[selectedElementId.parent][completeCorrect][category].possible++;
            }
          }
        }
      }
    }

      i += 2//++;
      skipLetters = i - correct.length;
      ausgetauscht = 1;
      wrongI += 2 //++;
    }
    // too much before end
    else if (((wrong[wrongI + 1] && wrong[wrongI + 1] == correct[i])) && correct[i] != wrong[wrongI]) {
      // console.log("remove " + wrong[wrongI] + " pos. " + wrongI);
      console.log(correctedString[wrongI + addI - beforeBeginning].letter + " müsste weg");
      // if (correctedString[wrongI + addI - 1]?.letter == '_') alert('Es gab Buchstaben, die bei der Schreibung "' + original.wrong + '" des Wortes "' + original.correct.replace(new RegExp('-', 'g'), '') + '" vielleicht fäschlicherweise als falsch wahrgenommen wurden, obwohl sie nur teilweise falsch sind! Bitte gehen sie sicher, dass die automatische Fehlerkorrektur nicht zu wenig Graphemtreffer angibt!');
      if (!pCorrect) correctedString[wrongI + addI - beforeBeginning].colour = selectedColours.wrong.dark.text;
      doubleError++;
      // addI++;
      i--;
      var iMinus = true;
      graphemFehler++;
      wrongI++;
    }
    // markiere falsche Groß-Kleinschreibung
    else if (!pCorrect && originalSilben.correct.split("-")[silbeNow][i] != originalSilben.wrong[wrongI] && correctedString[wrongI + addI - beforeBeginning] && !unitTesting) {
      correctedString[wrongI + addI - beforeBeginning].colour = selectedColours.wrong.light.text;
    }
    var wrongILetter = [];
    wrongILetter.unshift(wrong[wrongI]);
    if (letterCorrect/*correct[i] == wrong[wrongI - 1] && correct[i - 1] == wrong[wrongI] || (!(correct[i] != wrong[wrongI] && (!wrong[wrongI + 1] || wrongI > i || (wrong[wrongI + 1] && wrong[wrongI + 1] != correct[i]))) || (wrong[wrongI + 1] && wrong[wrongI + 1] == nextLetter))*/) wrongI++;
  }
  allI += i;
  // wrongI = i;
}
}
  // check end missing
  for (var i = allI; correctedString.length - doubleError/* - ausgetauscht*/ < original.correct.length; i++) {
    console.log(original.correct[correctedString.length] + " missing");
    correctedString.push({letter: '_', colour: "white"});
    var graphemObj = checkCategory(original.correct, /*correctedString.length - 1*/i, null, pCorrect, possibleGraphemtreffer);
    // graphemFehler = graphemObj.errors;
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
        if (onchange && i == correctedStringLengthBefore - 1) alert('Es gab Buchstaben, die bei'/* der Schreibung "' + original.wrong + '" des Wortes "' + original.correct.replace(new RegExp('-', 'g'), '') + '"*/ + ' dem zuletzt eingegebenen Wort wahrscheinlich nicht ausgewertet werden konnten! Bitte gehen Sie sicher, dass die automatische Fehlerkorrektur nicht zu wenige Graphemtreffer angibt!');
        correctedString.splice(wrongI + addI - beforeBeginning, 1);
    }
  }
  var graphemObj = checkCategory(original.correct, 0, true, pCorrect, possibleGraphemtreffer);
  // graphemFehler = graphemObj.errors;
  possibleGraphemtreffer = graphemObj.possible

  // console.log(correctedString);
  // konvertiert Variablen in HTML Elemente
  if (possibleGraphemtreffer - graphemFehler < 0) graphemFehler = possibleGraphemtreffer;
  if (!pCorrect) {
    showCorrectedWord(correctedString, id, wordCorrectionChild, original, wrong, possibleGraphemtreffer, recreatingSheets, onchange);
    if ((doNotMark || original.correct == original.wrong) && !auswertung.wrongLetters[selectedElementId.parent]) auswertung.wrongLetters[selectedElementId.parent] = {};
    if ((doNotMark || original.correct == original.wrong)) auswertung.wrongLetters[selectedElementId.parent][original.correct] = {};
    getAllGraphemtreffer();
}
  console.log("possibleGraphemtreffer: " +  possibleGraphemtreffer );
  console.log("graphemFehler: " + graphemFehler);
  console.log("--> " + ((possibleGraphemtreffer - graphemFehler) + '/' + possibleGraphemtreffer) + " Graphemtreffer");
  if (unitTesting) return (possibleGraphemtreffer - graphemFehler) + '/' + possibleGraphemtreffer;
  if (!unitTesting) var storedGraphemtreffer = JSON.parse(localStorage.getItem('inputsSchiku'))["Kreis Unna"][parentId].Graphemtreffer[original.correct];
  if (!inputs[selectedTest][parentId].Graphemtreffer) inputs[selectedTest][parentId].Graphemtreffer = {};
  if (!isDoNotCount) inputs[selectedTest][parentId].Graphemtreffer[original.correct] = {got: (possibleGraphemtreffer - graphemFehler), possible: possibleGraphemtreffer};
  if (recreatingSheets && storedGraphemtreffer && JSON.stringify({got: (possibleGraphemtreffer - graphemFehler), possible: possibleGraphemtreffer}) != JSON.stringify(storedGraphemtreffer) && !storedGraphemtreffer.auto_correction) {
    var graphemtrefferPossibleElm = findChild("id", findChild("id", parentId, "correction " + id.split("Writing ")[1]), "graphemtrefferPossible", true);
    var graphemtrefferGotElm = findChild("id", findChild("id", parentId, "correction " + id.split("Writing ")[1]), "graphemtrefferGot", true);
    if (possibleGraphemtreffer - graphemFehler != storedGraphemtreffer.got) {
      graphemtrefferGotElm.style.borderColor = "gray";
      graphemtrefferGotElm.style.borderWidth = "4px";
      graphemtrefferGotElm.value = storedGraphemtreffer.got;
    }
    if (possibleGraphemtreffer != storedGraphemtreffer.possible) {
      graphemtrefferPossibleElm.style.borderColor = "gray";
      graphemtrefferPossibleElm.style.borderWidth = "4px";
      graphemtrefferPossibleElm.value = storedGraphemtreffer.possible;
    }
    getAllGraphemtreffer(true, original.correct, parentId);
    graphemtrefferChanged = true;
  }
  return (possibleGraphemtreffer - graphemFehler) + '/' + possibleGraphemtreffer// JSON.stringify(correctedString);
}
var graphemtrefferChanged = false;
var alerted = true;
// id: pupils writing [number 1-*]
function showCorrectedWord(correctedString, id, wordCorrectionChild, original, wrong, possibleGraphemtreffer, recreatingSheets, onchange) {
  var counter = {gap: 0, wrongAdded: 0, pureWrongLetter: 0};
  alerted = !onchange
  correctedString.forEach((letter, i) => {
    if (letter.colour == selectedColours.wrong.dark.text) {
      counter.pureWrongLetter++;
    }
    else counter.pureWrongLetter = 0;
    if (letter.letter == "_") {
      if (counter.wrongAdded > 0) {
        counter.gap = 0;
      }
      counter.wrongAdded = 0;
      counter.gap++;
    }
    else if (letter.colour == selectedColours.wrong.dark.text && counter.gap >= 2) {
      counter.wrongAdded++;
    }
    else {
      counter = {gap: 0, wrongAdded: 0, pureWrongLetter: counter.pureWrongLetter};
    }
    if (((counter.gap >= 2 && counter.wrongAdded >= 2) || counter.pureWrongLetter >= 3) && !alerted && !recreatingSheets) {
      alert('Es gab Buchstaben, die bei'/* der Schreibung "' + original.wrong + '" des Wortes "' + original.correct.replace(new RegExp('-', 'g'), '') + '"*/ + ' dem zuletzt eingegebenen Wort wahrscheinlich nicht ausgewertet werden konnten! Bitte gehen Sie sicher, dass die automatische Fehlerkorrektur nicht zu wenige Graphemtreffer angibt!');
      alerted = true
    }
    var textColour = "black";
    if (!["rgb(219, 219, 219)", "white"].includes(letter.colour) && markWrong.checked) textColour = "white";
    var newElm = addElement({id: 'correctionLetter', explicitId: 'correctionLetter' + i, innerText: letter.letter, style: 'background-color:' + letter.colour + ';' + "color:" + textColour, title: 'klicken, um ' + letter.letter + ' als gespiegelt (blau) zu markieren, oder die Markierung wieder zu entfernen.\nBei Veränderung der Schreibweise des Schülers/der Schülerin wird das Wort nicht mehr als gespiegelt eingetragen sein.', onclick: 'changeMirror(' + i + ', "' + id + '");'}, 'strong', /*'correction ' + id.replace('pupilsWriting ', '')*/wordCorrectionChild, true);
    if (underlineWrong.checked && [selectedColours.wrong.dark.text, selectedColours.wrong.light.text].includes(newElm.style.backgroundColor)) {
      newElm.classList += " underline";
    }
    if (!markWrong.checked) newElm.style.backgroundColor = "";
  });

  // if (!doNotMark && graphemFehler > 0) {
    addElement({value: possibleGraphemtreffer - graphemFehler, id: 'graphemtrefferGot', onclick: "this.select();", onchange: 'getEveryCategory(true, "' + id + '");', oninput: 'if (value != "") getAllGraphemtreffer(true, "' + original.correct + '", "' + selectedElementId.parent + '");', class: 'graphemtrefferGot' + capitalizeFirstLetter(selectedElementId.parent), style: 'width: 25;'}, 'input', wordCorrectionChild, true);
    addElement({innerText: '/', id: 'graphemtrefferSlash', style: 'width: 25;'}, 'a', wordCorrectionChild, true);
    addElement({value: possibleGraphemtreffer, id: 'graphemtrefferPossible', onclick: "this.select();", onchange: 'getEveryCategory(true, "' + id + '");', oninput: 'getAllGraphemtreffer(true, "' + original.correct + '", "' + selectedElementId.parent + '");', class: 'graphemtrefferPossible' + capitalizeFirstLetter(selectedElementId.parent), style: 'width: 25;'}, 'input', wordCorrectionChild, true);
    if (findChild('id', wordCorrectionChild, 'automaticGraphemTreffer' + original.correct, true)) {
      findChild('id', wordCorrectionChild, 'automaticGraphemTreffer' + original.correct, true).remove();
    }
    addElement({innerText: '⟲automatische Auswertung', id: 'automaticGraphemTreffer' + original.correct, onclick: 'resetGraphemtreffer("' + selectedElementId.element + '", "' + selectedElementId.parent + '");', class: 'automaticGraphemTreffer' + capitalizeFirstLetter(selectedElementId.parent) + " automaticGraphemTreffer", style: 'width: 100; display: none;'}, 'button', wordCorrectionChild, true);
    var writingInput = findChild('id', selectedElementId.parent, id);
    writingInput.style.backgroundColor = selectedColours.wrong.dark.text;

  // }
  // else {
    // addElement({style: 'display: none;', value: possibleGraphemtreffer - graphemFehler, id: 'graphemtrefferGot', class: 'graphemtrefferGot' + capitalizeFirstLetter(selectedElementId.parent)}, 'input', wordCorrectionChild, true);
    // addElement({style: 'display: none;', value: possibleGraphemtreffer, id: 'graphemtrefferPossible', class: 'graphemtrefferPossible' + capitalizeFirstLetter(selectedElementId.parent)}, 'input', wordCorrectionChild, true);
    if (original.wrong == original.correct) writingInput.style.backgroundColor = selectedColours.right.text;
    else if (wrong == original.correct.toLowerCase()) writingInput.style.backgroundColor = selectedColours.wrong.light.text;
      if (["rgb(219, 219, 219)"].includes(writingInput.style.backgroundColor)) writingInput.style.color = "black";
  // }
}
// Needed for testing with Jest (?)
module.exports = markErrors;
