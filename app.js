/* Site behaviour. You normally don't need to edit this file. Edit content.js instead. */
(function(){
var S={camp:"augment",role:"Marketing",track:"pro",ptag:"ALL",rtag:"ALL",spot:0,w:0};
if(typeof K_READS!=="undefined"&&K_READS.length){S.spot=Math.floor(Math.random()*K_READS.length);}
var $=function(id){return document.getElementById(id);};
var esc=function(t){return String(t).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});};
var cap=function(t){return t.charAt(0)+t.slice(1).toLowerCase();};
function chipStyle(on,dark){
  var base="font-family: 'Inter',system-ui,-apple-system,'Segoe UI',sans-serif; font-weight: 600; font-size: 15px; padding: 0 18px; min-height: 44px; border-radius: 4px; cursor: pointer; ";
  if(dark) return base+(on?"background: #CDEBD9; color: #17201C; border: 1px solid #CDEBD9":"background: transparent; color: #E6ECE8; border: 1px solid #5B5C62");
  return base+(on?"background: #17201C; color: #FFFFFF; border: 1px solid #17201C":"background: #FFFFFF; color: #17201C; border: 1px solid #17201C");
}
function tabs(id,items,cur,key,dark,styleFn){
  $(id).innerHTML=items.map(function(it){var on=it.v===cur;
    return '<button type="button" data-k="'+key+'" data-v="'+esc(it.v)+'" aria-pressed="'+on+'" style="'+(styleFn?styleFn(on):chipStyle(on,dark))+'">'+esc(it.l)+'</button>';}).join("");
}
function render(){
  /* Each block only runs on the page that has it (home, /jobs/, /explore/...) */
  if($("dots")&&typeof K_CAMPS!=="undefined"){
  var camp=K_CAMPS.filter(function(c){return c.id===S.camp;})[0];
  $("dots").innerHTML=K_CAMPS.map(function(c){var on=c.id===S.camp,sz=on?28:18;
    return '<button type="button" data-k="camp" data-v="'+c.id+'" aria-label="'+esc(c.name)+'" aria-pressed="'+on+'" style="position: absolute; top: '+(28-sz/2)+'px; left: calc('+c.pos+'% - '+(sz/2)+'px); width: '+sz+'px; height: '+sz+'px; border-radius: 50%; cursor: pointer; padding: 0; transition: all .25s ease; '+(on?"background: #CDEBD9; border: 3px solid #17201C; box-shadow: 0 0 0 2px #CDEBD9":"background: #17201C; border: 1px solid #9FD1B8")+'"></button>';}).join("");
  tabs("campTabs",K_CAMPS.map(function(c){return {v:c.id,l:c.name};}),S.camp,"camp",true);
  $("campName").textContent=camp.name; $("campClaim").textContent=camp.claim; $("campArg").textContent=camp.argument;
  $("campBig").textContent=camp.big||""; $("campAct").textContent=camp.act||""; $("campForYou").textContent=camp.forYou; $("campTake").textContent=camp.take;
  $("camp_voices").innerHTML=camp.voices.map(function(v){return '<span style="border: 1px solid #5B5C62; padding: 4px 12px; border-radius: 4px; font-size: 14px; color: #E6ECE8">'+esc(v)+'</span>';}).join("");
  }
  /* jobs */
  if($("roleTabs")){
  var r=K_ROLES.filter(function(x){return x.name===S.role;})[0];
  var vc={"Amplified":["#0E5A43","#FFFFFF"],"Reinvented":["#CDEBD9","#17201C"],"Split":["#17201C","#FFFFFF"]}[r.verdict]||["#17201C","#CDEBD9"];
  tabs("roleTabs",K_ROLES.map(function(x){return {v:x.name,l:x.name};}),S.role,"role",false);
  $("roleName").textContent=r.name; $("absorbs").textContent=r.absorbs; $("human").textContent=r.human; $("next").textContent=r.next;
  var vd=$("verdict"); vd.textContent=r.verdict; vd.style.background=vc[0]; vd.style.color=vc[1];
  $("meterWrap").setAttribute("aria-label",r.level+" out of 5");
  $("meter").innerHTML=[1,2,3,4,5].map(function(i){return '<span style="display: block; width: 28px; height: 14px; border-radius: 3px; background: '+(i<=r.level?"#0E5A43":"#D3DBD6")+'"></span>';}).join("");
  }
  /* study */
  if($("trackTabs")){
  var t=K_TRACKS.filter(function(x){return x.id===S.track;})[0];
  tabs("trackTabs",K_TRACKS.map(function(x){return {v:x.id,l:x.label};}),S.track,"track",false,function(on){return "font-family: 'Inter',system-ui,-apple-system,'Segoe UI',sans-serif; font-weight: 700; font-size: 15px; padding: 0 22px; min-height: 44px; border-radius: 4px; cursor: pointer; border: 0; "+(on?"background: #CDEBD9; color: #17201C":"background: transparent; color: #FFFFFF");});
  $("trackIntro").textContent=t.intro;
  $("track_steps").innerHTML=t.steps.map(function(s){return '<div style="background: #FFFFFF; color: #17201C; padding: 28px; display: flex; flex-direction: column; gap: 12px"><span style="font-family: \'Bricolage Grotesque\', sans-serif; font-weight: 800; font-size: 48px; line-height: 1; color: #0E5A43">'+s.n+'</span><span style="font-family: \'Bricolage Grotesque\', sans-serif; font-weight: 700; font-size: 22px; line-height: 1.15">'+esc(s.title)+'</span><span style="font-size: 16px; color: #3A3B40">'+esc(s.body)+'</span></div>';}).join("");
  $("track_courses").innerHTML=t.courses.map(function(c){return '<a href="'+esc(c.url)+'" target="_blank" rel="noopener" class="k-tile" style="background: #0E5A43; color: #FFFFFF; text-decoration: none; padding: 22px 24px; display: flex; flex-direction: column; gap: 4px; min-height: 96px"><span style="font-weight: 700; font-size: 18px">'+esc(c.title)+' ↗</span><span style="font-size: 14px; opacity: 0.9">'+esc(c.by)+'</span></a>';}).join("");
  }
  /* people */
  if($("peopleList")){
  var pTags=["ALL","PIONEERS","BUILDERS","TRANSLATORS","SCEPTICS","INDIA"];
  tabs("peopleTabs",pTags.map(function(x){return {v:x,l:x==="ALL"?"Everyone":cap(x)};}),S.ptag,"ptag",false);
  var av={PIONEERS:["#17201C","#FFFFFF"],BUILDERS:["#0E5A43","#FFFFFF"],TRANSLATORS:["#CDEBD9","#17201C"],SCEPTICS:["#F1F4F1","#17201C"],INDIA:["#DE9A80","#17201C"]};
  $("peopleList").innerHTML=K_PEOPLE.filter(function(p){return S.ptag==="ALL"||p.tag===S.ptag;}).map(function(p){var c=av[p.tag];var ini=p.name.split(" ").map(function(x){return x[0];}).join("").slice(0,2);
    return '<a class="k-lift" href="'+esc(p.url)+'" target="_blank" rel="noopener" style="border: 1px solid #17201C; background: #FFFFFF; color: #17201C; text-decoration: none; padding: 24px; display: flex; flex-direction: column; gap: 14px; min-height: 250px"><div style="display: flex; justify-content: space-between; align-items: center; gap: 12px"><span aria-hidden="true" style="width: 56px; height: 56px; border-radius: 50%; border: 1px solid #17201C; display: flex; align-items: center; justify-content: center; font-family: \'Bricolage Grotesque\', sans-serif; font-weight: 800; font-size: 20px; background: '+c[0]+'; color: '+c[1]+'">'+ini+'</span><span style="font-family: \'JetBrains Mono\', ui-monospace, monospace; font-size: 11px; letter-spacing: 0.1em; color: #5B5C62">'+p.tag+'</span></div><span style="font-family: \'Bricolage Grotesque\', sans-serif; font-weight: 700; font-size: 24px; line-height: 1.1; letter-spacing: -0.02em">'+esc(p.name)+'</span><span style="font-size: 16px; color: #3A3B40; flex-grow: 1">'+esc(p.why)+'</span><span style="font-weight: 700; font-size: 15px; color: #0E5A43">Learn more ↗</span></a>';}).join("");
  }
  /* reads */
  if($("readsList")){
  var rTags=["ALL","START HERE","MANAGERS","BIG PICTURE","DATA","INDIA"];
  tabs("readTabs",rTags.map(function(x){return {v:x,l:x==="ALL"?"All":cap(x)};}),S.rtag,"rtag",true);
  $("readsList").innerHTML=K_READS.filter(function(x){return S.rtag==="ALL"||x.tag===S.rtag;}).map(function(x){
    return '<a class="k-tile" href="'+esc(x.url)+'" target="_blank" rel="noopener" style="color: #E6ECE8; text-decoration: none; display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 8px 32px; padding: 24px 12px; border-bottom: 1px solid #3A3B40; align-items: baseline"><span style="display: flex; flex-direction: column; gap: 2px"><span style="font-family: \'Bricolage Grotesque\', sans-serif; font-weight: 700; font-size: 24px; letter-spacing: -0.02em">'+esc(x.title)+' ↗</span><span style="font-size: 14px; opacity: 0.75">'+esc(x.source)+' · '+cap(x.tag)+'</span></span><span style="font-size: 17px">'+esc(x.why)+'</span></a>';}).join("");
  var sp=K_READS[S.spot]; if($("spotLink")){ $("spotLink").href=sp.url; $("spotTitle").textContent=sp.title; }
  }
  clipLists();
}
/* On phones, long lists start collapsed with a "Show all" button. Nothing is removed. */
var OPEN={};
function clipLists(){
  [["peopleList","people"],["readsList","reads"],["nlCards","issues"]].forEach(function(p){
    var el=$(p[0]); if(!el) return;
    var box=getComputedStyle(el).display==="contents"?el.parentNode:el;
    if(!box.id) box.id=p[0]+"Box";
    var btn=$(p[0]+"More");
    if(!btn){btn=document.createElement("button");btn.type="button";btn.id=p[0]+"More";btn.className="m-more";btn.setAttribute("aria-controls",box.id);
      btn.addEventListener("click",function(){OPEN[p[0]]=!OPEN[p[0]];clipLists();if(!OPEN[p[0]])box.scrollIntoView({block:"start"});});
      box.parentNode.insertBefore(btn,box.nextSibling);}
    var n=el.children.length, small=window.matchMedia("(max-width:640px)").matches;
    var clip=small&&!OPEN[p[0]]&&n>4;
    box.classList.toggle("m-clip",clip);
    btn.hidden=!(small&&n>4);
    btn.setAttribute("aria-expanded",String(!clip));
    btn.textContent=clip?("Show all "+n+" "+p[1]):"Show fewer";
  });
}
window.addEventListener("resize",function(){clipLists();});
function tick(){var n=new Date(); if(!$("clock")) return;
  $("clock").textContent=n.toLocaleTimeString("en-IN",{timeZone:"Asia/Kolkata",hour:"2-digit",minute:"2-digit",hour12:false});
  if($("todayDate")) $("todayDate").textContent=n.toLocaleDateString("en-IN",{timeZone:"Asia/Kolkata",weekday:"long",day:"numeric",month:"long",year:"numeric"}).toUpperCase();}
document.addEventListener("click",function(e){
  var b=e.target.closest("button[data-k]"); if(b){S[b.dataset.k]=b.dataset.v; render(); var f=document.querySelector('button[data-k="'+b.dataset.k+'"][data-v="'+CSS.escape(b.dataset.v)+'"]'); if(f) f.focus(); return;}
  if(e.target.closest("#shuffle")){var i=S.spot; while(i===S.spot){i=Math.floor(Math.random()*K_READS.length);} S.spot=i; render();}
});
var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if(!reduce){setInterval(function(){S.w++;var w=$("word"); if(!w) return;var nw=w.cloneNode(false);nw.textContent=K_WORDS[S.w%K_WORDS.length];w.parentNode.replaceChild(nw,w);},2200);}
tick(); setInterval(tick,30000); render();

/* Copy the prompt of the day */
document.addEventListener("click",function(e){
  var b=e.target.closest("[data-copy]"); if(!b) return;
  var el=document.getElementById(b.getAttribute("data-copy")); if(!el) return;
  var t=el.textContent.trim(), o=b.textContent;
  var ok=function(){b.textContent="Copied. Paste it into your AI tool"; b.classList.add("done"); setTimeout(function(){b.textContent=o; b.classList.remove("done");},2400);};
  if(navigator.clipboard){navigator.clipboard.writeText(t).then(ok,function(){window.prompt("Copy this prompt:",t);});} else {window.prompt("Copy this prompt:",t);}
});
/* Myth or fact quiz */
(function(){
  var q=document.getElementById("quiz"); if(!q) return;
  var items=[].slice.call(q.querySelectorAll("li[data-answer]")); if(!items.length) return;
  var score=0, done=0, out=document.getElementById("quizScore"), share=document.getElementById("quizShare");
  var verdict=["Time to read the field guide.","A start. Chapter 01 will help.","Not bad at all.","Sharp. You know your AI.","Excellent. Nearly perfect.","Perfect score. Come back tomorrow for five more."];
  items.forEach(function(li){
    li.querySelectorAll("[data-pick]").forEach(function(btn){
      btn.addEventListener("click",function(){
        if(li.classList.contains("done")) return;
        var ans=li.getAttribute("data-answer"), right=btn.getAttribute("data-pick")===ans;
        btn.classList.add(right?"right":"wrong");
        if(!right) li.querySelector('[data-pick="'+ans+'"]').classList.add("right");
        li.querySelectorAll("[data-pick]").forEach(function(x){x.disabled=true;});
        li.classList.add("done"); done++; if(right) score++;
        out.textContent=done<items.length?("SCORE "+score+" / "+done):("YOU GOT "+score+" / "+items.length+". "+verdict[score].toUpperCase());
        if(done===items.length&&share){
          var st=window.kmStreak?window.kmStreak(score,items.length):null;
          var msg="I scored "+score+"/"+items.length+" on today's AI Myth or Fact quiz at kunalai.in"+(st&&st.streak>1?(", "+st.streak+" days in a row"):"")+". Can you beat it?";
          var u=encodeURIComponent("https://kunalai.in/today/");
          share.innerHTML='<a target="_blank" rel="noopener" href="https://x.com/intent/post?text='+encodeURIComponent(msg)+'&url='+u+'">Share on X</a>'+
            '<a target="_blank" rel="noopener" href="https://wa.me/?text='+encodeURIComponent(msg+" https://kunalai.in/today/")+'">Share on WhatsApp</a>'+
            '<a target="_blank" rel="noopener" href="https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent("https://kunalai.in/")+'">Share on LinkedIn</a>';
          share.hidden=false;
        }
      });
    });
  });
})();

})();

/* Daily streak and badges for the Myth or Fact quiz. Stored only in the visitor's own browser. */
(function(){
  var KEY="km_daily", BKEY="km_badges";
  function today(off){var d=new Date(Date.now()+(off||0)*864e5);return d.toLocaleDateString("en-CA",{timeZone:"Asia/Kolkata"});}
  function load(k,def){try{return JSON.parse(localStorage.getItem(k))||def;}catch(e){return def;}}
  function save(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
  var BADGES={
    first:{name:"First quiz",desc:"Played your first Myth or Fact"},
    perfect:{name:"Perfect five",desc:"Scored 5 out of 5"},
    s3:{name:"3-day streak",desc:"Played three days in a row"},
    s7:{name:"7-day streak",desc:"A full week in a row"},
    s30:{name:"30-day streak",desc:"A month without missing a day"},
    q25:{name:"25 correct",desc:"25 right answers in total"},
    scored:{name:"Know your score",desc:"Took the How AI-proof is your job? check"}
  };
  function award(id){
    var b=load(BKEY,{}); if(b[id]) return false;
    b[id]=today(); save(BKEY,b); toast("Badge unlocked: "+BADGES[id].name); return true;
  }
  function toast(t){
    var el=document.getElementById("kmToast");
    if(!el){el=document.createElement("div");el.id="kmToast";el.setAttribute("role","status");document.body.appendChild(el);}
    el.textContent=t; el.className="show"; clearTimeout(el._h); el._h=setTimeout(function(){el.className="";},3600);
  }
  function render(){
    var bar=document.getElementById("streakBar"); if(!bar) return;
    var d=load(KEY,null), b=load(BKEY,{});
    if(!d){bar.innerHTML='<p class="sk-line">Answer all five to start your streak. New questions every morning at 6 AM.</p>'; return;}
    var alive=d.last===today()||d.last===today(-1);
    var streak=alive?d.streak:0, pct=d.answered?Math.round(100*d.correct/d.answered):0;
    var ids=Object.keys(BADGES);
    bar.innerHTML='<div class="sk-stats">'+
      '<div><b>'+streak+'</b><span>DAY STREAK</span></div>'+
      '<div><b>'+(d.best||0)+'</b><span>BEST STREAK</span></div>'+
      '<div><b>'+pct+'%</b><span>CORRECT</span></div>'+
      '<div><b>'+(d.days||0)+'</b><span>DAYS PLAYED</span></div></div>'+
      '<div class="sk-badges">'+ids.map(function(id){var on=!!b[id];
        return '<span class="sk-badge'+(on?' on':'')+'" title="'+BADGES[id].desc+'">'+(on?'★ ':'☆ ')+BADGES[id].name+'</span>';}).join("")+'</div>'+
      (d.last===today()?'<p class="sk-line">You\'ve played today. Five new questions tomorrow at 6 AM IST.</p>':
        (alive?'<p class="sk-line">Play today to keep your '+streak+'-day streak alive.</p>':''));
  }
  window.kmBadge=function(id){var r=award(id); render(); return r;};
  window.kmStreak=function(score,total){
    var d=load(KEY,{streak:0,best:0,correct:0,answered:0,days:0,last:null});
    var t=today();
    if(d.last!==t){
      d.streak=(d.last===today(-1))?d.streak+1:1;
      d.best=Math.max(d.best||0,d.streak);
      d.correct+=score; d.answered+=total; d.days=(d.days||0)+1; d.last=t;
      save(KEY,d);
      award("first");
      if(score===total) award("perfect");
      if(d.streak>=3) award("s3");
      if(d.streak>=7) award("s7");
      if(d.streak>=30) award("s30");
      if(d.correct>=25) award("q25");
    }
    render(); return d;
  };
  render();
})();

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

/* Feature spotlight: live numbers and a mini Your Job card that cycles through the roles */
(function(){
  if(typeof K_ROLES==="undefined"||!document.getElementById("fxCard")) return;
  var $=function(id){return document.getElementById(id);};
  var words=["Zero","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten"];
  var n=K_ROLES.length, top=K_ROLES.filter(function(r){return r.level===5;}).length;
  $("fxRoles").textContent=n; $("fxRoles2").textContent=n; $("fxBadge").textContent=n;
  $("fxTop").textContent=words[top]||top;
  var colours={"Amplified":["#0E5A43","#FFFFFF"],"Reinvented":["#CDEBD9","#17201C"],"Split":["#17201C","#FFFFFF"]};
  var start=0; K_ROLES.forEach(function(r,i){if(r.name==="Customer support") start=i;});
  var i=start, card=$("fxCard"), paused=false;
  function show(r){
    $("fxRole").textContent=r.name; $("fxAbsorb").textContent=r.absorbs; $("fxNext").textContent=r.next;
    var v=$("fxVerdict"), c=colours[r.verdict]||["#17201C","#CDEBD9"];
    v.textContent=r.verdict; v.style.background=c[0]; v.style.color=c[1];
    $("fxMeter").innerHTML=[1,2,3,4,5].map(function(k){return '<i'+(k<=r.level?' class="on"':'')+'></i>';}).join("");
  }
  show(K_ROLES[i]);
  var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(!reduce){
    setInterval(function(){
      if(paused||document.hidden) return;
      card.classList.add("fade");
      setTimeout(function(){i=(i+1)%n; show(K_ROLES[i]); card.classList.remove("fade");},250);
    },2800);
    card.addEventListener("mouseenter",function(){paused=true;});
    card.addEventListener("mouseleave",function(){paused=false;});
  }
  function goToRole(){
    var name=K_ROLES[i].name;
    var b=document.querySelector('button[data-k="role"][data-v="'+name.replace(/"/g,'\\"')+'"]');
    if(b) b.click();
    var j=document.getElementById("jobs"); if(j) j.scrollIntoView({behavior:reduce?"auto":"smooth"});
  }
  card.addEventListener("click",goToRole);
  $("fxCta").addEventListener("click",function(e){e.preventDefault(); goToRole();});
})();

/* "AI ready? Take the quiz" floating button: shows after the hero, hides while the quiz is on screen */
(function(){
  var f=document.getElementById("qzFloat"), sc=document.getElementById("score"), hero=document.querySelector(".qz-hero")||document.getElementById("top");
  if(!f) return;
  var pastHero=false, quizVisible=false;

  function update(){ f.classList.toggle("show", pastHero && !quizVisible); }
  if("IntersectionObserver" in window){
    if(sc) new IntersectionObserver(function(es){ quizVisible=es[0].isIntersecting; update(); },{threshold:0.15}).observe(sc);
    if(hero) new IntersectionObserver(function(es){ pastHero=!es[0].isIntersecting && es[0].boundingClientRect.top<0; update(); },{threshold:0}).observe(hero);
  }
  document.addEventListener("click",function(e){
    var a=e.target.closest("[data-qz]"); if(!a||!sc) return;
    e.preventDefault();
    sc.scrollIntoView({behavior:(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)?"auto":"smooth"});
    if(history.replaceState) history.replaceState(null,"","#score");
    setTimeout(function(){ var b=sc.querySelector('[data-sc="start"],[data-sc="show"]'); if(b) b.focus({preventScroll:true}); },600);
  });
})();

/* Today's top 5 carousel: auto-advances, pauses on hover/focus/tap, swipe on phones, still for reduced motion */
(function(){
  var band=document.querySelector(".t5"), track=document.getElementById("t5Track");
  if(!band||!track) return;
  var slides=[].slice.call(track.querySelectorAll(".t5-slide")), n=slides.length;
  var strip=document.getElementById("t5Strip"), stripT=document.getElementById("t5StripT");
  if(strip&&stripT&&slides.length){ var fh=slides[0].querySelector(".t5-h"); if(fh&&fh.getAttribute("href")!=="#today"){ stripT.textContent=fh.textContent; strip.hidden=false; } }
  if(n<2) return;
  var ctrl=document.getElementById("t5Ctrl"), dots=document.getElementById("t5Dots"), pauseBtn=band.querySelector('[data-t5="pause"]');
  var MS=7000, i=0, timer=null, userPaused=false, hover=false;
  var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  band.style.setProperty("--t5ms",MS+"ms");
  if(reduce){ band.classList.add("t5-static"); userPaused=true; pauseBtn.hidden=true; }
  ctrl.hidden=false;
  dots.innerHTML=slides.map(function(_,k){return '<button type="button" role="tab" aria-label="Story '+(k+1)+' of '+n+'"></button>';}).join("");
  var dotBtns=[].slice.call(dots.children);
  var side=document.getElementById("t5Side"), sideBtns=[];
  if(side){
    side.innerHTML='<p class="t5-side-h">ALL FIVE TODAY</p>'+slides.map(function(s,k){
      var h=s.querySelector(".t5-h"), src=s.querySelector(".t5-src");
      return '<button type="button" class="t5-item" data-k="'+k+'"><b>'+String(k+1).padStart(2,"0")+'</b><span>'+(h?h.textContent:"")+'<small>'+(src?src.textContent.split(" · ")[0]:"")+'</small></span></button>';
    }).join("");
    side.hidden=false;
    sideBtns=[].slice.call(side.querySelectorAll(".t5-item"));
  }
  function go(k,focus){
    i=(k+n)%n;
    track.style.transform="translateX("+(-100*i)+"%)";
    slides.forEach(function(s,j){ s.setAttribute("aria-hidden",j!==i); s.querySelectorAll("a").forEach(function(a){a.tabIndex=j===i?0:-1;}); });
    dotBtns.forEach(function(d,j){ d.setAttribute("aria-selected",j===i); d.style.animation="none"; void d.offsetWidth; d.style.animation=""; });
    sideBtns.forEach(function(b,j){ b.classList.toggle("on",j===i); b.setAttribute("aria-current",j===i?"true":"false"); });
    if(focus){ var h=slides[i].querySelector(".t5-h"); if(h) h.focus({preventScroll:true}); }
    schedule();
  }
  function schedule(){ clearTimeout(timer); if(!userPaused&&!hover&&!document.hidden) timer=setTimeout(function(){go(i+1);},MS); }
  function setPaused(p){ userPaused=p; band.classList.toggle("paused",p); pauseBtn.textContent=p?"Play":"Pause"; pauseBtn.setAttribute("aria-label",p?"Play the stories":"Pause the stories"); schedule(); }
  band.addEventListener("click",function(e){
    var b=e.target.closest("[data-t5]");
    if(b){ var a=b.getAttribute("data-t5"); if(a==="next") go(i+1,true); if(a==="prev") go(i-1,true); if(a==="pause") setPaused(!userPaused); return; }
    var d=e.target.closest("#t5Dots button"); if(d) go(dotBtns.indexOf(d),true);
    var it=e.target.closest(".t5-item"); if(it) go(+it.getAttribute("data-k"),true);
  });
  band.addEventListener("mouseenter",function(){hover=true;band.classList.add("paused");clearTimeout(timer);});
  band.addEventListener("mouseleave",function(){hover=false;if(!userPaused)band.classList.remove("paused");schedule();});
  band.addEventListener("focusin",function(){hover=true;band.classList.add("paused");clearTimeout(timer);});
  band.addEventListener("focusout",function(){hover=false;if(!userPaused)band.classList.remove("paused");schedule();});
  band.addEventListener("keydown",function(e){ if(e.key==="ArrowRight"){go(i+1,true);} if(e.key==="ArrowLeft"){go(i-1,true);} });
  var sx=null;
  track.addEventListener("touchstart",function(e){sx=e.touches[0].clientX;},{passive:true});
  track.addEventListener("touchend",function(e){ if(sx===null) return; var dx=e.changedTouches[0].clientX-sx; if(Math.abs(dx)>40){ go(dx<0?i+1:i-1); setPaused(true);} sx=null; });
  document.addEventListener("visibilitychange",schedule);
  go(0);
})();

/* Newsletter buttons: use the Substack address from content.js once it is set */
(function(){
  if(typeof SITE==="undefined"||!SITE.substack) return;
  document.querySelectorAll("[data-subscribe]").forEach(function(a){ a.href=SITE.substack.replace(/\/$/,"")+"/subscribe"; });
})();

/* Hero: interactive Human Line scorer */
(function(){
  var box=document.getElementById("hlx"); if(!box) return;
  var vals=[1,1,1,2,1], name="Writing the campaign brief", ovr=false;
  var ZONES=[[3,"Hand off","AI drafts and does it. You spot-check.",""],[6,"Team up","AI drafts. You challenge, edit and approve.",""],[10,"Hold","AI may inform. A human decides.","hold"]];
  var $=function(id){return document.getElementById(id);};
  function render(){
    var t=vals.reduce(function(a,b){return a+b;},0), z=ZONES[t<=3?0:t<=6?1:2];
    box.querySelectorAll(".hlx-f").forEach(function(row,i){
      row.querySelectorAll("button").forEach(function(b){ b.setAttribute("role","radio"); b.setAttribute("aria-checked", +b.getAttribute("data-v")===vals[i]?"true":"false"); });
    });
    $("hlxScore").textContent=t;
    $("hlxZone").textContent=z[1];
    $("hlxRule").textContent=z[2]+(ovr?" Plus: a named human approves it, whatever the score.":"");
    $("hlxName").textContent=name||"Your task";
    var v=box.querySelector(".hlx-verdict"); v.className="hlx-verdict"+(z[3]?" "+z[3]:"");
    // place the marker inside its zone band: Hand off 0-3 (4 parts), Team up 4-6 (3 parts), Hold 7-10 (4 parts)
    var pos=(t+0.5)/11*100; $("hlxMark").style.left=pos+"%";
  }
  box.addEventListener("click",function(e){
    var b=e.target.closest(".hlx-seg button");
    if(b){ var i=+b.closest(".hlx-f").getAttribute("data-f"); vals[i]=+b.getAttribute("data-v"); box.querySelectorAll(".hlx-presets button").forEach(function(x){x.classList.remove("on");}); if(!$("hlxTask").value) name="Your task"; render(); return; }
    var p=e.target.closest("[data-preset]");
    if(p){ vals=p.getAttribute("data-preset").split(",").map(Number); name=p.getAttribute("data-name"); $("hlxTask").value="";
      box.querySelectorAll(".hlx-presets button").forEach(function(x){x.classList.toggle("on",x===p);}); render(); }
  });
  $("hlxTask").addEventListener("input",function(){ name=this.value.trim()||"Your task"; box.querySelectorAll(".hlx-presets button").forEach(function(x){x.classList.remove("on");}); render(); });
  $("hlxOvr").addEventListener("change",function(){ ovr=this.checked; render(); });
  render();
})();

/* Explore hub: the numbers on the cards always match the content in content.js */
(function(){
  var els=document.querySelectorAll("[data-count]"); if(!els.length) return;
  var urls={}; if(typeof K_TRACKS!=="undefined") K_TRACKS.forEach(function(t){t.courses.forEach(function(c){urls[c.url]=1;});});
  var n={camps:typeof K_CAMPS!=="undefined"?K_CAMPS.length:0, tracks:typeof K_TRACKS!=="undefined"?K_TRACKS.length:0,
    courses:Object.keys(urls).length, people:typeof K_PEOPLE!=="undefined"?K_PEOPLE.length:0, reads:typeof K_READS!=="undefined"?K_READS.length:0};
  els.forEach(function(el){ var v=n[el.getAttribute("data-count")]; if(v) el.textContent=v; });
})();
