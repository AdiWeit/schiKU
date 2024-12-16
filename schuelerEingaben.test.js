const markErrors = require('./autoCorrection');
// test('Schüler 1', () => {
//   expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Fa-den', 'Faden', 'Waden')).toBe('4/5')
//   expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Hu-pe', 'Hupe', 'Hobe')).toBe('2/4')
// })
// var inputs = {
//   correct: ['Hu-pe', 'Fa-den', 'Ha-fen', 'Fi-na-le', 'Pe-da-len', 'Ta-pe-te', 'Ku-si-ne', 'Ra-ke-te', 'La-ma', 'Hu-pe', 'Do-mi-no', 'Pa-pe-te', 'Hau-fen', 'An-teil', 'Ein-kauf', 'Du-sche', 'Schein', ,'Um-tausch', 'Ma-schi-ne', 'Rei-ter', 'Ei-mer', 'Schön-heit', 'Al-ter', 'Le-der-ho-se', 'Me-lo-nen-scha-le', 'Ki-lo-me-ter', 'Mö-wen-fe-der', 'Rei-ter', 'Ei-mer', 'Aus-weis', 'Dö-ner', 'Schön-heit', 'Me-lo-nen-scha-le', 'Mo-den-schau', 'Mö-wen-fe-der', 'Eu-le', 'Gemeinheit', 'Ofenfeuer', 'Lebewesen', 'Nudelsalat', 'Möwenfeder', 'Hu-pe', 'Ta-pe-te', 'Rau-pe', 'Reiter', 'Döner', 'Möwenfeder', 'Scheunentor', 'Anteil', 'Faden', 'Hafen', 'Pedalen', 'Kusine'],
//   wrong: ['Hobe', 'Waden', 'Hafel', ''],
//   graphemtreffer: ['2/4']
// }

// Problem 1: 2 falsche Buchstaben hintereinander (die im Wort vorhandene Buchstaben ersetzen) + nur 1 richtiger Buchstabe am Ende
// alert über wahrscheinlich falsche Autokorrektur vorhanden
test('Hupe --> Hobe', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Hu-pe', 'Hobe', null, null, true)).toBe('2/4')})
test('Faden --> Waden', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Fa-den', 'Waden', null, null, true)).toBe('4/5')})
test('Hafen --> Hafel', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Ha-fen', 'Hafel', null, null, true)).toBe('4/5')})
test('Finale --> Finate', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Fi-na-le', 'Finate', null, null, true)).toBe('5/6')})
test('Pedalen --> Bedalen', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Pe-da-len', 'Bedalen', null, null, true)).toBe('6/7')})
test('Tapete --> Dabede', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Ta-pe-te', 'Dabede', null, null, true)).toBe('3/6')})
test('Kusine --> kosine', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Ku-si-ne', 'kosine', null, null, true)).toBe('5/6')})
test('Rakete --> Ragete', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Ra-ke-te', 'Ragete', null, null, true)).toBe('5/6')})


test('Lama --> Lamma', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'La-ma', 'Lamma', null, null, true)).toBe('3/4')})
test('Hupe --> Hope', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Hu-pe', 'Hope', null, null, true)).toBe('3/4')})
test('Domino --> Dumino', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Do-mi-no', 'Dumino', null, null, true)).toBe('5/6')})
// Problem 1: 2 falsche Buchstaben hintereinander (die im Wort vorhandene Buchstaben ersetzen) + nur 1 richtiger Buchstabe am Ende
// alert über wahrscheinlich falsche Autokorrektur vorhanden
test('Tapete --> Fabide', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Ta-pe-te', 'Fabide', null, null, true)).toBe('2/6')})

test('Haufen --> Hafen', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Hau-fen', 'Hafen', null, null, true)).toBe('4/5')})
// Problem 1: 2 falsche Buchstaben hintereinander (die im Wort vorhandene Buchstaben ersetzen) + nur 1 richtiger Buchstabe am Ende
// alert über wahrscheinlich falsche Autokorrektur vorhanden
test('Anteil --> Andaiel', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'An-teil', 'Andaiel', null, null, true)).toBe('3/5')})
// ab hier Wörter wo ein Buchstabe vertauscht raus
test('Einkauf --> Einkaufen', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Ein-kauf', 'Einkaufen', null, null, true)).toBe('3/5')})
test('Dusche --> Doshen', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Du-sche', 'Doshen', null, null, true)).toBe('1/4')})
test('Reifen --> Raiefen', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Rei-fen', 'Raiefen', null, null, true)).toBe('3/5')})
test('Auslauf --> Aslauf', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Aus-lauf', 'Aslauf', null, null, true)).toBe('4/5')})
test('Schein --> Schaien', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Schein', 'Schaien', null, null, true)).toBe('1/3')}) // fragen
test('Raupe --> Raube', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Rau-pe', 'Raube', null, null, true)).toBe('3/4')})

test('Dusche --> Doche', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Du-sche', 'Doche', null, null, true)).toBe('2/4')})
test('Schein --> sein', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Schein', 'sein', null, null, true)).toBe('2/3')})
test('Umtausch --> Umdaus', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Um-tausch', 'Umdaus', null, null, true)).toBe('3/5')})
test('Maschine --> Masinen', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Ma-schi-ne', 'Masinen', null, null, true)).toBe('4/6')})

test('Reiter --> Reita', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Rei-ter', 'Reita', null, null, true)).toBe('3/5')})
test('Eimer --> Eima', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Ei-mer', 'Eima', null, null, true)).toBe('2/4')})
test('Schönheit --> Soneit', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Schön-heit', 'Soneit', null, null, true)).toBe('3/6')})
test('Alter --> Aalta', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Al-ter', 'Aalta', null, null, true)).toBe('2/5')})
test('lederhose --> ledahose', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'le-der-ho-se', 'ledahose', null, null, true)).toBe('7/9')})
test('Melonenschale --> Mlunschle', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Me-lo-nen-scha-le', 'Mlunschle', null, null, true)).toBe('6/11')})
test('Kilometer --> Kelenta', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Ki-lo-me-ter', 'Kelenta', null, null, true)).toBe('3/9')})
// Problem 3: falscher Buchstabe wird für richtigen Buchstaben später im Wort gehalten
// alert über wahrscheinlich falsche Autokorrektur vorhanden
test('Möwenfeder --> Medenfeda', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Mö-wen-fe-der', 'Medenfeda', null, null, true)).toBe('6/10')})

test('Reiter --> Raitaer', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Rei-ter', 'Raitaer', null, null, true)).toBe('3/5')})
test('Eimer --> Aima', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Ei-mer', 'Aima', null, null, true)).toBe('1/4')})
// Problem 4: mehrere falsche buchstaben hintereinander
// alert über wahrscheinlich falsche Autokorrektur vorhanden
test('Ausweis --> Ausfais', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Aus-weis', 'Ausfais', null, null, true)).toBe('3/5')})
test('Döner --> Döna', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Dö-ner', 'Döna', null, null, true)).toBe('3/5')})
// ab hier nicht mehr a statt er
test('Schönheit --> Schönaid', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Schön-heit', 'Schönaid', null, null, true)).toBe('3/6')})
test('Melonenschale --> Meloneschale', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Me-lo-nen-scha-le', 'Meloneschale', null, null, true)).toBe('10/11')})
// ab hier nicht mehr nur einen ausgelassen
test('Modenschau --> Modeschaue', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Mo-den-schau', 'Modeschaue', null, null, true)).toBe('5/7')})
// Problem 3: falscher Buchstabe wird für richtigen Buchstaben später im Wort gehalten
// alert über wahrscheinlich falsche Autokorrektur vorhanden
test('Möwenfeder --> Modeweda', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Mö-wen-fe-der', 'Modeweda', null, null, true)).toBe('5/10')})

test('Eule --> Eulle', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Eu-le', 'Eulle', null, null, true)).toBe('2/3')})
// ab hier nicht mehr einer zu viel vor Ende
test('Gemeinheit --> Geheimen', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Ge-mein-heit', 'Geheimen', null, null, true)).toBe('3/8')})
test('Ofenfeuer --> Ofenfäuer', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'O-fen-feu-er', 'Ofenfäuer', null, null, true)).toBe('7/8')})
test('Lebewesen --> Lebewese', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Le-be-we-sen', 'Lebewese', null, null, true)).toBe('8/9')})
// ab hier nicht mehr nur Buchstaben fehlen (auch am Ende)

// Problem 4: mehrere falsche buchstaben hintereinander (a als überflüssig angesehen und nachher als fehlend)
// alert über wahrscheinlich falsche Autokorrektur vorhanden
test('Nudelsalat --> Nutelschalat', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Nu-del-sa-lat', 'Nutelschalat', null, null, true)).toBe('7/10')}) // fragen
test('Möwenfeder --> Möfenfeter', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Mö-wen-fe-der', 'Möfenfeter', null, null, true)).toBe('8/10')})

test('Tapete --> Dabede', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Ta-pe-te', 'Dabede', null, null, true)).toBe('3/6')})

test('Raupe --> RauBe', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Raupe', 'RauBe', null, null, true)).toBe('3/4')})
test('Reiter --> Rater', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Rei-ter', 'Rater', null, null, true)).toBe('4/5')})
test('Döner --> Duma', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Dö-ner', 'Duma', null, null, true)).toBe('1/5')})
// Problem 4: mehrere falsche buchstaben hintereinander
// alert über wahrscheinlich falsche Autokorrektur vorhanden
test('Möwenfeder --> Mädenfeler', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Mö-wen-fe-der', 'Mädenfeler', null, null, true)).toBe('7/10')})
test('Scheunentor --> Schäunnentor', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Scheu-nen-tor', 'Schäunnentor', null, null, true)).toBe('6/8')})

test('Anteil --> Antal', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'An-teil', 'Antal', null, null, true)).toBe('4/5')})
test('Faden --> Waten', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Fa-den', 'Waten', null, null, true)).toBe('3/5')})
test('Hafen --> Hwen', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Ha-fen', 'Hwen', null, null, true)).toBe('3/5')})
test('Pedalen --> BeTalen', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Pe-da-len', 'BeTalen', null, null, true)).toBe('5/7')})
test('Kusine --> KQsine', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Ku-si-ne', 'KQsine', null, null, true)).toBe('5/6')})
// problem 2: (TODO?): only one letter after "gap"
test('Einkauf --> Einkf', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, null, 'Ein-kauf', 'Einkf', null, null, true)).toBe('4/5')})