# And Creative Factory — website (final version)

This is the one official version of the site going forward. Open `index.html` with VS Code **Live Server** (or double-click it) — everything runs from this single file.

## Files

```
index.html          all 11 pages, the navbar and the footer (each written once)
css/main.css        colors, typography, components, light + dark theme
css/responsive.css  all media queries and RTL fixes
css/polish.css       premium extras: cursor, tilt, marquee, transitions, loader
js/main.js           core site logic, split into 12 commented sections
js/polish.js         the extras above — safe to delete along with its <link>/<script> tag to go back to the plain design
assets/img/          your real project photos (no placeholders left)
assets/videos/       3 placeholder MP4 clips — replace with real footage when ready
```

## Pages

Home · About · Capabilities · Wood Factory · Metal Factory · Printing Factory · Services · Projects · Brands · Process · Contact.

They are all `<section class="page" id="page-xxx">` inside `index.html`. `main.js` hides them all and shows one. The address bar keeps the page, so `index.html#wood` opens the wood factory directly.

## What's already in place

- Every image is your own real photography — nothing left to replace.
- Custom cursor, gentle 3D tilt on cards, a smooth crossfade between pages, an auto-scrolling brand strip, a real branded preloader, a scroll-progress bar, and a floating WhatsApp button.
- A custom mobile menu icon that morphs into an X when opened.
- Favicon and social-preview (Open Graph) tags.

## Replacing a photo

Every image is a plain `<img src="assets/img/...">`. Keep the same file name and drop your own photo on top of it — nothing else needs to change. Names describe what's in them (`project-kitchen-display.jpg`, `metal-accessories-tower-01.jpg`, and so on).

## Replacing videos

Put your files in `assets/videos/` using the same names — `factory-tour.mp4`, `wood-factory.mp4`, `installation.mp4` — or edit the `<source src="...">` lines in the video section of the Home page. The `poster="..."` attribute is the thumbnail shown before play.

## Arabic / English

Every text element carries both languages:

```html
<h2 data-en="Our factories" data-ar="مصانعنا"></h2>
```

Edit the attribute, not the text between the tags (it is filled in by JavaScript). Input placeholders use `data-en-ph` / `data-ar-ph`. The language button also flips the page to RTL.

## Adding a project

Copy any `<article class="project-card">` block on the Projects page and edit its `data-` attributes. The case-study popup reads them directly, so there is no separate list to keep in sync. `data-category` must match one of the filter buttons: `wood`, `metal`, `printing`, `fitout`, `signage`.

## Adding a brand

Same idea — copy a `<div class="brand-card">` block and edit its `data-` attributes.

## Contact form

`setupContactForm()` in `main.js` only validates and shows a thank-you message. Connect it to your email service, PHP script or Formspree when you are ready.

## Map

The Contact page uses a Google Maps embed pointing at 6th of October City. Replace the `src` of the `<iframe>` with your own embed link (Google Maps → Share → Embed a map).

## WhatsApp / phone number

The floating WhatsApp button, the footer icon, and the Contact page all currently use the placeholder number `+20 100 000 0000`. Search the file for `201000000000` and `+20 100 000 0000` and swap in the real number once you have it.

## Note

Bootstrap Icons and Google Fonts load from a CDN, so the first load needs an internet connection. To work fully offline, download them and point the `<link>` tags at local copies.
