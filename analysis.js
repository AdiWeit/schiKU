// Zusammenzählen aller Graphemtreffer und korrekter Wörter
// todo: klein + / + groß immer, also bei Rubriken hinzufügen
function getAllGraphemtreffer(/*doNotMark, graphemFehler, correct*/changedByUser, correct, parent) {
  auswertung.allGraphemtreffer.possible = 0;
  auswertung.allGraphemtreffer.got = 0;
  var writingI;
  // doNotCountBefore = structuredClone(auswertung.doNotCount[parent]);
  if (parent && !inputs[selectedTest][parent].Graphemtreffer) inputs[selectedTest][parent].Graphemtreffer = {};
  for (var i = 0; i < document.getElementsByClassName("graphemtrefferGot" + capitalizeFirstLetter(selectedElementId.parent)).length; i++) {
    var element = document.getElementsByClassName("graphemtrefferGot" + capitalizeFirstLetter(selectedElementId.parent))[i];
    if (parent && findChild("id", parent, "word " + (i + 1)).innerText == correct) {
      writingI = i;
    }
    if (i == JSON.parse(selectedElementId.element.replace('pupilsWriting ', '')) - 1 && changedByUser && !auswertung.doNotCount[selectedElementId.parent].includes(correct)) {
      auswertung.doNotCount[selectedElementId.parent].push(correct);
    }
    auswertung.allGraphemtreffer.possible += JSON.parse(document.getElementsByClassName("graphemtrefferPossible" + capitalizeFirstLetter(selectedElementId.parent))[i].value);
    auswertung.allGraphemtreffer.got += Number(element.value);
    if (parent && replaceAll(neededTest.words[i], '-', '') == correct) {
      // track Graphemtreffer (possible + got) to make automatically going back to autocorrection possible
      if (/*doNotCountBefore.includes(correct)*/Object.keys(inputs[selectedTest][parent].Graphemtreffer[correct]).includes('auto_correction')) {
        before = structuredClone(inputs[selectedTest][parent].Graphemtreffer[correct].auto_correction)
      }
      else before = structuredClone(inputs[selectedTest][parent].Graphemtreffer[correct]);
      if (!inputs[selectedTest][parent].Graphemtreffer[correct]) inputs[selectedTest][parent].Graphemtreffer[correct] = {};
      inputs[selectedTest][parent].Graphemtreffer[correct].got = Number(element.value) 
      inputs[selectedTest][parent].Graphemtreffer[correct].possible = JSON.parse(document.getElementsByClassName("graphemtrefferPossible" + capitalizeFirstLetter(selectedElementId.parent))[i].value);
      if (!/*doNotCountBefore.includes(correct)*/Object.keys(inputs[selectedTest][parent].Graphemtreffer[correct]).includes('auto_correction')) {
        inputs[selectedTest][parent].Graphemtreffer[correct].auto_correction = before;
      }
    }
  };  
  // parent only defined if graphemtreffer manually changed?
  // handle automatic correction button display + automatic revert to automatic correction because of same values
  if (parent) {
    selectedElementId.parent = parent;
    refreshNeededTest();
    graphemtreffer = inputs[selectedTest][parent].Graphemtreffer[correct];
    // TODO: autocorrection not always gotten (recreation of history)
    if (graphemtreffer.got == graphemtreffer.auto_correction?.got && graphemtreffer.possible == graphemtreffer.auto_correction?.possible) {
      resetGraphemtreffer("pupilsWriting " + (writingI+1), selectedElementId.parent);
    }
    else if (findChild('id', parent, 'automaticGraphemTreffer' + correct)) {
      findChild('id', parent, 'automaticGraphemTreffer' + correct).style.display = 'inline';
    } 
  }
  document.getElementById('allGraphemes' + selectedElementId.parent.toString().split('Sheet')[1]).innerHTML = '<a style="font-size:20">gesamt </a> <strong style="font-size:20">' + auswertung.allGraphemtreffer.got + '/' + auswertung.allGraphemtreffer.possible + "</strong> <a style='font-size:20'>Graphemtreffer</a>";
  // alle richtig verschriftlichen Wörter erfassen
  var correctWords = {possible: 0, got: 0};
  neededTest.words.forEach((word, i) => {
      correctWords.possible++;
      if (replaceAll(word, '-', '') == findChild('id', selectedElementId.parent, 'pupilsWriting ' + (i + 1)).value) correctWords.got++;
  });
  document.getElementById('allCorrect' + selectedElementId.parent.toString().split('Sheet')[1]).innerHTML = '<a style="font-size:20">gesamt </a> <strong style="font-size:20">' + correctWords.got + '/' + correctWords.possible + "</strong> <a style='font-size:20'>korrekte Wörter</a>";
  localStorage.setItem('inputsSchiku', JSON.stringify(inputs));
  inputs[/*'Test ' + */selectedTest][selectedElementId.parent].completed = completed()
}
// Schreibdiagnostik: welcher Buchstabe bzw. Laut wie häufig richtig?
// Datenübergabe und Befehl für Erstellung der Graphen
// manualOverwrite: true wenn durch Überschreiben der Graphemtreffer aufgerufen
// id: pupilsWriting [1-*]
// beide Parameter nur für graue Unterlegung wenn doNotCount -> TODO: später verlagern?
function getEveryCategory(manualOverwrite, id) {
  // Silben aus der Auswertung löschen (wird neu gezählt)
  for (auswertungNow of Object.keys(auswertung)) {
    if (auswertungNow.includes("Silben")/* != "letter" && auswertungNow != "allGraphemtreffer" && auswertungNow != "wrongLetters"*/) {
      delete auswertung[auswertungNow];
    }
  }
  auswertung.letter[selectedElementId.parent] = {};
  // doNotCount (Wörter mit manueller Korrektur durch Anpassung der Grapahemtreffer) Laute in minusList (Liste, welche Buchstaben wie Häufig auf Grund von Lauten (hier: mehr als 1 Buchstabe) oder weil sie nicht auswertbar sind von der Auswertung in den Rubriken ausgeschlossen werden müssen) hinzufügen
  var minusList = {doNotCount: {}};
  if (!auswertung.doNotCount[selectedElementId.parent]) auswertung.doNotCount[selectedElementId.parent] = [];
  for (word of auswertung.doNotCount[selectedElementId.parent]) {
    word.split('').forEach((letter, i) => {
      letter = letter.toLowerCase();
      if (letter == "e" && i == word.length - 1) letter = "<e>/<E>";
      if (!minusList[letter]) minusList[letter] = {};
      if (!minusList[letter][word]) minusList[letter][word] = 0;
      minusList[letter][word]++;
    });
  }

  var doNotCountObj = JSON.parse(JSON.stringify(minusList));
      doNotCountObj.laute = {};
      doNotCountObj.byCategories = {};
  // Anzahl Richtige und Anzahl Falsche zur Liste nach Kategorien und Alphabet geordnet hinzufügen
  var categoryList = [];
  // Umschreibung in kategorien (vorher: auswertung.categories[aktueller Test, also pupilSheet][Wort][Rubrik][Buchstabe] nachher: auswertung.byCategories[Rubrik][Buchstabe])
  auswertung.byCategories = {};
  for (var i1 = 0; auswertung.categories[selectedElementId.parent] && i1 < Object.keys(auswertung.categories[selectedElementId.parent]).length; i1++) {
    var wordNow = Object.keys(auswertung.categories[selectedElementId.parent])[i1];
    for (category of Object.keys(auswertung.categories[selectedElementId.parent][wordNow])) {
      // objKeyName: "possible", "got", letters
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
          else {
            if (!doNotCountObj.laute[objKeyName]) {
              doNotCountObj.laute[objKeyName] = 0;
            }
            if (!myCategories[category].includes(objKeyName) && !categoryList.includes(objKeyName)) categoryList.push(objKeyName);
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
    // count doNotCount
    for (category of Object.keys(auswertung.categories[selectedElementId.parent][wordNow])) {
      // objKeyName: "possible", "got", letters
      for (objKeyName of Object.keys(auswertung.categories[selectedElementId.parent][wordNow][category])) {
        for (const letter of Object.keys(doNotCountObj.laute)) {
          if (letter == objKeyName) {
            if (!doNotCountObj.byCategories[category]) doNotCountObj.byCategories[category] = {}
            doNotCountObj.byCategories[category][letter] = doNotCountObj.laute[letter];
          }
        }
      }
    }
  }
  var wrongList = [];
  var rightList = [];
  var mirrorList = [];
  var letterList = [];
    neededTest.words.forEach((word, i) => {
    var inputValue = document.getElementsByClassName('writing' + capitalizeFirstLetter(selectedElementId.parent))[i].value.toLowerCase();

    // Auswertung Silben
    var label = word.toString().split('-').length + ' Silben';
    var wordWithoutSilben = replaceAll(word, '-', '');
    if (auswertung.doNotCount[selectedElementId.parent].includes(wordWithoutSilben)) {
    // TODO: check ob Vereinheitlichen möglich
    if (label.includes("Silben")) {
      if (!doNotCountObj[label]) {
        doNotCountObj[label] = {}
      }
      if (!doNotCountObj[label][wordWithoutSilben]) doNotCountObj[label][wordWithoutSilben] = 0
      doNotCountObj[label][wordWithoutSilben]++;
    }
    else {
      if (!doNotCountObj[label]) doNotCountObj[label] = 0;//{};
      doNotCountObj[label]/*[wordWithoutSilben]*/++;
    }
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
    var wordNow = replaceAll(word, '-', '');
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
     console.log('not filled yet');
   }
 });
  // <e> als Endung hinzufügen (steht immer am Ende)
  if (neededTest.kategorien && neededTest.kategorien.Endungen && neededTest.kategorien.Endungen.includes("<e>")) {
    if (!auswertung.byCategories.Endungen) auswertung.byCategories.Endungen = {};
    if (auswertung.letter[selectedElementId.parent]["<e>"]) auswertung.byCategories.Endungen["<e>/<E>"] = auswertung.letter[selectedElementId.parent]["<e>"];
  }
  // Anzahl Richtige und Anzahl Falsche zur Liste nach Kategorien und Alphabet geordnet hinzufügen
  var wordsCountedTogether = [];
  auswertung.byCategories = sortObjectByKey(auswertung.byCategories, true);
  for (category of Object.keys(sortObjectByKey(/*auswertung.byCategories*/myCategories, true))) {
    auswertung.byCategories[category] = sortObjectByKey(auswertung.byCategories[category], true);
    if (Object.keys(auswertung.byCategories).includes(category)) categoryList.push(category);
    // doNotCount categoryList hinzufügen falls nötig
    for (letter of Object.keys(doNotCountObj)) {
      if (myCategories[category].includes(letter)) {
        if (!categoryList.includes(category)) categoryList.push(category)
        if (!Object.keys(auswertung.byCategories[category]).includes(letter)) {
          categoryList.push(letter);
          rightList.push(0);
          wrongList.push(0);
        }
      }
    }
    if (Object.keys(auswertung.byCategories).includes(category)) {
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
          if (!categoryList.includes(objKeyName)) categoryList.push(objKeyName);
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
      var currentWord = Object.keys(inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror)[i2];
      for (var i4 = 0; i4 < inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror[currentWord].length; i4++) {
        // indexList
        if (inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror[currentWord][i4]) {
          for (var i = 0; i < categoryList.length; i++) {
            if (categoryList[i][0] == findChild("class", findChild("word", selectedElementId.parent, currentWord), "correctionLetter" + i4, true).innerText.toLowerCase() && (categoryList[i].includes('/') || categoryList[i].length == 1)) {
              mirrorList[i]++;
              i = categoryList.length;
            }
          }
          if (i != categoryList.length + 1) {
            categoryList.push(findChild("class", findChild("word", selectedElementId.parent, currentWord), "correctionLetter" + i4, true).innerHTML.toLowerCase());
            mirrorList[i]++;
          }
        }
      }
      }
      var doNotCountList = [];
      // doNotCount (nict automatisch ausgewertet, also nur Graphemtreffer bekannt) zur Liste für die Grafik hinzufügen
      categoryList.forEach((category, i) => {
        // Hinzufügen der Laute, falls in Rubrik vorhanden
        if (Object.keys(doNotCountObj.laute).includes(category.split("/")[0])) {
          doNotCountList.push(doNotCountObj.laute[category.split("/")[0]]);
        }
        // Hinzufügen der Endung <e>
        else if (category == "<e>/<E>" && Object.keys(doNotCountObj).includes('<e>/<E>')) {
          doNotCountList.push(0);
          for (word of Object.keys(doNotCountObj[category])) {
            doNotCountList[doNotCountList.length - 1] += doNotCountObj[category][word];
          }
        }
        // Hinzufügen der nicht in Rubriken vorhandenen Buchstaben
        else if (Object.keys(doNotCountObj).includes(category.split("/")[0])) {
          var total = 0;
          for (keyNow of Object.keys(doNotCountObj[category.split("/")[0]])) {
            total += doNotCountObj[category.split("/")[0]][keyNow];
          }
          doNotCountList.push(total);
        }
        // Eintragen, dass kein nicht auswertbarer vorhanden ist, oder deine Rubrik auf der y-Achse bei dem Index vorhanden ist, wodurch dort auch nichts vorhanden sein kann
        else if ((category.length != 3 || !Object.keys(doNotCountObj).includes(category[0])) && category != "<e>/<E>") {
          doNotCountList.push(0);
        }
        // "sonstige" hinzufügen
        else if (category.length == 3) {
          doNotCountList.push(0);
          // if (minusList.doNotCount[category[0]] && minusList.doNotCount[category[0]] != 0) {
          // Abziehen wegen minusList (also Bucstaben aus Lauten (hier: mehrere Buchstaben) o.ä.)
            /*minusList.doNotCount[category[0]]*/if (minusList.doNotCount[category[0]]) doNotCountList[doNotCountList.length - 1] -= minusList.doNotCount[category[0]];
          // }
          // else {
          //
          for (wordNow of Object.keys(doNotCountObj[category[0]])) {
            doNotCountList[doNotCountList.length - 1] += doNotCountObj[category[0]][wordNow[i1]];
          }
        // }
        }
        // sonst damit die richtige Position auf der y-achse erhalten bleibt, 0 hinzufügen
        else doNotCountList.push(0);
      });
    // Hinzufügen der Laute, falls in Rubrik vorhanden
    if (Object.keys(doNotCountObj.laute).includes(category.split("/")[0])) {
      doNotCountList.push(doNotCountObj.laute[category.split("/")[0]]);
    }
    // Hinzufügen der Endung <e>
    else if (category == "<e>/<E>" && Object.keys(doNotCountObj).includes('<e>/<E>')) {
      doNotCountList.push(0);
      for (word of Object.keys(doNotCountObj[category])) {
        doNotCountList[doNotCountList.length - 1] += doNotCountObj[category][word];
      }
    }
    // Hinzufügen der nicht in Rubriken vorhandenen Buchstaben
    else if (Object.keys(doNotCountObj).includes(category.split("/")[0])) {
      var total = 0;
      for (keyNow of Object.keys(doNotCountObj[category.split("/")[0]])) {
        total += doNotCountObj[category.split("/")[0]][keyNow];
      }
      doNotCountList.push(total);
    }
    // Eintragen, dass kein nicht auswertbarer vorhanden ist, oder deine Rubrik auf der y-Achse bei dem Index vorhanden ist, wodurch dort auch nichts vorhanden sein kann
    else if ((category.length != 3 || !Object.keys(doNotCountObj).includes(category[0])) && category != "<e>/<E>") {
      doNotCountList.push(0);
    }
    // "sonstige" hinzufügen
    else if (category.length == 3) {
      doNotCountList.push(0);
      // if (minusList.doNotCount[category[0]] && minusList.doNotCount[category[0]] != 0) {
      // Abziehen wegen minusList (also Bucstaben aus Lauten (hier: mehrere Buchstaben) o.ä.)
        /*minusList.doNotCount[category[0]]*/if (minusList.doNotCount[category[0]]) doNotCountList[doNotCountList.length - 1] -= minusList.doNotCount[category[0]];
      // }
      // else {
      //
      for (wordNow of Object.keys(doNotCountObj[category[0]])) {
        doNotCountList[doNotCountList.length - 1] += doNotCountObj[category[0]][wordNow[i1]];
      }
    // }
    }
    // sonst damit die richtige Position auf der y-achse erhalten bleibt, 0 hinzufügen
  else doNotCountList.push(0);
    for (var i = 0; i < categoryList.length; i++) {
      mirrorList.push(0);
    }
    // gespiegelte Buchstaben hinzufügen
    // TODO: <e> gespiegelt
    for (var i2 = 0; inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror && i2 < Object.keys(inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror).length; i2++) {
      var currentWord = Object.keys(inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror)[i2];
      for (var i4 = 0; i4 < inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror[currentWord].length; i4++) {
        // indexList
        if (inputs[/*'Test ' + */selectedTest][selectedElementId.parent].mirror[currentWord][i4]) {
          for (var i = 0; i < categoryList.length; i++) {
            letter = findChild("class", findChild("word", selectedElementId.parent, currentWord), "correctionLetter" + i4, true).innerText.toLowerCase();
            if ((categoryList[i][0] == letter && (categoryList[i].includes('/') || categoryList[i].length == 1)) || (countTogether.checked && neededTest.kategorien[categoryList[i].replace("zusammen ", "")]?.includes(letter))) {
              mirrorList[i]++;
              i = categoryList.length;
            }
          }
          if (i != categoryList.length + 1) {
            categoryList.push(letter);
            mirrorList[i]++;
          }
        }
      }
      }
    if (chartInPercent.checked && (!chartInPercentIfCountTogether.checked || (countTogether.checked && neededTest.countTogether != undefined))) {
      for (let i = 0; i < wrongList.length; i++) {
        var sum = wrongList[i] + rightList[i] + doNotCountList[i];
        wrongList[i] = (wrongList[i]/sum*100).toFixed(2).replace('NaN', '0');
        rightList[i] = (rightList[i]/sum*100).toFixed(2).replace('NaN', '0');
        doNotCountList[i] = (doNotCountList[i]/sum*100).toFixed(2).replace('NaN', '0');
        mirrorList[i] = (mirrorList[i]/sum*100).toFixed(2).replace('NaN', '0');
      }
    }
    // delete categories without entries
    for (var i = 0; i < categoryList.length; i++) {
      if (wrongList[i] == 0 && rightList[i] == 0 && doNotCountList[i] == 0 && mirrorList[i] == 0 && (Object.keys(neededTest.kategorien).concat("sonstige").includes(categoryList[i + 1]) || categoryList[i + 1].includes('Silben'))) {
        wrongList.splice(i, 1);
        rightList.splice(i, 1);
        doNotCountList.splice(i, 1);
        mirrorList.splice(i, 1);
        categoryList.splice(i, 1);
        i--;
      }
    };
    addChart(categoryList, {wrong: wrongList, right: rightList, doNotCount: doNotCountList, mirror: mirrorList});
  if (manualOverwrite) document.getElementById(id).style.backgroundColor = "gray";
}
// fügt einen neuen Graphem inzu bzw. aktuallisiert ihn
// @param texte: Beschriftung des Graphen auf der y-Achse (Balkendiagramm)
// @param data: Inhalte bzw. Daten für die Balken
function addChart(texte, data) {
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
  // srcElement is deprecaed
  selectedElementId.parent = evt.currentTarget.id.replace('textur', '');
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
    neededTest.words.forEach((word, i) => {
        findChild('id', pupilSheet, 'correction ' + (i + 1)).style.outlineStyle = "";
        findChild('id', pupilSheet, 'correction ' + (i + 1)).style.width = "";
        // Überprüfung, ob das Ausgewählte in dem Wort, das gerade überprüft wird, vorhanden ist
        if ((category != "Doppelkonsonanten" || (replaceAll(word, '-', '').includes(label + label) && ((Object.keys(neededTest.betonung[i])[0] && replaceAll(word, '-', '')[JSON.parse(Object.keys(neededTest.betonung[i])[0]) + 1] == label) || (Object.keys(neededTest.betonung[i])[1] && replaceAll(word, '-', '')[JSON.parse(Object.keys(neededTest.betonung[i])[1]) + 1] == label)))) && (label.replace('>', '').replace('<', '').length == 1 && (word.toLowerCase().includes(label.replace('>', '').replace('<', '').toLowerCase())) || (label.includes('Silben') && word.toString().split('-').length == label.replace(' Silben', ''))) && findChild('id', pupilSheet, 'pupilsWriting ' + (i + 1)).value != "") {
          var result = undefined;
          if (label == 'e' && word[word.length - 1] == "e") {
            result = word.split('');
            result.pop();
          }
          // Das angewälte, falls kein Laut (mit mehreren Buchstaben) markieren
          if (label.includes('Silben') || ((label != '<e>' && (!result || (result.join('').includes('e')))) || (label == '<e>' && word[word.length - 1] == "e"))) {
          var wordWithoutCategories = word.toLowerCase();
          for (var i1 = 0; i1 < possibleLetterList.length; i1++) {
            wordWithoutCategories = replaceAll(wordWithoutCategories, possibleLetterList[i1], '');
          }
          if ((wordWithoutCategories.includes(label) || possibleLetterList.length == 0)) {
          findChild('id', pupilSheet, 'correction ' + (i + 1)).style.outlineColor = selectedColours.wrong.dark.text;
          if ((label.includes('Silben') && findChild('id', pupilSheet, 'pupilsWriting ' + (i + 1)).value.toLowerCase() == replaceAll(word, '-', '').toLowerCase()) || (!label.includes('Silben') && ((label == "<e>" && getLastLetterStyle(i, pupilSheet).color != selectedColours.wrong.dark.text && getLastLetterStyle(i, pupilSheet).letter.toLowerCase() == "e") || (label != "<e>" && findLetter(replaceAll(word, '-', ''), label).got == findLetter(replaceAll(word, '-', ''), label).possible)))) findChild('id', pupilSheet, 'correction ' + (i + 1)).style.outlineColor = selectedColours.right.text;//"green";
          if (auswertung.doNotCount[selectedElementId.parent].includes(replaceAll(word, '-', ''))) findChild('id', pupilSheet, 'correction ' + (i + 1)).style.outlineColor = "gray";
          findChild('id', pupilSheet, 'correction ' + (i + 1)).style.outlineStyle = "outset";
          // TODO: not needed because it is already checked if Schreibung Schüler is ""?
          if (!document.getElementsByClassName('graphemtrefferPossible' + pupilSheet)[i]) {
              // go through words
              for (var i2 = 0; i2 < officialData[selectedTest][inputs[selectedTest][pupilSheet].testName].words.length; i2++) {
                  markErrors('pupilsWriting ' + (i2 + 1), pupilSheet/*'pupilSheet' + i1*/);
              }
            // }
          }
          findChild('id', pupilSheet, 'correction ' + (i + 1)).style.width = document.getElementsByClassName('graphemtrefferPossible' + pupilSheet)[i].getBoundingClientRect().right + 3;
          // if (findChild('id', pupilSheet, 'pupilsWriting ' + (i + 1)).value.toLowerCase() == replaceAll(word, '-', '').toLowerCase()) findChild('id', pupilSheet, 'correction ' + (i + 1)).style.width = 7*replaceAll(word, '-', '').length;
        }
        }
      }
      // Ausgewählte Kriterium ist in einer Kategorie vorhanden: Markierung des Wortes
      if (label.replace('>', '').replace('<', '').length > 1 && !(label.includes("Silben"))) {
        var wordNow = replaceAll(word, '-', '');
        findChild('word', pupilSheet, wordNow).style.outlineStyle = "";
        for (category of Object.keys(auswertung.categories[selectedElementId.parent][wordNow])) {
          for (letter of Object.keys(auswertung.categories[selectedElementId.parent][wordNow][category])) {
            if (auswertung.categories[selectedElementId.parent][wordNow][category][letter].possible && letter == label) {
              findChild('word', pupilSheet, wordNow).style.outlineColor = selectedColours.wrong.dark.text;
              if (auswertung.categories[selectedElementId.parent][wordNow][category][letter].possible == auswertung.categories[selectedElementId.parent][wordNow][category][letter].got) findChild('word', pupilSheet, wordNow).style.outlineColor = selectedColours.right.text;//"green";
              if (auswertung.doNotCount[selectedElementId.parent].includes(wordNow)) findChild('word', pupilSheet, wordNow).style.outlineColor = "gray";
              findChild('word', pupilSheet, wordNow).style.outlineStyle = "outset";
              findChild('word', pupilSheet, wordNow).style.width = document.getElementsByClassName('graphemtrefferPossible' + pupilSheet)[i].getBoundingClientRect().right + 3;
              // if (findChild('id', pupilSheet, 'pupilsWriting ' + (i + 1)).value == wordNow) findChild('word', pupilSheet, wordNow).style.width = 7*replaceAll(word, '-', '').length;
            }
          }
        }
      }
    });
  }
};
var mostLeft = 257;
for (var i = 0; i < document.getElementsByClassName('writing' + selectedElementId.parent).length; i++) {
  if (document.getElementsByClassName('writing' + selectedElementId.parent)[i].getBoundingClientRect().right > mostLeft) mostLeft = document.getElementsByClassName('writing' + selectedElementId.parent)[i].getBoundingClientRect().right;
}
// Anpassung der Größe des Feldes für Anmerkungen
findChild('id', selectedElementId.parent, 'comment').style.width = window.innerWidth - mostLeft - 65- (window.innerWidth - document.getElementById(selectedElementId.parent).getBoundingClientRect().right);
if (!printerMode.checked) {
  findChild('id', selectedElementId.parent, 'comment').style.height = 10;
}
makeTextboxBigger();
// Anpassung der Größe der Grafik
chartNow.canvas.parentNode.style.right = 27//-20;
chartNow.canvas.parentNode.style.width = window.innerWidth - mostLeft - 10 - (window.innerWidth - document.getElementById(selectedElementId.parent).getBoundingClientRect().right);
chartNow.canvas.parentNode.style.height = 1;
chartNow.canvas.parentNode.style.top = 79// 74;
for (var graphBottom = document.getElementById('divGraph' + selectedElementId.parent.replace('pupilSheet', '')).getBoundingClientRect().bottom; document.getElementById(selectedElementId.parent).getBoundingClientRect().bottom > graphBottom; graphBottom++) {
  chartNow.canvas.parentNode.style.height = JSON.parse(chartNow.canvas.parentNode.style.height.replace('px', '')) + 1 + 'px';
}
if (chartNow.canvas.parentNode.style.height.replace("px", "") > 50*texte.length) chartNow.canvas.parentNode.style.height = 50*texte.length + "px";
}
