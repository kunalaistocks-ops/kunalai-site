/* The Human Line Check (kunalai.in/check/)
   10 marketing tasks, each answered a) AI on its own, b) AI drafts, a person decides, c) People only.
   1 point per answer that matches the recommended zone. Results shown on screen, and emailed via the
   Google Sheet web app in content.js (SITE.sheet). Task wording and scores come from the Channel Playbook. */
(function () {
  var box = document.getElementById("ck");
  if (!box) return;

  var ANSWERS = [
    ["a", "AI does it on its own"],
    ["b", "AI drafts, a person decides"],
    ["c", "People only"]
  ];
  // [task, score, recommendation, matching answer, zone]
  var TASKS = [
    ["Summarising an internal meeting", "0", "Hand off", "a", "hand"],
    ["Resizing and reformatting campaign assets", "1", "Hand off", "a", "hand"],
    ["First-pass competitor research", "2", "Hand off", "a", "hand"],
    ["Drafting social caption variants", "3 + override", "Hand off to draft; approve before publishing", "b", "hand"],
    ["Writing the campaign brief", "6", "Team up", "b", "team"],
    ["A campaign concept for a launch", "6", "Team up", "b", "team"],
    ["Notes from a board or leadership meeting", "4", "Team up", "b", "team"],
    ["Shortlisting agencies", "6 + override", "Team up; final pick is human", "b", "team"],
    ["Replying to an upset key client", "7", "Hold", "c", "hold"],
    ["Writing performance reviews", "9", "Hold", "c", "hold"]
  ];
  var PROFILES = {
    drawn: { name: "Line drawn", range: "8 to 10", text: "Your team already splits work well.", fix: "Write your split down, so new hires follow the same line." },
    drifting: { name: "Line drifting", range: "5 to 7", text: "Some tasks sit on the wrong side of the line.", fix: "Move the two biggest mismatches this week." },
    none: { name: "No line yet", range: "0 to 4", text: "AI is being used by habit, not by design.", fix: "Run the full Human Line on 20 of your team's tasks." }
  };
  var ROLES = ["Head of marketing or brand", "Marketing or brand manager", "Agency", "Founder or business owner", "Other"];
  var SIZES = ["Just me", "2 to 5", "6 to 15", "16 to 40", "More than 40"];
  var SHEET = (typeof SITE !== "undefined" && SITE.sheet) ? SITE.sheet : "";
  var answers = [];

  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  function questions() {
    box.innerHTML =
      '<p class="ck-how">For each task, ask: <b>How does your team do this today?</b></p>' +
      '<ol class="ck-list">' + TASKS.map(function (t, i) {
        return '<li class="ck-item" data-i="' + i + '"><p class="ck-task"><span>' + String(i + 1).padStart(2, "0") + '</span>' + esc(t[0]) + '</p>' +
          '<div class="ck-opts" role="radiogroup" aria-label="' + esc(t[0]) + '">' + ANSWERS.map(function (a) {
            return '<button type="button" role="radio" aria-checked="false" data-a="' + a[0] + '"><b>' + a[0] + ')</b> ' + esc(a[1]) + '</button>';
          }).join("") + '</div></li>';
      }).join("") + '</ol>' +
      '<div class="ck-foot"><p class="ck-progress" aria-live="polite">0 of 10 answered</p>' +
      '<button type="button" class="hl-btn ck-go" data-ck="gate" disabled>See my results →</button></div>';
  }

  function score() {
    var pts = 0, over = [], under = [], misses = [];
    TASKS.forEach(function (t, i) {
      var a = answers[i];
      if (a === t[3]) { pts++; return; }
      misses.push(i);
      if (a === "a" && (t[4] === "team" || t[4] === "hold")) over.push(i);
      if (a === "c" && t[4] === "hand") under.push(i);
    });
    var key = pts >= 8 ? "drawn" : pts >= 5 ? "drifting" : "none";
    // three fixes: the profile fix, then the biggest mismatches (over-delegation first, riskiest first)
    var order = over.slice().sort(function (x, y) { return parseInt(TASKS[y][1], 10) - parseInt(TASKS[x][1], 10); })
      .concat(under).concat(misses.filter(function (i) { return over.indexOf(i) < 0 && under.indexOf(i) < 0; }));
    var fixes = [PROFILES[key].fix];
    order.forEach(function (i) {
      if (fixes.length >= 3) return;
      var t = TASKS[i];
      fixes.push("Move \"" + t[0] + "\" to " + t[2] + " (score " + t[1] + ").");
    });
    if (fixes.length < 3) fixes.push("Score ten more of your team's weekly tasks and check them against the line.");
    if (fixes.length < 3) fixes.push("Share The Human Line with your team so everyone draws it the same way.");
    return { points: pts, key: key, over: over, under: under, fixes: fixes.slice(0, 3) };
  }

  function gate() {
    box.innerHTML =
      '<div class="ck-gate">' +
      '<p class="s14">ALMOST THERE</p>' +
      '<h2 class="ck-h">Where should we send your Line profile and three fixes?</h2>' +
      '<form data-ck-form novalidate>' +
      '<label for="ckEmail">Work email</label><input id="ckEmail" class="sc-input" type="email" autocomplete="email" placeholder="you@company.com" required>' +
      '<label for="ckRole">Your role</label><select id="ckRole" class="sc-input">' + ROLES.map(function (r) { return '<option>' + r + '</option>'; }).join("") + '</select>' +
      '<label for="ckSize">Team size</label><select id="ckSize" class="sc-input">' + SIZES.map(function (r) { return '<option>' + r + '</option>'; }).join("") + '</select>' +
      '<input type="text" name="website" class="sc-trap" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '<button type="submit" class="hl-btn">Show and email my results →</button>' +
      '<p class="ck-fine">Used only to send your results. Never shared, never sold. <a href="/privacy.html">Privacy</a></p>' +
      '<p class="ck-msg" aria-live="polite"></p></form>' +
      '<button type="button" class="ck-back" data-ck="back">← Change my answers</button></div>';
    var em = box.querySelector("#ckEmail"); if (em) em.focus();
  }

  function results(r, emailed) {
    var p = PROFILES[r.key];
    var list = function (ids) { return ids.length ? '<ul>' + ids.map(function (i) { return '<li>' + esc(TASKS[i][0]) + ' <span>(' + esc(TASKS[i][2]) + ', score ' + esc(TASKS[i][1]) + ')</span></li>'; }).join("") + '</ul>' : '<p class="ck-none">None. Nicely done.</p>'; };
    box.innerHTML =
      '<div class="ck-res ck-' + r.key + '">' +
      '<div class="ck-res-head"><p class="s14">YOUR TEAM\'S LINE PROFILE</p>' +
      '<h2 class="ck-res-name">' + p.name + '</h2>' +
      '<p class="ck-res-score"><b>' + r.points + '</b> / 10 tasks on the right side of the line</p>' +
      '<p class="ck-res-text">' + p.text + '</p></div>' +
      '<div class="ck-cols">' +
      '<div class="ck-col ck-risk"><p class="ck-lab">OVER-DELEGATING (RISK)</p><p class="ck-sub">AI does these on its own, but they need a person.</p>' + list(r.over) + '</div>' +
      '<div class="ck-col"><p class="ck-lab">UNDER-DELEGATING (LOST TIME)</p><p class="ck-sub">People do these by hand, but AI could.</p>' + list(r.under) + '</div>' +
      '</div>' +
      '<div class="ck-fixes"><p class="ck-lab">YOUR THREE FIXES</p><ol>' + r.fixes.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join("") + '</ol></div>' +
      '<div class="ck-next">' + (emailed ? '<p class="ck-sent">We\'ve emailed this to you. Check your inbox in a minute.</p>' : '') +
      '<a class="hl-btn" href="/the-human-line/">Read the full method →</a>' +
      '<a class="ck-sub-btn" data-subscribe href="https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=7396425243105329152" target="_blank" rel="noopener">Get What the AI!? free every Saturday ↗</a>' +
      '<button type="button" class="ck-back" data-ck="restart">Take it again</button></div>' +
      '</div>';
    if (typeof SITE !== "undefined" && SITE.substack) box.querySelectorAll("[data-subscribe]").forEach(function (a) { a.href = SITE.substack.replace(/\/$/, "") + "/subscribe"; });
    box.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  box.addEventListener("click", function (e) {
    var b = e.target.closest("[data-a]");
    if (b) {
      var li = b.closest(".ck-item"), i = +li.getAttribute("data-i");
      answers[i] = b.getAttribute("data-a");
      li.querySelectorAll("[data-a]").forEach(function (x) { x.setAttribute("aria-checked", x === b ? "true" : "false"); });
      li.classList.add("done");
      var n = answers.filter(Boolean).length;
      box.querySelector(".ck-progress").textContent = n + " of 10 answered";
      box.querySelector(".ck-go").disabled = n < 10;
      var next = box.querySelector('.ck-item[data-i="' + (i + 1) + '"]');
      if (next && !next.classList.contains("done") && window.innerWidth < 900) next.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    var c = e.target.closest("[data-ck]"); if (!c) return;
    var act = c.getAttribute("data-ck");
    if (act === "gate") gate();
    if (act === "back") { var keep = answers.slice(); questions(); keep.forEach(function (a, i) { var btn = box.querySelector('.ck-item[data-i="' + i + '"] [data-a="' + a + '"]'); if (btn) btn.click(); }); }
    if (act === "restart") { answers = []; questions(); box.scrollIntoView({ behavior: "smooth" }); }
  });

  box.addEventListener("submit", function (e) {
    if (!e.target.hasAttribute("data-ck-form")) return;
    e.preventDefault();
    var f = e.target, msg = f.querySelector(".ck-msg"), email = f.querySelector("#ckEmail").value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { msg.textContent = "Please check your email address."; f.querySelector("#ckEmail").focus(); return; }
    var r = score();
    var btn = f.querySelector("button[type=submit]"); btn.disabled = true; btn.textContent = "One moment...";
    var payload = {
      kind: "check", website: f.querySelector(".sc-trap").value, email: email,
      role: f.querySelector("#ckRole").value, teamSize: f.querySelector("#ckSize").value,
      points: r.points, profile: PROFILES[r.key].name, profileText: PROFILES[r.key].text,
      over: r.over.map(function (i) { return TASKS[i][0] + " (" + TASKS[i][2] + ")"; }),
      under: r.under.map(function (i) { return TASKS[i][0] + " (" + TASKS[i][2] + ")"; }),
      fixes: r.fixes, answers: answers.join("")
    };
    if (!SHEET) { results(r, false); return; }
    fetch(SHEET, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) })
      .then(function () { results(r, true); }, function () { results(r, false); });
  });

  questions();
})();
