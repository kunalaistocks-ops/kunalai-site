/* How AI-proof is your job?
   Ten questions about the visitor's own week. Two scores (exposure and readiness),
   one of four types, next steps, and a shareable image card.
   Everything stays in the visitor's browser. Nothing is sent anywhere.
   To change the wording of questions or results, edit the text in Q and TYPES below. */
(function(){
  var box = document.getElementById("scBox");
  if (!box || typeof K_ROLES === "undefined") return;


  // Roles grouped by field. "level" is a starting point for exposure (1 = mostly physical, hands-on
  // or care work; 5 = mostly text, data or routine digital work), informed by the ILO's 2025 Refined
  // Global Index of Occupational Exposure to Generative AI. "maps" links to a role card in Chapter 2.
  var FIELDS = [
    ["Business and management", [
      ["Admin, office or executive assistant", 5, null, "Running inboxes, calendars and documents with AI, and owning the judgement calls."],
      ["Marketing, brand or communications", 4, "Marketing"],
      ["Sales or business development", 3, "Sales"],
      ["HR, people or recruitment", 3, "HR"],
      ["Finance, accounting or audit", 4, "Finance"],
      ["Operations or supply chain", 3, "Operations"],
      ["Customer service or support", 5, "Customer support"],
      ["Consulting or strategy", 4, null, "Using AI for research and first drafts, so your time goes on insight and client trust."],
      ["Founder, business owner or senior leader", 3, "Founders and leaders"]]],
    ["Technology and data", [
      ["Software engineering", 5, "Software"],
      ["Data, analytics or BI", 4, null, "Asking better questions of data, and checking AI-built analysis before anyone acts on it."],
      ["IT support or infrastructure", 4, null, "Automating routine tickets and fixes, while owning security and reliability."],
      ["Product management", 3, null, "Prototyping ideas with AI in hours, then spending the time saved with customers."],
      ["UX or product design", 3, null, "Exploring more options faster with AI, while owning the research and the final call."]]],
    ["Creative and media", [
      ["Writing, content or journalism", 4, "Content and creative"],
      ["Design, film, photography or visual art", 4, "Content and creative"],
      ["Media, advertising or entertainment", 3, null, "Testing more ideas and formats with AI, while protecting the IP, talent and taste that set you apart."]]],
    ["Professional and financial services", [
      ["Law, compliance or risk", 4, "Legal and compliance"],
      ["Banking, insurance or investment", 4, null, "Using AI for research, reporting and client prep, with rigorous checks on every number."]]],
    ["Health and care", [
      ["Doctor or clinician", 2, null, "Using AI for notes, summaries and second opinions, while keeping clinical judgement and the patient relationship."],
      ["Nursing, therapy or allied health", 1, null, "Letting AI handle paperwork and scheduling, so more of your time goes to patients."],
      ["Pharma, biotech or life sciences", 3, null, "Speeding up literature review, documentation and analysis with AI, with strict validation."],
      ["Social work, counselling or care", 1, null, "Cutting admin and reporting with AI, so you can spend more time with the people you support."]]],
    ["Education and research", [
      ["School teaching", 2, null, "Using AI to plan lessons, adapt material and give faster feedback, while you focus on your students."],
      ["Higher education or research", 3, null, "Speeding up reading, analysis and drafting with AI, while guarding the rigour of your work."],
      ["Training, coaching or L&D", 3, null, "Building AI-powered practice and personalised learning paths for the people you train."]]],
    ["Public and social sector", [
      ["Government or public administration", 3, null, "Drafting, summarising and serving citizens faster with AI, within clear rules on data and fairness."],
      ["NGO, development or social impact", 2, null, "Stretching small teams with AI: grant writing, reporting and translation into local languages."]]],
    ["Hands-on, technical and frontline", [
      ["Engineering: civil, mechanical or electrical", 2, null, "Using AI for calculations, documentation and design options, while owning safety and sign-off."],
      ["Manufacturing or production", 2, null, "Understanding how AI-driven quality checks and predictive maintenance work on your line."],
      ["Skilled trade or technician", 1, null, "Using AI on your phone for manuals, diagnostics and quotes. Your hands-on skill stays in demand."],
      ["Retail or store operations", 2, null, "Using AI for stock, staffing and customer insight, while you own the in-store experience."],
      ["Hospitality, travel or events", 2, null, "Using AI for bookings, guest messages and planning, so you can focus on the experience on the day."],
      ["Logistics, delivery or transport", 2, null, "Understanding AI route planning and tracking, and handling the exceptions it can't."],
      ["Construction or real estate", 2, null, "Using AI for listings, documents and estimates, while you own the site, the deal and the relationship."],
      ["Agriculture or agribusiness", 1, null, "Using AI tools for weather, crop and price advice in your own language."]]],
    ["Not in a job right now", [
      ["Student", null, null, "Using AI as a daily tutor and collaborator, while building deep skills in a field you love."],
      ["Between jobs or on a career break", null, null, "Using AI to learn a new skill and sharpen your applications, one small project at a time."],
      ["Something else", null, null, null]]]
  ];
  var ROLES = [];
  FIELDS.forEach(function (f, gi) { f[1].forEach(function (r) {
    var card = r[2] ? K_ROLES.filter(function (k) { return k.name === r[2]; })[0] : null;
    ROLES.push({ name: r[0], level: r[1], group: gi, card: card || null, next: r[3] || (card ? card.next : null) });
  }); });

  var SCALE = ["Very little", "About a quarter", "About half", "Most of it"];
  // kind: "role" picks a role; "exp" adds to exposure; "expr" is reverse (more = less exposure); "ready" adds to readiness
  var Q = [
    { kind: "role", text: "First, what kind of work do you do?" },
    { kind: "exp", text: "How much of your week goes on writing and drafting? Emails, reports, notes, posts, documents.", opts: SCALE },
    { kind: "exp", text: "How much of your week goes on data, numbers, records and reporting?", opts: SCALE },
    { kind: "exp", text: "How much of your work follows a repeatable process or template?", opts: SCALE },
    { kind: "expr", text: "How much of your day is face to face or hands-on? Customers, patients, students, your team, sites, equipment.", opts: SCALE },
    { kind: "expr", text: "How often do you make the final call on decisions with real consequences?", opts: ["Rarely", "Sometimes", "Often", "Most days"] },
    { kind: "ready", w: 0.35, text: "How often do you use AI tools at work?", opts: ["Never", "Tried it once or twice", "Every week", "Every day"] },
    { kind: "ready", w: 0.25, text: "When AI gives you an answer, what do you usually do?", opts: ["I don't use AI yet", "Use it as it is", "Edit it lightly", "Check the facts and rework it"] },
    { kind: "ready", w: 0.30, text: "Have you built any repeatable AI habits? Saved prompts, templates, automations.", opts: ["Not yet", "Thinking about it", "One or two", "Several"] },
    { kind: "ready", w: 0.10, text: "How do you feel about AI and your career?", opts: ["Worried", "Unsure", "Curious", "Excited"] }
  ];

  var TYPES = {
    operator: {
      name: "Quiet Operator",
      line: "Your work is in AI's path, and you're already using it well. You're the person your team will copy.",
      moves: ["Turn your best prompts into templates your whole team can reuse.",
              "Pick one weekly process and automate it end to end.",
              "Teach two colleagues what works for you this month. Your edge grows when theirs does."],
      track: "leader"
    },
    next: {
      name: "Next in Line",
      line: "A big share of your week is the kind of work AI is getting good at. The good news: the fix is a habit, not a degree.",
      moves: ["Use AI on three real tasks every day for the next 30 days.",
              "Learn to brief AI like you'd brief a good agency: context, goal and an example.",
              "Move more of your time toward what AI can't do: judgement, relationships and decisions."],
      track: "pro"
    },
    multiplier: {
      name: "Multiplier",
      line: "Your core work is hard to automate, and you know how to use AI. That combination scales you.",
      moves: ["Hand AI the admin around your core work: notes, follow-ups, first drafts.",
              "Use AI as a sparring partner before big decisions. Ask it to argue the other side.",
              "Help your team catch up. A team of multipliers outruns everyone."],
      track: "leader"
    },
    bystander: {
      name: "Comfortable Bystander",
      line: "AI isn't knocking on your door yet, and you haven't opened it. Safe for now, but the gap widens quietly.",
      moves: ["Try one AI tool this week on something you already do.",
              "Read one practical AI newsletter every week. What the AI!? is a good place to start.",
              "Ask who in your team uses AI best, and spend 20 minutes learning from them."],
      track: "pro"
    }
  };

  var KEY = "km_score";
  var answers = [], step = 0;

  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function load() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} }

  var openGroup = null;

  function compute() {
    var role = ROLES[answers[0]];
    var task = 0, taskMax = 0, ready = 0;
    Q.forEach(function (q, i) {
      var a = answers[i];
      if (q.kind === "exp") { task += a; taskMax += 3; }
      if (q.kind === "expr") { task += 3 - a; taskMax += 3; }
      if (q.kind === "ready") { ready += q.w * (a / 3); }
    });
    var taskPct = taskMax ? task / taskMax : 0;
    var exposure = role && role.level ? 0.3 * ((role.level - 1) / 4) + 0.7 * taskPct : taskPct;
    exposure = Math.round(Math.max(3, Math.min(97, exposure * 100)));
    var readiness = Math.round(Math.max(3, Math.min(97, ready * 100)));
    var key = exposure >= 50 ? (readiness >= 50 ? "operator" : "next") : (readiness >= 50 ? "multiplier" : "bystander");
    return { exposure: exposure, readiness: readiness, type: key, role: role.name, date: new Date().toISOString().slice(0, 10) };
  }

  function intro() {
    var last = load();
    box.innerHTML =
      '<div class="sc-intro">' +
      '<div class="sc-intro-l"><p class="s59">10 QUESTIONS · 2 MINUTES · PRIVATE</p>' +
      '<p class="sc-big">Find out how much of your work AI could take on, and how ready you are for it.</p>' +
      '<p class="sc-small">For every kind of work: office, creative, health, education, public sector, hands-on and frontline, students too. You get two scores, your AI type and next moves. Your answers stay in your browser.</p>' +
      '<button type="button" class="sc-go" data-sc="start">' + (last ? "Take it again" : "Start the check") + ' →</button>' +
      '<details class="sc-how"><summary>How the scoring works</summary>' +
      '<p><b>AI exposure</b> combines a starting point for your field (30%) with how you actually spend your week (70%). ' +
      'Writing, data and repeatable work raise it. Face-to-face, hands-on work and making final calls lower it. ' +
      'Field starting points draw on the ILO\'s 2025 global index of occupational exposure to generative AI, which found clerical and highly digital work most exposed, ' +
      'and physical and care work far less. Students and people between jobs are scored on their answers alone.</p>' +
      '<p><b>AI readiness</b> combines how often you use AI (35%), whether you\'ve built repeatable habits (30%), whether you check its work (25%) and how you feel about it (10%).</p>' +
      '<p>Exposure means your work is likely to change, not that your job will disappear. <a href="https://www.ilo.org/node/706766" target="_blank" rel="noopener">Read the ILO research ↗</a></p></details></div>' +
      '<div class="sc-sample"><p class="s59">YOU GET A CARD LIKE THIS TO SHARE</p>' +
      '<div class="sc-card-wrap"><canvas id="scSample" width="1080" height="1350" role="img" aria-label="Sample result card: Quiet Operator, exposure 68, readiness 74"></canvas></div>' +
      '<p class="sc-types-line">Four types: <b>Quiet Operator</b>, <b>Next in Line</b>, <b>Multiplier</b> and <b>Comfortable Bystander</b>.</p></div></div>' +
      (last ? '<p class="sc-last">Your last result: <b>' + esc(TYPES[last.type].name) + '</b>, exposure ' + last.exposure + ', readiness ' + last.readiness + '. <button type="button" class="sc-link" data-sc="show">See it again</button></p>' : "");
  }

  function introCard() { drawCard({ exposure: 68, readiness: 74, type: "operator", role: "Marketing, brand or communications" }, "scSample", true); }

  function question() {
    var q = Q[step], opts = q.opts || [];
    var pct = Math.round(100 * step / Q.length);
    box.innerHTML =
      '<div class="sc-q">' +
      '<div class="sc-prog"><span style="width:' + pct + '%"></span></div>' +
      '<p class="s59">QUESTION ' + (step + 1) + ' OF ' + Q.length + (q.kind === "ready" ? " · YOUR AI HABITS" : q.kind === "role" ? "" : " · YOUR WEEK") + '</p>' +
      '<h3 class="sc-qt" tabindex="-1">' + esc(q.text) + '</h3>' +
      (q.kind === "role" ? rolePicker() :
      '<div class="sc-opts">' + opts.map(function (o, i) {
        return '<button type="button" class="sc-opt' + (answers[step] === i ? " picked" : "") + '" data-opt="' + i + '">' + esc(o) + '</button>';
      }).join("") + '</div>') +
      (step > 0 ? '<button type="button" class="sc-link" data-sc="back">← Back</button>' : "") +
      '</div>';
    var h = box.querySelector(".sc-qt"); if (h && document.activeElement && box.contains(document.activeElement)) h.focus();
  }

  function rolePicker() {
    if (openGroup === null && answers[0] !== undefined) openGroup = ROLES[answers[0]].group;
    return '<div class="sc-fields">' + FIELDS.map(function (f, gi) {
      var open = openGroup === gi;
      return '<div class="sc-field' + (open ? " open" : "") + '">' +
        '<button type="button" class="sc-fbtn" data-group="' + gi + '" aria-expanded="' + open + '">' + esc(f[0]) + '<span aria-hidden="true">' + (open ? "−" : "+") + '</span></button>' +
        (open ? '<div class="sc-opts sc-opts-role">' + ROLES.map(function (r, i) {
          return r.group === gi ? '<button type="button" class="sc-opt' + (answers[0] === i ? " picked" : "") + '" data-opt="' + i + '">' + esc(r.name) + '</button>' : "";
        }).join("") + '</div>' : "") + '</div>';
    }).join("") + '</div>';
  }

  function meter(label, v, note) {
    return '<div class="sc-meter"><p class="s59">' + label + '</p><p class="sc-num">' + v + '<small>/100</small></p>' +
      '<div class="sc-bar"><span style="width:' + v + '%"></span></div><p class="sc-note">' + note + '</p></div>';
  }

  function result(r, fresh) {
    var t = TYPES[r.type];
    var role = ROLES.filter(function (x) { return x.name === r.role; })[0];
    var moves = t.moves.slice();
    if (role && role.next) moves.push("Your next skill: " + role.next.charAt(0).toLowerCase() + role.next.slice(1));
    var shareText = "I'm a " + t.name + ": " + r.exposure + " AI exposure, " + r.readiness + " readiness. How AI-proof is your job? Take the 2-minute check at kunalai.in";
    var url = "https://kunalai.in/#score";
    box.innerHTML =
      '<div class="sc-res sc-t-' + r.type + '">' +
      '<div class="sc-res-head"><p class="s59">YOUR AI TYPE' + (r.role && r.role !== "Something else" ? " · " + esc(r.role.toUpperCase()) : "") + '</p>' +
      '<h3 class="sc-res-name" tabindex="-1">' + t.name + '</h3><p class="sc-res-line">' + esc(t.line) + '</p></div>' +
      '<div class="sc-meters">' +
      meter("AI EXPOSURE", r.exposure, "How much of your work AI could take on.") +
      meter("AI READINESS", r.readiness, "How ready you are to make the most of it.") +
      '</div>' +
      '<div class="sc-moves"><p class="s59">YOUR NEXT MOVES</p><ol>' + moves.map(function (m) { return "<li>" + esc(m) + "</li>"; }).join("") + '</ol>' +
      '<div class="sc-actions"><button type="button" class="sc-go" data-sc="path">Start your learning path →</button>' +
      (role && role.card ? '<button type="button" class="sc-ghost" data-sc="role">See your role in detail</button>' : "") + '</div></div>' +
      '<div class="sc-share"><div class="sc-share-card"><div class="sc-card-wrap"><canvas id="scCanvas" width="1080" height="1350" role="img" aria-label="Your result card: ' + esc(t.name) + ', exposure ' + r.exposure + ', readiness ' + r.readiness + '"></canvas></div></div>' +
      '<div class="sc-share-side"><p class="s59">SHARE YOUR RESULT</p><p class="sc-share-h">Post your card. See what your network gets.</p>' +
      '<div class="sc-share-btns">' +
      '<button type="button" class="sc-go" data-sc="download">Download image</button>' +
      '<button type="button" class="sc-ghost" data-sc="copy">Copy caption</button>' +
      '<a class="sc-ghost" target="_blank" rel="noopener" href="https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url) + '">LinkedIn</a>' +
      '<a class="sc-ghost" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(shareText + " " + url) + '">WhatsApp</a>' +
      '<a class="sc-ghost" target="_blank" rel="noopener" href="https://x.com/intent/post?text=' + encodeURIComponent(shareText) + '&url=' + encodeURIComponent(url) + '">X</a>' +
      '</div><ol class="sc-steps"><li>Download your card.</li><li>Copy the caption.</li><li>On LinkedIn, start a post, paste the caption and add the image.</li></ol>' +
      '<p class="sc-small sc-copied" aria-live="polite"></p></div></div>' +
      '<p class="sc-foot">These scores are a quick guide based on your answers, not a forecast. <button type="button" class="sc-link" data-sc="start">Take it again</button></p>' +
      '</div>';
    box._share = shareText;
    box._r = r;
    drawCard(r);
    if (fresh) {
      var h = box.querySelector(".sc-res-name"); if (h) h.focus();
      if (window.kmBadge) window.kmBadge("scored");
    }
  }

  // ---------- share image (1080 x 1350, LinkedIn's 4:5 feed format) ----------
  var TCOL = { operator: ["#D9FF3F", "#101114"], next: ["#FF7A2F", "#101114"], multiplier: ["#FFFFFF", "#2B3BFF"], bystander: ["#101114", "#FFFFFF"] };
  function wrap(ctx, text, x, y, maxW, lh, maxLines) {
    var words = String(text).split(" "), line = "", lines = [];
    words.forEach(function (w) { var t = line ? line + " " + w : w; if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else { line = t; } });
    if (line) lines.push(line);
    if (maxLines && lines.length > maxLines) { lines = lines.slice(0, maxLines); lines[maxLines - 1] = lines[maxLines - 1].replace(/\s+\S*$/, "") + "..."; }
    lines.forEach(function (l, i) { ctx.fillText(l, x, y + i * lh); });
    return lines.length;
  }
  function rrect(x, X, Y, W, H, R) { x.beginPath(); x.moveTo(X + R, Y); x.arcTo(X + W, Y, X + W, Y + H, R); x.arcTo(X + W, Y + H, X, Y + H, R); x.arcTo(X, Y + H, X, Y, R); x.arcTo(X, Y, X + W, Y, R); x.closePath(); }
  function paintCard(c, r, sample) {
    var t = TYPES[r.type], col = TCOL[r.type], x = c.getContext("2d"), W = 1080, H = 1350, M = 72;
    x.clearRect(0, 0, W, H);
    // background and grid
    x.fillStyle = "#2B3BFF"; x.fillRect(0, 0, W, H);
    x.strokeStyle = "rgba(255,255,255,0.07)"; x.lineWidth = 1;
    for (var g = 0; g <= W; g += 40) { x.beginPath(); x.moveTo(g, 0); x.lineTo(g, H); x.stroke(); }
    for (g = 0; g <= H; g += 40) { x.beginPath(); x.moveTo(0, g); x.lineTo(W, g); x.stroke(); }
    // header
    x.fillStyle = "#D9FF3F"; x.beginPath(); x.arc(M + 10, 92, 10, 0, 7); x.fill();
    x.font = "500 26px 'JetBrains Mono', monospace"; x.textBaseline = "alphabetic";
    x.fillText("MY AI SCORE · KUNALAI.IN", M + 34, 101);
    if (sample) {
      x.font = "700 22px 'JetBrains Mono', monospace"; var sw = x.measureText("SAMPLE").width + 36;
      x.fillStyle = "#FF7A2F"; rrect(x, W - M - sw, 66, sw, 50, 25); x.fill(); x.strokeStyle = "#101114"; x.lineWidth = 3; x.stroke();
      x.fillStyle = "#101114"; x.fillText("SAMPLE", W - M - sw + 18, 100);
    }
    // role pill
    if (r.role && r.role !== "Something else") {
      x.font = "500 24px 'JetBrains Mono', monospace";
      var role = r.role.toUpperCase(); while (x.measureText(role).width > W - 2 * M - 60 && role.length > 10) role = role.slice(0, -2);
      if (role !== r.role.toUpperCase()) role = role.replace(/\s*\S*$/, "") + "...";
      var pw = x.measureText(role).width + 44;
      x.strokeStyle = "rgba(255,255,255,0.9)"; x.lineWidth = 2; rrect(x, M, 140, pw, 52, 26); x.stroke();
      x.fillStyle = "#FFFFFF"; x.fillText(role, M + 22, 175);
    }
    // "I'm a" + type name
    x.fillStyle = "#FFFFFF"; x.font = "800 72px 'Bricolage Grotesque', sans-serif"; x.fillText("I'm a", M, 300);
    var size = t.name.length > 18 ? 92 : t.name.length > 13 ? 110 : 124;
    x.font = "800 " + size + "px 'Bricolage Grotesque', sans-serif";
    var nw = Math.min(x.measureText(t.name).width, W - 2 * M - 40), bh = size * 1.22;
    x.save(); x.translate(M, 330); x.rotate(-0.022);
    x.fillStyle = "#101114"; x.fillRect(12, 12, nw + 48, bh);
    x.fillStyle = col[0]; x.fillRect(0, 0, nw + 48, bh);
    x.strokeStyle = "#101114"; x.lineWidth = 4; x.strokeRect(0, 0, nw + 48, bh);
    x.fillStyle = col[1]; x.fillText(t.name, 24, bh * 0.78, W - 2 * M - 40);
    x.restore();
    // score cards (left) and type map (right)
    var top = 560, colW = 440, gap = W - 2 * M - 2 * colW;
    [["AI EXPOSURE", r.exposure, "How much of my work AI could take on"], ["AI READINESS", r.readiness, "How ready I am to make the most of it"]].forEach(function (m, i) {
      var y = top + i * 210;
      x.fillStyle = "#101114"; x.fillRect(M + 8, y + 8, colW, 190);
      x.fillStyle = "#FFFFFF"; x.fillRect(M, y, colW, 190);
      x.strokeStyle = "#101114"; x.lineWidth = 4; x.strokeRect(M, y, colW, 190);
      x.fillStyle = "#2B3BFF"; x.font = "500 22px 'JetBrains Mono', monospace"; x.fillText(m[0], M + 28, y + 44);
      x.fillStyle = "#101114"; x.font = "800 96px 'Bricolage Grotesque', sans-serif"; x.fillText(String(m[1]), M + 24, y + 140);
      var nwid = x.measureText(String(m[1])).width;
      x.fillStyle = "#5B5C62"; x.font = "600 28px 'Hanken Grotesk', sans-serif"; x.fillText("/100", M + 32 + nwid, y + 140);
      x.fillStyle = "#DADAD4"; x.fillRect(M + 28, y + 160, colW - 56, 12);
      x.fillStyle = "#2B3BFF"; x.fillRect(M + 28, y + 160, (colW - 56) * m[1] / 100, 12);
    });
    // map: x = readiness, y = exposure
    var mx = M + colW + gap, my = top, ms = colW - 20, cell = ms / 2;
    var cells = [["next", "NEXT IN LINE", 0, 0], ["operator", "QUIET OPERATOR", 1, 0], ["bystander", "BYSTANDER", 0, 1], ["multiplier", "MULTIPLIER", 1, 1]];
    x.fillStyle = "#101114"; x.fillRect(mx + 28, my + 8, ms, ms);
    cells.forEach(function (cl) {
      var cx = mx + 20 + cl[2] * cell, cy = my + cl[3] * cell, on = cl[0] === r.type;
      x.fillStyle = on ? TCOL[cl[0]][0] : "rgba(255,255,255,0.92)"; x.fillRect(cx, cy, cell, cell);
      x.fillStyle = on ? TCOL[cl[0]][1] : "#5B5C62"; x.font = (on ? "700 " : "500 ") + "17px 'JetBrains Mono', monospace";
      x.fillText(cl[1], cx + 14, cy + 30, cell - 24);
    });
    x.strokeStyle = "#101114"; x.lineWidth = 4; x.strokeRect(mx + 20, my, ms, ms);
    x.beginPath(); x.moveTo(mx + 20 + cell, my); x.lineTo(mx + 20 + cell, my + ms); x.moveTo(mx + 20, my + cell); x.lineTo(mx + 20 + ms, my + cell); x.lineWidth = 2; x.stroke();
    var dx = mx + 20 + ms * r.readiness / 100, dy = my + ms * (1 - r.exposure / 100);
    dx = Math.max(mx + 46, Math.min(mx + 20 + ms - 26, dx)); dy = Math.max(my + 78, Math.min(my + ms - 28, dy)); if (dy > my + cell - 30 && dy < my + cell + 52) dy = dy < my + cell + 11 ? my + cell - 30 : my + cell + 52;
    x.fillStyle = "#101114"; x.beginPath(); x.arc(dx + 3, dy + 3, 22, 0, 7); x.fill();
    x.fillStyle = r.type === "next" ? "#FFFFFF" : "#FF7A2F"; x.beginPath(); x.arc(dx, dy, 22, 0, 7); x.fill();
    x.strokeStyle = "#101114"; x.lineWidth = 4; x.stroke();
    x.fillStyle = "#101114"; x.font = "800 15px 'JetBrains Mono', monospace"; x.textAlign = "center"; x.fillText("ME", dx, dy + 5); x.textAlign = "left";
    x.fillStyle = "#FFFFFF"; x.font = "500 18px 'JetBrains Mono', monospace";
    x.fillText("READINESS →", mx + 20, my + ms + 34);
    x.save(); x.translate(mx + 4, my + ms); x.rotate(-Math.PI / 2); x.fillText("EXPOSURE →", 0, 0); x.restore();
    // verdict
    x.fillStyle = "#FFFFFF"; x.font = "600 36px 'Hanken Grotesk', sans-serif";
    wrap(x, t.line, M, 1052, W - 2 * M, 48, 3);
    // footer
    x.fillStyle = "#101114"; x.fillRect(0, H - 150, W, 150);
    x.fillStyle = "#D9FF3F"; x.font = "800 50px 'Bricolage Grotesque', sans-serif"; x.fillText("How AI-proof is your job?", M, H - 82);
    x.fillStyle = "#FFFFFF"; x.font = "500 24px 'JetBrains Mono', monospace"; x.fillText("TAKE THE 2-MINUTE CHECK  →  KUNALAI.IN", M, H - 40);
  }
  function drawCard(r, id, sample) {
    var c = document.getElementById(id || "scCanvas"); if (!c || !c.getContext) return;
    var go = function () { paintCard(c, r, sample); };
    go();
    if (document.fonts && document.fonts.load) {
      Promise.all([document.fonts.load("800 72px 'Bricolage Grotesque'"), document.fonts.load("500 26px 'JetBrains Mono'"), document.fonts.load("600 36px 'Hanken Grotesk'")]).then(go, go);
    }
  }

  // ---------- events ----------
  box.addEventListener("click", function (e) {
    var g = e.target.closest("[data-group]");
    if (g) { var gi = +g.getAttribute("data-group"); openGroup = openGroup === gi ? -1 : gi; question();
      var o = box.querySelector(".sc-field.open .sc-opt"); if (o) o.focus(); return; }
    var b = e.target.closest("[data-sc],[data-opt]"); if (!b) return;
    if (b.hasAttribute("data-opt")) {
      answers[step] = +b.getAttribute("data-opt");
      if (step < Q.length - 1) { step++; question(); }
      else { var r = compute(); save(r); result(r, true); }
      return;
    }
    var a = b.getAttribute("data-sc");
    if (a === "start") { answers = []; step = 0; openGroup = null; question(); box.querySelector(".sc-qt").focus(); }
    if (a === "back") { step = Math.max(0, step - 1); question(); }
    if (a === "show") { var l = load(); if (l && TYPES[l.type]) result(l, false); }
    if (a === "path") {
      var trk = box._r.role === "Student" ? "student" : (box._r.role === "Founder, business owner or senior leader" ? "leader" : TYPES[box._r.type].track);
      var tb = document.querySelector('button[data-k="track"][data-v="' + trk + '"]'); if (tb) tb.click();
      var st = document.getElementById("study"); if (st) st.scrollIntoView({ behavior: "smooth" });
    }
    if (a === "role") {
      var rr = ROLES.filter(function (x) { return x.name === box._r.role; })[0];
      var rb = rr && rr.card ? document.querySelector('button[data-k="role"][data-v="' + rr.card.name.replace(/"/g, '\\"') + '"]') : null; if (rb) rb.click();
      var jb = document.getElementById("jobs"); if (jb) jb.scrollIntoView({ behavior: "smooth" });
    }
    if (a === "download") {
      var c = document.getElementById("scCanvas");
      try {
        var link = document.createElement("a");
        link.download = "my-ai-score-kunalai.png"; link.href = c.toDataURL("image/png");
        document.body.appendChild(link); link.click(); link.remove();
      } catch (err) { box.querySelector(".sc-copied").textContent = "Couldn't download. Long-press or right-click the image to save it."; }
    }
    if (a === "copy") {
      var note = box.querySelector(".sc-copied"), txt = box._share + " https://kunalai.in/#score";
      var ok = function () { note.textContent = "Caption copied. Paste it with your image."; };
      if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(txt).then(ok, function () { window.prompt("Copy this caption:", txt); }); }
      else { window.prompt("Copy this caption:", txt); }
    }
  });

  intro(); introCard();
})();
