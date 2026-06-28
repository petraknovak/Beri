window.BERI_registerStoryCategory({
  id: "fluency",
  label: "Fluency Reading",
  description: "Short humorous stories for connected reading and rereading.",
  levels: [
    {
      id: 5,
      label: "Funny Stories",
      difficultyWeight: 5,
      focus: "light punchlines, rereading, expressive reading",
      stories: [
        {
          id: "frog-phone-1",
          title: "The Frog on the Phone",
          lines: [
            "A frog sits by the pond.",
            "He hears a phone ring.",
            "The frog hops to the phone.",
            "He says: Ribbit?",
            "On the other end is Grandma.",
            "Grandma says: Wrong number, but very polite."
          ],
          question: {
            prompt: "Who calls?",
            correct: "Grandma.",
            wrong: [
              "The baker.",
              "A pirate.",
              "The dog.",
              "A singing cheese."
            ]
          }
        },
        {
          id: "goat-bus-1",
          title: "The Goat on the Bus",
          lines: [
            "A goat waits at the bus stop.",
            "The bus comes around the corner.",
            "The goat steps onto the bus.",
            "The driver says: One ticket, please.",
            "The goat gives him a leaf.",
            "The driver says: That is not money, but it is fresh."
          ],
          question: {
            prompt: "What does the goat give the driver?",
            correct: "A leaf.",
            wrong: [
              "A coin.",
              "A red hat.",
              "A sandwich.",
              "A tiny piano."
            ]
          }
        },
        {
          id: "cat-pancake-1",
          title: "The Cat and the Pancake",
          lines: [
            "A cat sits in the kitchen.",
            "Mom flips a pancake in the pan.",
            "The pancake flies too high.",
            "It lands on the cat's head.",
            "The cat does not move.",
            "Mom says: Nice hat, cat."
          ],
          question: {
            prompt: "Where does the pancake land?",
            correct: "On the cat's head.",
            wrong: [
              "On the floor.",
              "In the sink.",
              "On Dad's shoe.",
              "Inside a trumpet."
            ]
          }
        },
        {
          id: "robot-library-1",
          title: "The Robot in the Library",
          lines: [
            "A robot goes to the library.",
            "The robot wants a book about dogs.",
            "It asks the librarian: Beep, book, dog?",
            "The librarian gives it a dog book.",
            "The robot reads one page.",
            "Then it barks in a very metal voice."
          ],
          question: {
            prompt: "What book does the robot want?",
            correct: "A book about dogs.",
            wrong: [
              "A book about soup.",
              "A book about clouds.",
              "A book about socks.",
              "A book about sleepy bananas."
            ]
          }
        },
        {
          id: "duck-hat-shop-1",
          title: "The Duck at the Hat Shop",
          lines: [
            "A duck walks into a hat shop.",
            "The duck tries on a blue hat.",
            "The hat falls over its eyes.",
            "The duck tries on a small hat.",
            "The small hat fits one feather.",
            "The duck says: I will take both."
          ],
          question: {
            prompt: "What does the duck buy?",
            correct: "Both hats.",
            wrong: [
              "One red shoe.",
              "A cake.",
              "A clock.",
              "A bucket of stars."
            ]
          }
        }
      ]
    },
    {
      id: 6,
      label: "Longer Fluency Stories",
      difficultyWeight: 6,
      focus: "multi-step humor, dialogue, sustained attention",
      stories: [
        {
          id: "pirate-lunch-1",
          title: "The Pirate Lunch",
          lines: [
            "A pirate opens his lunch box.",
            "Inside, he finds bread, cheese, and a map.",
            "He looks at the map carefully.",
            "The map shows a big red X.",
            "The pirate digs under his chair.",
            "He finds one cookie and says: Treasure!"
          ],
          question: {
            prompt: "What treasure does the pirate find?",
            correct: "One cookie.",
            wrong: [
              "Gold coins.",
              "A parrot.",
              "A ship.",
              "A dancing potato."
            ]
          }
        },
        {
          id: "moon-soup-1",
          title: "Moon Soup",
          lines: [
            "Lena looks at the moon.",
            "The moon looks round and white.",
            "Lena says: It looks like soup.",
            "Dad looks at the moon too.",
            "Dad says: Then it needs a spoon.",
            "Lena brings the biggest spoon in the house."
          ],
          question: {
            prompt: "What does Lena bring?",
            correct: "The biggest spoon.",
            wrong: [
              "A small cup.",
              "A red ball.",
              "A ladder.",
              "A sleepy frog."
            ]
          }
        },
        {
          id: "bear-bath-1",
          title: "The Bear Takes a Bath",
          lines: [
            "A bear finds a bathtub in the woods.",
            "The bear climbs into the tub.",
            "The water splashes over the sides.",
            "A squirrel watches from a tree.",
            "The bear sings a bath song.",
            "The squirrel says: Too loud, but very clean."
          ],
          question: {
            prompt: "Who watches the bear?",
            correct: "A squirrel.",
            wrong: [
              "A teacher.",
              "A fish.",
              "A dragon.",
              "A singing sandwich."
            ]
          }
        },
        {
          id: "dog-homework-1",
          title: "The Dog Did Homework",
          lines: [
            "Nora puts her homework on the table.",
            "The dog puts one paw on the page.",
            "Then the dog makes a big muddy print.",
            "Nora looks at the page.",
            "The teacher looks at the page too.",
            "The teacher says: This answer has paws."
          ],
          question: {
            prompt: "What does the dog make?",
            correct: "A muddy print.",
            wrong: [
              "A cake.",
              "A phone call.",
              "A blue hat.",
              "A map to Mars."
            ]
          }
        },
        {
          id: "penguin-shoes-1",
          title: "The Penguin Shoes",
          lines: [
            "A penguin finds a pair of red shoes.",
            "The penguin puts them on carefully.",
            "The shoes are much too big.",
            "The penguin slides across the ice.",
            "It slides past three seals.",
            "The seals clap and ask for tickets."
          ],
          question: {
            prompt: "What does the penguin find?",
            correct: "A pair of red shoes.",
            wrong: [
              "A yellow scarf.",
              "A fish sandwich.",
              "A school bag.",
              "A trumpet made of ice."
            ]
          }
        }
      ]
    }
  ]
});
