/* Site behaviour. You normally don't need to edit this file. Edit content.js instead. */
(function(){
var S={camp:"augment",role:"Marketing",track:"pro",ptag:"ALL",rtag:"ALL",spot:0,w:0};
var $=function(id){return document.getElementById(id);};
var esc=function(t){return String(t).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});};
var cap=function(t){return t.charAt(0)+t.slice(1).toLowerCase();};
function chipStyle(on,dark){
  var base="font-family: 'Hanken Grotesk', sans-serif; font-weight: 600; font-size: 15px; padding: 0 18px; min-height: 44px; border-radius: 999px; cursor: pointer; ";
  if(dark) return base+(on?"background: #D9FF3F; color: #101114; border: 2px solid #D9FF3F":"background: transparent; color: #E8E8E3; border: 2px solid #5B5C62");
  return base+(on?"background: #101114; color: #FFFFFF; border: 2px solid #101114":"background: #FFFFFF; color: #101114; border: 2px solid #101114");
}
function tabs(id,items,cur,key,dark,styleFn){
  $(id).innerHTML=items.map(function(it){var on=it.v===cur;
    return '<button type="button" data-k="'+key+'" data-v="'+esc(it.v)+'" aria-pressed="'+on+'" style="'+(styleFn?styleFn(on):chipStyle(on,dark))+'">'+esc(it.l)+'</button>';}).join("");
}
function render(){
  /* perspectives */
  var camp=K_CAMPS.filter(function(c){return c.id===S.camp;})[0];
  $("dots").innerHTML=K_CAMPS.map(function(c){var on=c.id===S.camp,sz=on?28:18;
    return '<button type="button" data-k="camp" data-v="'+c.id+'" aria-label="'+esc(c.name)+'" aria-pressed="'+on+'" style="position: absolute; top: '+(28-sz/2)+'px; left: calc('+c.pos+'% - '+(sz/2)+'px); width: '+sz+'px; height: '+sz+'px; border-radius: 50%; cursor: pointer; padding: 0; transition: all .25s ease; '+(on?"background: #D9FF3F; border: 3px solid #101114; box-shadow: 0 0 0 2px #D9FF3F":"background: #101114; border: 2px solid #8F9BFF")+'"></button>';}).join("");
  tabs("campTabs",K_CAMPS.map(function(c){return {v:c.id,l:c.name};}),S.camp,"camp",true);
  $("campName").textContent=camp.name; $("campClaim").textContent=camp.claim; $("campArg").textContent=camp.argument;
  $("campBig").textContent=camp.big||""; $("campAct").textContent=camp.act||""; $("campForYou").textContent=camp.forYou; $("campTake").textContent=camp.take;
  $("camp_voices").innerHTML=camp.voices.map(function(v){return '<span style="border: 1px solid #5B5C62; padding: 4px 12px; border-radius: 999px; font-size: 14px; color: #E8E8E3">'+esc(v)+'</span>';}).join("");
  /* jobs */
  var r=K_ROLES.filter(function(x){return x.name===S.role;})[0];
  var vc={"Amplified":["#2B3BFF","#FFFFFF"],"Reinvented":["#D9FF3F","#101114"],"Split":["#101114","#FFFFFF"]}[r.verdict]||["#101114","#D9FF3F"];
  tabs("roleTabs",K_ROLES.map(function(x){return {v:x.name,l:x.name};}),S.role,"role",false);
  $("roleName").textContent=r.name; $("absorbs").textContent=r.absorbs; $("human").textContent=r.human; $("next").textContent=r.next;
  var vd=$("verdict"); vd.textContent=r.verdict; vd.style.background=vc[0]; vd.style.color=vc[1];
  $("meterWrap").setAttribute("aria-label",r.level+" out of 5");
  $("meter").innerHTML=[1,2,3,4,5].map(function(i){return '<span style="display: block; width: 28px; height: 14px; border-radius: 3px; background: '+(i<=r.level?"#2B3BFF":"#DADAD4")+'"></span>';}).join("");
  /* study */
  var t=K_TRACKS.filter(function(x){return x.id===S.track;})[0];
  tabs("trackTabs",K_TRACKS.map(function(x){return {v:x.id,l:x.label};}),S.track,"track",false,function(on){return "font-family: 'Hanken Grotesk', sans-serif; font-weight: 700; font-size: 15px; padding: 0 22px; min-height: 44px; border-radius: 999px; cursor: pointer; border: 0; "+(on?"background: #D9FF3F; color: #101114":"background: transparent; color: #FFFFFF");});
  $("trackIntro").textContent=t.intro;
  $("track_steps").innerHTML=t.steps.map(function(s){return '<div style="background: #FFFFFF; color: #101114; padding: 28px; display: flex; flex-direction: column; gap: 12px"><span style="font-family: \'Bricolage Grotesque\', sans-serif; font-weight: 800; font-size: 48px; line-height: 1; color: #2B3BFF">'+s.n+'</span><span style="font-family: \'Bricolage Grotesque\', sans-serif; font-weight: 700; font-size: 22px; line-height: 1.15">'+esc(s.title)+'</span><span style="font-size: 16px; color: #3A3B40">'+esc(s.body)+'</span></div>';}).join("");
  $("track_courses").innerHTML=t.courses.map(function(c){return '<a href="'+esc(c.url)+'" target="_blank" rel="noopener" class="k-tile" style="background: #2B3BFF; color: #FFFFFF; text-decoration: none; padding: 22px 24px; display: flex; flex-direction: column; gap: 4px; min-height: 96px"><span style="font-weight: 700; font-size: 18px">'+esc(c.title)+' ↗</span><span style="font-size: 14px; opacity: 0.9">'+esc(c.by)+'</span></a>';}).join("");
  /* people */
  var pTags=["ALL","PIONEERS","BUILDERS","TRANSLATORS","SCEPTICS","INDIA"];
  tabs("peopleTabs",pTags.map(function(x){return {v:x,l:x==="ALL"?"Everyone":cap(x)};}),S.ptag,"ptag",false);
  var av={PIONEERS:["#101114","#FFFFFF"],BUILDERS:["#2B3BFF","#FFFFFF"],TRANSLATORS:["#D9FF3F","#101114"],SCEPTICS:["#F2F2EE","#101114"],INDIA:["#FF7A2F","#101114"]};
  $("peopleList").innerHTML=K_PEOPLE.filter(function(p){return S.ptag==="ALL"||p.tag===S.ptag;}).map(function(p){var c=av[p.tag];var ini=p.name.split(" ").map(function(x){return x[0];}).join("").slice(0,2);
    return '<a class="k-lift" href="'+esc(p.url)+'" target="_blank" rel="noopener" style="border: 2px solid #101114; background: #FFFFFF; color: #101114; text-decoration: none; padding: 24px; display: flex; flex-direction: column; gap: 14px; min-height: 250px"><div style="display: flex; justify-content: space-between; align-items: center; gap: 12px"><span aria-hidden="true" style="width: 56px; height: 56px; border-radius: 50%; border: 2px solid #101114; display: flex; align-items: center; justify-content: center; font-family: \'Bricolage Grotesque\', sans-serif; font-weight: 800; font-size: 20px; background: '+c[0]+'; color: '+c[1]+'">'+ini+'</span><span style="font-family: \'JetBrains Mono\', ui-monospace, monospace; font-size: 11px; letter-spacing: 0.1em; color: #5B5C62">'+p.tag+'</span></div><span style="font-family: \'Bricolage Grotesque\', sans-serif; font-weight: 700; font-size: 24px; line-height: 1.1; letter-spacing: -0.02em">'+esc(p.name)+'</span><span style="font-size: 16px; color: #3A3B40; flex-grow: 1">'+esc(p.why)+'</span><span style="font-weight: 700; font-size: 15px; color: #2B3BFF">Learn more ↗</span></a>';}).join("");
  /* reads */
  var rTags=["ALL","START HERE","MANAGERS","BIG PICTURE","DATA","INDIA"];
  tabs("readTabs",rTags.map(function(x){return {v:x,l:x==="ALL"?"All":cap(x)};}),S.rtag,"rtag",true);
  $("readsList").innerHTML=K_READS.filter(function(x){return S.rtag==="ALL"||x.tag===S.rtag;}).map(function(x){
    return '<a class="k-tile" href="'+esc(x.url)+'" target="_blank" rel="noopener" style="color: #E8E8E3; text-decoration: none; display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 8px 32px; padding: 24px 12px; border-bottom: 1px solid #3A3B40; align-items: baseline"><span style="display: flex; flex-direction: column; gap: 2px"><span style="font-family: \'Bricolage Grotesque\', sans-serif; font-weight: 700; font-size: 24px; letter-spacing: -0.02em">'+esc(x.title)+' ↗</span><span style="font-size: 14px; opacity: 0.75">'+esc(x.source)+' · '+cap(x.tag)+'</span></span><span style="font-size: 17px">'+esc(x.why)+'</span></a>';}).join("");
  var sp=K_READS[S.spot]; $("spotLink").href=sp.url; $("spotTitle").textContent=sp.title;
}
function tick(){var n=new Date();
  $("clock").textContent=n.toLocaleTimeString("en-IN",{timeZone:"Asia/Kolkata",hour:"2-digit",minute:"2-digit",hour12:false});
  $("todayDate").textContent=n.toLocaleDateString("en-IN",{timeZone:"Asia/Kolkata",weekday:"long",day:"numeric",month:"long",year:"numeric"}).toUpperCase();}
document.addEventListener("click",function(e){
  var b=e.target.closest("button[data-k]"); if(b){S[b.dataset.k]=b.dataset.v; render(); var f=document.querySelector('button[data-k="'+b.dataset.k+'"][data-v="'+CSS.escape(b.dataset.v)+'"]'); if(f) f.focus(); return;}
  if(e.target.closest("#shuffle")){var i=S.spot; while(i===S.spot){i=Math.floor(Math.random()*K_READS.length);} S.spot=i; render();}
});
var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if(!reduce){setInterval(function(){S.w++;var w=$("word");var nw=w.cloneNode(false);nw.textContent=K_WORDS[S.w%K_WORDS.length];w.parentNode.replaceChild(nw,w);},2200);}
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
          var msg="I scored "+score+"/"+items.length+" on today's AI Myth or Fact quiz at kunalai.in. Can you beat it?";
          var u=encodeURIComponent("https://kunalai.in/#today");
          share.innerHTML='<a target="_blank" rel="noopener" href="https://x.com/intent/post?text='+encodeURIComponent(msg)+'&url='+u+'">Share on X</a>'+
            '<a target="_blank" rel="noopener" href="https://wa.me/?text='+encodeURIComponent(msg+" https://kunalai.in/#today")+'">Share on WhatsApp</a>'+
            '<a target="_blank" rel="noopener" href="https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent("https://kunalai.in/")+'">Share on LinkedIn</a>';
          share.hidden=false;
        }
      });
    });
  });
})();
})();
