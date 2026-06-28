window.BERI_registerStoryCategory({
  id: "everyday",
  label: "Alltagsgeschichten",
  description: "Simple everyday scenes with slightly longer sentences.",
  levels: [
    {
      id: 3,
      label: "Einfach",
      difficultyWeight: 3,
      focus: "daily routines, common verbs, mild humor",
      stories: [
        {
          id: "schule-brot-1",
          title: "Das Pau-sen-brot",
          lines: [
            "Ben packt sein Pau-sen-brot ein.",
            "Er legt es in die Ta-sche.",
            "In der Pau-se sucht Ben das Brot.",
            "Die Ta-sche ist leer.",
            "Ben schaut nach Hau-se.",
            "Das Brot liegt noch auf dem Tisch."
          ],
          question: {
            prompt: "Wo liegt das Pausenbrot?",
            correct: "Auf dem Tisch.",
            wrong: [
              "In der Tasche.",
              "Im Garten.",
              "In der Schule.",
              "Im Urlaub auf dem Mond."
            ]
          }
        },
        {
          id: "regenmantel-1",
          title: "Der Re-gen-man-tel",
          lines: [
            "Es reg-net stark.",
            "Le-na zieht den Re-gen-man-tel an.",
            "Sie zieht auch die Stie-fel an.",
            "Dann geht Le-na hi-naus.",
            "Die Son-ne scheint.",
            "Le-na ist be-reit für den Re-gen von ges-tern."
          ],
          question: {
            prompt: "Was scheint am Ende?",
            correct: "Die Sonne.",
            wrong: [
              "Der Regen.",
              "Der Wind.",
              "Ein Drache.",
              "Ein Fisch mit Sonnenbrille."
            ]
          }
        },
        {
          id: "hund-banane-1",
          title: "Der Hund und die Ba-na-ne",
          lines: [
            "Der Hund hat Hun-ger.",
            "Tim gibt ihm ei-ne Ba-na-ne.",
            "Der Hund schaut Tim an.",
            "Tim sagt: Die ist gut.",
            "Der Hund riecht die Ba-na-ne.",
            "Der Hund will lie-ber Wurst."
          ],
          question: {
            prompt: "Was will der Hund lieber?",
            correct: "Wurst.",
            wrong: [
              "Käse.",
              "Brot.",
              "Die Banane.",
              "Einen goldenen Schuh."
            ]
          }
        },
        {
          id: "falscher-schuh-1",
          title: "Der fal-sche Schuh",
          lines: [
            "Ma-ra zieht die Schu-he an.",
            "Ein Schuh ist rot.",
            "Ein Schuh ist blau.",
            "Ma-ra läuft zur Tür.",
            "Pa-pa schaut auf die Schu-he.",
            "Ma-ra sagt: Heu-te bin ich bunt."
          ],
          question: {
            prompt: "Welche Farben haben die Schuhe?",
            correct: "Rot und blau.",
            wrong: [
              "Grün und gelb.",
              "Schwarz und weiß.",
              "Rot und grün.",
              "Unsichtbar und glitzernd."
            ]
          }
        },
        {
          id: "tisch-decken-1",
          title: "Der vol-le Tisch",
          lines: [
            "O-pa deckt den Tisch.",
            "Er stellt Tel-ler hin.",
            "Er stellt Tas-sen hin.",
            "Er stellt Löf-fel hin.",
            "O-ma fragt: Wo ist mein Platz?",
            "O-pa hat ü-ber-all Sup-pe hin-ge-stellt."
          ],
          question: {
            prompt: "Was steht ueberall?",
            correct: "Suppe.",
            wrong: [
              "Teller.",
              "Tassen.",
              "Kekse.",
              "Ein Piratenschiff."
            ]
          }
        }
      ]
    },
    {
      id: 4,
      label: "Etwas länger",
      difficultyWeight: 4,
      focus: "longer connected scenes, predictable structure",
      stories: [
        {
          id: "baumhaus-1",
          title: "Das Baum-haus",
          lines: [
            "Im Gar-ten steht ein Baum-haus.",
            "Mi-la und Ben klet-tern hi-nauf.",
            "O-ben liegt ein Kis-sen.",
            "O-ben liegt ein Buch.",
            "O-ben liegt auch ein Ap-fel.",
            "Ben sagt: Hier wohnt wohl ein sehr klu-ger Wurm."
          ],
          question: {
            prompt: "Was liegt oben im Baumhaus?",
            correct: "Ein Kissen, ein Buch und ein Apfel.",
            wrong: [
              "Nur ein Ball.",
              "Ein Hund und ein Schuh.",
              "Nur ein Kissen.",
              "Ein Wurm mit Brille."
            ]
          }
        },
        {
          id: "schneemann-1",
          title: "Der Schnee-mann",
          lines: [
            "Die Kin-der bau-en ei-nen Schnee-mann.",
            "Er be-kommt ei-ne Na-se aus Möh-re.",
            "Er be-kommt ei-nen Hut von O-pa.",
            "Er be-kommt ei-nen Schal von O-ma.",
            "Am A-bend schaut Pa-pa hi-naus.",
            "Der Schnee-mann sieht bes-ser an-ge-zo-gen aus als Pa-pa."
          ],
          question: {
            prompt: "Wer bekommt Opas Hut?",
            correct: "Der Schneemann.",
            wrong: [
              "Opa.",
              "Der Hund.",
              "Papa.",
              "Ein Pinguin."
            ]
          }
        },
        {
          id: "bibliothek-1",
          title: "In der Bü-che-rei",
          lines: [
            "Le-na geht in die Bü-che-rei.",
            "Sie sucht ein Buch ü-ber Dra-chen.",
            "Sie fin-det ein Buch ü-ber Hun-de.",
            "Sie fin-det ein Buch ü-ber Ku-chen.",
            "Dann fin-det sie ein Buch ü-ber Dra-chen.",
            "Der Dra-che auf dem Bild liest ein Buch ü-ber Le-na."
          ],
          question: {
            prompt: "Was sucht Lena?",
            correct: "Ein Buch über Drachen.",
            wrong: [
              "Ein Buch über Hunde.",
              "Ein Buch über Kuchen.",
              "Ein Buch über Fische.",
              "Ein Buch über fliegende Socken."
            ]
          }
        },
        {
          id: "zaubersocken-1",
          title: "Die Zau-ber-so-cken",
          lines: [
            "Nils zieht neu-e So-cken an.",
            "Ei-ne So-cke ist grün.",
            "Ei-ne So-cke ist gelb.",
            "Nils springt ein-mal.",
            "Nils springt zwei-mal.",
            "Die So-cken zau-bern kein Flie-gen, a-ber war-me Fü-ße."
          ],
          question: {
            prompt: "Was zaubern die Socken?",
            correct: "Warme Füße.",
            wrong: [
              "Flügel.",
              "Unsichtbare Zehen.",
              "Einen Tanz.",
              "Einen Urlaub am Meer."
            ]
          }
        },
        {
          id: "piratenschatz-1",
          title: "Der Pi-ra-ten-schatz",
          lines: [
            "Tom malt ei-ne Schatz-kar-te.",
            "Auf der Kar-te ist ein Baum.",
            "Un-ter dem Baum ist ein Kreuz.",
            "Tom gräbt im Gar-ten.",
            "Er fin-det ei-ne al-te Do-se.",
            "In der Do-se liegt ein Keks von ges-tern."
          ],
          question: {
            prompt: "Was findet Tom?",
            correct: "Eine alte Dose mit einem Keks.",
            wrong: [
              "Einen echten Schatz.",
              "Ein Buch.",
              "Eine Banane.",
              "Eine Dose voller Sterne."
            ]
          }
        }
      ]
    }
  ]
});
