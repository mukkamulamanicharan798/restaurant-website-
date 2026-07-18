# Ember & Oak — Restaurant Website

A responsive, premium single-page website for a wood-fired restaurant.

## Structure
```
ember-oak/
├── index.html      All markup / sections
├── css/styles.css  Design tokens, layout, animations
├── js/script.js    Nav, scroll reveals, image loading, ember canvas, review carousel, form
└── README.md
```

## Run it
No build step needed — just open `index.html` in a browser, or serve the
folder with any static server, e.g.:
```
npx serve .
```

## Customize
- **Colors / fonts**: edit the CSS custom properties at the top of `css/styles.css` (`:root`).
- **Text & prices**: edit directly in `index.html` — each section is clearly commented.
- **Images**: every image is loaded via a `data-src` attribute on an element
  with class `img-bg` (see `js/script.js`). Swap the URLs, or point them at
  local files in an `/images` folder. If an image fails to load, the site
  falls back to a warm ember-toned gradient automatically, so nothing breaks.
- **Sections included**: sticky nav, hero, intro stats strip, mains menu,
  desserts, gallery, testimonials carousel, contact (info + form), footer.

## Notes
- Fonts (Fraunces + Work Sans) are loaded from Google Fonts via CDN link tags.
- The contact form is front-end only — wire `js/script.js`'s submit handler
  up to your backend or a service like Formspree to actually receive messages.
