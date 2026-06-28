window.BERI_registerStoryCategory({
  id: "everyday",
  label: "Everyday Stories",
  description: "Simple daily-life stories with gentle humor.",
  levels: [
    {
      id: 3,
      label: "Simple",
      difficultyWeight: 3,
      focus: "daily routines, common verbs, concrete situations",
      stories: [
        {
          id: "dog-banana-1",
          title: "The Dog and the Banana",
          lines: [
            "The dog is hungry.",
            "Tim gives him a banana.",
            "The dog looks at Tim.",
            "Tim says: It is good.",
            "The dog smells the banana.",
            "The dog wants sausage instead."
          ],
          question: {
            prompt: "What does the dog want instead?",
            correct: "Sausage.",
            wrong: [
              "Cheese.",
              "Bread.",
              "The banana.",
              "A golden shoe."
            ]
          }
        },
        {
          id: "wet-shoes-1",
          title: "Wet Shoes",
          lines: [
            "Lena runs through a puddle.",
            "Her shoes get very wet.",
            "She walks into the house.",
            "Mom looks at the floor.",
            "The floor is wet too.",
            "Mom gives Lena a towel."
          ],
          question: {
            prompt: "What does Mom give Lena?",
            correct: "A towel.",
            wrong: [
              "A fish.",
              "A cake.",
              "A trumpet.",
              "A red cloud."
            ]
          }
        },
        {
          id: "lost-sock-1",
          title: "The Lost Sock",
          lines: [
            "Ben cannot find his sock.",
            "He looks under the bed.",
            "He looks in the basket.",
            "He looks in his shoe.",
            "The sock is on his head.",
            "Ben laughs very hard."
          ],
          question: {
            prompt: "Where is the sock?",
            correct: "On his head.",
            wrong: [
              "Under the bed.",
              "In the basket.",
              "In the shoe.",
              "On the moon."
            ]
          }
        }
      ]
    },
    {
      id: 4,
      label: "Longer Everyday Stories",
      difficultyWeight: 4,
      focus: "connected events, predictable structure, fluency",
      stories: [
        {
          id: "late-bus-1",
          title: "The Late Bus",
          lines: [
            "Mia waits for the bus.",
            "The bus does not come.",
            "Mia checks the time.",
            "A man says: The bus is late.",
            "Mia sits on the bench.",
            "Then the bus finally comes."
          ],
          question: {
            prompt: "Why does Mia wait?",
            correct: "The bus is late.",
            wrong: [
              "The bus can fly.",
              "She lost her shoes.",
              "The bench is singing.",
              "A penguin drives the bus."
            ]
          }
        },
        {
          id: "pizza-phone-1",
          title: "The Pizza Call",
          lines: [
            "Dad orders a pizza by phone.",
            "He wants cheese and tomatoes.",
            "The pizza arrives very fast.",
            "Dad opens the box.",
            "Inside is only pineapple pizza.",
            "Dad looks very confused."
          ],
          question: {
            prompt: "What pizza arrives?",
            correct: "Pineapple pizza.",
            wrong: [
              "Cheese pizza.",
              "Fish pizza.",
              "Chocolate pizza.",
              "Invisible pizza."
            ]
          }
        },
        {
          id: "cold-milk-1",
          title: "Cold Milk",
          lines: [
            "Nora pours milk into a glass.",
            "She takes one big sip.",
            "The milk is very cold.",
            "Nora jumps a little.",
            "Her brother laughs loudly.",
            "Nora laughs too."
          ],
          question: {
            prompt: "Why does Nora jump?",
            correct: "The milk is very cold.",
            wrong: [
              "A lion roars.",
              "The glass breaks.",
              "The milk is hot.",
              "A dragon drinks the milk."
            ]
          }
        },
        {
          id: "homework-cat-1",
          title: "The Cat on Homework",
          lines: [
            "Ella writes her homework.",
            "Her cat jumps onto the table.",
            "The cat sits on the paper.",
            "Ella cannot see her math.",
            "The cat starts to sleep.",
            "Ella waits very patiently."
          ],
          question: {
            prompt: "Where does the cat sit?",
            correct: "On the paper.",
            wrong: [
              "Under the chair.",
              "In the sink.",
              "On the roof.",
              "Inside a sandwich."
            ]
          }
        },
        {
          id: "rain-jacket-1",
          title: "The Rain Jacket",
          lines: [
            "Tom sees dark clouds outside.",
            "Mom says: Take your jacket.",
            "Tom says: I do not need it.",
            "Five minutes later it rains hard.",
            "Tom runs back home quickly.",
            "Now Tom wants the jacket."
          ],
          question: {
            prompt: "What does Tom want at the end?",
            correct: "The jacket.",
            wrong: [
              "A bicycle.",
              "A banana.",
              "A robot.",
              "A flying potato."
            ]
          }
        }
      ]
    },
    {
      id: 5,
      label: "Extended Everyday Stories",
      difficultyWeight: 5,
      focus: "longer reading flow, memory, comprehension",
      stories: [
        {
          id: "supermarket-1",
          title: "At the Supermarket",
          lines: [
            "Mom and Leo go to the supermarket.",
            "Leo pushes the small cart.",
            "He puts apples into the cart.",
            "Then he puts cookies into the cart.",
            "Then he puts more cookies into the cart.",
            "Mom says: We still need vegetables."
          ],
          question: {
            prompt: "What does Mom say they still need?",
            correct: "Vegetables.",
            wrong: [
              "More cookies.",
              "A horse.",
              "A television.",
              "A silver banana."
            ]
          }
        },
        {
          id: "alarm-clock-1",
          title: "The Alarm Clock",
          lines: [
            "Max hears his alarm clock.",
            "He turns off the alarm.",
            "Then he falls asleep again.",
            "Mom opens the door later.",
            "Max jumps out of bed quickly.",
            "He puts on two different socks."
          ],
          question: {
            prompt: "What does Max put on?",
            correct: "Two different socks.",
            wrong: [
              "A pirate hat.",
              "Snow boots.",
              "A frog costume.",
              "Three jackets."
            ]
          }
        }
      ]
    }
  ]
});
