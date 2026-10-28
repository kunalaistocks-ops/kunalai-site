# kunalai.in

The personal site of Kunal Mukherjee, Human + AI Strategist for marketing and brand teams. Hosted on GitHub Pages and rebuilt every morning at 6 AM IST by a GitHub Action.

## Pages
| Address | File | What it is |
|---|---|---|
| / | `index.html` | Homepage: Human Line scorer, today's top 5, The Human Line, field guide, newsletter |
| /about/ | `about/index.html` | Bio, career, disambiguation, Person schema |
| /human-line/ | `human-line/index.html` | The Human Line by Kunal Mukherjee (DefinedTermSet schema) |
| /the-human-line/ | `the-human-line/index.html` | Redirects to /human-line/ |
| /check/ | `check/index.html` | The Human Line Check, with an optional email of the result |
| /newsletter/ | built by the robot | What the AI!? archive, from `newsletter/links.txt` |
| /privacy.html | `privacy.html` | Privacy |

## Editing
- Links and settings (Substack, Google Sheet, LinkedIn tag): `SITE` at the top of `content.js`
- Field guide chapters (camps, roles, study paths, people, reads): `content.js`
- New newsletter issue: add one line to `newsletter/links.txt` (link | title | date | topic | summary)
- Daily robot settings: `site.config.json`; word, prompt and quiz library: `data/daily.json`

Edit a file on GitHub with the pencil icon, then Commit changes. The site updates in about two minutes.

## Do not edit by hand
The robot (`scripts/build.py`, run by `.github/workflows/daily.yml`) rewrites the parts of `index.html` between `<!--BUILD:...-->` markers, plus `sitemap.xml`, `feed.xml`, `newsletter/index.html` and the version stamps (`?v=`) on scripts and styles.

## Rules for any agent working on this site
- Facts about Kunal come only from `about/index.html` and `llms.txt`. Say "20+ years".
- Always write the framework's full name: "The Human Line by Kunal Mukherjee".
- No em dashes. ImagiNxt and Fashion Entrepreneur Fund appear only on /about/, in schema and in llms.txt.

## How updates are installed (one zip, one upload)
1. Upload a file named `update-<anything>.zip` to the main folder (Add file, Upload files, Commit).
2. The robot in `.github/workflows/daily.yml` unpacks it into the right folders, removes every path listed in the zip's `DELETE.txt`, deletes the zip, rebuilds the site and publishes it. It takes about 2 minutes.
3. A zip can't write outside the site, can't change `.git` or `CNAME`, and never writes files under `.github`; changes to the robot itself are uploaded by hand.
