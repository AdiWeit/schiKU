// von mir eingebaute Tests und Kategorien
var officialCategories = {Vokale: ["a", "e", "i", "o", "u"], Konsonanten: ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y"], Zwielaut: ["ai", "ei", "eu", "äu", "ai", "ui"], Endungen: ["en", "<e>"] /*TODO*/};
var officialData = {
  // TODO: stattdessen SchiKU
  "Kreis Unna": {
    "Test 1": {
      words: ["La-ma", "Na-se", "Hu-pe", "Ro-se", "Fa-den", "Ho-se", "Ha-fen", "Sa-la-mi", "Fi-na-le", "Do-mi-no", "Ka-no-ne", "Pe-da-len", "Ta-pe-te", "Ku-si-ne", "Ra-ke-te"],
      kategorien: {
        Vokale: officialCategories.Vokale,
        Konsonanten: officialCategories.Konsonanten,
        Endungen: officialCategories.Endungen
      },
    },
    "Test 2": {
      words: ["Hau-fen", "An-teil", "O-fen", "Ein-kauf", "Du-sche", "Pi-rat", "Rei-fen", "Aus-lauf", "Schein", "Ka-min", "Rau-pe", "Um-tausch", "Ei-sen", "Ma-schi-ne", "En-de"],
      kategorien: {
        "Zwielaut/Diphthong": ["au", "ei"],
        sonstige: ["sch"],
        Vokale: officialCategories.Vokale,
        Konsonanten: officialCategories.Konsonanten,
        Endungen: officialCategories.Endungen
      },
      countTogether: ["Vokale", "Konsonanten", "Endungen"]
    },
    "Test 3": {
      kategorien: {
        "Zwielaut/Diphthong": ["au", "ei"],
        sonstige: ["sch"],
        Vokale: officialCategories.Vokale,
        Konsonanten: officialCategories.Konsonanten,
        Endungen: officialCategories.Endungen
      },
      countTogether: ["Vokale", "Konsonanten", "Endungen"],
      words: ["Wein", "Rei-ter", "Am-pel", "Na-del", "Ei-mer", "Aus-weis", "Dö-ner", "Schön-heit", "Al-ter", "Le-der-ho-se", "Me-lo-nen-scha-le", "Nu-del-sa-lat", "Mo-den-schau", "Ki-lo-me-ter", "Mö-wen-fe-der"]
    },
    "Test 4": {
      kategorien: {
        "Zwielaut/Diphthong": ["au", "ei"],
        sonstige: ["sch"],
        Vokale: officialCategories.Vokale,
        Konsonanten: officialCategories.Konsonanten,
        Endungen: officialCategories.Endungen
      },
      countTogether: ["Vokale", "Konsonanten", "Endungen"],
      words: ["Gei-ge", "Bau-er", "Eu-le", "Se-gel", "Bi-ber", "Beu-tel", "Ga-bel", "Ge-mü-se", "Scheu-nen-tor", "Ge-heim-tür", "Mö-bel-wa-gen", "Bü-gel-ei-sen", "Le-be-we-sen", "Ge-mein-heit", "O-fen-feu-er"]
    },
    "Test 5": {
      kategorien: {
        "Zwielaut/Diphthong": ["au", "ei"],
        sonstige: ["sch"],
        Vokale: officialCategories.Vokale,
        Konsonanten: officialCategories.Konsonanten,
        Endungen: officialCategories.Endungen
      },
      countTogether: ["Vokale", "Konsonanten", "Endungen"],
      words: ["Ba-de-wan-ne", "Re-gen-man-tel", "Per-len-ket-te", "Ha-sen-fel-le", "Wasch-be-cken", "Ra-ben-fe-der", "Me-lo-nen-ker-ne", "Waf-fel-ei-sen", "Las-so-wer-fer", "Mö-bel-pa-cker",
        "Scher-ben-hau-fen", "Le-be-we-sen", "Kel-ler-e-cke", "Ta-fel-lap-pen", "Lam-pen-schal-ter"
      ]
    },
    "Test 6": {
      kategorien: {
        "Zwielaut/Diphthong": ["au", "ei", "sch"],
        sonstige: ["sch"],
        Vokale: officialCategories.Vokale,
        Konsonanten: officialCategories.Konsonanten,
        Endungen: officialCategories.Endungen
      },
      countTogether: ["Vokale", "Konsonanten", "Endungen"],
      words: ["Hin-weis-schil-der", "Lie-fer-wa-gen", "Win-ter-wet-ter", "Schie-be-tür", "Ge-wit-ter-him-mel",
        "Wi-ckel-tisch", "Ge-heim-nis-se", "Tin-ten-kil-ler", "Lie-ge-wie-se", "Un-ter-kie-fer", "Rin-der-her-de", "Lie-bes-lie-der", "Re-gen-rin-ne", "Kin-der-wip-pe"
      ]
    },
    "Test 7": {
      kategorien: {
        "Zwielaut/Diphthong": ["au", "ei"],
        sonstige: ["sch"],
        Vokale: officialCategories.Vokale,
        Konsonanten: officialCategories.Konsonanten,
        Endungen: officialCategories.Endungen
      },
      countTogether: ["Vokale", "Konsonanten", "Endungen"],
      words: ["Son-der-an-ge-bo-te", "Hun-de-fut-ter", "Sol-da-ten-ru-fe", "Kar-tof-fel-sor-te", "Bu-ckel-wa-le", "But-ter-do-se", "Eis-schol-le", "Re-gen-ton-ne", "Schul-ter-wun-de", "Nu-del-sup-pe", "Win-ter-soc-ken", "Fisch-kut-ter"]
    },
    "Test 8": {
      kategorien: {
        "Zwielaut/Diphthong": ["au", "ei"],
        sonstige: ["sch"],
        Vokale: officialCategories.Vokale,
        Konsonanten: officialCategories.Konsonanten,
        Endungen: officialCategories.Endungen
      },
      countTogether: ["Vokale", "Konsonanten", "Endungen"],
      words: ["Sa-lat-schüs-sel", "Ra-ke-ten-böl-ler", "Kör-per-teil", "Re-gen-wür-mer", "Hun-de-hüt-te", "Ka-mel-hö-cker", "Dö-ner-bu-de", "Sup-pen-löf-fel", "Da-men-hü-te", "Fül-ler-tin-te", "Schü-ler-wün-sche", "Wör-ter-lis-te",
        "Rü-cken-num-mer", "Lö-wen-köp-fe"
      ]
    },
    // TODO: verhindert Auswertung Zwielaute?
    einGraphemtreffer: ["ei", "au", "eu", "ch", "sch"],
    // preComment: 'Die einzelnen Buchstaben der Laute, die nicht unter "sonstige" stehen, werden dort auch nicht mitgezählt. Wenn es keine Rubriken gibt, wird zudem "sonstige" nicht angezeigt.'
    preComment: 'Fehler bei der Groß- Kleinschreibung gehen bei Graphemtreffern nicht in die Wertung ein, jedoch bei der Ermittlung der Anzahl der richtigen Wörter.'
  }
};
var words = officialData;
var myCategories = officialCategories;
