# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Photo search

The page opens with a spotlight and decorative theater curtains that automatically part. Visitors
who prefer reduced motion see the page without the curtain animation.
Decorative stars appear over the page, with a soft glow around the background
edges.
Moving a mouse or pen, or touching and moving a finger on a touch screen,
creates a brief glitter trail; the effect is disabled when reduced motion is
preferred.

The optional background music player generates an original instrumental loop
in the browser. Use Play music and Pause music to control playback and the
volume slider to adjust it; music does not start automatically.

Word definitions use the Free Dictionary API (`api.dictionaryapi.dev`) through
a same-origin Vercel rewrite to avoid browser CORS issues, with Datamuse as a
fallback if the primary service is unavailable. Related pictures are searched
through the public Wikimedia Commons API and link to their Commons details and
license pages. No photo API key or server environment variable is required.
Drag a photo onto another photo to rearrange the gallery, or use its arrow
buttons. Selecting a photo without dragging opens its Commons source.

Dictionary results also show up to three related Bible verses when available.
Verse search uses the Bolls.life API and displays text from the public-domain
World English Bible.

Results include love quotes, short poems, and jokes using the searched word, separate
from the official dictionary definitions.
Jokes are also translated into the selected result language when it is not English;
the original English jokes remain visible if translation is unavailable.
The search form supports English, Spanish, French, German, Italian, and
Portuguese. Non-English searches are translated to English before looking up
definitions. Results show the original word and English headword, with
definitions translated into the selected language. English searches continue
to show Spanish translations.
Changing the From language displays a hello greeting in that language.
When available, results include medical senses explicitly labeled by
Wiktionary, plus separate law term senses labeled law, legal, or jurisprudence.
Both sections include source and license links.
The page also includes a glossary of common medical and legal terms with
built-in illustrations. Its filter searches English entries. Selecting a glossary
entry looks it up in the dictionary; its translation button translates the term
and definition to the selected result language. Medical and law senses in search
results are also translated into that language when available. Translations use
online services and are for general information, not medical or legal advice.
Use the Listen buttons to hear dictionary definitions, glossary entries, and
medical or legal definitions in English or their selected translation, using
your browser's speech voices. Each translated definition can be read separately.
Listen buttons are also available for words, examples, synonyms, jokes, poems,
quotes, and Bible verses; translated jokes and examples use the target language.

## Translations

Dictionary definitions and examples are translated from English to the selected
language (Spanish for English searches)
using the public MyMemory translation service, with Google Translate as a
fallback when MyMemory is unavailable or reaches its free quota. Translation
requires an internet connection and depends on public service availability.
Non-English search terms use the same services to translate into English.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
