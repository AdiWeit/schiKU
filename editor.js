// öffnet Editor und erstellt falls test bearbeiten gedrückt wurde das bereits vorhandene der tests
function editTest() {
  if (syncDataCheckbox.checked && confirm("Wenn Sie die Seite neu laden, werden ihre Änderungen mit den offiziellen Daten überschrieben! Wollen Sie die Synchronisation mit offiziellen Daten deaktivieren um dies zu vermeiden?")) {
    syncDataCheckbox.checked = false;
    localStorage.setItem('syncWithOfficials', false);
  }
  toggleSettingsVis();
// löscht alle Elemente vom dem letzen Öffnen des Editors
while (document.getElementsByClassName("Wort").length > 0) {
  document.getElementsByClassName("Wort")[0].remove();
  document.getElementsByClassName("brWort")[0].remove();
}
while (document.getElementsByClassName("Rubrik").length > 0) {
  document.getElementsByClassName("Rubrik")[0].remove();
  document.getElementsByClassName("brRubrik")[0].remove();
}
while (document.getElementsByClassName("Wortlaut").length > 0) {
  document.getElementsByClassName("Wortlaut")[0].remove();
  document.getElementsByClassName("brWortlaut")[0].remove();
}
while (document.getElementsByClassName("ownCategory").length > 0) {
  document.getElementsByClassName("ownCategory")[0].remove();
}
while (document.getElementsByClassName("combineCategories").length > 0) {
  document.getElementsByClassName("combineCategories")[0].remove();
}
tests.style.display = "none";
editor.style.display = "inline";
// Bereits vorhandene Eingaben bzw. Einstellungen des Tests in Elemente, die erstellt werden einfügen
if (testTypeSelector.value != "newTestType" && testSelector.value != "newTest") {
for (var i = 0; i < neededTest.words.length; i++) {
  addTextbox(neededTest.words[i]/*, i*/, "Wort", "word");
}
for (var i = 0; words[testTypeSelector.value][testSelector.value].kategorien && i < Object.keys(words[testTypeSelector.value][testSelector.value].kategorien).length; i++) {
  addTextbox(Object.keys(words[testTypeSelector.value][testSelector.value].kategorien)[i], "Rubrik", "rubrik");
}
for (var i = 0; i < words[testTypeSelector.value].einGraphemtreffer.length; i++) {
  addTextbox(words[testTypeSelector.value].einGraphemtreffer[i], "Wortlaut", "wortlaut");
}
for (var i = 0; words[testTypeSelector.value][testSelector.value].countTogether && i < words[testTypeSelector.value][testSelector.value].countTogether.length; i++) {
  addTextbox(words[testTypeSelector.value][testSelector.value].countTogether[i], 'Rubrik', 'combineCategories');
}
}
preCommentInput.value = "";
if (testTypeSelector.value != "newTestType") {
nameType.value = testTypeSelector.value;
if (words[testTypeSelector.value].preComment) preCommentInput.value = words[testTypeSelector.value].preComment;
if (testSelector.value != "newTest") {
  nameTest.value = testSelector.value;
}
}
if (testTypeSelector.value == "newTestType" || selectedTest == "newTest") addTextbox('', /*0*/"Wort", "word");
}
// schließt Editor
// @param save: Änderungen lokal auf dem Gerät speichern?
function closeEditor(save) {

// if (!words[nameType.value][nameTest.value]) nameTest.value = nameTest.value;
if (save) {
  // Die Eingaben bzw. Einstellungen speichern
if (!words[nameType.value]) words[nameType.value] = {};
words[nameType.value].einGraphemtreffer = [];
words[nameType.value][nameTest.value] = {words: [], kategorien: {}, countTogether: []};
for (var i = 0; i < document.getElementsByClassName("Wort").length; i++) {
  words[nameType.value][nameTest.value].words.push(document.getElementsByClassName("Wort")[i].value);
}
for (var i = 0; i < document.getElementsByClassName("Wortlaut").length; i++) {
  words[nameType.value].einGraphemtreffer.push(document.getElementsByClassName("Wortlaut")[i].value);
}
for (var i = 0; i < document.getElementsByClassName("combineCategories").length; i++) {
  words[nameType.value][nameTest.value].countTogether.push(document.getElementsByClassName("combineCategories")[i].value);
}
for (var i = 0; i < document.getElementsByClassName("ownCategoryDiv").length; i++) {
  var newCategoryName = document.getElementsByClassName("ownCategoryDiv")[i].id.replace("ownCategory ", "");
  myCategories[newCategoryName] = [];
  for (elm of document.getElementsByClassName("laut " + newCategoryName)) {
    myCategories[newCategoryName].push(elm.value);
  }
}
for (var i = 0; i < document.getElementsByClassName("Rubrik").length; i++) {
  if (document.getElementsByClassName("Rubrik")[i].value != "sonstige") words[nameType.value][nameTest.value].kategorien[document.getElementsByClassName("Rubrik")[i].value] = myCategories[document.getElementsByClassName("Rubrik")[i].value];
}
}
editor.style.display = 'none';
tests.style.display = 'inline';
localStorage.setItem('words', JSON.stringify(words));
var selected = {element: testSelector.value, testType: testTypeSelector.value};
refreshWords();
testSelector.value = selected.element;
testTypeSelector.value = selected.testType;
}
/*
ein neues Element für den Editor hinzufügen
@param value: Text des Elements
       type: Art des Elements
       parent: wo das Element angehängt werden soll
*/
function addTextbox(value/*, i*/, type, parent) {
if (type != "Rubrik") {
addElement({class: type, value: value, title: 'Silben mit Bindestrich abtrennen.'}, 'input', parent);
addElement({class: 'br' + type}, 'br', parent);
}
else {
if (parent != "rubrik") type = "combineCategories";
addElement({class: type, onchange: 'categorySelectionChanged(value, this)'}, 'select', parent);
for (var i = 0; i < Object.keys(myCategories).length; i++) {
  if (myCategories[i] != "sonstige") addElement({value: Object.keys(myCategories)[i], innerText: Object.keys(myCategories)[i]}, 'option', document.getElementsByClassName(type)[document.getElementsByClassName(type).length - 1], true);
}
if (!Object.keys(myCategories) || !Object.keys(myCategories).includes(value)) addElement({value: value, innerText: value}, 'option', document.getElementsByClassName(type)[document.getElementsByClassName(type).length - 1], true);
if (parent == "rubrik") addElement({value: "neue erstellen", innerText: "neue erstellen"}, 'option', document.getElementsByClassName(type)[document.getElementsByClassName(type).length - 1], true);
document.getElementsByClassName(type)[document.getElementsByClassName(type).length - 1].value = value;
addElement({class: 'br' + type}, 'br', parent);
}
}
// Kategorieauswahl im Editor geändert
// @param: value: Text
//         elm: das Element, dessen Auswahl geändert wurde
function categorySelectionChanged(value, elm) {
  if (value == "neue erstellen") {
    // neue Rubrik hinzufügen
    var newCategoryName = prompt("Wie soll die neue Rubrik heißen?");
    if (newCategoryName != null) {
    addElement({value: newCategoryName, innerText: newCategoryName}, 'option', elm, true);
    elm.value = newCategoryName;
    addElement({class: "ownCategory"}, "br", "rubrik");
    addElement({id: "ownCategory " + newCategoryName, class: "ownCategoryDiv"}, 'div', "rubrik");
    addElement({placeholder: "laut", class: "laut " + newCategoryName}, 'input', "ownCategory " + newCategoryName);
    addElement({class: "ownCategory", innerText: "+ Wortlaut", onclick: 'addElement({class: "ownCategory"}, "br", "ownCategory ' + newCategoryName + '"); addElement({placeholder: "laut", class: "laut ' + newCategoryName + '"}, "input", "ownCategory ' + newCategoryName + '");'}, 'button', "rubrik");
    // addElement({class: "ownCategory", innerText: "bestätigen", onclick: 'newCategory("' + newCategoryName + '")'}, 'button', "rubrik");
    addElement({class: "ownCategory"}, "br", "rubrik");
    addElement({class: "ownCategory"}, "br", "rubrik");
  }
  else elm.value = "bitte auswählen";
  }
}
// function newCategory(name) {
//   myCategories[name] = [];
//   for (elm of document.getElementsByClassName("ownCategory " + name)) {
//     myCategories[name].push(elm.value);
//   }
// }
// lösche Element in Editor
function removeType(type) {
document.getElementsByClassName(type)[document.getElementsByClassName(type).length - 1].remove();
document.getElementsByClassName('br' + type)[document.getElementsByClassName('br' + type).length - 1].remove();
}
// aktuallisiert den Test (seine Einstellungen bzw. Eingaben), der aktuell genutzt wird und erstellt alle Elemente neu, damit die geänderten Einstellungen auf die bereits vorhandenen Eingaben angepasst werden
function refreshWords(doNotRecreatePupils, showEditNotChecked) {
while (document.getElementById('testTypeSelector').options.length > 0) {
  document.getElementById('testTypeSelector').options[0] = undefined;
}
while (document.getElementById('testSelector').options.length > 0) {
  document.getElementById('testSelector').options[0] = undefined;
}
for (nameTypeNow of Object.keys(words)) {
  addElement({value: nameTypeNow, innerText: nameTypeNow}, 'option', 'testTypeSelector');
  for (nameTestNow of Object.keys(words[nameTypeNow])) {
    if (nameTestNow != "einGraphemtreffer" && nameTestNow != "preComment") {
    addElement({value: nameTestNow, innerText: nameTestNow}, 'option', 'testSelector');
  }
}
}
if (!doNotRecreatePupils) {
  addElement({value: 'newTestType', innerText: '+ Testverfahren'}, 'option', 'testTypeSelector');
  addElement({value: 'newTest', innerText: '+ Test'}, 'option', 'testSelector');
}
}
