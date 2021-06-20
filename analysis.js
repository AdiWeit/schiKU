// Zusammenzählen aller Graphemtreffer und korrekter Wörter
// todo: klein + / + groß immer, also bei Rubriken hinzufügen
function getAllGraphemtreffer(/*doNotMark, graphemFehler, correct*/changedByUser, correct, parent) {
  if (parent) {
    selectedElementId.parent = parent;
    refreshNeededTest();
    if (findChild('id', parent, 'automaticGraphemTreffer' + correct)) findChild('id', parent, 'automaticGraphemTreffer' + correct).style.display = 'inline';
  }
  auswertung.allGraphemtreffer.possible = 0;
  auswertung.allGraphemtreffer.got = 0;
  if (parent && !inputs[selectedTest][parent].Graphemtreffer) inputs[selectedTest][parent].Graphemtreffer = {};
  for (var i = 0; i < document.getElementsByClassName("graphemtrefferGot" + capitalizeFirstLetter(selectedElementId.parent)).length; i++) {
    if (i == JSON.parse(selectedElementId.element.replace('pupilsWriting ', '')) - 1 && changedByUser && !auswertung.doNotCount[selectedElementId.parent].includes(correct)) {
      auswertung.doNotCount[selectedElementId.parent].push(correct);
    }
    auswertung.allGraphemtreffer.possible += JSON.parse(document.getElementsByClassName("graphemtrefferPossible" + capitalizeFirstLetter(selectedElementId.parent))[i].value);
    auswertung.allGraphemtreffer.got += JSON.parse(document.getElementsByClassName("graphemtrefferGot" + capitalizeFirstLetter(selectedElementId.parent))[i].value);
    if (parent && replaceAll(neededTest.words[i], '-', '') == correct) {
      inputs[selectedTest][parent].Graphemtreffer[correct] = {got: JSON.parse(document.getElementsByClassName("graphemtrefferGot" + capitalizeFirstLetter(selectedElementId.parent))[i].value), possible: JSON.parse(document.getElementsByClassName("graphemtrefferPossible" + capitalizeFirstLetter(selectedElementId.parent))[i].value)};
    }
  }
  document.getElementById('allGraphemes' + selectedElementId.parent.toString().split('Sheet')[1]).innerHTML = '<a style="font-size:20">gesamt </a> <strong style="font-size:20">' + auswertung.allGraphemtreffer.got + '/' + auswertung.allGraphemtreffer.possible + "</strong> <a style='font-size:20'>Graphemtreffer</a>";
  // alle richtig verschriftlichen Wörter erfassen
  var correctWords = {possible: 0, got: 0};
  for (var i = 0; i < neededTest.words.length; i++) {
    correctWords.possible++;
    if (replaceAll(neededTest.words[i], '-', '') == findChild('id', selectedElementId.parent, 'pupilsWriting ' + (i + 1)).value) correctWords.got++;
  }
  document.getElementById('allCorrect' + selectedElementId.parent.toString().split('Sheet')[1]).innerHTML = '<a style="font-size:20">gesamt </a> <strong style="font-size:20">' + correctWords.got + '/' + correctWords.possible + "</strong> <a style='font-size:20'>korrekte Wörter</a>";
  localStorage.setItem('inputsSchiku', JSON.stringify(inputs));
}
// Schreibdiagnostik: welcher Buchstabe bzw. Laut wie häufig richtig?
// Datenübergabe und Befehl für Erstellung der Graphen
function getEveryCategory(printMode) {
  // Silben aus der Auswertung löschen (wird neu gezählt)
  for (auswertungNow of Object.keys(auswertung)) {
    if (auswertungNow.includes("Silben")/* != "letter" && auswertungNow != "allGraphemtreffer" && auswertungNow != "wrongLetters"*/) {
      delete auswertung[auswertungNow];
      i--;
    }
  }
  auswertung.letter[selectedElementId.parent] = {};
  // doNotCount (Wörter mit manueller Korrektur durch Anpassung der Grapahemtreffer) Laute in minusList (Liste, welche Buchstaben wie Häufig auf Grund von Lauten (hier: mehr als 1 Buchstabe) oder weil sie nicht auswertbar sind von der Auswertung in den Rubriken ausgeschlossen werden müssen) hinzufügen
  var minusList = {doNotCount: {}};
  if (!auswertung.doNotCount[selectedElementId.parent]) auswertung.doNotCount[selectedElementId.parent] = [];
  for (var i = 0; i < auswertung.doNotCount[selectedElementId.parent].length; i++) {
    for (var i1 = 0; i1 < auswertung.doNotCount[selectedElementId.parent][i].length; i1++) {
      var letter = auswertung.doNotCount[selectedElementId.parent][i][i1].toLowerCase();
      if (letter == "e" && i1 == auswertung.doNotCount[selectedElementId.parent][i].length - 1) letter = "<e>/<E>";
      if (!minusList[letter]) minusList[letter] = {};
      if (!minusList[letter][auswertung.doNotCount[selectedElementId.parent][i]]) minusList[letter][auswertung.doNotCount[selectedElementId.parent][i]] = 0;
      minusList[letter][auswertung.doNotCount[selectedElementId.parent][i]]++;
    }
  }
  var doNotCountObj = JSON.parse(JSON.stringify(minusList));
      doNotCountObj.laute = {};
  // Umschreibung in kategorien (vorher: auswertung.categories[aktueller Test, also pupilSheet][Wort][Rubrik][Buchstabe] nachher: auswertung.byCategories[Rubrik][Buchstabe])
  auswertung.byCategories = {};
  for (var i1 = 0; auswertung.categories[selectedElementId.parent] && i1 < Object.keys(auswertung.categories[selectedElementId.parent]).length; i1++) {
    var wordNow = Object.keys(auswertung.categories[selectedElementId.parent])[i1];
    for (category of Object.keys(auswertung.categories[selectedElementId.parent][wordNow])) {
      for (objKeyName of Object.keys(auswertung.categories[selectedElementId.parent][wordNow][category])) {
        if (!auswertung.byCategories[category]) auswertung.byCategories[category] = {possible: 0, got: 0};
        if (objKeyName != "got" && objKeyName != "possible") {
          if (!auswertung.doNotCount[selectedElementId.parent].includes(wordNow)) {
          if (!auswertung.byCategories[category][objKeyName]) auswertung.byCategories[category][objKeyName] = {possible: 0, got: 0};
          if (!minusList[objKeyName] || !minusList[objKeyName][wordNow]) {
        auswertung.byCategories[category][objKeyName].possible += auswertung.categories[selectedElementId.parent][wordNow][category][objKeyName].possible;
        auswertung.byCategories[category][objKeyName].got += auswertung.categories[selectedElementId.parent][wordNow][category][objKeyName].got;
      }
      else if (minusList[objKeyName] && minusList[objKeyName][wordNow]) minusList[objKeyName][wordNow]--;
        }
        else if (!doNotCountObj.laute[objKeyName]) {
          // TODO: wenn keine Kathegorie vorhanden
          doNotCountObj.laute[objKeyName] = 0;
          if (objKeyName.length == 1) doNotCountObj.laute[objKeyName] += doNotCountObj[objKeyName][wordNow];
          // TODO: Laute: einzelne Buchstaben übertragen (Anzahl kann aus auswertung.categories abgelesen werden)
          else {
            // doNotCountObj.laute[objKeyName]++;
            doNotCountObj.laute[objKeyName] += auswertung.categories[selectedElementId.parent][wordNow][category][objKeyName].possible;
            for (var letter of objKeyName) {
              if (!doNotCountObj.laute[letter]) doNotCountObj.laute[letter] = 1;
              doNotCountObj.laute[letter]--;
            }
          }
        }
      }
        else if (objKeyName == "possible") auswertung.byCategories[category].possible += auswertung.categories[selectedElementId.parent][wordNow][category].possible;
        else {
        auswertung.byCategories[category].got += auswertung.categories[selectedElementId.parent][wordNow][category].got;
        }
    }
    }
  }
  var wrongList = [];
  var rightList = [];
  var mirrorList = [];
  var letterList = [];
  for (var i = 0; i < neededTest.words.length; i++) {
    var inputValue = document.getElementsByClassName('writing' + capitalizeFirstLetter(selectedElementId.parent))[i].value.toLowerCase();

    // Auswertung Silben
    var label = neededTest.words[i].toString().split('-').length + ' Silben';
    var wordWithoutSilben = replaceAll(neededTest.words[i], '-', '');
    if (auswertung.doNotCount[selectedElementId.parent].includes(wordWithoutSilben)) {
    if (!doNotCountObj[label]) doNotCountObj[label] = 0;//{};
    // if (!doNotCountObj[label][wordWithoutSilben]) doNotCountObj[label][wordWithoutSilben] = 0;
    doNotCountObj[label]/*[wordWithoutSilben]*/++;
    // falls kein einziger auswertbar
    if (!auswertung[label]) auswertung[label] = {possible: 0, got: 0};
  }
    else {
      if (!auswertung[label]) auswertung[label] = {possible: 0, got: 0};
      auswertung[label].possible++;
      if (wordWithoutSilben.toLowerCase() == inputValue) auswertung[label].got++;
    }

    // Auswertung Buchstaben
    try {
    var wordNow = replaceAll(neededTest.words[i], '-', '');
      var wrongLetterAblage = JSON.parse(JSON.stringify(auswertung.wrongLetters[selectedElementId.parent][wordNow]));
      for (var i1 = 0; i1 < wordNow.length; i1++) {
        var letterNow = wordNow[i1].toLowerCase();
        if (i1 == wordNow.length - 1 && letterNow == "e")  {
          letterNow = "<e>";
          minusList["<e>"] = minusList["<e>/<E>"];
        }
        if (!auswertung.letter[selectedElementId.parent][letterNow]) auswertung.letter[selectedElementId.parent][letterNow] = {possible: 0, got: 0};
        if (!minusList[letterNow] || !minusList[letterNow][wordNow] || minusList[letterNow][wordNow] == 0) auswertung.letter[selectedElementId.parent][letterNow].possible++;
        if (!auswertung.wrongLetters[selectedElementId.parent][wordNow] || (!auswertung.wrongLetters[selectedElementId.parent][wordNow][letterNow])) {
          if (!(minusList[letterNow] && minusList[letterNow][wordNow] && minusList[letterNow][wordNow] > 0)) auswertung.letter[selectedElementId.parent][letterNow].got++;
      }
      if (auswertung.wrongLetters[selectedElementId.parent][wordNow] && auswertung.wrongLetters[selectedElementId.parent][wordNow][letterNow]) auswertung.wrongLetters[selectedElementId.parent][wordNow][letterNow]--;
      if (minusList[letterNow] && minusList[letterNow][wordNow] && minusList[letterNow][wordNow] > 0) minusList[letterNow][wordNow]--;
    }
    auswertung.wrongLetters[selectedElementId.parent][wordNow] = wrongLetterAblage;
   } catch (e) {
     console.log('not filled already');
   }
  }
  // <e> als Endung hinzufügen (steht immer am Ende)
  if (neededTest.kategorien && neededTest.kategorien.Endungen && neededTest.kategorien.Endungen.includes("<e>")) {
    if (!auswertung.byCategories.Endungen) auswertung.byCategories.Endungen = {};
    if (auswertung.letter[selectedElementId.parent]["<e>"]) auswertung.byCategories.Endungen["<e>/<E>"] = auswertung.letter[selectedElementId.parent]["<e>"];
  }
  // Anzahl Richtige und Anzahl Falsche zur Liste nach Kategorien und Alphabet geordnet hinzufügen
  var categoryList = [];
  var wordsCountedTogether = [];
  auswertung.byCategories = sortObjectByKey(auswertung.byCategories, true);
  for (category of Object.keys(auswertung.byCategories)) {
    auswertung.byCategories[category] = sortObjectByKey(auswertung.byCategories[category], true);
    categoryList.push(category);
    // Zusammenzählen der Rubrik, falls ausgewählt
  if (neededTest.countTogether && neededTest.countTogether.includes(category) && countTogether.checked) {
    categoryList[categoryList.length - 1] = "zusammen " + categoryList[categoryList.length - 1];
    rightList.push(auswertung.byCategories[category].got)
    wrongList.push(auswertung.byCategories[category].possible - auswertung.byCategories[category].got);
    for (letter of Object.keys(auswertung.byCategories[category])) {
      if (letter != "<e>/<E>") wordsCountedTogether.push(letter + "/" + letter.toUpperCase());
      else wordsCountedTogether.push(letter);
    }
  }
  else {
    // 0 wegen Text der Rubriken auf der y-Achse (dort sollen keine Balken sein)
    rightList.push(0)
    wrongList.push(0);
    // Hinzufügen der Rubriken, Anzahl richtig und Anzahl falsch geschriebener Laute in Liste für Grafik hinzufügen
    for (objKeyName of Object.keys(auswertung.byCategories[category])) {
      if (objKeyName != "got" && objKeyName != "possible") {
        // letterList push weiter unten um Buchstaben, die in einer Kategorie sind aber in dem spezifisch gewählen Test nicht vorkommen abzufangen
        // letterList.push(objKeyName);
        categoryList.push(objKeyName);
        rightList.push(auswertung.byCategories[category][objKeyName].got);
        wrongList.push(auswertung.byCategories[category][objKeyName].possible - auswertung.byCategories[category][objKeyName].got);
      }
    }
  }
}
// alle zu bewertende Laute in "letterList" hinzufügen
for (category of Object.keys(neededTest.kategorien)) {
  for (laut of neededTest.kategorien[category]) {
    letterList.push(laut);
  }
}
// Falls keine Rubrik "sonstige" vorhanden, aber andere vorhanden sind, wird diese erstellt
  if (!Object.keys(auswertung.byCategories).includes('sonstige') && Object.keys(auswertung.byCategories).length > 0) {
    categoryList.push('sonstige');
    rightList.push(0/*auswertung.byCategories[category].got*/)
    wrongList.push(0/*auswertung.byCategories[category].possible - auswertung.byCategories[category].got*/);
  }

    // console.log(auswertung);
    auswertung.letter[selectedElementId.parent] = sortObjectByKey(auswertung.letter[selectedElementId.parent]);
    // categoryList = Object.keys(auswertung.letter[selectedElementId.parent]);
    // Buchstaben, die in keiner Rubrik vorkamen werden nun (unter "sonstige") hinzugefügt
    for (letter of Object.keys(auswertung.letter[selectedElementId.parent])) {
      if (!wordsCountedTogether.includes(letter) && !(letterList.includes(letter[0])) && letter[0] != "e" && (letter != "<e>/<E>" || (!auswertung.byCategories.Endungen || !Object.keys(auswertung.byCategories.Endungen).includes("<e>/<E>")))) {
        // Buchstabe mit Anzahl falsch und Anzahl richtig geschrieben hinzufügen
        categoryList.push(letter);
        // if (Object.keys(minusList).includes(letter[0])) {
          // auswertung.letter[selectedElementId.parent][letter].possible -= minusList[letter[0]].possible;
          // auswertung.letter[selectedElementId.parent][letter].got -= minusList[letter[0]].got;
        // }
        wrongList.push(auswertung.letter[selectedElementId.parent][letter].possible - auswertung.letter[selectedElementId.parent][letter].got);
        rightList.push(auswertung.letter[selectedElementId.parent][letter].got);
      }
    }
    // _Silbige Wörter und wie oft sie falsch und wie oft sie richtig eingegeben wurden (unter "sonstige" ganz unten) hinzufügen
    for (auswertungNow of Object.keys(auswertung)) {
      if (auswertungNow.includes('Silben')) {
        categoryList.push(auswertungNow);
        wrongList.push(auswertung[auswertungNow].possible - auswertung[auswertungNow].got);
        rightList.push(auswertung[auswertungNow].got);
      }
    }
    for (var i = 0; i < categoryList.length; i++) {
      mirrorList.push(0);
    }
    // gespiegelte Buchstaben hinzufügen
    // TODO: <e> gespiegelt
    for (var i2 = 0; inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror && i2 < Object.keys(inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror).length; i2++) {
      for (var i4 = 0; i4 < inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror[Object.keys(inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror)[i2]].length; i4++) {
        if (inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror[Object.keys(inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror)[i2]][i4]) {
          for (var i = 0; i < categoryList.length; i++) {
            if (categoryList[i][0] == findChild("class", findChild("word", selectedElementId.parent, Object.keys(inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror)[i2]), "correctionLetter" + i4, true).innerText.toLowerCase() && (categoryList[i].includes('/') || categoryList[i].length == 1)) {
              mirrorList[i]++;
              i = categoryList.length;
            }
          }
          if (i != categoryList.length + 1) {
            categoryList.push(findChild("class", findChild("word", selectedElementId.parent, Object.keys(inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror)[i2]), "correctionLetter" + i4, true).toLowerCase());
            mirrorList[i]++;
          }
        }
      }
      }
      var doNotCountList = [];
      // doNotCount (nict automatisch ausgewertet, also nur Graphemtreffer bekannt) zur Liste für die Grafik hinzufügen
      for (var i = 0; i < categoryList.length; i++) {
        // Hinzufügen der Laute, falls in Rubrik vorhanden
        if (Object.keys(doNotCountObj.laute).includes(categoryList[i].split("/")[0])) {
          doNotCountList.push(doNotCountObj.laute[categoryList[i].split("/")[0]]);
        }
        // Hinzufügen der Endung <e>
        else if (categoryList[i] == "<e>/<E>" && Object.keys(doNotCountObj).includes('<e>/<E>')) {
          doNotCountList.push(0);
          for (var i1 = 0; i1 < Object.keys(doNotCountObj[categoryList[i]]).length; i1++) {
            doNotCountList[doNotCountList.length - 1] += doNotCountObj[categoryList[i]][Object.keys(doNotCountObj[categoryList[i]])];
          }
        }
        // Hinzufügen der nicht in Rubriken vorhandenen Buchstaben
        else if (Object.keys(doNotCountObj).includes(categoryList[i].split("/")[0])) {
          var total = 0;
          for (keyNow of Object.keys(doNotCountObj[categoryList[i].split("/")[0]])) {
            total += doNotCountObj[categoryList[i].split("/")[0]][keyNow];
          }
          doNotCountList.push(total);
        }
        // Eintragen, dass kein nicht auswertbarer vorhanden ist, oder deine Rubrik auf der y-Achse bei dem Index vorhanden ist, wodurch dort auch nichts vorhanden sein kann
        else if ((categoryList[i].length != 3 || !Object.keys(doNotCountObj).includes(categoryList[i][0])) && categoryList[i] != "<e>/<E>") {
          doNotCountList.push(0);
        }
        // "sonstige" hinzufügen
        else if (categoryList[i].length == 3) {
          doNotCountList.push(0);
          // if (minusList.doNotCount[categoryList[i][0]] && minusList.doNotCount[categoryList[i][0]] != 0) {
          // Abziehen wegen minusList (also Bucstaben aus Lauten (hier: mehrere Buchstaben) o.ä.)
            /*minusList.doNotCount[categoryList[i][0]]*/if (minusList.doNotCount[categoryList[i][0]]) doNotCountList[doNotCountList.length - 1] -= minusList.doNotCount[categoryList[i][0]];
          // }
          // else {
          //
          for (wordNow of Object.keys(doNotCountObj[categoryList[i][0]])) {
            doNotCountList[doNotCountList.length - 1] += doNotCountObj[categoryList[i][0]][wordNow[i1]];
          }
        // }
        }
        // sonst damit die richtige Position auf der y-achse erhalten bleibt, 0 hinzufügen
        else doNotCountList.push(0);
      }
    addChart(categoryList, {wrong: wrongList, right: rightList, doNotCount: doNotCountList, mirror: mirrorList}, printMode);
}
// fügt einen neuen Graphem inzu bzw. aktuallisiert ihn
// @param texte: Beschriftung des Graphen auf der y-Achse (Balkendiagramm)
// @param data: Inhalte bzw. Daten für die Balken
function addChart(texte, data, printMode) {
  // to refresh size (not working otherwise)
  document.getElementById('textur' + selectedElementId.parent).remove();
  addElement({id: 'textur' + selectedElementId.parent}, 'canvas', 'divGraph' + selectedElementId.parent.replace('pupilSheet', ''));
  var data = {
    labels: texte,//["b statt d", "h weggelassen", "t statt l"],
    datasets: [{
      label: "richtige",
      backgroundColor: selectedColours.right[patterns],
      // borderColor: selectedColours.right[patterns],
      fill: true,
      data: data.right,//[5,3,7],
      stack:'stack0'
    }, {
      label: "falsche",
      backgroundColor: selectedColours.wrong.dark[patterns],
      // borderColor: selectedColours.wrong.dark,
      fill: true,
      data: data.wrong,
      stack:'stack0'
    }, {
      label: "nicht auswertbar",
      backgroundColor: selectedColours.doNotCount[patterns],
      // borderColor: selectedColours.doNotCount,
      fill: true,
      data: data.doNotCount,
      stack:'stack0'
    }, {
      label: "spiegelverkehrt",
      backgroundColor: selectedColours.spiegelverkehrt[patterns]/*'#00BFFF'*/,
      // borderColor: selectedColours.spiegelverkehrt,
      fill: true,
      data: data.mirror,
      stack:'stack0'
    }
    ]
  }
  var options = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      xAxes: [{
        stacked: true,
        ticks: {
          stepSize: 2,
          fontSize: 17
        }
        // barPercentage: 0.4
      }],
      yAxes: [{
        stacked: true,
        // barPercentage: 0.3,
        ticks: {
          beginAtZero: true,
          fontSize: 20
          // stepSize: 2,
        }
      }],
    },
  }
  myBarChart[selectedElementId.parent.replace('pupilSheet', '')] = new Chart(document.getElementById('textur' + selectedElementId.parent), {
    type: 'horizontalBar',
    data: data,
    options: options
});
console.log("selectedElementId: " + selectedElementId.parent);
var chartNow = myBarChart[selectedElementId.parent.replace('pupilSheet', '')];
// Markierung der Wörter mit dem ausgewählten Kriterium bzw. Balken
document.getElementById('textur' + selectedElementId.parent).onclick = function(evt) {
  // TODO: Markierung: "te"/"et" bei "Tapete" (Überschneidung)
  selectedElementId.parent = evt.path[0].id.replace('textur', '');
  refreshNeededTest();
  var chartNow = myBarChart[selectedElementId.parent.replace('pupilSheet', '')];
  var activePoints = chartNow.getElementsAtEvent(evt);
  if (activePoints[0]) {
    var chartData = activePoints[0]['_chart'].config.data;
    var idx = activePoints[0]['_index'];
    var pupilSheet = chartNow.canvas.id.replace('textur', '');
    var label = chartData.labels[idx];
    if (label.includes("/") && label.length == 3) label = label[0];
    if (label == "<e>/<E>") label = "<e>";
    var right = chartData.datasets[0].data[idx];
    var wrong = chartData.datasets[1].data[idx];
    console.log(label + ': ' + right + '/' + (wrong + right) + ' (' + wrong + ' wrong)');
    console.log("selectedElementId: " + pupilSheet);
    var possibleLetterList = [];
    for (var i1 = 0; neededTest.kategorien && i1 < Object.keys(neededTest.kategorien).length; i1++) {
      var category = Object.keys(neededTest.kategorien)[i1];
      for (var i2 = 0; i2 < Object.keys(neededTest.kategorien[category]).length; i2++) {
        var letter = neededTest.kategorien[category][i2];
        if (letter.includes(label) && letter != label && letter != "got" && letter != "possible") possibleLetterList.push(letter);
      }
    }
    var category = label;
    for (var i = idx; !Object.keys(neededTest.kategorien).includes(category); i--) {
      category = chartData.labels[i];
    }
      for (var i = 0; i < neededTest.words.length; i++) {

        findChild('id', pupilSheet, 'correction ' + (i + 1)).style.outlineStyle = "";
        // Überprüfung, ob das Ausgewählte in dem Wort, das gerade überprüft wird, vorhanden ist
        if ((category != "Doppelkonsonanten" || (replaceAll(neededTest.words[i], '-', '').includes(label + label) && ((Object.keys(neededTest.betonung[i])[0] && replaceAll(neededTest.words[i], '-', '')[JSON.parse(Object.keys(neededTest.betonung[i])[0]) + 1] == label) || (Object.keys(neededTest.betonung[i])[1] && replaceAll(neededTest.words[i], '-', '')[JSON.parse(Object.keys(neededTest.betonung[i])[1]) + 1] == label)))) && (label.replace('>', '').replace('<', '').length == 1 && (neededTest.words[i].toLowerCase().includes(label.replace('>', '').replace('<', '').toLowerCase())) || (label.includes('Silben') && neededTest.words[i].toString().split('-').length == label.replace(' Silben', ''))) && findChild('id', pupilSheet, 'pupilsWriting ' + (i + 1)).value != "") {
          var result = undefined;
          if (label == 'e' && neededTest.words[i][neededTest.words[i].length - 1] == "e") {
            result = neededTest.words[i].split('');
            result.pop();
          }
          // Das angewälte, falls kein Laut (mit mehreren Buchstaben) markieren
          if (label.includes('Silben') || ((label != '<e>' && (!result || (result.join('').includes('e')))) || (label == '<e>' && neededTest.words[i][neededTest.words[i].length - 1] == "e"))) {
          // Überprüfung, ob
          var labelIncluded = false;
          var wordWithoutCategories = neededTest.words[i].toLowerCase();
          for (var i1 = 0; i1 < possibleLetterList.length; i1++) {
            wordWithoutCategories = replaceAll(wordWithoutCategories, possibleLetterList[i1], '');
          }
          if ((wordWithoutCategories.includes(label) || possibleLetterList.length == 0)) {
          findChild('id', pupilSheet, 'correction ' + (i + 1)).style.outlineColor = selectedColours.wrong.dark.text;
          if ((!Object.keys(auswertung.wrongLetters[pupilSheet][replaceAll(neededTest.words[i], '-', '')]).length || (!auswertung.wrongLetters[pupilSheet][replaceAll(neededTest.words[i], '-', '')][label])) && (!(label.includes('Silben')) || findChild('id', pupilSheet, 'pupilsWriting ' + (i + 1)).value == replaceAll(neededTest.words[i], '-', ''))) findChild('id', pupilSheet, 'correction ' + (i + 1)).style.outlineColor = selectedColours.right.text;//"green";
          if (auswertung.doNotCount[selectedElementId.parent].includes(replaceAll(neededTest.words[i], '-', ''))) findChild('id', pupilSheet, 'correction ' + (i + 1)).style.outlineColor = "gray";
          findChild('id', pupilSheet, 'correction ' + (i + 1)).style.outlineStyle = "outset";
          // TODO: leere Felder beachten (Liste der Class und dann bei leeren Feldern was rein setzen?)
          findChild('id', pupilSheet, 'correction ' + (i + 1)).style.width = graphemtrefferPossible[neededTest.words.length*(pupilSheet.replace('pupilSheet', '') - 1) + i].getBoundingClientRect().right + 3;
          // if (findChild('id', pupilSheet, 'pupilsWriting ' + (i + 1)).value.toLowerCase() == replaceAll(neededTest.words[i], '-', '').toLowerCase()) findChild('id', pupilSheet, 'correction ' + (i + 1)).style.width = 7*replaceAll(neededTest.words[i], '-', '').length;
        }
        }
      }
      // Ausgewählte Kriterium ist in einer Kategorie vorhanden: Markierung des Wortes
      if (label.replace('>', '').replace('<', '').length > 1 && !(label.includes("Silben"))) {
        var wordNow = replaceAll(neededTest.words[i], '-', '');
        findChild('word', pupilSheet, wordNow).style.outlineStyle = "";
        for (category of Object.keys(auswertung.categories[selectedElementId.parent][wordNow])) {
          for (letter of Object.keys(auswertung.categories[selectedElementId.parent][wordNow][category])) {
            if (auswertung.categories[selectedElementId.parent][wordNow][category][letter].possible && letter == label) {
              findChild('word', pupilSheet, wordNow).style.outlineColor = selectedColours.wrong.dark.text;
              if (auswertung.categories[selectedElementId.parent][wordNow][category][letter].possible == auswertung.categories[selectedElementId.parent][wordNow][category][letter].got) findChild('word', pupilSheet, wordNow).style.outlineColor = selectedColours.right.text;//"green";
              if (auswertung.doNotCount[selectedElementId.parent].includes(wordNow)) findChild('word', pupilSheet, wordNow).style.outlineColor = "gray";
              findChild('word', pupilSheet, wordNow).style.outlineStyle = "outset";
              findChild('word', pupilSheet, wordNow).style.width = graphemtrefferPossible[neededTest.words.length*(pupilSheet.replace('pupilSheet', '') - 1) + i].getBoundingClientRect().right + 3;
              // if (findChild('id', pupilSheet, 'pupilsWriting ' + (i + 1)).value == wordNow) findChild('word', pupilSheet, wordNow).style.width = 7*replaceAll(neededTest.words[i], '-', '').length;
            }
          }
        }
      }
    }
  }
};
var mostLeft = 257;
for (var i = 0; i < document.getElementsByClassName('writing' + selectedElementId.parent).length; i++) {
  if (document.getElementsByClassName('writing' + selectedElementId.parent)[i].getBoundingClientRect().right > mostLeft) mostLeft = document.getElementsByClassName('writing' + selectedElementId.parent)[i].getBoundingClientRect().right;
}
// Anpassung der Größe der Grafik und des Feldes für Anmerkungen
chartNow.canvas.parentNode.style.right = 27//-20;
chartNow.canvas.parentNode.style.width = window.innerWidth - mostLeft - 10 - (window.innerWidth - document.getElementById(selectedElementId.parent).getBoundingClientRect().right);
chartNow.canvas.parentNode.style.height = 1;
if (printMode && randDrucken.checked) chartNow.canvas.parentNode.style.top = document.getElementById(selectedElementId.parent).getBoundingClientRect().top + 55 + scrollY + 37*(selectedElementId.parent.replace('pupilSheet', '') - 1);
else chartNow.canvas.parentNode.style.top = document.getElementById(selectedElementId.parent).getBoundingClientRect().top + 40 + scrollY;
for (var graphBottom = document.getElementById('divGraph' + selectedElementId.parent.replace('pupilSheet', '')).getBoundingClientRect().bottom; document.getElementById(selectedElementId.parent).getBoundingClientRect().bottom > graphBottom; graphBottom++) {
  chartNow.canvas.parentNode.style.height = JSON.parse(chartNow.canvas.parentNode.style.height.replace('px', '')) + 1 + 'px';
}
findChild('id', selectedElementId.parent, 'comment').style.width = window.innerWidth - mostLeft - 65- (window.innerWidth - document.getElementById(selectedElementId.parent).getBoundingClientRect().right);
findChild('id', selectedElementId.parent, 'comment').style.height = 10;
makeTextboxBigger();
if (chartNow.canvas.parentNode.style.height.replace("px", "") > 50*texte.length) chartNow.canvas.parentNode.style.height = 50*texte.length + "px";
// findChild('id', selectedElementId.parent, 'comment').style.top = chartNow.canvas.parentNode.style.top.replace("px", "") - JSON.parse(findChild('id', selectedElementId.parent, 'comment').style.height.replace("px", "")) - (1*(selectedElementId.parent.replace('pupilSheet', '') - 1)) + "px";
}
