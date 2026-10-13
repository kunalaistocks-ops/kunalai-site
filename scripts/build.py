#!/usr/bin/env python3
"""
Daily build for kunalai.in

Runs every morning via GitHub Actions (see .github/workflows/daily.yml).
It rewrites the marked blocks inside index.html, so the published page is
plain HTML that search engines and AI assistants can read.

What it does:
  1. Stamps today's date (IST) as the edition date.
  2. Pulls fresh AI headlines from the feeds in site.config.json
     (headline, source and link only; never article text).
  3. Picks today's term, prompt and quiz from data/daily.json.
  4. Turns every newsletter/*.md file into its own page and an archive list.
  5. Rebuilds sitemap.xml and feed.xml (RSS of the newsletter).

If a feed fails, the build keeps going. If every feed fails, yesterday's
headlines stay on the page.
"""
import datetime as dt
import html
import json
import os
import re
import socket
import sys
import urllib.request
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent.parent
IST = dt.timezone(dt.timedelta(hours=5, minutes=30))
NOW = dt.datetime.now(IST)
TODAY = NOW.date()
socket.setdefaulttimeout(20)

try:
    import feedparser
except ImportError:
    feedparser = None
try:
    import markdown as md
except ImportError:
    md = None

CFG = json.loads((ROOT / "site.config.json").read_text(encoding="utf-8"))
BANK = json.loads((ROOT / "data/daily.json").read_text(encoding="utf-8"))
SITE = CFG["site_url"].rstrip("/")
E = html.escape


def nice_date(d):
    return f"{d.strftime('%A')}, {d.day} {d.strftime('%B %Y')}"


def replace_block(page, name, content):
    pat = re.compile(rf"(<!--BUILD:{name}-->)(.*?)(<!--/BUILD:{name}-->)", re.S)
    if not pat.search(page):
        print(f"warning: marker {name} not found", file=sys.stderr)
        return page
    return pat.sub(lambda m: m.group(1) + content + m.group(3), page)


def strip_tags(s):
    """Remove tags and turn entities like &#8216; into real characters."""
    text = re.sub(r"<[^>]+>", "", s or "")
    for _ in range(2):  # some feeds encode entities twice
        text = html.unescape(text)
    return re.sub(r"\s+", " ", text).strip()


# ---------- 1. News ----------
def fetch_news():
    if not feedparser:
        print("feedparser missing; skipping news", file=sys.stderr)
        return []
    items, seen = [], set()
    cutoff = NOW - dt.timedelta(days=3)
    for feed in CFG["news_feeds"]:
        try:
            parsed = feedparser.parse(feed["url"], agent="kunalai.in daily build")
        except Exception as e:  # noqa
            print(f"feed failed: {feed['name']}: {e}", file=sys.stderr)
            continue
        for en in parsed.entries[:25]:
          try:
            title = strip_tags(en.get("title", ""))
            link = en.get("link", "")
            if not title or not link:
                continue
            source = feed["name"]
            src = en.get("source")
            if src and getattr(src, "title", None):
                source = src.title
            elif isinstance(src, dict) and src.get("title"):
                source = src["title"]
            if source and title.endswith(" - " + source):
                title = title[: -len(" - " + source)]
            if source.startswith("Google News"):
                source = "News"
            t = en.get("published_parsed") or en.get("updated_parsed")
            when = dt.datetime(*t[:6], tzinfo=dt.timezone.utc).astimezone(IST) if t else NOW
            if when < cutoff:
                continue
            key = re.sub(r"\W+", "", title.lower())[:60]
            if key in seen:
                continue
            seen.add(key)
            items.append({"title": title, "link": link, "source": source,
                          "when": when, "region": feed.get("region", "World")})
          except Exception as e:  # noqa
            print(f"skipped one item from {feed['name']}: {e}", file=sys.stderr)
    items.sort(key=lambda x: x["when"], reverse=True)
    picked, per = [], {}
    limit, per_max = CFG.get("news_count", 8), CFG.get("news_max_per_source", 2)
    # Make sure India gets at least two slots
    for want_india in (True, False):
        for it in items:
            if len(picked) >= limit:
                break
            if it in picked:
                continue
            if want_india and (it["region"] != "India" or sum(p["region"] == "India" for p in picked) >= 2):
                continue
            if per.get(it["source"], 0) >= per_max:
                continue
            per[it["source"]] = per.get(it["source"], 0) + 1
            picked.append(it)
    picked.sort(key=lambda x: x["when"], reverse=True)
    return picked


def render_news(items):
    out = ['<ol class="td-list">']
    for it in items:
        ago = NOW - it["when"]
        hrs = int(ago.total_seconds() // 3600)
        when = "Just now" if hrs < 1 else (f"{hrs}h ago" if hrs < 24 else f"{hrs // 24}d ago")
        tag = '<span class="td-flag">INDIA</span>' if it["region"] == "India" else ""
        out.append(
            f'<li><a href="{E(it["link"])}" target="_blank" rel="noopener">{E(it["title"])}</a>'
            f'<span>{E(it["source"])}, {when}{tag}</span></li>')
    out.append("</ol>")
    return "\n".join(out)


# ---------- 2. Daily picks: AI-written each morning, library as backup ----------
TODAY_FILE = ROOT / "data" / "today.json"
HISTORY_FILE = ROOT / "data" / "ai_history.json"
ROLES = ["Anyone", "Marketing", "Finance", "Sales", "HR", "Operations", "Customer support",
         "Leadership", "Legal", "Content", "Students", "Founders"]


def library_picks():
    """Today's picks from data/daily.json, cycling through everything before repeating."""
    d = TODAY.toordinal()
    term = BANK["terms"][d % len(BANK["terms"])]
    prompt = BANK["prompts"][(d * 7 + 3) % len(BANK["prompts"])]
    facts = [q for q in BANK["quiz"] if q["a"]]
    myths = [q for q in BANK["quiz"] if not q["a"]]
    pick = [facts[(d * 3 + i) % len(facts)] for i in range(3)] + \
           [myths[(d * 2 + i) % len(myths)] for i in range(2)]
    order = [0, 3, 1, 4, 2] if d % 2 else [3, 0, 1, 2, 4]
    return {"term": term, "prompt": prompt, "quiz": [pick[i] for i in order], "source": "library"}


def clean_text(t):
    t = str(t or "").replace("\u2014", ", ").replace("\u2013", " to ").replace("|", "/")
    t = re.sub(r"\s+,", ",", t)
    return re.sub(r"\s+", " ", t).strip()


def validate_ai(data, recent_terms):
    """Return clean content, or raise ValueError if anything is off."""
    term = data.get("term") or {}
    t, d = clean_text(term.get("term")), clean_text(term.get("def"))
    if not (2 <= len(t) <= 40 and 40 <= len(d) <= 280):
        raise ValueError("term has the wrong length")
    if t.lower() in recent_terms:
        raise ValueError(f"term '{t}' was used recently")
    pr = data.get("prompt") or {}
    who, ptxt = clean_text(pr.get("for")), clean_text(pr.get("prompt"))
    who = next((r for r in ROLES if r.lower() == who.lower()), "Anyone")
    if not 40 <= len(ptxt) <= 320:
        raise ValueError("prompt has the wrong length")
    quiz = data.get("quiz") or []
    if len(quiz) != 5:
        raise ValueError("quiz needs exactly five questions")
    out = []
    for q in quiz:
        qq, why = clean_text(q.get("q")), clean_text(q.get("why"))
        qq = re.sub(r"^(myth or fact|fact or myth)\s*[:?.-]\s*", "", qq, flags=re.I)
        qq = qq[:1].upper() + qq[1:]
        if not isinstance(q.get("a"), bool):
            raise ValueError("quiz answer must be true or false")
        if not (20 <= len(qq) <= 200 and 20 <= len(why) <= 260):
            raise ValueError("quiz item has the wrong length")
        out.append({"q": qq, "a": q["a"], "why": why})
    myths = sum(not q["a"] for q in out)
    if not 1 <= myths <= 3:
        raise ValueError("quiz needs a mix of myths and facts")
    return {"term": {"term": t, "def": d}, "prompt": {"for": who, "prompt": ptxt},
            "quiz": out, "source": "ai"}


AI_SYSTEM = """You write the daily section of kunalai.in, a site by Kunal Mukherjee that explains AI to
non-technical managers in India. Plain, warm, confident English. Short sentences. No jargon without
explanation. Never use em dashes or en dashes. Never use the | character.

Reply with JSON only, no other text, in exactly this shape:
{"term": {"term": "...", "def": "..."},
 "prompt": {"for": "...", "prompt": "..."},
 "quiz": [{"q": "...", "a": true, "why": "..."}, ... five items ...]}

Rules:
- term: one AI word or phrase a manager will meet at work. "def" is one or two plain sentences, 60 to 220 characters.
  Prefer a term connected to today's headlines. Do not use any term in the AVOID list.
- prompt: one ready-to-use prompt a manager can paste into an AI tool today, 60 to 280 characters,
  with [brackets] for the parts they fill in. "for" is one of: Anyone, Marketing, Finance, Sales, HR,
  Operations, Customer support, Leadership, Legal, Content, Students, Founders.
- quiz: exactly five Myth or Fact statements, "a" is true for fact and false for myth.
  Write each statement on its own, without starting it with "Myth or Fact".
  Include two or three myths. Each "q" is under 170 characters; each "why" is one or two sentences under 220 characters.
- Up to two quiz items may be about today's headlines. They must be facts, must only restate what the headline
  itself says, and must name the source, for example "Mint reports that ...". Never guess details beyond the headline.
- Myths must be common misconceptions about AI in general. Never write a false claim about a real company,
  person, product or news event.
- Every other statement must be well-established and stable over time. If unsure, leave it out.
- Nothing political, medical, legal advice, or about specific share prices."""


def ai_picks(news):
    key = os.environ.get("ANTHROPIC_API_KEY", "").strip()
    if not key or not CFG.get("ai_daily", True):
        return None
    if TODAY_FILE.exists():
        try:
            saved = json.loads(TODAY_FILE.read_text(encoding="utf-8"))
            if saved.get("date") == TODAY.isoformat() and saved.get("source") == "ai":
                print("using today's AI content already written earlier")
                return saved
        except ValueError:
            pass
    history = {}
    if HISTORY_FILE.exists():
        try:
            history = json.loads(HISTORY_FILE.read_text(encoding="utf-8"))
        except ValueError:
            history = {}
    recent = [t.lower() for t in history.get("terms", [])[-120:]]
    lines = "\n".join(f"- {n['title']} ({n['source']})" for n in news) or "- (no headlines today)"
    user = (f"Date: {nice_date(TODAY)}\n\nToday's AI headlines:\n{lines}\n\n"
            f"AVOID these terms: {', '.join(history.get('terms', [])[-120:]) or 'none'}\n\n"
            "Write today's term, prompt and five quiz items.")
    for model in CFG.get("ai_models", ["claude-sonnet-5-5"]):
        try:
            body = json.dumps({"model": model, "max_tokens": 2000, "system": AI_SYSTEM,
                               "messages": [{"role": "user", "content": user}]}).encode()
            req = urllib.request.Request("https://api.anthropic.com/v1/messages", data=body, headers={
                "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json"})
            with urllib.request.urlopen(req, timeout=90) as r:
                resp = json.loads(r.read().decode("utf-8"))
            text = "".join(b.get("text", "") for b in resp.get("content", []) if b.get("type") == "text")
            text = re.sub(r"^```(?:json)?|```$", "", text.strip(), flags=re.M).strip()
            m = re.search(r"\{.*\}", text, re.S)
            content = validate_ai(json.loads(m.group(0) if m else text), recent)
            content["date"] = TODAY.isoformat()
            content["model"] = model
            TODAY_FILE.write_text(json.dumps(content, indent=1, ensure_ascii=False), encoding="utf-8")
            history.setdefault("terms", []).append(content["term"]["term"])
            history["terms"] = history["terms"][-365:]
            HISTORY_FILE.write_text(json.dumps(history, indent=1, ensure_ascii=False), encoding="utf-8")
            print(f"AI content written with {model}")
            return content
        except Exception as e:  # noqa
            print(f"AI content with {model} not used: {e}", file=sys.stderr)
    return None


def render_term(t):
    return f'<h3>{E(t["term"])}</h3><p>{E(t["def"])}</p>'


def render_prompt(p):
    who = "ANYONE" if p["for"] == "Anyone" else p["for"].upper()
    return (f'<p class="td-for">FOR {E(who)}</p>'
            f'<p class="td-q" id="promptText">{E(p["prompt"])}</p>'
            f'<button type="button" class="td-copy" data-copy="promptText">Copy prompt</button>')


def render_quiz(items, source):
    out = ['<ol class="td-quiz" id="quiz">']
    for it in items:
        ans = "fact" if it["a"] else "myth"
        out.append(
            f'<li data-answer="{ans}"><p class="q">{E(it["q"])}</p>'
            f'<div class="qb"><button type="button" data-pick="fact">Fact</button>'
            f'<button type="button" data-pick="myth">Myth</button></div>'
            f'<p class="why"><strong>{ans.capitalize()}.</strong> {E(it["why"])}</p></li>')
    out.append("</ol>")
    if source == "ai":
        out.append('<p class="td-fine">Today\'s word, prompt and quiz were written with AI, '
                   'based on this morning\'s headlines. Spot a mistake? Tell me.</p>')
    return "\n".join(out)


# ---------- 3. Newsletter ----------
def parse_issue(path):
    raw = path.read_text(encoding="utf-8")
    meta, body = {}, raw
    m = re.match(r"^---\s*\n(.*?)\n---\s*\n(.*)$", raw, re.S)
    if m:
        for line in m.group(1).splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                meta[k.strip().lower()] = v.strip().strip('"').strip("'")
        body = m.group(2)
    try:
        date = dt.date.fromisoformat(meta.get("date", ""))
    except ValueError:
        date = dt.date.fromtimestamp(path.stat().st_mtime)
    title = meta.get("title") or path.stem.replace("-", " ").title()
    slug = re.sub(r"[^a-z0-9]+", "-", path.stem.lower()).strip("-")
    if md:
        body_html = md.markdown(body, extensions=["extra", "sane_lists"])
    else:
        body_html = "".join(f"<p>{E(p)}</p>" for p in body.split("\n\n") if p.strip())
    text = strip_tags(body_html)
    summary = meta.get("summary") or (text[:180].rsplit(" ", 1)[0] + "...")
    words = len(text.split())
    return {"title": title, "date": date, "slug": slug, "summary": summary,
            "linkedin": meta.get("linkedin", ""), "html": body_html, "topic": meta.get("topic", ""),
            "minutes": max(1, round(words / 220))}


LINKS_FILE = ROOT / "newsletter" / "links.txt"
LINKS_CACHE = ROOT / "data" / "newsletter_links.json"
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0 Safari/537.36")


def fetch_meta(url):
    """Read the public page's title, summary and date. Returns {} if blocked."""
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en-IN,en"})
        with urllib.request.urlopen(req, timeout=20) as r:
            page = r.read(600_000).decode("utf-8", "ignore")
    except Exception as e:  # noqa
        print(f"could not read {url}: {e}", file=sys.stderr)
        return {}

    def meta(prop):
        m = (re.search(rf'<meta[^>]+(?:property|name)="{prop}"[^>]+content="([^"]*)"', page, re.I)
             or re.search(rf'<meta[^>]+content="([^"]*)"[^>]+(?:property|name)="{prop}"', page, re.I))
        return html.unescape(m.group(1)).strip() if m else ""

    title = meta("og:title") or meta("twitter:title")
    title = re.sub(r"\s*\|\s*LinkedIn\s*$", "", title)
    desc = meta("og:description") or meta("description")
    date = meta("article:published_time")
    if not date:
        m = re.search(r'"datePublished"\s*:\s*"([0-9]{4}-[0-9]{2}-[0-9]{2})', page)
        date = m.group(1) if m else ""
    if not title or "sign in" in title.lower() or "sign up" in title.lower():
        return {}
    return {"title": title, "summary": desc, "date": date[:10]}


def title_from_url(url):
    """Fallback title from a LinkedIn link like /pulse/ai-for-hr-kunal-mukherjee-3xk9f/."""
    slug = url.rstrip("/").split("/")[-1].split("?")[0]
    parts = slug.split("-")
    if parts and re.search(r"\d", parts[-1]) and len(parts[-1]) >= 4:
        parts = parts[:-1]
    if parts[-2:] == ["kunal", "mukherjee"]:
        parts = parts[:-2]
    caps = {"ai": "AI", "hr": "HR", "cfo": "CFO", "ceo": "CEO", "cmo": "CMO", "cxo": "CXO",
            "llm": "LLM", "llms": "LLMs", "genai": "GenAI", "india": "India", "indian": "Indian"}
    words = [caps.get(w.lower(), w) for w in parts if w]
    text = " ".join(words).strip() or "What the AI!? issue"
    return text[0].upper() + text[1:]


def load_links():
    """Issues listed in newsletter/links.txt, one public link per line.
    Optional extras on the same line: link | title | 2026-10-20 | topic | summary"""
    if not LINKS_FILE.exists():
        return []
    cache = {}
    if LINKS_CACHE.exists():
        try:
            cache = json.loads(LINKS_CACHE.read_text(encoding="utf-8"))
        except ValueError:
            cache = {}
    out = []
    for raw in LINKS_FILE.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        bits = [b.strip() for b in line.split("|")]
        url = bits[0]
        if not url.startswith("http"):
            continue
        c = cache.get(url, {})
        if not c.get("fetched"):
            got = fetch_meta(url)
            c = {"title": got.get("title") or c.get("title") or title_from_url(url),
                 "summary": got.get("summary") or c.get("summary", ""),
                 "date": got.get("date") or c.get("date") or TODAY.isoformat(),
                 "fetched": bool(got)}
            cache[url] = c
        title = bits[1] if len(bits) > 1 and bits[1] else c["title"]
        try:
            date = dt.date.fromisoformat(bits[2] if len(bits) > 2 and bits[2] else c["date"])
        except ValueError:
            date = TODAY
        summ = bits[4] if len(bits) > 4 and bits[4] else c.get("summary", "")
        if len(summ) > 200:
            summ = summ[:200].rsplit(" ", 1)[0] + "..."
        topic = bits[3] if len(bits) > 3 else ""
        out.append({"title": title, "date": date, "slug": None, "external": url, "topic": topic,
                    "summary": summ or "Read this issue of What the AI!? on LinkedIn.",
                    "minutes": None, "linkedin": url})
    LINKS_CACHE.parent.mkdir(exist_ok=True)
    LINKS_CACHE.write_text(json.dumps(cache, indent=1, ensure_ascii=False), encoding="utf-8")
    return out


def load_issues():
    (ROOT / "newsletter").mkdir(exist_ok=True)
    issues = [parse_issue(p) for p in sorted((ROOT / "newsletter").glob("*.md"))
              if not p.name.startswith("_")]
    issues += load_links()
    if CFG.get("newsletter_rss") and feedparser:
        try:
            for en in feedparser.parse(CFG["newsletter_rss"]).entries[:30]:
                t = en.get("published_parsed")
                issues.append({"title": strip_tags(en.get("title", "")),
                               "date": dt.date(*t[:3]) if t else TODAY,
                               "slug": None, "external": en.get("link", ""),
                               "summary": strip_tags(en.get("summary", ""))[:180],
                               "minutes": None})
        except Exception as e:  # noqa
            print(f"newsletter rss failed: {e}", file=sys.stderr)
    issues.sort(key=lambda x: x["date"])
    for n, it in enumerate(issues, 1):
        it["no"] = n
    issues.reverse()
    return issues


def issue_url(it):
    return it.get("external") or f"/newsletter/{it['slug']}.html"


def short_date(d):
    return f"{d.day} {d.strftime('%b %Y').upper()}"


def card(it, with_summary=False):
    tag = f'<span class="nl-tag">{E(it["topic"].upper())}</span>' if it.get("topic") else ""
    where = "ON LINKEDIN" if it.get("external") else f'{it.get("minutes") or 1} MIN READ'
    summ = (f'<span class="nl-csum">{E(it["summary"])}</span>'
            if with_summary and it.get("summary") else "")
    tgt = ' target="_blank" rel="noopener"' if it.get("external") else ""
    return (f'<a class="nl-card k-lift" href="{E(issue_url(it))}"{tgt}>'
            f'<span class="nl-ctop"><span class="nl-no">#{it["no"]:02d}</span>{tag}</span>'
            f'<strong>{E(it["title"])}</strong>{summ}'
            f'<span class="nl-cfoot">{short_date(it["date"])} · {where} ↗</span></a>')


def render_archive(issues):
    sub = CFG.get("linkedin_newsletter_url") or CFG["linkedin_profile"]
    if not issues:
        return ('<div class="nl-empty"><p class="s59">THE ARCHIVE</p><p>Issues are moving here from LinkedIn, '
                f'one by one. Until then, <a href="{E(sub)}">read the latest on LinkedIn</a>.</p></div>')
    it = issues[0]
    where = "ON LINKEDIN" if it.get("external") else f'{it.get("minutes") or 1} MIN READ'
    tag = f'<span class="nl-tag">{E(it["topic"].upper())}</span>' if it.get("topic") else ""
    tgt = ' target="_blank" rel="noopener"' if it.get("external") else ""
    return (f'<a class="nl-lead" href="{E(issue_url(it))}"{tgt}>'
            f'<span class="nl-ltop"><span class="nl-no nl-no-lg">#{it["no"]:02d}</span>'
            f'<span class="s59">LATEST ISSUE · {short_date(it["date"])} · {where}</span></span>'
            f'<strong>{E(it["title"])}</strong>'
            f'<span class="sum">{E(it["summary"])}</span>'
            f'<span class="nl-lfoot">{tag}<span class="go">Read the issue ↗</span></span></a>')


def render_more(issues):
    more = issues[1:7]
    if not more:
        return ""
    out = ['<div class="nl-more"><div class="td-head"><p class="s59">EARLIER ISSUES</p>'
           f'<p class="s59">{len(issues)} ISSUES SO FAR</p></div><div class="nl-cards">']
    out += [card(i) for i in more]
    out.append("</div>")
    if len(issues) > 7:
        out.append(f'<a class="s102 nl-allbtn" href="/newsletter/">See all {len(issues)} issues ↗</a>')
    out.append("</div>")
    return "".join(out)


PAGE = """<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}: What the AI!? by Kunal Mukherjee</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{url}">
<meta name="theme-color" content="#2B3BFF">
<meta property="og:type" content="article">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{site}/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="alternate" type="application/rss+xml" title="What the AI!?" href="/feed.xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
<script type="application/ld+json">{ld}</script>
</head>
<body>
<div class="s1">
<header class="s6"><div class="s7">
<a href="/" class="s8"><span class="s9">KM</span><span class="s10">Kunal Mukherjee</span></a>
<nav aria-label="Main" class="mainnav s11"><a href="/#today" class="s12">Today</a><a href="/#jobs" class="s12">Your job</a><a href="/#newsletter" class="s12">Newsletter</a><a href="/#about" class="s12">About</a></nav>
</div></header>
<main class="art">
{body}
</main>
<section class="s97"><div class="s98">
<h2 class="s99">Disagree with<br>something? Good.</h2>
<p class="s100">Speaking, partnerships, collaborations, or a good argument about AI. My inbox is open.</p>
<div class="s88"><a href="mailto:{email}" class="s101">Email me</a><a href="{sub}" target="_blank" rel="noopener" class="s102">Subscribe on LinkedIn</a>{xbtn}</div>
<p class="mailline">Or write to <a href="mailto:{email}">{email}</a></p>
</div></section>
<footer class="s103"><div class="s104">
<span>© {year} Kunal Mukherjee · Views are my own · <a class="foot" href="mailto:{email}">Email</a> · <a class="foot" href="{li}">LinkedIn</a>{xlink} · <a class="foot" href="/feed.xml">RSS</a></span>
<span><a class="foot" href="/privacy.html">Privacy</a> · <a class="foot" href="#" data-cookie-settings>Cookie settings</a> · Made in Mumbai</span>
</div></footer>
</div>
<script src="/content.js"></script>
<script src="/consent.js"></script>
<script src="/app-mail.js"></script>
</body></html>
"""


def x_url():
    h = CFG.get("x_handle", "").lstrip("@").strip()
    return f"https://x.com/{h}" if h else ""


def page_common():
    sub = CFG.get("linkedin_newsletter_url") or CFG["linkedin_profile"]
    xl = f' · <a class="foot" href="{x_url()}">X</a>' if x_url() else ""
    xb = (f'<a href="{x_url()}" target="_blank" rel="noopener me" class="s102">Follow on X</a>'
          if x_url() else "")
    return dict(site=SITE, email=CFG["email"], sub=sub, li=CFG["linkedin_profile"],
                year=TODAY.year, xlink=xl, xbtn=xb)


def write_issue_pages(issues):
    outdir = ROOT / "newsletter"
    outdir.mkdir(exist_ok=True)
    local = [i for i in issues if i.get("slug")]
    for idx, it in enumerate(local):
        url = f"{SITE}/newsletter/{it['slug']}.html"
        prev_ = local[idx + 1] if idx + 1 < len(local) else None
        next_ = local[idx - 1] if idx > 0 else None
        nav = '<nav class="issue-nav">'
        if prev_:
            nav += f'<a href="/newsletter/{prev_["slug"]}.html">Previous: {E(prev_["title"])}</a>'
        if next_:
            nav += f'<a href="/newsletter/{next_["slug"]}.html">Next: {E(next_["title"])}</a>'
        nav += "</nav>"
        orig = (f'<p class="orig">Also published on <a href="{E(it["linkedin"])}">LinkedIn</a>.</p>'
                if it.get("linkedin") else "")
        body = (f'<p class="s14"><a href="/#newsletter">WHAT THE AI!?</a> · '
                f'{it["date"].day} {it["date"].strftime("%B %Y").upper()} · {it["minutes"]} MIN READ</p>'
                f'<h1 class="art-h">{E(it["title"])}</h1>'
                f'<p class="art-by">By Kunal Mukherjee</p>'
                f'<div class="prose">{it["html"]}</div>{orig}{nav}')
        ld = json.dumps({"@context": "https://schema.org", "@type": "Article",
                         "headline": it["title"], "datePublished": it["date"].isoformat(),
                         "author": {"@type": "Person", "name": "Kunal Mukherjee", "url": SITE + "/"},
                         "mainEntityOfPage": url, "image": SITE + "/og-image.png"})
        (outdir / f"{it['slug']}.html").write_text(stamp_assets(PAGE, asset_versions()).format(
            title=E(it["title"]), desc=E(it["summary"]), url=url, body=body, ld=ld,
            **page_common()), encoding="utf-8")
    # Full archive page, grouped by year
    years = {}
    for i in issues:
        years.setdefault(i["date"].year, []).append(i)
    groups = "".join(f'<h2 class="nl-year">{y}</h2><div class="nl-cards">'
                     + "".join(card(i, with_summary=True) for i in items) + "</div>"
                     for y, items in years.items())
    sub = CFG.get("linkedin_newsletter_url") or CFG["linkedin_profile"]
    body = ('<p class="s14">THE NEWSLETTER</p><h1 class="art-h">What the AI!?</h1>'
            f'<p class="art-by">{len(issues)} issues of practical AI for non-technical managers, newest first. '
            f'<a href="{E(sub)}" target="_blank" rel="noopener">Subscribe on LinkedIn ↗</a></p>'
            + (groups or '<p>New issues will appear here.</p>'))
    (outdir / "index.html").write_text(stamp_assets(PAGE, asset_versions()).format(
        title="All issues", desc="Every issue of What the AI!? by Kunal Mukherjee.",
        url=f"{SITE}/newsletter/", body=body, ld="{}", **page_common())
        .replace('<main class="art">', '<main class="art art-wide">'), encoding="utf-8")


def write_feed(issues):
    items = []
    for it in issues[:30]:
        link = it.get("external") or f"{SITE}/newsletter/{it['slug']}.html"
        pub = dt.datetime.combine(it["date"], dt.time(8, 0), IST).strftime("%a, %d %b %Y %H:%M:%S %z")
        items.append(f"<item><title>{E(it['title'])}</title><link>{E(link)}</link>"
                     f"<guid>{E(link)}</guid><pubDate>{pub}</pubDate>"
                     f"<description>{E(it['summary'])}</description></item>")
    (ROOT / "feed.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel>'
        f"<title>What the AI!? by Kunal Mukherjee</title><link>{SITE}/</link>"
        "<description>AI explained for the people who run things.</description>"
        f"<language>en-in</language>{''.join(items)}</channel></rss>\n", encoding="utf-8")


def write_sitemap(issues):
    urls = [(f"{SITE}/", TODAY), (f"{SITE}/newsletter/", TODAY), (f"{SITE}/privacy.html", TODAY)]
    urls += [(f"{SITE}/newsletter/{i['slug']}.html", i["date"]) for i in issues if i.get("slug")]
    body = "".join(f"<url><loc>{u}</loc><lastmod>{d.isoformat()}</lastmod></url>" for u, d in urls)
    (ROOT / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        f'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{body}</urlset>\n', encoding="utf-8")


# ---------- 4. X ----------
def render_x():
    url = x_url()
    if not url:
        return ""
    h = CFG["x_handle"].lstrip("@")
    out = f'<a class="btn ghost" href="{url}" rel="me">Follow @{E(h)} on X</a>'
    return out


def render_x_embed():
    url = x_url()
    if not url or not CFG.get("x_embed_timeline"):
        return ""
    h = CFG["x_handle"].lstrip("@")
    return (f'<div class="x-embed"><a class="twitter-timeline" data-height="520" data-dnt="true" '
            f'href="{url}">Posts by @{E(h)}</a>'
            '<script async src="https://platform.twitter.com/widgets.js"></script></div>')



# ---------- Version stamps so browsers always load the newest files ----------
ASSETS = ["styles.css", "content.js", "consent.js", "app.js", "score.js", "app-mail.js"]


def asset_versions():
    import hashlib
    out = {}
    for name in ASSETS:
        f = ROOT / name
        if f.exists():
            out[name] = hashlib.md5(f.read_bytes()).hexdigest()[:8]
    return out


def stamp_assets(page, versions):
    """Turn src="app.js" into src="app.js?v=1a2b3c4d" (and update old stamps)."""
    for name, v in versions.items():
        page = re.sub(r'((?:src|href)="/?' + re.escape(name) + r')(\?v=[0-9a-f]*)?"', r'\1?v=' + v + '"', page)
    return page


def main():
    page_path = ROOT / "index.html"
    page = page_path.read_text(encoding="utf-8")

    page = replace_block(page, "DATE", E(nice_date(TODAY).replace(",", "").upper()))

    news = fetch_news()
    if news:
        page = replace_block(page, "NEWS", render_news(news))
        page = replace_block(page, "NEWSTIME", E(f"UPDATED {NOW.strftime('%-I:%M %p')} IST"))
    else:
        print("no fresh news; keeping previous headlines", file=sys.stderr)

    picks = ai_picks(news) or library_picks()
    page = replace_block(page, "TERM", render_term(picks["term"]))
    page = replace_block(page, "PROMPT", render_prompt(picks["prompt"]))
    page = replace_block(page, "QUIZ", render_quiz(picks["quiz"], picks["source"]))

    issues = load_issues()
    page = replace_block(page, "NEWSLETTER", render_archive(issues))
    page = replace_block(page, "NLMORE", render_more(issues))

    versions = asset_versions()
    page = stamp_assets(page, versions)
    page_path.write_text(page, encoding="utf-8")
    priv = ROOT / "privacy.html"
    if priv.exists():
        priv.write_text(stamp_assets(priv.read_text(encoding="utf-8"), versions), encoding="utf-8")
    write_issue_pages(issues)
    write_feed(issues)
    write_sitemap(issues)
    print(f"built {TODAY}: {len(news)} headlines, {len(issues)} newsletter issues, daily picks from {picks['source']}")


if __name__ == "__main__":
    main()

