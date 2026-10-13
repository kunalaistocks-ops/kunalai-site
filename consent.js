/* Cookie notice and LinkedIn Insight Tag.
   The tag only loads after a visitor clicks Accept. Nothing loads if SITE.linkedinPartnerId is empty.
   The choice is remembered in the visitor's browser; "Cookie settings" in the footer lets them change it. */
(function () {
  var S = (typeof SITE !== "undefined") ? SITE : {};
  var PID = String(S.linkedinPartnerId || "").replace(/\D/g, "");
  var KEY = "km_consent";
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  var loaded = false;

  function loadTag() {
    if (loaded || !PID) return; loaded = true;
    window._linkedin_partner_id = PID;
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(PID);
    if (!window.lintrk) {
      window.lintrk = function (a, b) { window.lintrk.q.push([a, b]); };
      window.lintrk.q = [];
    }
    var s = document.createElement("script");
    s.async = true; s.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
    document.head.appendChild(s);
  }

  // Called by the quiz when someone finishes it (only counts if they accepted and a conversion ID is set)
  window.kmTrackQuiz = function () {
    var cid = String(S.linkedinConversionId || "").replace(/\D/g, "");
    if (cid && get() === "yes" && window.lintrk) window.lintrk("track", { conversion_id: Number(cid) });
  };

  function banner() {
    if (document.getElementById("kmConsent")) return;
    var b = document.createElement("div");
    b.id = "kmConsent"; b.setAttribute("role", "dialog"); b.setAttribute("aria-label", "Cookie choice");
    b.innerHTML =
      '<p class="kc-t">Can I use a LinkedIn cookie?</p>' +
      '<p class="kc-p">It helps me show What the AI!? to people who visited this site, on LinkedIn. It doesn\'t affect the quiz or your answers. ' +
      '<a href="/privacy.html">Privacy</a></p>' +
      '<div class="kc-b"><button type="button" data-kc="no">No thanks</button><button type="button" data-kc="yes" class="kc-yes">Accept</button></div>';
    document.body.appendChild(b);
    b.addEventListener("click", function (e) {
      var k = e.target.closest("[data-kc]"); if (!k) return;
      var v = k.getAttribute("data-kc"); set(v); b.remove();
      if (v === "yes") loadTag();
    });
  }

  // "Cookie settings" link anywhere on the page reopens the choice
  document.addEventListener("click", function (e) {
    if (!e.target.closest("[data-cookie-settings]")) return;
    e.preventDefault();
    if (!PID) { alert("This site doesn't use any advertising cookies right now."); return; }
    try { localStorage.removeItem(KEY); } catch (err) {}
    banner();
  });

  if (!PID) return;
  var c = get();
  if (c === "yes") loadTag();
  else if (c !== "no") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", banner); else banner();
  }
})();
