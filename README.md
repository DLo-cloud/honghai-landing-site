# Honghai Landing Site

Static website for Honghai Solution.

## Local Preview

Open `index.html` in a browser, or run a simple static server:

```sh
python3 -m http.server 4173
```

Then visit `http://localhost:4173`.

## Replace Images

All temporary image areas are marked in HTML with:

```html
data-replaceable="true"
```

When final images are ready, replace each `.image-slot` block with an `<img>` element or set a CSS background image.

Recommended image sizes:

- Hero: 920 x 1040
- About images: 600 x 820
- Solution images: 688 x 300
- Product images: 360 x 220

## Cloudflare Pages Deployment

Recommended setup:

1. Create a GitHub repository.
2. Push this folder to the repository.
3. In Cloudflare, go to **Workers & Pages**.
4. Create a Pages project and connect the GitHub repository.
5. Build command: leave empty.
6. Build output directory: `/` if this repository only contains this site, or `honghai-landing-site` if using the current workspace as the repository root.
7. Add the custom domain from Cloudflare Pages.

## Direct Upload Alternative

For the fastest one-time upload, upload the contents of this folder directly to Cloudflare Pages.
