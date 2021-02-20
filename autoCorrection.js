// fügt der Auswertung die falsch geschriebenen Buchstaben hinzu
function addWrongLetter(correct, i) {
  try {
    var currentLetter = correct[i].toLowerCase();
    for (lautNow of Object.keys(letterList)) {
      if (letterList[lautNow] && letterList[lautNow][currentLetter]) {
        letterList[lautNow][currentLetter] = false;
      }
    }
    graphemFehler++;
    if (currentLetter == "e" && i == correct.length - 1) currentLetter = '<e>';
    if (!auswertung.wrongLetters[selectedElementId.parent]) auswertung.wrongLetters[selectedElementId.parent] = {};
    if (!auswertung.wrongLetters[selectedElementId.parent][correct]) auswertung.wrongLetters[selectedElementId.parent][correct] = {};
    if (!auswertung.wrongLetters[selectedElementId.parent][correct][currentLetter]) auswertung.wrongLetters[selectedElementId.parent][correct][currentLetter] = 0;
    auswertung.wrongLetters[selectedElementId.parent][correct][currentLetter]++;
  } catch (e) {}
}
var graphemFehler = 0;
var possibleGraphemtreffer;
var letterList;
var letterCounter;
var selectedTest = "Kreis Unna";
// überprüft Laute auf Richtigkeit und Anzahl
// @param correct: korrekte Schreibweise
//        i: aktueller Index (hier: Position im korrekten Wort)
function checkCategory(correct, i, last) {
  var editedCategories = JSON.parse(JSON.stringify(neededTest.kategorien));
  var justOneGraphemtreffer = [];
  for (laut of sortByStringLength(words[selectedTest].einGraphemtreffer)) {
    var strings = [];
    for (category of Object.keys(neededTest.kategorien)) {
      for (string of neededTest.kategorien[category]) {
        strings.push(string);
      }
    }
    if (/*!strings.includes(laut) && */correct.toLowerCase().includes(laut) && !justOneGraphemtreffer.some(x => x.includes(laut))) {
      if (!editedCategories["trigger"]) editedCategories["trigger"] = [];
      editedCategories["trigger"].push(laut);
      justOneGraphemtreffer.push(laut);
    }
  }
  possibleGraphemtreffer = correct.length;
  if (i == 0) var firstLetter = correct[0];
  if (Object.keys(editedCategories).length == 0) editedCategories["trigger"] = [];
  for (var i1 = 0; editedCategories && i1 < Object.keys(editedCategories).length; i1++) {
    var category = Object.keys(editedCategories)[i1];
    for (var i2 = 0; i2 < editedCategories[category].length; i2++) {
      var letterString = editedCategories[category][i2];
      if (correct.toLowerCase().includes(letterString)) {
        // TODO: nicht selector
      for (var i3 = 0; justOneGraphemtreffer.includes(letterString) && category != "trigger" && i3 < letterString.length - 1; i3++) {
        possibleGraphemtreffer--;
      }
      if (!letterList[letterString]) letterList[letterString] = {};
      if (!letterCounter[letterString]) letterCounter[letterString] = [];
      if (/*letterCounter*/Object.keys(letterList[letterString]).length == letterString.length) {
        var string = Object.keys(letterList[letterString]).toString().replace(',', '');
        var letterInMultiple = false;
        for (stringCompair of Object.keys(letterList)) {
          var stringTogether = Object.keys(letterList[stringCompair]).toString().replace(',', '');
          for (var i4 = i; i4 < i + stringCompair.length; i4++) {
            if (correct[i4]) stringTogether += correct[i4];
          }
          if (stringCompair.includes(string) && string.length == 1 && stringCompair.length > 1 && stringTogether.includes(stringCompair)) letterInMultiple = true;
        }
        if (string == letterString && !(string == "e" && last) && !letterInMultiple) {
          if (!justOneGraphemtreffer.includes(string)) {
          if (!auswertung.categories[selectedElementId.parent]) auswertung.categories[selectedElementId.parent] = {};
          if (!auswertung.categories[selectedElementId.parent][correct]) auswertung.categories[selectedElementId.parent][correct] = {};
          if (!auswertung.categories[selectedElementId.parent][correct][category]) auswertung.categories[selectedElementId.parent][correct][category] = {got: 0, possible: 0};
          if (!auswertung.categories[selectedElementId.parent][correct][category][letterString]) auswertung.categories[selectedElementId.parent][correct][category][letterString] = {possible: 0, got: 0};
          auswertung.categories[selectedElementId.parent][correct][category][letterString].possible++;
          auswertung.categories[selectedElementId.parent][correct][category].possible++;
        }
        var firstOne = false;
        var graphemFehlerBefore = graphemFehler;
        for (letterNow of Object.keys(letterList[letterString])) {
          if (!letterList[letterString][letterNow] && !firstOne) {
            firstOne = true;
          }
          else if (!letterList[letterString][letterNow] && category != "trigger" && justOneGraphemtreffer.includes(letterString)) {
            graphemFehler--;
          }
        }
        if (graphemFehlerBefore == graphemFehler && !firstOne && !justOneGraphemtreffer.includes(string)) {
          auswertung.categories[selectedElementId.parent][correct][category][letterString].got++;
          auswertung.categories[selectedElementId.parent][correct][category].got++;
        }
      }
        delete letterList[letterString][letterCounter[letterString][0]];
        letterCounter[letterString].shift();
      }
      // TODO: Prblem: gleiche Buchstaben
      letterList[letterString][correct[i].toLowerCase()] = true;
      letterCounter[letterString].push(correct[i].toLowerCase());
    }
  }
}
}
/*
 * ermittelt die Fehler des Schülers
 * Parameter: id - id des Textfeldes, wo die Schreibung des Schülers eingegeben wird
 *            parentId - Id des "Blattes" (div element) des Schülers
 *            doNotMark - wenn true wird die Anzeige für die Auswertung nicht erneuert, wodurch sie nicht zu sehen ist (bei korrekten Wörtern)
 *            doNotResetMirror -
 */
function markErrors(id, parentId, doNotMark, doNotResetMirror) {
  // TODO: Silben mit einbeziehen: siehe Eingabe "Dno"
  if (!auswertung.doNotCount[selectedElementId.parent]) auswertung.doNotCount[selectedElementId.parent] = [];
  selectedElementId = {parent: parentId, element: id};
  refreshNeededTest();
  inputs[/*'Test ' + */selectedTest][parentId][id] = findChild('id', selectedElementId.parent, id).value;
  localStorage.setItem('inputsSchiku', JSON.stringify(inputs));
  var correct = findChild('id', selectedElementId.parent, 'word ' + id.replace('pupilsWriting ', '')).innerText;
  var wrong = findChild('id', selectedElementId.parent, 'pupilsWriting ' + id.replace('pupilsWriting ', '')).value;
  // findChild("id", parentId, id).style.width = wrong.length*8;
  if (adaptInputs.checked) {
  findChild("id", parentId, id).style.width = 1;
  findChild("id", parentId, id).scroll(100, 0)
  while (findChild("id", parentId, id).scrollLeft > 0) {
    findChild("id", parentId, id).style.width = JSON.parse(findChild("id", parentId, id).style.width.replace("px", "")) + 1 + "px";
  }
  }
  else findChild("id", parentId, id).style.width = 100;
  var wrongI = 0;
  if (!doNotResetMirror && inputs[/*'Test ' + */selectedTest] && inputs[/*'Test ' + */selectedTest][selectedElementId.parent] && inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror) inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror[correct] = [];
  if (auswertung.wrongLetters[selectedElementId.parent]) auswertung.wrongLetters[selectedElementId.parent][correct] = {};
  if (auswertung.categories[selectedElementId.parent]) auswertung.categories[selectedElementId.parent][correct] = {};
  var newWord = [];
  var addI = 0;
  var doubleError = 0;
  graphemFehler = 0;
  letterList = {};
  letterCounter = {};
  var wordCorrectionChild = findChild('id', selectedElementId.parent, 'correction ' + id.replace('pupilsWriting ', ''));
  for (var i = 0; findChild('id', wordCorrectionChild, 'correctionLetter', true); i++) {
    findChild('id', wordCorrectionChild, 'correctionLetter', true).remove();
  }
  try {
    findChild('id', wordCorrectionChild, 'graphemtrefferGot', true).remove();
    findChild('id', wordCorrectionChild, 'graphemtrefferPossible', true).remove();
    findChild('id', wordCorrectionChild, 'graphemtrefferSlash', true).remove();
    findChild('id', wordCorrectionChild, 'automaticGraphemTreffer' + correct, true).remove();
  } catch (e) {console.log(e);}
  for (var i = 0; i < wrong.length; i++) {
    newWord.push({letter: wrong[i], colour: "white"});
  }
  var original = {correct: correct, wrong: wrong};
  correct = correct.toLowerCase();
  wrong = wrong.toLowerCase();
  for (var i = 0; i < correct.length && wrong[wrongI]; i++) {
    var ausgetauscht = 0;
    checkCategory(original.correct, i);
    // check letter difference: following letter wrong
    if (correct[i] != wrong[wrongI] && (!wrong[wrongI + 1] || (wrong[wrongI + 1] && wrong[wrongI + 1] != correct[i]))) {
      if ((/*wrong[wrongI] == wrong[wrongI] || */correct[i] != wrong[wrongI]/*capitalizeFirstLetter(correct[i]) == correct[i]*/)/* && !(capitalizeFirstLetter(correct[i]) == correct[i] && correct[i] == wrong[wrongI])*/) {
        addWrongLetter(original.correct, i);
      }
      // console.log(correct[i] + " before " + wrong[wrongI]);
      // check if letter missing
      if ((!wrong[wrongI + 1] && (!wrong[wrongI] || wrong[wrongI] != correct[i + 1])) || (wrong[wrongI + 1] && wrong[wrongI + 1] == correct[i + 1])) {
        // console.log("remove " + wrong[wrongI] + " pos. " + wrongI);
        if (newWord[wrongI + addI]) newWord[wrongI + addI].colour = selectedColours.wrong.dark.text;
        wrongI++;

        // check if doubleError: same letter 2 times in a row, on time false: understand, that it was not a replacement, but an added wrong letter
        if (wrong[wrongI - 2] == wrong[wrongI - 1]) {
          newWord.splice(wrongI + addI, 0, {letter: '_', colour: "white"});
          addI++;
          doubleError++;
        }
}
else {
  newWord.splice(wrongI + addI, 0, {letter: '_', colour: "white"});
  addI++;
  // graphemFehler++;
}
    }
    // getauscht check
    else if (correct[i + 1] == wrong[wrongI] && correct[i] == wrong[wrongI + 1] && correct[i] != correct[i + 1]) {
      graphemFehler++;
      newWord[wrongI + addI].colour = selectedColours.wrong.dark.text;
      newWord[wrongI + 1 + addI].colour = selectedColours.wrong.dark.text;
      i++;
      ausgetauscht = 1;
      wrongI++;
    }
    // too much before end
    else if (((wrong[wrongI + 1] && wrong[wrongI + 1] == correct[i])) && correct[i] != wrong[wrongI]) {
      // console.log("remove " + wrong[wrongI] + " pos. " + wrongI);
      newWord[wrongI + addI].colour = selectedColours.wrong.dark.text;
      doubleError++;
      i--;
      graphemFehler++;
    }
    // markiere falsche groß-Kleinschreibung
    else if (original.correct[i] != original.wrong[wrongI]) newWord[wrongI + addI].colour = selectedColours.wrong.light.text;
    if (correct[i] == wrong[wrongI - 1] && correct[i - 1] == wrong[wrongI] || (!(correct[i] != wrong[wrongI] && (!wrong[wrongI + 1] || wrongI > i || (wrong[wrongI + 1] && wrong[wrongI + 1] != correct[i]))) || (wrong[wrongI + 1] && wrong[wrongI + 1] == correct[i + 1]))) wrongI++;
  }
  if (ausgetauscht) i--;
  // check end missing
  for (var i = i; newWord.length - doubleError - ausgetauscht < correct.length; i++) {
    newWord.push({letter: '_', colour: "white"});
    checkCategory(original.correct, /*newWord.length - 1*/i);
    addWrongLetter(original.correct, /*newWord.length - 1 - ausgetauscht*/i);
  }
  // check too much in the end
  for (var i = wrongI + addI; i < newWord.length && i >= correct.length; i++) {
    // console.log("remove " + wrong[i]);
    if (newWord[i].letter != '_') {
      newWord[i].colour = selectedColours.wrong.dark.text;
      graphemFehler++;
    }
  }
  checkCategory(original.correct, 0, true);
  // console.log(newWord);
  for (var i = 0; i < newWord.length && !doNotMark && graphemFehler > 0; i++) {
    var textColour = "black";
    if (newWord[i].colour != "white") textColour = "white";
    addElement({id: 'correctionLetter', class: 'correctionLetter' + i, innerText: newWord[i].letter, style: 'background-color:' + newWord[i].colour + ';' + "color:" + textColour, title: 'klicken, um ' + newWord[i].letter + ' als gespiegelt (blau) zu markieren, oder die Markierung wieder zu entfernen.\nBei Veränderung der Schreibweise des Schülers/der Schülerin wird das Wort nicht mehr als gespiegelt eingetragen sein.', onclick: 'changeMirror(' + i + ', "' + id + '");'}, 'strong', /*'correction ' + id.replace('pupilsWriting ', '')*/wordCorrectionChild, true);
  }
  if (possibleGraphemtreffer - graphemFehler < 0) graphemFehler = possibleGraphemtreffer;
  if (!doNotMark && graphemFehler > 0) {
    addElement({value: possibleGraphemtreffer - graphemFehler, id: 'graphemtrefferGot', onchange: 'getEveryCategory();', oninput: 'getAllGraphemtreffer(true, "' + original.correct + '", "' + selectedElementId.parent + '");', class: 'graphemtrefferGot' + capitalizeFirstLetter(selectedElementId.parent), style: 'width: 25;'}, 'input', wordCorrectionChild, true);
    addElement({innerText: '/', id: 'graphemtrefferSlash', style: 'width: 25;'}, 'a', wordCorrectionChild, true);
    addElement({value: possibleGraphemtreffer, id: 'graphemtrefferPossible',onchange: 'getEveryCategory();', oninput: 'getAllGraphemtreffer(true, "' + original.correct + '", "' + selectedElementId.parent + '");', class: 'graphemtrefferPossible' + capitalizeFirstLetter(selectedElementId.parent), style: 'width: 25;'}, 'input', wordCorrectionChild, true);
    addElement({innerText: '⟲automatische Auswertung', id: 'automaticGraphemTreffer' + original.correct, onclick: 'resetGraphemtreffer("' + selectedElementId.element + '", "' + selectedElementId.parent + '");', class: 'automaticGraphemTreffer' + capitalizeFirstLetter(selectedElementId.parent), style: 'width: 100; display: none;'}, 'button', wordCorrectionChild, true);
    findChild('id', selectedElementId.parent, id).style.backgroundColor = selectedColours.wrong.dark.text;
  }
  else {
    addElement({style: 'display: none;', value: possibleGraphemtreffer - graphemFehler, id: 'graphemtrefferGot', class: 'graphemtrefferGot' + capitalizeFirstLetter(selectedElementId.parent)}, 'input', wordCorrectionChild, true);
    addElement({style: 'display: none;', value: possibleGraphemtreffer, id: 'graphemtrefferPossible', class: 'graphemtrefferPossible' + capitalizeFirstLetter(selectedElementId.parent)}, 'input', wordCorrectionChild, true);
    if (original.wrong == original.correct) findChild('id', selectedElementId.parent, id).style.backgroundColor = selectedColours.right.text;
    else findChild('id', selectedElementId.parent, id).style.backgroundColor = selectedColours.wrong.light.text;
  }
  if ((doNotMark || original.correct == original.wrong) && !auswertung.wrongLetters[selectedElementId.parent]) auswertung.wrongLetters[selectedElementId.parent] = {};
  if (doNotMark || original.correct == original.wrong) auswertung.wrongLetters[selectedElementId.parent][original.correct] = {};
  getAllGraphemtreffer();
}
