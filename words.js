// von mir eingebaute Tests und Kategorien
var officialCategories = {Vokale: ["a", "ä", "e", "i", "o", "ö", "u", "ü"], Konsonanten: ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y"], Zwielaute: ["ai", "ei", "eu", "äu", "ai", "ui", "au"], Endungen: ["en", "<e>"], sonstige: ["Sch", "ch"] /*TODO*/};
var officialData = {
  // TODO: stattdessen SchiKU
  "Kreis Unna": {
    "Test 1": {
      words: ["La-ma", "Na-se", "Hu-pe", "Ro-se", "Fa-den", "Ho-se", "Ha-fen", "Sa-la-mi", "Fi-na-le", "Do-mi-no", "Ka-no-ne", "Pe-da-len", "Ta-pe-te", "Ku-si-ne", "Ra-ke-te"],
      kategorien: {
        Vokale: officialCategories.Vokale,
        Konsonanten: officialCategories.Konsonanten,
        Endungen: officialCategories.Endungen,
        Zwielaute: officialCategories.Zwielaute
      },
    },
    "Test 2": {
      words: ["Hau-fen", "An-teil", "O-fen", "Ein-kauf", "Du-sche", "Pi-rat", "Rei-fen", "Aus-lauf", "Schein", "Ka-min", "Rau-pe", "Um-tausch", "Ei-sen", "Ma-schi-ne", "En-de"],
      kategorien: {
        sonstige: ["sch"],
        Vokale: officialCategories.Vokale,
        Konsonanten: officialCategories.Konsonanten,
        Endungen: officialCategories.Endungen,
        Zwielaute: officialCategories.Zwielaute
      },
      countTogether: ["Vokale", "Konsonanten"]
    },
    "Test 3": {
      kategorien: {
        sonstige: ["sch"],
        Vokale: officialCategories.Vokale,
        Konsonanten: officialCategories.Konsonanten,
        Endungen: ["<e>", "en", "er", "el"],
        Zwielaute: officialCategories.Zwielaute,
        "Wichtige": ["ö", "w"]
      },
      countTogether: ["Vokale", "Konsonanten"],
      words: ["Wein", "Rei-ter", "Am-pel", "Na-del", "Ei-mer", "Aus-weis", "Dö-ner", "Schön-heit", "Al-ter", "Le-der-ho-se", "Me-lo-nen-scha-le", "Nu-del-sa-lat", "Mo-den-schau", "Ki-lo-me-ter", "Mö-wen-fe-der"]
    },
    "Test 4": {
      kategorien: {
        sonstige: ["sch"],
        Vokale: officialCategories.Vokale,
        Konsonanten: officialCategories.Konsonanten,
        Endungen: officialCategories.Endungen,
        Zwielaute: officialCategories.Zwielaute,
        wichtige: ["ö", "ü", "g", "b"]
      },
      countTogether: ["Vokale", "Konsonanten"],
      words: ["Gei-ge", "Bau-er", "Eu-le", "Se-gel", "Bi-ber", "Beu-tel", "Ga-bel", "Ge-mü-se", "Scheu-nen-tor", "Ge-heim-tür", "Mö-bel-wa-gen", "Bü-gel-ei-sen", "Le-be-we-sen", "Ge-mein-heit", "O-fen-feu-er"]
    },
    "Test 5": {
      kategorien: {
        sonstige: ["sch", "ck"],
        Vokale: officialCategories.Vokale,
        Konsonanten: officialCategories.Konsonanten,
        Endungen: officialCategories.Endungen,
        Zwielaute: officialCategories.Zwielaute,
        Doppelkonsonanten: officialCategories.Konsonanten// ["dd", "ff", "hh", "kk", "ll", "mm", "nn", "pp", "rr", "ss", "tt", "ww"]
      },
      countTogether: ["Vokale", "Konsonanten"],
      words: ["Ba-de-wan-ne", "Re-gen-man-tel", "Per-len-ket-te", "Ha-sen-fel-le", "Wasch-be-cken", "Ra-ben-fe-der", "Me-lo-nen-ker-ne", "Waf-fel-ei-sen", "Las-so-wer-fer", "Mö-bel-pa-cker",
        "Scher-ben-hau-fen", "Le-be-we-sen", "Kel-ler-e-cke", "Ta-fel-lap-pen", "Lam-pen-schal-ter"],
      betonung: [{1: "lang", 5: "kurz"}, {1: "lang"}, {1: "lang", 7: "kurz"}, {6: "kurz"}, {1: "lang", 6: "kurz"}, {}, {}, {1: "kurz"}, {1: "kurz"}, {6: "kurz"}, {}, {}, {1: "kurz", 6: "kurz"}, {6: "kurz"}, {}]
    },
    "Test 6": {
      kategorien: {
        sonstige: ["sch", "ck", "ie"],
        Vokale: officialCategories.Vokale,
        Konsonanten: officialCategories.Konsonanten,
        Endungen: officialCategories.Endungen,
        Zwielaute: officialCategories.Zwielaute,
        Doppelkonsonanten: officialCategories.Konsonanten// ["d
      },
      countTogether: ["Vokale", "Konsonanten"],
      words: ["Hin-weis-schil-der", "Lie-fer-wa-gen", "Win-ter-wet-ter", "Schie-be-tür", "Ge-wit-ter-him-mel",
        "Wi-ckel-tisch", "Ge-heim-nis-se", "Tin-ten-kil-ler", "Lie-ge-wie-se", "Un-ter-kie-fer", "Rin-der-her-de", "Lie-bes-lie-der", "Re-gen-rin-ne", "Kin-der-wip-pe"],
      betonung: [{}, {}, {7: "kurz"}, {}, {3: "kurz", 9: "kurz"}, {1: "kurz"}, {7: "kurz"}, {7: "kurz"}, {}, {}, {}, {}, {6: "kurz"}, {7: "kurz"}]
    },
    "Test 7": {
      kategorien: {
        sonstige: ["sch"],
        Vokale: officialCategories.Vokale,
        Konsonanten: officialCategories.Konsonanten,
        Endungen: officialCategories.Endungen,
        Zwielaute: officialCategories.Zwielaute
      },
      countTogether: ["Vokale", "Konsonanten"],
      words: ["Son-der-an-ge-bo-te", "Hun-de-fut-ter", "Sol-da-ten-ru-fe", "Kar-tof-fel-sor-te", "Bu-ckel-wa-le", "But-ter-do-se", "Eis-schol-le", "Re-gen-ton-ne", "Schul-ter-wun-de", "Nu-del-sup-pe", "Win-ter-soc-ken", "Fisch-kut-ter"]
    },
    "Test 8": {
      kategorien: {
        sonstige: ["sch"],
        Vokale: officialCategories.Vokale,
        Konsonanten: officialCategories.Konsonanten,
        Endungen: officialCategories.Endungen,
        Zwielaute: officialCategories.Zwielaute
      },
      countTogether: ["Vokale", "Konsonanten"],
      words: ["Sa-lat-schüs-sel", "Ra-ke-ten-böl-ler", "Kör-per-teil", "Re-gen-wür-mer", "Hun-de-hüt-te", "Ka-mel-hö-cker", "Dö-ner-bu-de", "Sup-pen-löf-fel", "Da-men-hü-te", "Fül-ler-tin-te", "Schü-ler-wün-sche", "Wör-ter-lis-te",
        "Rü-cken-num-mer", "Lö-wen-köp-fe"
      ]
    },
    einGraphemtreffer: ["ei", "au", "eu", "ch", "sch"],
    // preComment: 'Die einzelnen Buchstaben der Laute, die nicht unter "sonstige" stehen, werden dort auch nicht mitgezählt. Wenn es keine Rubriken gibt, wird zudem "sonstige" nicht angezeigt.'
    preComment: 'Fehler bei der Groß- Kleinschreibung gehen bei Graphemtreffern nicht in die Wertung ein, jedoch bei der Ermittlung der Anzahl der richtigen Wörter.'
  }
};
var words = officialData;
var myCategories = officialCategories;
