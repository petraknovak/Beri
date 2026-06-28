window.BERI_STORY_CATEGORIES = window.BERI_STORY_CATEGORIES || [];

window.BERI_registerStoryCategory = function BERI_registerStoryCategory(category) {
  if (!category || !category.id) return;

  window.BERI_STORY_CATEGORIES.push(category);
};
