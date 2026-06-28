(function buildEnglishStories() {
  const sourceCategories = Array.isArray(window.BERI_STORY_CATEGORIES)
    ? window.BERI_STORY_CATEGORIES.slice()
    : [];
  const storyLabels = {
    mini: "Mini",
    everyday: "Everyday",
    fluency: "Fluency"
  };

  function compactStoryCategories(categories) {
    return categories.map(function (category, index) {
      const stories = [];

      (Array.isArray(category.levels) ? category.levels : []).forEach(function (level) {
        (Array.isArray(level.stories) ? level.stories : []).forEach(function (story) {
          stories.push(story);
        });
      });

      return Object.assign({}, category, {
        levels: [
          {
            id: index + 1,
            label: storyLabels[category.id] || category.label || String(index + 1),
            difficultyWeight: index + 1,
            focus: category.description || "",
            stories: stories
          }
        ]
      });
    }).filter(function (category) {
      return category.levels[0].stories.length > 0;
    });
  }

  const categories = compactStoryCategories(sourceCategories);

  window.BERI_STORIES = {
    language: "en",
    title: "Beri Stories",

    meta: {
      purpose: "Short English stories for dyslexic beginner readers",
      designPrinciples: [
        "short connected texts",
        "high repetition in early levels",
        "easy-to-read vocabulary",
        "simple syntax",
        "concrete humor",
        "word-family reinforcement",
        "high-frequency irregular words in context",
        "predictable sentence rhythm"
      ]
    },

    display: {
      preferredMode: "story",
      lineByLine: true,
      allowFullStory: false,
      allowSyllableVersion: false
    },

    groups: categories
  };
})();
