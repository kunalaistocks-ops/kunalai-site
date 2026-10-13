/* Email panel: "Email me" opens a small panel with the address and ways to send,
   so it works in incognito, on phones and on computers with no email app set up. */
(function(){
  if(window.__kmMail) return; window.__kmMail=true;
  var last=null;
  function close(){var p=document.getElementById("mailPanel"); if(p){p.remove(); if(last) last.focus();}}
  function open(addr,subject){
    close();
    var q=subject?("&su="+encodeURIComponent(subject)):"";
    var wrap=document.createElement("div"); wrap.id="mailPanel";
    wrap.innerHTML='<div class="mp-back" data-mp-close></div>'+
      '<div class="mp-box" role="dialog" aria-modal="true" aria-labelledby="mpTitle">'+
      '<button type="button" class="mp-x" data-mp-close aria-label="Close">×</button>'+
      '<p class="mp-label">EMAIL KUNAL</p>'+
      '<p class="mp-addr" id="mpTitle">'+addr+'</p>'+
      '<div class="mp-btns">'+
      '<button type="button" class="mp-copy">Copy address</button>'+
      '<a target="_blank" rel="noopener" href="https://mail.google.com/mail/?view=cm&fs=1&to='+encodeURIComponent(addr)+q+'">Open Gmail ↗</a>'+
      '<a target="_blank" rel="noopener" href="https://outlook.live.com/mail/0/deeplink/compose?to='+encodeURIComponent(addr)+(subject?"&subject="+encodeURIComponent(subject):"")+'">Open Outlook ↗</a>'+
      '<a href="mailto:'+addr+(subject?"?subject="+encodeURIComponent(subject):"")+'">Use my email app</a>'+
      '</div><p class="mp-note" aria-live="polite"></p></div>';
    document.body.appendChild(wrap);
    var copy=wrap.querySelector(".mp-copy"), note=wrap.querySelector(".mp-note");
    copy.focus();
    copy.addEventListener("click",function(){
      var done=function(){copy.textContent="Copied ✓"; copy.classList.add("ok"); note.textContent="Paste it into any email app.";};
      if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(addr).then(done,fallback);} else {fallback();}
      function fallback(){var r=document.createRange(); r.selectNodeContents(wrap.querySelector(".mp-addr")); var s=window.getSelection(); s.removeAllRanges(); s.addRange(r);
        try{document.execCommand("copy"); done();}catch(e){note.textContent="Press Ctrl+C (or Cmd+C) to copy the selected address.";}}
    });
  }
  document.addEventListener("click",function(e){
    if(e.target.closest("[data-mp-close]")){close(); return;}
    var a=e.target.closest('a[href^="mailto:"]');
    if(!a||a.closest("#mailPanel")) return;
    e.preventDefault(); last=a;
    var raw=a.getAttribute("href").slice(7), addr=raw.split("?")[0];
    var m=/subject=([^&]*)/i.exec(raw);
    open(addr, m?decodeURIComponent(m[1]):"");
  });
  document.addEventListener("keydown",function(e){if(e.key==="Escape") close();});
})();
