window.BERI_registerStoryCategory({
  id: "mini",
  label: "Mini-Geschichten",
  description: "Very short stories with strong repetition and familiar words.",
  levels: [
    {
      id: 1,
      label: "Sehr leicht",
      difficultyWeight: 1,
      focus: "repetition, family words, simple locations",
      stories: [
        {
          id: "oma-brille-1",
          title: "O-mas Bril-le",
          lines: [
            "O-ma sucht ih-re Bril-le.",
            "Sie sucht im Bad.",
            "Sie sucht in der Kü-che.",
            "Sie sucht im Bett.",
            "O-pa lacht.",
            "Die Bril-le ist auf O-mas Kopf."
          ],
          question: {
            prompt: "Wo ist Omas Brille?",
            correct: "Auf Omas Kopf.",
            wrong: [
              "Im Bad.",
              "Im Bett.",
              "In der Küche.",
              "Die Brille ist im Urlaub."
            ]
          }
        },
        {
          id: "opa-hut-1",
          title: "O-pas Hut",
          lines: [
            "O-pa sucht sei-nen Hut.",
            "Er sucht im Flur.",
            "Er sucht im Bad.",
            "Er sucht im Gar-ten.",
            "O-ma lacht.",
            "Der Hut ist auf O-pas Kopf."
          ],
          question: {
            prompt: "Wo ist der Hut?",
            correct: "Auf Opas Kopf.",
            wrong: [
              "Im Flur.",
              "Im Garten.",
              "Im Bad.",
              "Der Hut fährt mit dem Bus."
            ]
          }
        },
        {
          id: "mama-tee-1",
          title: "Ma-mas Tee",
          lines: [
            "Ma-ma hat Tee.",
            "Der Tee ist heiß.",
            "Ma-ma pus-tet.",
            "Ma-ma pus-tet noch mal.",
            "Pa-pa schaut.",
            "Nun ist der Tee kalt."
          ],
          question: {
            prompt: "Wie ist der Tee am Ende?",
            correct: "Kalt.",
            wrong: [
              "Heiß.",
              "Süß.",
              "Leer.",
              "Der Tee macht gerade Ferien."
            ]
          }
        },
        {
          id: "lili-ball-1",
          title: "Li-lis Ball",
          lines: [
            "Li-li hat ei-nen Ball.",
            "Der Ball ist rot.",
            "Der Ball rollt los.",
            "Der Ball rollt zum So-fa.",
            "Li-li ruft: Halt!",
            "Der Ball hört nicht."
          ],
          question: {
            prompt: "Was macht der Ball?",
            correct: "Er rollt los.",
            wrong: [
              "Er schläft.",
              "Er springt hoch.",
              "Er liegt still.",
              "Er rollt bis nach Italien."
            ]
          }
        },
        {
          id: "hund-da-1",
          title: "Der Hund ist da",
          lines: [
            "Der Hund ist da.",
            "Der Hund sitzt.",
            "Der Hund schaut.",
            "Der Hund war-tet.",
            "Tim sagt: Sitz!",
            "Der Hund sitzt schon."
          ],
          question: {
            prompt: "Was sagt Tim?",
            correct: "Sitz.",
            wrong: [
              "Platz!",
              "Komm!",
              "Wuff!",
              "Heute gibt es Pizza!"
            ]
          }
        }
      ]
    },
    {
      id: 2,
      label: "Leicht",
      difficultyWeight: 2,
      focus: "short actions, repeated sentence frames",
      stories: [
        {
          id: "katze-sofa-1",
          title: "Die Kat-ze auf dem So-fa",
          lines: [
            "Die Kat-ze sitzt auf dem So-fa.",
            "Ma-ma sitzt auf dem So-fa.",
            "Pa-pa sitzt auf dem So-fa.",
            "O-ma will auch sit-zen.",
            "Die Kat-ze macht sich breit.",
            "O-ma sitzt auf dem Stuhl."
          ],
          question: {
            prompt: "Wo sitzt Oma am Ende?",
            correct: "Auf dem Stuhl.",
            wrong: [
              "Auf dem Sofa.",
              "Im Garten.",
              "Auf dem Bett.",
              "Auf dem Kühlschrank."
            ]
          }
        },
        {
          id: "nina-eis-1",
          title: "Ni-nas Eis",
          lines: [
            "Ni-na hat ein Eis.",
            "Das Eis ist ro-sa.",
            "Ni-na leckt das Eis.",
            "Der Hund schaut das Eis an.",
            "Ni-na schaut den Hund an.",
            "Der Hund be-kommt nichts."
          ],
          question: {
            prompt: "Wer schaut das Eis an?",
            correct: "Der Hund.",
            wrong: [
              "Papa.",
              "Oma.",
              "Die Katze.",
              "Ein Pinguin mit Hunger."
            ]
          }
        },
        {
          id: "tom-bett-1",
          title: "Tom im Bett",
          lines: [
            "Tom liegt im Bett.",
            "Tom ist nicht mü-de.",
            "Tom zählt Scha-fe.",
            "Ein Schaf kommt.",
            "Noch ein Schaf kommt.",
            "Nun ist das Bett voll."
          ],
          question: {
            prompt: "Warum ist das Bett voll?",
            correct: "Weil die Schafe da sind.",
            wrong: [
              "Weil Tom viele Kissen hat.",
              "Weil der Hund dort schläft.",
              "Weil ein Kuchen dort liegt.",
              "Weil das Bett heute wächst."
            ]
          }
        },
        {
          id: "mila-tasche-1",
          title: "Mi-las Ta-sche",
          lines: [
            "Mi-la hat ei-ne Ta-sche.",
            "In der Ta-sche ist ein Buch.",
            "In der Ta-sche ist ein Ap-fel.",
            "In der Ta-sche ist ein Ball.",
            "Mi-la sucht den Stift.",
            "Der Stift ist hin-ter dem Ohr."
          ],
          question: {
            prompt: "Wo ist der Stift?",
            correct: "Hinter dem Ohr.",
            wrong: [
              "In der Tasche.",
              "Unter dem Tisch.",
              "Im Buch.",
              "Auf dem Mond."
            ]
          }
        },
        {
          id: "papa-kocht-1",
          title: "Pa-pa kocht",
          lines: [
            "Pa-pa kocht Sup-pe.",
            "Er rührt die Sup-pe.",
            "Er riecht die Sup-pe.",
            "Er pro-biert die Sup-pe.",
            "Pa-pa sagt: Hm.",
            "Der Hund sagt: Wuff."
          ],
          question: {
            prompt: "Was kocht Papa?",
            correct: "Suppe.",
            wrong: [
              "Kuchen.",
              "Nudeln.",
              "Kakao.",
              "Eine Regenwolke."
            ]
          }
        }
      ]
    }
  ]
});
