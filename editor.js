// öffnet Editor
function editTest() {
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
tests.style.display = "none";
editor.style.display = "inline";
if (testTypeSelector.value != "newTestType" && testSelector.value != "newTest") {
for (var i = 0; i < neededTest.words.length; i++) {
  addTextbox(neededTest.words[i]/*, i*/, "Wort", "word");
}
for (var i = 0; words[testTypeSelector.value][testSelector.value].Kategorien && i < Object.keys(words[testTypeSelector.value][testSelector.value].Kategorien).length; i++) {
  addTextbox(rubrik, "Rubrik");
}
for (var i = 0; i < words[testTypeSelector.value].einGraphemtreffer.length; i++) {
  addTextbox(words[testTypeSelector.value].einGraphemtreffer[i], "Wortlaut", "wortlaut");
}
}
if (testTypeSelector.value != "newTestType") {
nameType.value = testTypeSelector.value;
if (testSelector.value != "newTest") {
  nameTest.value = testSelector.value;
}
}
if (testTypeSelector.value == "newTestType" || selectedTest == "newTest") addTextbox('', /*0*/"Wort", "word");
}
// schließt Editor
// @param save: Änderungen lokal auf dem Gerät speichern
function closeEditor(save) {

// if (!words[nameType.value][nameTest.value]) nameTest.value = nameTest.value;
if (save) {
if (!words[nameType.value]) words[nameType.value] = {};
words[nameType.value].einGraphemtreffer = [];
words[nameType.value][nameTest.value] = {words: [], Kategorien: {}};
for (var i = 0; i < document.getElementsByClassName("Wort").length; i++) {
  words[nameType.value][nameTest.value].words.push(document.getElementsByClassName("Wort")[i].value);
}
for (var i = 0; i < document.getElementsByClassName("Wortlaut").length; i++) {
  words[nameType.value].einGraphemtreffer.push(document.getElementsByClassName("Wortlaut")[i].value);
}
for (var i = 0; i < document.getElementsByClassName("Rubrik").length; i++) {
  words[nameType.value][nameTest.value].Kategorien[document.getElementsByClassName("Rubrik")[i].value] = {};
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
addElement({class: type, title: 'Silben mit Bindestrich abtrennen.'}, 'select', "rubrik");
if (words[testTypeSelector.value][testSelector.value].Kategorien) var categories = Object.keys(words[testTypeSelector.value][testSelector.value].Kategorien);
for (var i = 0; categories && i < categories.length; i++) {
  addElement({value: categories[i], innerText: categories[i]}, 'option', document.getElementsByClassName(type)[document.getElementsByClassName(type).length - 1], true);
}
if (!categories || !categories.includes(value)) addElement({value: value, innerText: value}, 'option', document.getElementsByClassName(type)[document.getElementsByClassName(type).length - 1], true);
document.getElementsByClassName(type)[document.getElementsByClassName(type).length - 1].value = value;
addElement({class: 'br' + type}, 'br', "rubrik");
}
}
// lösche Element in Editor
function removeType(type) {
document.getElementsByClassName(type)[document.getElementsByClassName(type).length - 1].remove();
document.getElementsByClassName('br' + type)[document.getElementsByClassName('br' + type).length - 1].remove();
}
// aktuallisiert den Test, der aktuell genutzt wird
function refreshWords() {
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
addElement({value: 'newTestType', innerText: '+ Test Typ'}, 'option', 'testTypeSelector');
addElement({value: 'newTest', innerText: '+ Test'}, 'option', 'testSelector');
recreatePupils();
}
