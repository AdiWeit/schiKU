const markErrors = require('./autoCorrection');
// test('Schüler 1', () => {
//   expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Fa-den', 'Faden', 'Waden')).toBe('4/5')
//   expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Hu-pe', 'Hupe', 'Hobe')).toBe('2/4')
// })
test('Hupe --> Hobe', () => {  expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Hu-pe', 'Hobe')).toBe('2/4')})
test('Faden --> Waden', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Fa-den', 'Waden')).toBe('4/5')})
test('Hafen --> Hafel', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Ha-fen', 'Hafel')).toBe('4/5')})
test('Finale --> Finate', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Fi-na-le', 'Finate')).toBe('5/6')})
test('Pedalen --> Bedalen', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Pe-da-len', 'Bedalen')).toBe('6/7')})
test('Tapete --> Dabede', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Ta-pe-te', 'Dabede')).toBe('3/6')})
test('Kusine --> kosine', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Ku-si-ne', 'kosine')).toBe('5/6')})
test('Rakete --> Ragete', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Ra-ke-te', 'Ragete')).toBe('5/6')})


test('Lama --> Lamma', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'La-ma', 'Lamma')).toBe('3/4')})
test('Hupe --> Hope', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Hu-pe', 'Hope')).toBe('3/4')})
test('Domino --> Dumino', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Do-mi-no', 'Dumino')).toBe('5/6')})
test('Tapete --> Fabide', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Ta-pe-te', 'Fabide')).toBe('2/6')})

test('Haufen --> Hafen', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Hau-fen', 'Hafen')).toBe('4/5')})
test('Anteil --> Andaiel', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'An-teil', 'Andaiel')).toBe('2/5')})
// ab hier Wörter wo ein Buchstabe vertauscht raus
test('Einkauf --> Einkaufen', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Ein-kauf', 'Einkaufen')).toBe('3/5')})
test('Dusche --> Doshen', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Du-sche', 'Doshen')).toBe('1/4')})
test('Reifen --> Raiefen', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Rei-fen', 'Raiefen')).toBe('3/5')})
test('Auslauf --> Aslauf', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Aus-lauf', 'Aslauf')).toBe('4/5')})
test('Schein --> Schaien', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Schein', 'Schaien')).toBe('1/3')}) // fragen
test('Raupe --> Raube', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Rau-pe', 'Raube')).toBe('3/4')})

test('Dusche --> Doche', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Du-sche', 'Doche')).toBe('2/4')})
test('Schein --> sein', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Schein', 'sein')).toBe('2/3')})
test('Umtausch --> Umdaus', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Um-tausch', 'Umdaus')).toBe('3/5')})
test('Maschine --> Masinen', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Ma-schi-ne', 'Masinen')).toBe('4/6')})

test('Reiter --> Reita', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Rei-ter', 'Reita')).toBe('3/5')})
test('Eimer --> Eima', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Ei-mer', 'Eima')).toBe('2/4')})
test('Schönheit --> Soneit', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Schön-heit', 'Soneit')).toBe('3/6')})
test('Alter --> Aalta', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Al-ter', 'Aalta')).toBe('2/5')})
test('lederhose --> ledahose', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'le-der-ho-se', 'ledahose')).toBe('7/9')})
test('Melonenschale --> Mlunschle', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Me-lo-nen-scha-le', 'Mlunschle')).toBe('6/11')})
test('Kilometer --> Kelenta', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Ki-lo-me-ter', 'Kelenta')).toBe('3/9')})
test('Möwenfeder --> Medenfeda', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Mö-wen-fe-der', 'Medenfeda')).toBe('6/10')})

test('Reiter --> Raitaer', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Rei-ter', 'Raitaer')).toBe('3/5')})
test('Eimer --> Aima', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Ei-mer', 'Aima')).toBe('1/4')})
test('Ausweis --> Ausfais', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Aus-weis', 'Ausfais')).toBe('3/5')})
test('Döner --> Döna', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Dö-ner', 'Döna')).toBe('3/5')})
// ab hier nicht mehr a statt er
test('Schönheit --> Schönaid', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Schön-heit', 'Schönaid')).toBe('3/6')})
test('Melonenschale --> Meloneschale', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Me-lo-nen-scha-le', 'Meloneschale')).toBe('10/11')})
// ab hier nicht mehr nur einen ausgelassen
test('Modenschau --> Modeschaue', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Mo-den-schau', 'Modeschaue')).toBe('5/7')})
test('Möwenfeder --> Modeweda', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Mö-wen-fe-der', 'Modeweda')).toBe('5/10')})

test('Eule --> Eulle', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Eu-le', 'Eulle')).toBe('2/3')})
// ab hier nicht mehr einer zu viel vor Ende
test('Gemeinheit --> Geheimen', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Ge-mein-heit', 'Geheimen')).toBe('3/8')})
test('Ofenfeuer --> Ofenfäuer', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'O-fen-feu-er', 'Ofenfäuer')).toBe('7/8')})
test('Lebewesen --> Lebewese', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Le-be-we-sen', 'Lebewese')).toBe('8/9')})
// ab hier nicht mehr nur Buchstaben fehlen (auch am Ende)

test('Nudelsalat --> Nutelschalat', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Nu-del-sa-lat', 'Nutelschalat')).toBe('7/10')}) // fragen
test('Möwenfeder --> Möfenfeter', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Mö-wen-fe-der', 'Möfenfeter')).toBe('8/10')})

test('Hupe --> Hobe', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Hu-pe', 'Hobe')).toBe('2/4')})
test('Tapete --> Dabede', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Ta-pe-te', 'Dabede')).toBe('3/6')})

test('Raupe --> BauBe', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Raupe', 'BauBe')).toBe('3/4')})
test('Reiter --> Rater', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Rei-ter', 'Rater')).toBe('4/5')})
test('Döner --> Duma', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Dö-ner', 'Duma')).toBe('1/5')})
test('Möwenfeder --> Mädenfeler', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Mö-wen-fe-der', 'Mädenfeler')).toBe('7/10')})
test('Scheunentor --> Schäunnentor', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Scheu-nen-tor', 'Schäunnentor')).toBe('6/8')})

test('Anteil --> Antal', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'An-teil', 'Antal')).toBe('4/5')})
test('Faden --> Waten', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Fa-den', 'Waten')).toBe('3/5')})
test('Hafen --> Hwen', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Ha-fen', 'Hwen')).toBe('3/5')})
test('Pedalen --> BeTalen', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Pe-da-len', 'BeTalen')).toBe('5/7')})
test('Kusine --> KQsine', () => {expect(markErrors('pupilsWriting 3', 'pupilSheet1', null, null, 'Ku-si-ne', 'KQsine')).toBe('5/7')})
