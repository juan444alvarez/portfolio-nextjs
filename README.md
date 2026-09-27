# Portfolio starter

A small Next.js starting point for your portfolio. It does three things:

1. **Home page.** Your layout and text, in a 388px column centered on the screen.
2. **Showcase transition.** Clicking a showcase on the home page slides the showcase up over the home page.
3. **Hover lines.** Hovering the Ebara title draws blue lines across the screen, steering around your content.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Then replace the two placeholder images in `public/` with your real ones, keeping the same file names:

- `public/avatar.jpeg`
- `public/ebara-preview.png`

## Files

```
app/
  layout.tsx              font (Geist) and page title template
  globals.css             colors, black body, showcase transition CSS
  page.tsx                home page: your text and the SHOWCASES list
  showcase/
    ebara/page.tsx        fullest example: external link, hero image, a section
    calpers/page.tsx
    veeva/page.tsx
components/
  Shell.tsx               HomeShell and ShowcaseShell: every page's <main>
  HoverLines.tsx          the hover lines (all settings in CONFIG at the top)
  tokens.ts               shared text styles, link and back-button classes
  icons.tsx               ReturnArrow, ExternalLink
public/                   images
```

## How the showcase transition works

Three pieces have to agree, and each file's comments point to the others:

1. On the home page, each showcase `<Link>` has `transitionTypes={SHOWCASE_TRANSITION}`. That tags the navigation with the type `"showcase"`.
2. `components/Shell.tsx` turns that type into two classes. `HomeShell` exits with `home-exit`, and `ShowcaseShell` enters with `showcase-enter`.
3. `app/globals.css` animates those two classes. The speed and easing are `--showcase-duration` and `--showcase-ease`.

Going back (the back link, the browser's back button, a swipe, a refresh) carries no type, so the page swaps instantly. No setting in `next.config.ts` is needed for any of this.

## How the hover lines work

- `HomeShell` renders `<HoverLines />` once. It also marks your column with `data-hover-lines-avoid`, so the lines steer around it.
- A link triggers the lines when it has `data-hover-lines`. On the home page, that's any entry in `SHOWCASES` with `hoverLines: true`.
- To change the look, edit `CONFIG` at the top of `components/HoverLines.tsx`. It controls the style (`"chaos"`, `"corners"` or `"echoes"`), number of lines, width, colors, timing and exit. No CSS is involved.

## Add a showcase

1. Copy `app/showcase/calpers` to a new folder, for example `app/showcase/newproject`.
2. Edit the new `page.tsx`: the `metadata` title, the `<h1>`, and the sections.
3. Add an entry to `SHOWCASES` in `app/page.tsx` whose `slug` matches the folder name exactly.
