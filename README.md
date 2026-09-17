# And Creative Factory — website

Open `index.html` with VS Code **Live Server** (or double-click it). Everything runs from this one file.

## Files

```
index.html          all 11 pages, the navbar and the footer (each written once)
css/main.css        colors, typography, components, light + dark theme
css/responsive.css  all media queries and RTL fixes
js/main.js          plain JavaScript, split into 12 commented sections
assets/img/         photos and placeholders
assets/videos/      3 placeholder MP4 clips
```

## Pages

Home · About · Capabilities · Wood Factory · Metal Factory · Printing Factory · Services · Projects · Brands · Process · Contact.

They are all `<section class="page" id="page-xxx">` inside `index.html`. `main.js` hides them all and shows one. The address bar keeps the page, so `index.html#wood` opens the wood factory directly.

## Replacing images

Every image is a normal `<img src="assets/img/...">`. Keep the same file name and drop your own photo on top of it — nothing else needs to change.

Files starting with `ph-` are generated placeholders (they say "replace this image" on them). These are the ones to swap first:

| File | Use it for |
|---|---|
| `ph-wood-hero.jpg`, `ph-cnc.jpg`, `ph-edgebander.jpg` | wood factory |
| `ph-metal-hero.jpg`, `ph-laser.jpg`, `ph-press-brake.jpg`, `ph-powder.jpg` | metal factory |
| `ph-print-hero.jpg`, `ph-uv-printer.jpg`, `ph-latex.jpg`, `ph-cutting-plotter.jpg` | printing factory |
| `ph-engineering.jpg`, `ph-qc.jpg`, `ph-survey.jpg`, `ph-install.jpg` | engineering, QC, survey, installation |
| `ph-team.jpg`, `ph-about.jpg` | about page |

Your own photos are already used across Home, Projects, the factory pages and the galleries.

## Replacing videos

Put your files in `assets/videos/` using the same names — `factory-tour.mp4`, `wood-factory.mp4`, `installation.mp4` — or edit the `<source src="...">` lines in the video section of the Home page. The `poster="..."` attribute is the thumbnail shown before play.

## Arabic / English

Every text element carries both languages:

```html
<h2 data-en="Our factories" data-ar="مصانعنا"></h2>
```

Edit the attribute, not the text between the tags (it is filled in by JavaScript). Input placeholders use `data-en-ph` / `data-ar-ph`. The language button also flips the page to RTL.

## Adding a project

Copy any `<article class="project-card">` block in the Projects page and edit its `data-` attributes. The case-study popup reads them directly, so there is no separate list to update. `data-category` must match one of the filter buttons: `wood`, `metal`, `printing`, `fitout`, `signage`.

## Adding a brand

Same idea — copy a `<div class="brand-card">` and edit its `data-` attributes.

## Contact form

`setupContactForm()` in `main.js` only validates and shows a thank-you message. Connect it to your email service, PHP script or Formspree when you are ready.

## Map

The Contact page uses a Google Maps embed pointing at 6th of October City. Replace the `src` of the `<iframe>` with your own embed link (Google Maps → Share → Embed a map).

## Note

Bootstrap 5, Bootstrap Icons and Google Fonts load from CDN, so the first load needs an internet connection. To work fully offline, download them and point the `<link>` and `<script>` tags at local copies.
