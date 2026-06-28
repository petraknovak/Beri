window.BERI_registerStoryCategory({
  id: "fluency",
  label: "Flüssiger lesen",
  description: "Short humorous stories for connected reading and rereading.",
  levels: [
    {
      id: 5,
      label: "Kleine Witze",
      difficultyWeight: 5,
      focus: "light punchlines, comprehension, rereading",
      stories: [
        {
          id: "frosch-telefon-1",
          title: "Der Frosch am Te-le-fon",
          lines: [
            "Ein Frosch sitzt am Teich.",
            "Er hört ein Te-le-fon klin-geln.",
            "Der Frosch hüpft zum Te-le-fon.",
            "Er sagt: Quak?",
            "Am an-de-ren En-de ist O-ma.",
            "O-ma sagt: Falsch ver-bun-den, a-ber sehr höf-lich."
          ],
          question: {
            prompt: "Wer ruft an?",
            correct: "Oma.",
            wrong: [
              "Der Bäcker.",
              "Ein Pirat.",
              "Der Hund.",
              "Ein singender Käse."
            ]
          }
        },
        {
          id: "eule-brille-1",
          title: "Die Eu-le liest",
          lines: [
            "Die Eu-le sitzt im Baum.",
            "Sie liest ein Buch.",
            "Der Fuchs fragt: Kannst du im Dun-keln le-sen?",
            "Die Eu-le nickt.",
            "Dann setzt sie ei-ne Bril-le auf.",
            "Die Bril-le ist nur für klu-ge Bli-cke."
          ],
          question: {
            prompt: "Wofür ist die Brille?",
            correct: "Für kluge Blicke.",
            wrong: [
              "Für den Regen.",
              "Für das Schwimmen.",
              "Für das Kochen.",
              "Für geheime Superkräfte."
            ]
          }
        },
        {
          id: "kuchen-test-1",
          title: "Der Ku-chen-test",
          lines: [
            "Ma-ma backt ei-nen Ku-chen.",
            "Der Ku-chen riecht gut.",
            "Ben will nur ein klei-nes Stück pro-bie-ren.",
            "Dann pro-biert er noch ein klei-nes Stück.",
            "Dann ist der Tel-ler leer.",
            "Ben sagt: Der Ku-chen be-steht den Test."
          ],
          question: {
            prompt: "Was passiert mit dem Kuchen?",
            correct: "Ben isst ihn beim Probieren.",
            wrong: [
              "Der Hund isst ihn.",
              "Mama versteckt ihn.",
              "Der Kuchen fliegt weg.",
              "Er macht einen Purzelbaum."
            ]
          }
        },
        {
          id: "roboter-zimmer-1",
          title: "Der Zim-mer-Ro-bo-ter",
          lines: [
            "Mi-a wünscht sich ei-nen Ro-bo-ter.",
            "Der Ro-bo-ter soll ihr Zim-mer auf-räu-men.",
            "Pa-pa baut ei-nen Ro-bo-ter aus Kar-ton.",
            "Der Ro-bo-ter steht im Zim-mer.",
            "Mi-a war-tet.",
            "Pa-pa sagt: Die-ser Ro-bo-ter kann sehr gut war-ten."
          ],
          question: {
            prompt: "Was kann der Roboter gut?",
            correct: "Warten.",
            wrong: [
              "Fliegen.",
              "Aufräumen.",
              "Tanzen.",
              "Pudding kochen."
            ]
          }
        },
        {
          id: "sprechender-apfel-1",
          title: "Der spre-chen-de Ap-fel",
          lines: [
            "Ein Ap-fel liegt auf dem Tisch.",
            "Lu-ka sagt: Du siehst le-cker aus.",
            "Der Ap-fel sagt nichts.",
            "Lu-ka war-tet.",
            "Der Ap-fel sagt im-mer noch nichts.",
            "Lu-ka sagt: Sehr höf-lich, du un-ter-brichst nie."
          ],
          question: {
            prompt: "Was sagt der Apfel?",
            correct: "Nichts.",
            wrong: [
              "Hallo.",
              "Ich bin ein Apfel.",
              "Mehr Saft bitte.",
              "Er erzählt einen Witz."
            ]
          }
        }
      ]
    }
  ]
});
