# Beri
Beri is a small browser-based reading practice app for children learning to read. It is meant as an always-at-hand companion to book exercises, not a replacement for adult guidance or supervision. Children can practise short reading items regularly, while Beri keeps track of progress and gives reward points for consistency.

The current content includes German and English reading practice, short comprehension stories, student profiles, daily progress tracking, and a gentle display mode. Beri is designed as an extensible reading-practice infrastructure where additional languages, levels, stories, and reading resources can be added over time.

## Privacy-first

Beri is designed for offline, private reading practice.

- All progress is stored locally on the device.
- No user accounts.
- No cloud storage.
- No analytics.
- No reading data leaves the user's device.

This makes Beri suitable for use in homes, schools, and clinical settings where privacy matters.

## Typical workflow

Beri supports independent practice while fitting naturally into existing reading support.

### Reader

The reader practices independently on their own phone, tablet, or computer.

### Parent

A parent can supervise practice sessions on the parent's own device and observe progress over time.

### Reading specialist

During weekly sessions, the specialist uses Beri on their own device to assess reading, compare progress, and adjust the next practice goals.

Each device keeps its own local progress history. No information is shared automatically between devices.

## Contact

Beri is maintained by Petra Kralj Novak. For project questions, content suggestions, or private feedback, use `beri.reader@gmail.com`.

## Open the app

The public version is deployed and free to use at <http://beri.janov.si/>.

Open `index.html` in a browser.

The app is static HTML, CSS, and JavaScript. It does not need a build step.

All source files should be saved as UTF-8. German umlauts such as `ä`, `ö`, `ü`, and `ß` are intentional reading content and should stay as normal characters.

Useful language URLs:

- `index.html?lang=de`
- `index.html?lang=en`

## Project structure

- `index.html` - default entry point for static hosting
- `berilogic.js` - app behavior, profiles, scoring, progress, and stories
- `BeriMobile.css` - app styling
- `locales/` - language-specific UI text, reading content, and story files
- `images/` - app images

## Contributing content

Reading levels live in `locales/<language>/content-*.js`.

Stories live in `locales/<language>/stories/`. For German story instructions, see `locales/de/stories/README.md`.

When adding new content:

1. Keep items short and readable aloud.
2. Match the level's pattern or difficulty.
3. Use hyphens to mark smaller readable segments when useful, for example `Re-gen-man-tel` or `c-at`. Unmarked words are still treated as single colorable segments.
4. Keep scoring in mind: beginner levels score readable characters, later levels score words or pattern examples. A level is considered fluent when a reader earns about 15 reading points in a 20-second round.
5. Add stories to the matching category and update the story manifest if adding a new file.
6. Test both `?lang=de` and `?lang=en` in the browser.

## Before committing

Recommended first commit cleanup:

1. Open `index.html` locally and check the main flows: profile, practice, stories, progress, settings, and language switch.
2. Confirm no private student data is stored in committed files. Browser progress is saved in local storage/cookies only.
