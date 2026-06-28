# German Stories

Stories are now organized as one JS file per category.

## Structure
- `_categories.js`: shared category registration helper
- `manifest.js`: ordered list of category files to load for the browser app
- `index.js`: assembles `window.BERI_STORIES` from registered categories
- `mini.js`, `everyday.js`, `fluency.js`: category files containing levels and stories

## Add a new story
1. Open the matching category file.
2. Add the story object directly to the right level's `stories` array.
3. Use hyphens to mark smaller readable segments when useful, for example `Re-gen-man-tel`. Unmarked words are still treated as single colorable segments.

## Add a new category
1. Create a new category `.js` file that calls `window.BERI_registerStoryCategory({ ... })`.
2. Add that file path to `manifest.js`.
