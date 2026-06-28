window.BERI_registerStoryCategory({
  id: "mini",
  label: "Mini Stories",
  description: "Very short stories with repetition and familiar vocabulary.",
  levels: [
    {
      id: 1,
      label: "Very Easy",
      difficultyWeight: 1,
      focus: "repetition, simple actions, predictable structure",
      stories: [
        {
          id: "dog-here-1",
          title: "The Dog Is Here",
          lines: [
            "The dog is here.",
            "The dog sits.",
            "The dog looks.",
            "The dog waits.",
            "Tim says: Sit!",
            "The dog sits fast."
          ],
          question: {
            prompt: "What does Tim say?",
            correct: "Sit!",
            wrong: ["Run!", "Jump!", "Pizza!", "The moon is green!"]
          }
        },
        {
          id: "cat-box-1",
          title: "The Cat Box",
          lines: [
            "The cat has a box.",
            "The cat sits in the box.",
            "The box tips.",
            "The cat jumps out.",
            "Mia laughs.",
            "The cat sits in the box again."
          ],
          question: {
            prompt: "Where does the cat sit?",
            correct: "In the box.",
            wrong: ["On the bus.", "In the tree.", "On the moon.", "In the soup."]
          }
        },
        {
          id: "big-hat-1",
          title: "The Big Hat",
          lines: [
            "Sam has a big hat.",
            "The hat is too big.",
            "The hat tips down.",
            "Sam cannot see.",
            "Sam walks into a chair.",
            "Sam laughs at the hat."
          ],
          question: {
            prompt: "Why can Sam not see?",
            correct: "The hat is too big.",
            wrong: ["It is dark.", "Sam is asleep.", "A fish is on Sam.", "The chair can fly."]
          }
        },
        {
          id: "red-sock-1",
          title: "The Red Sock",
          lines: [
            "Ben has one red sock.",
            "Ben has one blue sock.",
            "Ben looks at his feet.",
            "Ben looks at the socks.",
            "Ben laughs.",
            "Ben likes the socks."
          ],
          question: {
            prompt: "What color is the second sock?",
            correct: "Blue.",
            wrong: ["Green.", "Pink.", "Dog.", "Pizza."]
          }
        },
        {
          id: "duck-run-1",
          title: "The Duck Runs",
          lines: [
            "A duck runs fast.",
            "The duck runs left.",
            "The duck runs right.",
            "Max runs after the duck.",
            "Max slips in mud.",
            "The duck looks proud."
          ],
          question: {
            prompt: "Who slips in mud?",
            correct: "Max.",
            wrong: ["The duck.", "A fish.", "The moon.", "A chair."]
          }
        }
      ]
    },
    {
      id: 2,
      label: "Easy",
      difficultyWeight: 2,
      focus: "short connected scenes, repeated sentence frames",
      stories: []
    }
  ]
});
