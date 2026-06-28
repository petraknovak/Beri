(function buildGermanStories() {
  const sourceCategories = Array.isArray(window.BERI_STORY_CATEGORIES)
    ? window.BERI_STORY_CATEGORIES.slice()
    : [];
  const storyLabels = {
    mini: "Mini",
    everyday: "Alltag",
    fluency: "Flüssig"
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
    language: "de",
    title: "Beri Geschichten",

    meta: {
      purpose: "Short German stories for dyslexic beginner readers",
      designPrinciples: [
        "short connected texts",
        "high repetition in early levels",
        "easy-to-read vocabulary",
        "simple syntax",
        "concrete humor",
        "syllable-separated lines for display options"
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
