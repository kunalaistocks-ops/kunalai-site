# kunalai.in

Kunal Mukherjee's field guide to the AI decade. It's a plain static site: no build step, hosted on GitHub Pages.

## Editing content (the usual case)
Almost everything you'd want to change is in **`content.js`**:

| What | Where in content.js |
|---|---|
| Your LinkedIn, newsletter and email links | `SITE` at the top |
| Rotating headline words ("AI, explained for ___") | `K_WORDS` |
| Chapter 01: Perspectives / camps | `K_CAMPS` |
| Chapter 02: Your job | `K_ROLES` |
| Chapter 03: What to study | `K_TRACKS` |
| Chapter 04: People to follow | `K_PEOPLE` |
| Chapter 05: Reading room | `K_READS` |

**How to edit on GitHub:** open the repo, click `content.js`, click the ✏️ pencil, change the text between the "quotes", then click **Commit changes**. The live site updates in about a minute.

Rules of thumb:
- Keep the quotes `"..."` and the commas between items.
- To use a quote mark inside text, write `\"`. Apostrophes (') are fine.
- To add a person or a read, copy an existing line, paste it below, and edit it.
- If the page goes blank after an edit, a comma or quote is probably missing. Open the commit history and click "Revert", or fix the line.

## Editing page text
Headings, the intro, About, "What I believe", "Now" and Contact are in **`index.html`**. Search for the words you want to change and edit them the same way.

## Files
- `index.html`: page structure and fixed text
- `content.js`: all list content (edit this)
- `app.js`: interactive behaviour (normally leave alone)
- `styles.css`: design
- `og-image.png`: the preview image shown when the link is shared
- `favicon.*`, `apple-touch-icon.png`: icons
- `CNAME`: tells GitHub Pages to use kunalai.in (don't delete)
- `robots.txt`, `sitemap.xml`: for search engines. Update `lastmod` in the sitemap after big changes.

## Preview locally (optional)
Double-click `index.html`, or run `python3 -m http.server` and open http://localhost:8000.
