/* Kilo de merde - cartes illustrées (planche_cartes.webp) + règle du 7 chasse d'eau.
   À charger APRÈS le script principal : <script src="cartes.js"></script> juste avant </body>. */
(function(){
'use strict';
var SHEET='planche_cartes.webp',CL='kdmc';
if(typeof S!=='undefined'&&S.length===4)S.push('');   // couleur 4 = carte kilo (aucun symbole dans les messages)
var st=document.createElement('style');
st.textContent=
'.'+CL+'{background-color:transparent!important;background-repeat:no-repeat!important;color:transparent!important;font-size:0!important;border-radius:4px!important;flex:0 0 auto!important}'+
'.c.'+CL+'{width:62px;height:92px}'+
'.mc2.'+CL+'{width:38px;height:57px}'+
'.c7.'+CL+'{width:40px;height:60px}'+
'.mc.'+CL+'{width:56px;height:84px}'+
'.c7.b{background:url('+SHEET+') 44.444% 0%/1000% 1000% no-repeat!important;border:0!important;color:transparent!important;font-size:0!important;width:40px;height:60px}'+
'.c7.b i,.c7.b small{display:none}'+
/* disposition du bas : joueur à gauche de la main, même taille que les autres joueurs */
'#bot #me{flex:0 0 162px}'+
'#bot #hw{flex-direction:row;align-items:flex-end;justify-content:center;gap:0}'+
'#bot #hand{min-width:0}'+
'#bot .mrow{order:-1;flex:0 0 auto;flex-direction:column;align-items:center;gap:0;margin:0 22px 0 0}'+
'#bot .avw{width:92px;height:92px}'+
'#bot #myav{width:92px;height:92px}'+
'#bot .avw .ring{width:106px;height:106px;z-index:4}'+
'#bot #hand .c{z-index:5}'+
'#bot,#bot #hw,#bot #me{pointer-events:none}#bot #hand .c,#bot #flush .c7,#bot #btns button{pointer-events:auto}'+
'#tap{display:none!important}#mym{gap:0!important}#flzl{position:fixed;inset:0;pointer-events:none;z-index:1}.tpb.u{transform:rotate(-4deg)}'+
'#bot .mt2{align-items:center;margin-top:-10px;position:relative;z-index:5}';
st.textContent+=
'#srt{display:none!important}'+
'.c7.kdmc.bUse{box-shadow:0 0 0 2px var(--gold),0 0 10px 2px var(--gold)}'+
'.c7.kdmc.tpArmed{animation:tpblink .5s infinite alternate}'+
'.op.tpt{pointer-events:auto;cursor:pointer}'+
'.op.tpt .avw2{border-radius:50%;animation:tpblink .55s infinite alternate}'+
'@keyframes tpblink{from{box-shadow:0 0 0 3px #ff2d2d,0 0 8px 2px #ff2d2d88}to{box-shadow:0 0 0 6px #ff6b6b,0 0 26px 10px #ff2d2d}}'+
'#tpl{position:fixed;inset:0;pointer-events:none;z-index:4}'+
'.tpb{position:absolute;width:40px;height:60px;pointer-events:none;filter:drop-shadow(0 2px 3px #000a)}'+
'.tpb.r{transform:rotate(8deg)}.tpb.l{transform:rotate(-8deg)}'+
'#tpfx{position:fixed;inset:0;z-index:9;background:#000b;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px}'+
'#tpfx video{width:min(420px,80vw);max-height:68vh;border-radius:14px;border:4px solid var(--gold);box-shadow:0 8px 30px #000;background:#07301a}'+
'#tpfx p{margin:0;font-size:22px;font-weight:800;text-shadow:0 2px 6px #000}';
st.textContent+='.tf i{width:30px!important;height:43px!important;left:-15px!important;top:-21.5px!important;border:2px solid #fff!important;border-radius:6px!important;transform-origin:50% 50%!important;box-shadow:0 2px 6px #000c!important;transition:none}';
/* tas de pioche : angle de la diagonale (degrés) et descente (px) */
var PILE_ANGLE=-28,PILE_DOWN=4;
var FEINT_CD=60;   // attente (en secondes) entre deux feintes, pour tous les joueurs
/* nouvelle table (table2.jpg) : repères en pixels de l'image 1376 x 768 ; places = [avatar x, y, cartes x, y] ; avatars sur les couvercles des toilettes */
var TBL={w:1376,h:768,cx:688,cy:428};
[[1255,375,1155,402],[1085,160,1009,265],[688,150,687,252],[310,160,373,265],[125,372,248,421]].forEach(function(q,i){SEATS[i]=q});
st.textContent+='body{background:#1a1410 url(table2.jpg) 50% 50%/cover no-repeat!important}';
new Image().src='table2.jpg';
st.textContent+='#tas.stk{width:66px;height:46px;filter:drop-shadow(0 6px 6px #000b)}'+
'#pl{margin-top:'+PILE_DOWN+'px}'+
'#tas b{display:none!important}'+
'#fans{z-index:1}#plates{z-index:2}'+
'#tas .tasl{position:absolute;left:50%;top:50%;width:46px;height:66px;margin:-33px 0 0 -23px;transform:rotate('+(90+PILE_ANGLE)+'deg)}'+
'#tas .tasl i{border-width:2px;box-shadow:0 1px 2px #0009}';
st.textContent+='.flz{position:absolute;width:16px;height:16px;margin:-8px 0 0 -8px;line-height:16px;text-align:center;font-size:15px;pointer-events:none;animation:flyorbit 1.6s linear infinite}'+
'@keyframes flyorbit{from{transform:rotate(0deg) translateX(56px) rotate(0deg)}to{transform:rotate(360deg) translateX(56px) rotate(-360deg)}}';
st.textContent+='.soon{position:absolute;left:100%;top:50%;margin-left:14px;transform:translateY(-50%) rotate(-3deg);white-space:normal;text-align:center;line-height:1.15;pointer-events:none;background:linear-gradient(135deg,#ffe27a,#f6b82e 55%,#e8891a);color:#4a2c00;font-weight:900;font-size:12px;letter-spacing:.2px;padding:3px 10px;border-radius:13px;border:2px solid #fff9;box-shadow:0 3px 0 #a97a10,0 0 10px rgba(255,210,80,.6);animation:soonpulse 1.8s ease-in-out infinite}'+
'.soon::before{content:"";position:absolute;left:-9px;top:50%;margin-top:-6px;border:6px solid transparent;border-left:0;border-right:7px solid #f6b82e}'+
'.soon i{font-style:normal;display:inline-block;margin-right:3px;animation:soonbob 1.2s ease-in-out infinite}'+
'@keyframes soonpulse{0%,100%{box-shadow:0 3px 0 #a97a10,0 0 8px rgba(255,210,80,.45)}50%{box-shadow:0 3px 0 #a97a10,0 0 22px rgba(255,210,80,.95)}}'+
'@keyframes soonbob{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-2px) rotate(14deg)}}';
st.textContent+='#hm1 .mb.gr:disabled{opacity:1!important;background:linear-gradient(#3fd6c6,#1b8f9e)!important;box-shadow:0 4px 0 #0b4f58,0 0 12px rgba(63,214,198,.55)!important;color:#fff!important;text-shadow:0 1px 2px #0009!important;cursor:default;animation:mpglow 2.2s ease-in-out infinite}'+
'@keyframes mpglow{0%,100%{box-shadow:0 4px 0 #0b4f58,0 0 8px rgba(63,214,198,.4)}50%{box-shadow:0 4px 0 #0b4f58,0 0 20px rgba(63,214,198,.9)}}';
st.textContent+='@property --cd{syntax:"<angle>";inherits:false;initial-value:360deg}'+
'#feint{background-image:url(feinte.png)!important;background-size:cover!important;background-position:center!important;background-repeat:no-repeat!important}'+
'#feint.cooldown::after{content:"";position:absolute;inset:0;width:auto!important;border-radius:50%;background:conic-gradient(from 0deg,transparent calc(360deg - var(--cd)),rgba(70,70,70,.9) 0)!important;pointer-events:none;animation:feinteCd '+FEINT_CD+'s linear forwards!important}'+
'#feint.cooldown:disabled{opacity:1!important}'+
'@keyframes feinteCd{from{--cd:360deg}to{--cd:0deg}}';
new Image().src='feinte.png';
st.textContent+='#hm1 .mb.dfi:disabled{opacity:1!important;background:linear-gradient(#ff9a62,#d9482b)!important;box-shadow:0 4px 0 #7a2410,0 0 12px rgba(255,150,98,.55)!important;color:#fff!important;text-shadow:0 1px 2px #0009!important;cursor:default;animation:dfglow 2.2s ease-in-out infinite}'+
'@keyframes dfglow{0%,100%{box-shadow:0 4px 0 #7a2410,0 0 8px rgba(255,150,98,.4)}50%{box-shadow:0 4px 0 #7a2410,0 0 20px rgba(255,150,98,.9)}}'+
'.soon.l{left:auto;right:100%;margin-left:0;margin-right:14px;transform:translateY(-50%) rotate(3deg)}'+
'.soon.l::before{left:auto;right:-9px;border-right:0;border-left:7px solid #f6b82e}';
document.head.appendChild(st);
new Image().src=SHEET;

/* >>> RÉGLAGE : nombre de cartes 7 chasse d'eau PAR COULEUR dans le tas (1 = 4 en tout, 2 = 8, 3 = 12, 4 = 16) <<< */
var SEPT_PAR_COULEUR=3;
var KC=[[2,4],[3,6],[4,6],[5,6],[6,6],[8,6],[9,6],[10,6],[11,3],[12,3],[13,3],[100,4]]; // [poids, exemplaires]
var RP={12:0,11:1,10:2,1:3,2:4,3:5,4:6,5:7};
function kIdx(c){
  var v=val(c),cp=c.kid?(parseInt(String(c.kid).split('_')[2],10)||1):1+((c.s|0)%3),o=41,i;
  for(i=0;i<KC.length;i++){if(KC[i][0]===v)return o+Math.min(Math.max(cp,1),KC[i][1])-1;o+=KC[i][1]}
  return -1;
}
function handIdx(c){return c&&RP[c.r]!==undefined?9+(c.s|0)*8+RP[c.r]:-1}
function sevenIdx(c){return c.b?4:5+(c.s|0)}
function sp(el,i){
  if(!el||i<0)return;
  el.classList.add(CL);el.textContent='';
  el.style.backgroundImage='url('+SHEET+')';el.style.backgroundSize='1000% 1000%';
  el.style.backgroundPosition=((i%10)/9*100)+'% '+(Math.floor(i/10)/9*100)+'%';
}
// resserre la main pour qu'elle ne touche jamais l'avatar (22 px de marge à droite de l'avatar)
function layoutHand(){
  var hw=document.getElementById('hw'),mr=document.querySelector('#bot .mrow'),hd=document.getElementById('hand');
  if(!hw||!mr||!hd)return;
  var cs=hd.children,n=cs.length,i;if(n<1)return;
  var avail=hw.clientWidth-mr.offsetWidth-22,ov=n>1?Math.min(44,Math.max(10,(n*62-avail)/(n-1))):0;
  for(i=0;i<n;i++){cs[i].style.marginLeft=(i?-ov:0)+'px';cs[i].style.marginRight='0px'}
}
function skin(){
  if(typeof G==='undefined'||!G||!G.P)return;
  var me=G.P[0],k4=me.k.slice(-4),fe=Array.prototype.forEach;
  fe.call(document.getElementById('hand').children,function(el,i){sp(el,handIdx(me.h[i]))});
  layoutHand();
  var mym=document.getElementById('mym');mym.innerHTML='';
  me.k.slice(-8).forEach(function(c,i){var d=document.createElement('div');d.className='mc2';sp(d,kIdx(c));if(i)d.style.marginLeft='-21px';mym.appendChild(d)});
  renderTray();markOpponents();layoutFans();placePile();renderPile();cueTap();
}
function buildTas(){
  var t=[],i,j,k;
  for(k=0;k<4;k++)for(j=0;j<SEPT_PAR_COULEUR;j++)t.push({r:6,s:k});
  KC.forEach(function(e){for(i=1;i<=e[1];i++)t.push({r:e[0]===100?0:e[0]-1,s:4,kid:'kilo_'+e[0]+'_'+i})});
  return shuf(t);
}
// ----- nouvelle règle : un 7 pioché tire la chasse tout de suite (kilos + 7 sous le tas, même sans kilo)
drawKilo=function(p){
  var c=G.tas.shift();if(!c)return{p:p};
  if(c.r===6){if(p.tp){G.tas.push(c);return{p:p,c:c,sv:1,fl:0,blocked:1}}var n=p.k.length;G.tas.push(c);Array.prototype.push.apply(G.tas,p.k);p.k=[];return{p:p,c:c,sv:1,fl:n}}
  p.k.push(c);return{p:p,c:c};
};
drawFor=function(list){
  var res=list.map(drawKilo);render();
  res.forEach(function(r,k){
    var who=r.p.me?'Tu pioches ':r.p.nm+' pioche ';
    r.txt=!r.c?nm(r.p)+' : tas vide':r.sv?(r.p.me?'Tu pioches un 7 🚽 : ':r.p.nm+' pioche un 7 🚽 : ')+(r.blocked?'toilettes bouchées ! aucun kilo évacué, le 7 retourne sous le tas':r.fl>0?'chasse d\'eau, '+r.fl+' kilo'+(r.fl>1?'s':'')+' évacué'+(r.fl>1?'s':''):'aucun kilo à évacuer, le 7 retourne sous le tas'):who+R[r.c.r]+S[r.c.s]+' → +'+val(r.c)+' kg';
    setTimeout(function(){
      if(!r.c)return;
      fly($('tas'),r.p.me?$('myav'):$('op'+r.p.i),r.c);
      setTimeout(function(){
        if(r.sv){if(r.fl>0)chasse(r.p,r.fl);else if(r.blocked)sBah();else sLevel()}
        else{sBah();sPlop();if(r.p.me)vib(120)}
      },650);
    },k*350);
  });
  return res;
};
// ----- textes des règles mis à jour
function fixRules(){
  var hs=document.querySelectorAll('#rules h3'),i,h,p;
  for(i=0;i<hs.length;i++){
    h=hs[i];p=h.nextElementSibling;if(!p)continue;
    if(h.textContent.indexOf('matériel')>-1)p.textContent='32 cartes de jeu (roi, dame, valet et 2 à 6 dans les 4 couleurs), '+(4*SEPT_PAR_COULEUR)+' cartes 7 chasse d\'eau et 59 cartes kilo de merde, de 3 à 6 joueurs.';
    if(h.textContent.indexOf('distribution')>-1&&p.nextElementSibling&&p.nextElementSibling.tagName==='UL'){var q=p.nextElementSibling.nextElementSibling;if(q&&q.tagName==='P')q.textContent='Le tas de merde, au milieu de la table, contient les '+(4*SEPT_PAR_COULEUR)+' cartes 7 chasse d\'eau et les 59 cartes kilo de merde.'}
    if(h.textContent.indexOf('chasse d')>-1){p.textContent='Si tu pioches un 7, tu tires la chasse d\'eau tout de suite : tous tes kilos de merde et le 7 retournent sous le tas de pioche. Si tu n\'as aucun kilo, le 7 retourne quand même sous le tas. Un bonus acheté au magasin ajoute un 7 spécial que tu gardes en réserve et peux utiliser quand tu veux.';
      var h2=document.createElement('h3');h2.textContent='Bonus : papier toilette, ventouse, mouches et insecticide';var p2=document.createElement('p');p2.textContent='Papier toilette : à ton tour, touche la carte puis un adversaire. Ses toilettes sont bouchées jusqu\'à la fin de la manche : il ne peut plus tirer la chasse d\'eau, et s\'il pioche un 7, le 7 retourne sous le tas sans évacuer ses kilos. Ventouse : à ton tour, retire le papier toilette qu\'on t\'a donné. Mouches : à ton tour, touche la carte puis un adversaire : à chacun de ses tours, il pioche une carte du tas, jusqu\'à la fin de la manche. Insecticide : à ton tour, supprime les mouches que l\'on t\'a envoyées.';p.parentNode.insertBefore(h2,p.nextSibling);p.parentNode.insertBefore(p2,h2.nextSibling)}
  }
}
fixRules();
Array.prototype.forEach.call(document.querySelectorAll('#rules p'),function(p){var t=p.textContent;if(t.indexOf('TAPER')>-1||t.indexOf('SUIVRE')>-1)p.textContent=t.replace(/ton bouton TAPER et le tas( de pioche)? clignotent, et ça bipe\. Touche l'un des deux pour taper\. Il reste bloqué tant que tu n'as pas 4 cartes identiques\./,'le tas de pioche clignote et ça bipe. Touche-le pour taper (il ne réagit que si tu as 4 cartes identiques).').replace('ton bouton TAPER et le tas clignotent','le tas de pioche clignote').replace('touche SUIVRE ou la grosse main au centre','touche le tas de pioche ou la grosse main au centre').replace('avec le bouton SUIVRE','en touchant le tas de pioche')});

// ===== BONUS : papier toilette (toilettes bouchées) et ventouse =====
var BIDX={insecticide:0,mouche:1,papier:2,ventouse:3,chasse:4};   // place des cartes bonus dans la planche
BO[1]={id:'papier',n:'Papier toilette',e:'🧻',p:100,d:'Bouche les toilettes d\'un adversaire pendant la manche'};
BO[2]={id:'ventouse',n:'Ventouse',e:'🪠',p:100,d:'Débouche tes toilettes'};   // prix provisoire
BO[3]={id:'mouche',n:'Mouches',e:'🪰',p:100,d:'Le joueur touché pioche une carte à chacun de ses tours'};   // prix provisoire
BO[4]={id:'insecticide',n:'Insecticide',e:'🧴',p:100,d:'Supprime les mouches que tu as reçues'};   // prix provisoire
function spriteHTML(i,w,h){
  return '<div class="'+CL+'" style="display:inline-block;width:'+w+';height:'+h+';background-image:url('+SHEET+');background-size:1000% 1000%;background-position:'+((i%10)/9*100)+'% '+(Math.floor(i/10)/9*100)+'%"></div>';
}
function fixBonusPv(box,list){
  var its=box.querySelectorAll('.it');
  list.forEach(function(x,i){var pv=its[i]&&its[i].querySelector('.pv');if(pv&&x.id!=='chasse'&&BIDX[x.id]!==undefined)pv.innerHTML=spriteHTML(BIDX[x.id],'40px','60px')});
}
var inBag=function(x){return !x.off&&(PF.bag[x.id]||0)>0};
var _shop=shop;shop=function(t){_shop(t);try{if(t==='bo')fixBonusPv($('shgrid'),BO)}catch(e){}};
var _bag=bag;bag=function(){_bag();try{
  fixBonusPv($('bagl'),BO.filter(inBag));
  Array.prototype.forEach.call($('bagl').querySelectorAll('button'),function(x){x.remove()});   // plus de choix ici : on choisit ses bonus au début de la partie
  var pp=document.querySelector('#bag p');if(pp)pp.textContent='Voici tes bonus. Tu les choisis au début de chaque partie, dans les 3 emplacements.';
}catch(e){}};
var _bsm=bagSelectMode;bagSelectMode=function(){_bsm();try{
  var L=BO.filter(inBag),its=$('bagl').querySelectorAll('.it');
  fixBonusPv($('bagl'),L);
  L.forEach(function(x,i){
    var it=its[i];if(!it)return;
    var bt=it.querySelector('button');if(bt)bt.textContent='Choisir cette carte';
    if(bt&&bt.disabled)return;
    it.style.cursor='pointer';
    it.onclick=function(e){if(e.target.closest&&e.target.closest('button'))return;assignBonusToSlot(x.id)};   // toucher l'image choisit aussi la carte
  });
  var pp=document.querySelector('#bag p');if(pp)pp.textContent='Touche une carte (ou « Choisir cette carte ») pour la mettre dans cet emplacement.';
}catch(e){}};
var _rbs=renderBonusSlots;renderBonusSlots=function(){_rbs();try{document.querySelectorAll('.bslot').forEach(function(el,i){var id=PF.selSlots[i];if(id&&id!=='chasse'&&BIDX[id]!==undefined)el.innerHTML=spriteHTML(BIDX[id],'100%','100%')})}catch(e){}};
useBonus=function(){
  if(!Array.isArray(PF.selSlots))PF.selSlots=[null,null,null];
  var me=G.P[0];me.bn=me.bn||[];
  PF.selSlots.forEach(function(id){
    if(!id||!((PF.bag[id]||0)>0))return;
    PF.bag[id]--;
    if(id==='chasse'){me.s.push({r:6,s:Math.floor(Math.random()*4),b:1});toast('🚽 Bonus activé : un 7 chasse d\'eau en plus')}
    else if(BIDX[id]!==undefined){me.bn.push({id:id});toast((id==='papier'?'🧻 Bonus papier toilette prêt':id==='mouche'?'🪰 Bonus mouches prêt':id==='insecticide'?'🧴 Bonus insecticide prêt':'🪠 Bonus ventouse prêt'))}
  });
  PF.selSlots=[null,null,null];Store.save(PF);renderBonusSlots();
};
// un joueur aux toilettes bouchées ne peut plus tirer la chasse
var _flush=flush;flush=function(p){if(p&&p.tp)return false;return _flush(p)};
// plateau des bonus (même endroit que le 7 bonus) : chaque carte est cliquable
function usableNow(){return !!G&&G.phase==='turn'&&G.cur===0}
(function(){var b=document.getElementById('flush');if(b&&b.tagName==='BUTTON'){var d=document.createElement('div');d.id='flush';d.className=b.className;b.parentNode.replaceChild(d,b)}})();
function renderTray(){
  var fb=document.getElementById('flush');if(!fb||!G||!G.P)return;
  var me=G.P[0],its=[];
  me.s.forEach(function(c){its.push({t:'chasse',idx:sevenIdx(c)})});
  (me.bn||[]).forEach(function(b){if(BIDX[b.id]!==undefined)its.push({t:b.id,idx:BIDX[b.id]})});
  fb.innerHTML='';
  if(!its.length){fb.innerHTML='<div class="c7 e">🚽</div>';return}
  its.forEach(function(x,i){
    var d=document.createElement('div');d.className='c7';d.style.marginLeft=i?'-8px':'0px';sp(d,x.idx);
    if((x.t==='papier'||x.t==='mouche')&&G.tpSel&&G.tgt===x.t)d.classList.add('tpArmed');
    else if((x.t==='chasse'&&OKP.indexOf(G.phase)>-1&&me.k.length&&!me.tp)||(x.t!=='chasse'&&usableNow()))d.classList.add('bUse');
    d.onclick=function(e){e.stopPropagation();useBonusCard(x.t)};
    fb.appendChild(d);
  });
}
function useBonusCard(t){
  if(!G||!G.P)return;au();var me=G.P[0];
  if(t==='chasse'){
    if(OKP.indexOf(G.phase)<0)return;
    if(me.tp){toast('🧻 Toilettes bouchées ! Pas de chasse d\'eau jusqu\'à la fin de la manche');return}
    if(!me.k.length){toast('Aucun kilo à évacuer');return}
    flush(me);return;
  }
  if(!usableNow()){toast('Ce bonus s\'utilise pendant ton tour');return}
  if(t==='papier'||t==='mouche'){
    if(G.tpSel&&G.tgt===t){G.tpSel=false;G.tgt=null;render();return}
    if(!G.P.some(function(p){return canTarget(p,t)})){toast(t==='papier'?'Tous les adversaires ont déjà les toilettes bouchées':'Tous les adversaires ont déjà les mouches');return}
    G.tpSel=true;G.tgt=t;render();msg(t==='papier'?'🧻 Touche l\'adversaire à qui donner le papier toilette':'🪰 Touche l\'adversaire à qui envoyer les mouches');return;
  }
  if(t==='insecticide'){
    if(!me.fl){toast('🧴 Tu n\'as pas de mouches à supprimer');return}
    useInsecticide(me);return;
  }
  if(t==='ventouse'){
    if(!me.tp){toast('🪠 Tu n\'as pas de papier toilette à retirer');return}
    useVentouse(me);
  }
}
function canTarget(p,t){return !p.me&&(t==='mouche'?!p.fl:!p.tp)}
function sideOf(p){var q=SEATS[G.seats[p.i-1]];return (q[2]-q[0])>100?'l':'r'}
function markOpponents(){
  if(G.tpSel&&!usableNow())G.tpSel=false;
  var L=document.getElementById('tpl');if(!L){L=document.createElement('div');L.id='tpl';document.body.appendChild(L)}
  L.innerHTML='';ensureFlz().innerHTML='';var B=bgBox();
  G.P.forEach(function(p){
    if(!p.tp&&!p.fl)return;var x,y,side;
    if(p.me){
      var r=document.querySelector('#bot .avw');if(!r)return;
      var rc=r.getBoundingClientRect(),cx=rc.left+rc.width/2,cy=rc.top+rc.height/2;
      if(matchMedia('(orientation:portrait)').matches){var t0=cx;cx=cy;cy=innerWidth-t0}
      x=cx;y=cy;side='l';
    }else{var q=SEATS[G.seats[p.i-1]];x=B.ox+B.s*q[0];y=B.oy+B.s*q[1];side=sideOf(p)}
    var W=matchMedia('(orientation:portrait)').matches?innerHeight:innerWidth,cnt=(p.tp?1:0)+(p.fl?1:0),tot=40+26*(cnt-1);
    var above=!p.me&&(x<112||x>W-112);   // joueurs au bord de l'écran : cartes malus au-dessus de l'avatar pour rester entièrement visibles
    var n2=0;
    [['tp',BIDX.papier],['fl',BIDX.mouche]].forEach(function(z){
      if(!p[z[0]])return;var d=document.createElement('div');d.className='tpb '+(above?'u':side);sp(d,z[1]);
      var lf=above?x-tot/2+26*n2:(side==='l'?x-72-26*n2:x+32+26*n2),tt=above?y-92:y-42+10*n2;
      lf=Math.max(4,Math.min(W-44,lf));
      d.style.left=lf+'px';d.style.top=tt+'px';L.appendChild(d);n2++;
    });
    if(p.fl){var LF=ensureFlz();for(var k=0;k<3;k++){var f=document.createElement('div');f.className='flz';f.textContent='🪰';f.style.left=x+'px';f.style.top=y+'px';f.style.animationDelay=(-k*.55)+'s';f.style.animationDuration=(1.5+k*.35)+'s';(p.me?L:LF).appendChild(f)}}
  });
  G.P.forEach(function(p){
    if(p.me)return;var el=document.getElementById('op'+p.i);if(!el)return;
    el.classList.toggle('tpt',!!G.tpSel&&canTarget(p,G.tgt||'papier'));
  });
}
document.addEventListener('click',function(e){
  if(!G||!G.tpSel||!e.target.closest)return;
  var el=e.target.closest('.op.tpt');if(!el)return;
  var p=G.P[parseInt(el.id.slice(2),10)];if(p&&canTarget(p,G.tgt||'papier')){if(G.tgt==='mouche')giveFlies(G.P[0],p);else giveTP(G.P[0],p)}
},true);
function ensureFlz(){var L=document.getElementById('flzl');if(!L){L=document.createElement('div');L.id='flzl';document.body.appendChild(L)}return L}
function ensureTpl(){var L=document.getElementById('tpl');if(!L){L=document.createElement('div');L.id='tpl';document.body.appendChild(L)}return L}
(function(){   // vidéos de tape / feinte : les cartes malus passent sous la fenêtre ; pendant le décompte elles restent au-dessus
  var stg=document.getElementById('stage');ensureTpl();
  if(stg&&window.MutationObserver)new MutationObserver(function(){ensureTpl().style.zIndex=stg.querySelector('video')?'2':''}).observe(stg,{childList:true,subtree:true});
})();
function fxAnim(done,src,caption){
  var ov=document.createElement('div');ov.id='tpfx';
  ov.innerHTML='<video src="'+src+'" playsinline preload="auto"></video><p></p>';ov.querySelector('p').textContent=caption;
  document.body.appendChild(ov);fxp++;var ended=false,e0=ep;ensureTpl().style.visibility='hidden';ensureFlz().style.visibility='hidden';   // pas de cartes malus visibles pendant la vidéo
  function end(){if(ended)return;ended=true;fxp--;ov.remove();ensureTpl().style.visibility='';ensureFlz().style.visibility='';if(e0===ep)done()}
  var v=ov.querySelector('video');v.muted=!(PF.set&&PF.set.sound);
  var pr=v.play();if(pr&&pr.catch)pr.catch(function(){v.muted=true;var q=v.play();if(q&&q.catch)q.catch(function(){})});
  v.onerror=function(){setTimeout(end,1200)};
  v.ontimeupdate=function(){if(v.currentTime>=4.45)end()};
  v.onended=end;setTimeout(end,5000);
}
function tpCaption(from,t){return from.me?'🧻 Tu bouches les toilettes de '+t.nm+' !':t.me?'🧻 '+from.nm+' bouche tes toilettes !':'🧻 '+from.nm+' bouche les toilettes de '+t.nm+' !'}
// donne le papier toilette (joueur ou IA) : animation, puis les toilettes de la cible sont bouchées jusqu'à la fin de la manche
function giveTP(from,t){
  var k=(from.bn||[]).findIndex(function(b){return b.id==='papier'});if(k<0)return false;
  from.bn.splice(k,1);G.tpSel=false;G.tgt=null;
  if(from.me){G.tk=(G.tk||0)+1;clearRing()}
  render();sWhoosh();
  fxAnim(function(){
    t.tp={round:G.round};render();sPlop();
    msg(tpCaption(from,t)+' (jusqu\'à la fin de la manche)');
    toast(t.me?'🧻 '+from.nm+' t\'a donné le papier toilette : tes toilettes sont bouchées jusqu\'à la fin de la manche !':'🧻 Toilettes bouchées pour '+t.nm+' !',3200);
    if(from.me){if(G.phase==='turn'&&G.cur===0)startTimer()}else later(aiTurn,500);
  },'toilettes_bouchees.mp4',tpCaption(from,t));
  return true;
}
// mouches (joueur ou IA) : la cible pioche une carte à chacun de ses tours, jusqu'à la fin de la manche
function fliesCaption(from,t){return from.me?'🪰 Tu envoies les mouches sur '+t.nm+' !':t.me?'🪰 '+from.nm+' t\'envoie les mouches !':'🪰 '+from.nm+' envoie les mouches sur '+t.nm+' !'}
function giveFlies(from,t){
  var k=(from.bn||[]).findIndex(function(b){return b.id==='mouche'});if(k<0)return false;
  from.bn.splice(k,1);G.tpSel=false;G.tgt=null;
  if(from.me){G.tk=(G.tk||0)+1;clearRing()}
  render();sWhoosh();
  fxAnim(function(){
    t.fl={round:G.round};render();sPlop();
    msg(fliesCaption(from,t)+' (jusqu\'à la fin de la manche)');
    toast(t.me?'🪰 '+from.nm+' t\'a envoyé les mouches : tu pioches une carte à chacun de tes tours jusqu\'à la fin de la manche !':'🪰 Mouches sur '+t.nm+' !',3200);
    if(from.me){if(G.phase==='turn'&&G.cur===0)startTimer()}else later(aiTurn,500);
  },'mouches.mp4',fliesCaption(from,t));
  return true;
}
// insecticide (joueur ou IA) : supprime les mouches que l'on a reçues
function useInsecticide(p){
  var k=(p.bn||[]).findIndex(function(b){return b.id==='insecticide'});if(k<0||!p.fl)return false;
  p.bn.splice(k,1);
  if(p.me){G.tk=(G.tk||0)+1;clearRing()}
  render();sWhoosh();
  var cap='🧴 '+(p.me?'Tu supprimes les mouches':p.nm+' supprime les mouches')+' !';
  fxAnim(function(){
    p.fl=null;render();sPlop();msg(cap);toast(cap,2600);
    if(p.me){if(G.phase==='turn'&&G.cur===0)startTimer()}else later(aiTurn,500);
  },'insecticide.mp4',cap);
  return true;
}
// ventouse (joueur ou IA) : retire le papier toilette que l'on a reçu
function useVentouse(p){
  var k=(p.bn||[]).findIndex(function(b){return b.id==='ventouse'});if(k<0||!p.tp)return false;
  p.bn.splice(k,1);
  if(p.me){G.tk=(G.tk||0)+1;clearRing()}
  render();sWhoosh();
  var cap='🪠 '+(p.me?'Tu débouches tes toilettes':p.nm+' débouche ses toilettes')+' !';
  fxAnim(function(){
    p.tp=null;render();sPlop();msg(cap);toast(cap,2600);
    if(p.me){if(G.phase==='turn'&&G.cur===0)startTimer()}else later(aiTurn,500);
  },'ventouse.mp4',cap);
  return true;
}
// ----- les IA ont aussi des bonus et les utilisent pendant leur tour
var AI_SLOTS=3,AI_BONUS_CHANCE=.75;   // comme toi : chaque IA choisit ses bonus au début de la partie (3 emplacements)
var AI_USE=.6;                         // chance d'utiliser un bonus d'attaque à un tour où elle y est autorisée
function randomBonusId(){var r=Math.random();return r<.35?'papier':r<.7?'mouche':r<.85?'chasse':r<.93?'ventouse':'insecticide'}
function addBonus(p,id){if(id==='chasse')p.s.push({r:6,s:Math.floor(Math.random()*4),b:1});else(p.bn=p.bn||[]).push({id:id})}
function giveAIBonus(){
  G.P.forEach(function(p){
    if(p.me)return;p.bn=[];p.used=0;p.ou=0;p.tr=0;
    for(var i=0;i<AI_SLOTS;i++)if(Math.random()<AI_BONUS_CHANCE)addBonus(p,randomBonusId());
    p.n0=p.bn.filter(function(b){return b.id==='papier'||b.id==='mouche'}).length;   // bonus d'attaque à répartir sur les manches
  });
}
function aiBonus(p){
  var bn=p.bn||[],has=function(id){return bn.some(function(b){return b.id===id})};
  var key=G.round+':'+G.tc+':'+p.i;if(p.bk!==key){p.bk=key;p.tr=(p.tr||0)+1}   // compte ses tours dans la manche
  // se défendre quand on est touché
  if(p.tp&&has('ventouse')&&Math.random()<.9)return useVentouse(p);
  if(p.fl&&has('insecticide')&&Math.random()<.9)return useInsecticide(p);
  // chasse d'eau bonus : quand elle a pas mal de kilos et que ses toilettes ne sont pas bouchées
  if(p.s.some(function(c){return c.b})&&p.k.length&&!p.tp&&kil(p)>=8&&Math.random()<.5&&flush(p)){later(aiTurn,1900);return true}
  // attaquer progressivement : 1 bonus au plus par manche, jamais avant son 2e tour, et en les répartissant sur toutes les manches
  var allowed=Math.ceil((p.n0||0)*G.round/(G.rounds||1));
  if((p.ou||0)>=1||(p.used||0)>=allowed||(p.tr||0)<2||Math.random()>=AI_USE)return false;
  if(has('papier')){   // papier toilette : seulement si la cible a des kilos à protéger ou un 7 en réserve
    var c=G.P.filter(function(q){return q!==p&&!q.tp&&(kil(q)>=3||q.s.length)});
    if(c.length){c.sort(function(x,y){return kil(y)-kil(x)||Math.random()-.5});p.ou=1;p.used=(p.used||0)+1;return giveTP(p,c[0])}
  }
  if(has('mouche')){   // mouches : sur celui qui a le moins de kilos
    var c2=G.P.filter(function(q){return q!==p&&!q.fl});
    if(c2.length){c2.sort(function(x,y){return kil(x)-kil(y)||Math.random()-.5});p.ou=1;p.used=(p.used||0)+1;return giveFlies(p,c2[0])}
  }
  return false;
}
var _aiTurn=aiTurn;aiTurn=function(){var p=G.P[G.cur];if(p&&!p.me&&aiBonus(p))return;_aiTurn()};
var _turn=turn;
turn=function(){
  try{
    var p=G.P[G.cur];
    if(p&&p.fl){
      var key=G.round+':'+G.tc+':'+G.cur;
      if(p.flk!==key){
        p.flk=key;var res=drawFor([p]);
        toast('🪰 Les mouches : '+(p.me?'tu pioches':p.nm+' pioche')+' une carte',2400);
        if(p.me&&res[0]&&res[0].sv&&res[0].fl>0)later(function(){if(G.phase==='turn'&&G.cur===0){G.tk=(G.tk||0)+1;clearRing();startTimer()}},3700);
      }
    }
  }catch(e){}
  _turn();
};
// l'effet se termine à chaque nouvelle manche ; les bonus non utilisés retournent dans le sac à la fin de la partie
var _sr=startRound;startRound=function(){try{G.P.forEach(function(p){p.tp=null;p.fl=null});G.tpSel=false;G.tgt=null;G.P.forEach(function(p){p.ou=0;p.tr=0})}catch(e){}_sr()};
var _fin=finish;finish=function(){
  try{if(G&&G.P&&!G.finalResultsApplied){var n=0;(G.P[0].bn||[]).forEach(function(b){PF.bag[b.id]=(PF.bag[b.id]||0)+1;n++});G.P[0].bn=[];if(n){Store.save(PF);setTimeout(function(){toast('👝 Bonus non utilisé : retourné dans ton sac',3000)},3400)}}}catch(e){}
  _fin.apply(this,arguments);
};

// ===== mains des adversaires : éventail façon UNO (dos des cartes bien visibles) =====
// réglages par place autour de la table (poussée, rotation en degrés, décalage) pour que les mains de joueurs voisins ne se touchent jamais
var FANCFG={0:{push:0,rot:0,lat:0},1:{push:0,rot:0,lat:0},2:{push:0,rot:0,lat:0},3:{push:0,rot:-15,lat:0},4:{push:0,rot:0,lat:0}};
function layoutFans(){
  if(typeof G==='undefined'||!G||!G.P)return;
  var sc=Math.min(1.2,Math.max(.85,bgBox().s/.547));
  G.P.forEach(function(p){
    if(p.me)return;var f=document.getElementById('fan'+p.i);if(!f)return;
    var seat=G.seats[p.i-1],q=SEATS[seat],c=FANCFG[seat]||{push:0,rot:0,lat:0};
    var a0=Math.atan2(q[3]-q[1],q[2]-q[0])+c.rot*Math.PI/180,nx=Math.cos(a0),ny=Math.sin(a0),ux=-ny,uy=nx,ang=a0*180/Math.PI-90;
    var cs=f.children,n=cs.length,gap=11,pick=(G.pick&&G.pick.i===p.i)?G.pick.idx:-1,i,t,lat,al,x,y;
    for(i=0;i<n;i++){
      t=i-(n-1)/2;lat=t*gap;al=14+c.push-lat*lat*.0036;       // éventail : bords un peu plus près du joueur
      x=(ux*(lat+c.lat)+nx*al)*sc;y=(uy*(lat+c.lat)+ny*al)*sc;
      if(i===pick){x+=nx*30*sc;y+=ny*30*sc}                    // carte choisie : sortie de l'éventail, dos visible
      cs[i].style.transition=pick>=0?'transform .3s ease,filter .3s ease':'none';
      cs[i].style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px) rotate('+(ang+t*6).toFixed(1)+'deg) scale('+(sc*(i===pick?1.12:1)).toFixed(3)+')';
      cs[i].style.zIndex=i===pick?30:i;
      cs[i].style.filter=i===pick?'drop-shadow(0 0 9px #ffd34d)':'';
    }
  });
}
// une IA sort d'abord la carte qu'elle va donner (0,6 s), puis la donne
var _give1=give1;
give1=function(i,k){
  if(i===0||typeof G==='undefined'||!G||!G.P)return _give1(i,k);
  G.pick={i:i,idx:k};layoutFans();sCard();
  later(function(){
    G.pick=null;
    if(G.phase!=='turn'||G.cur!==i){layoutFans();return}
    _give1(i,k);
  },600);
};

// ===== tas de pioche horizontal, plus épais, qui s'amincit quand on pioche =====
function pr(i,k){var v=Math.sin(i*12.9898+k*78.233)*43758.5453;return v-Math.floor(v)}
function placePile(){   // le tas au centre de la nouvelle table
  var B=bgBox(),px=B.ox+B.s*TBL.cx,py=B.oy+B.s*TBL.cy,a=document.getElementById('pl'),m=document.getElementById('mc'),l=document.getElementById('lc');
  if(a){a.style.left=px+'px';a.style.top=py+'px'}if(m){m.style.left=(px+112)+'px';m.style.top=py+'px'}if(l){l.style.left=(px-112)+'px';l.style.top=py+'px'}
}
function cueTap(){   // pas de bouton : le tas clignote quand il faut le toucher pour suivre
  var t=document.getElementById('tas');if(!t||typeof G==='undefined'||!G||!G.P)return;var c=G.call;
  if(G.phase==='call'&&c&&c.i!==0&&!c.fol.some(function(f){return f.p===G.P[0]}))t.classList.add('ok');
}
function renderPile(){
  var t=document.getElementById('tas');if(typeof G==='undefined'||!t||!G||!G.tas)return;
  Array.prototype.slice.call(t.children).forEach(function(e){if(e.tagName==='I')e.remove()});   // anciennes cartes de l'ancien tas
  var n=Math.max(3,Math.min(12,Math.round(G.tas.length/6))),w=t.querySelector('.tasl');
  if(!w){w=document.createElement('div');w.className='tasl';t.insertBefore(w,t.firstChild)}
  if(w.getAttribute('data-n')===String(n))return;
  w.setAttribute('data-n',n);w.innerHTML='';
  for(var i=0;i<n;i++){
    var d=document.createElement('i'),top=i===n-1,j=top?.25:1,dep=(n-1-i)*1.0;   // les cartes du dessous dépassent vers le bas de l'écran, face au joueur
    var R=(90+PILE_ANGLE)*Math.PI/180,x=dep*Math.sin(R)+(pr(i,1)-.5)*2.6*j,y=dep*Math.cos(R)+(pr(i,2)-.5)*3*j,a=(pr(i,3)-.5)*7*j;
    d.style.transform='translate('+x.toFixed(2)+'px,'+y.toFixed(2)+'px) rotate('+a.toFixed(2)+'deg)';
    w.appendChild(d);
  }
}
// ===== boutique : zoom sur un objet (flèches gauche/droite, croix pour quitter) =====
st.textContent+=
'#toasts{z-index:14}'+
'.it.zo{cursor:pointer;position:relative;transition:transform .15s,box-shadow .2s}.it.zo:active{transform:scale(.96)}'+
'.it.zo::after{content:"🔍";position:absolute;right:4px;top:2px;font-size:11px;opacity:.75;pointer-events:none}'+
'#zoomv{position:fixed;inset:0;z-index:13;display:none;align-items:center;justify-content:center;flex-direction:column;overflow:hidden;background:radial-gradient(circle at 50% 42%,rgba(255,210,80,.30),rgba(6,20,14,.94) 68%);-webkit-backdrop-filter:blur(7px);backdrop-filter:blur(7px)}'+
'#zoomv.on{display:flex;animation:zfade .35s ease both}'+
'@keyframes zfade{from{opacity:0}to{opacity:1}}'+
'.zrays{position:absolute;left:50%;top:44%;width:620px;height:620px;margin:-310px 0 0 -310px;background:repeating-conic-gradient(rgba(255,215,90,.32) 0 7deg,transparent 7deg 20deg);-webkit-mask:radial-gradient(circle,#000 6%,transparent 66%);mask:radial-gradient(circle,#000 6%,transparent 66%);animation:zspin 26s linear infinite;pointer-events:none}'+
'@keyframes zspin{to{transform:rotate(360deg)}}'+
'.zsp{position:absolute;inset:0;pointer-events:none}.zsp i{position:absolute;color:#ffe27a;font-style:normal;text-shadow:0 0 8px #ffd34d;opacity:0;animation:ztw 2.6s ease-in-out infinite}'+
'@keyframes ztw{0%,100%{opacity:0;transform:scale(.4) rotate(0)}50%{opacity:1;transform:scale(1.25) rotate(90deg)}}'+
'.zstage{position:relative;display:flex;align-items:center;justify-content:center;touch-action:pan-y}'+
'.zitem{position:relative;overflow:hidden;animation:zpop .6s cubic-bezier(.2,1.4,.3,1) both,zfloat 3.4s ease-in-out .6s infinite;box-shadow:0 0 34px rgba(255,210,80,.55),0 10px 30px #000c}'+
'.zitem.circ{border-radius:50%}.zitem.card{border-radius:12px}'+
'.zitem.nr{animation:zinr .45s cubic-bezier(.2,1.2,.3,1) both,zfloat 3.4s ease-in-out .45s infinite}'+
'.zitem.nl{animation:zinl .45s cubic-bezier(.2,1.2,.3,1) both,zfloat 3.4s ease-in-out .45s infinite}'+
'@keyframes zpop{from{transform:scale(.25) rotate(-14deg);opacity:0;filter:blur(8px)}to{transform:none;opacity:1;filter:none}}'+
'@keyframes zinr{from{transform:translateX(110px) scale(.65) rotate(10deg);opacity:0}to{transform:none;opacity:1}}'+
'@keyframes zinl{from{transform:translateX(-110px) scale(.65) rotate(-10deg);opacity:0}to{transform:none;opacity:1}}'+
'@keyframes zfloat{0%,100%{translate:0 0}50%{translate:0 -7px}}'+
'.zitem::after{content:"";position:absolute;inset:0;background:linear-gradient(115deg,transparent 35%,rgba(255,255,255,.6) 50%,transparent 65%);transform:translateX(-130%);animation:zshine 2.8s ease-in-out 1s infinite;pointer-events:none;mix-blend-mode:overlay}'+
'@keyframes zshine{to{transform:translateX(130%)}}'+
'.zav{border:5px solid #f6b82e;background:#3a2410}.zav .av{width:100%;height:100%;border:0;border-radius:50%}.zav svg{width:100%;height:100%;display:block}'+
'.zback{border:3px solid #fff;border-radius:10px;background-size:cover!important;background-position:center!important}'+
'.zar,.zx{position:absolute;z-index:3;border:2px solid rgba(255,230,140,.75);background:rgba(20,30,24,.55);color:#ffe27a;border-radius:50%;width:46px;height:46px;font-size:28px;line-height:1;display:flex;align-items:center;justify-content:center;padding:0;cursor:pointer;-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);transition:transform .15s}'+
'.zar:active,.zx:active{transform:scale(.86)}'+
'.zar{top:50%;margin-top:-23px;animation:zpulse 2s ease-in-out infinite}.zar.zl{left:max(14px,env(safe-area-inset-left))}.zar.zr{right:max(14px,env(safe-area-inset-right))}'+
'@keyframes zpulse{0%,100%{box-shadow:0 0 8px rgba(255,210,80,.35)}50%{box-shadow:0 0 22px rgba(255,210,80,.85)}}'+
'.zx{right:max(12px,env(safe-area-inset-right));top:max(10px,env(safe-area-inset-top));font-size:22px;font-weight:900;box-shadow:0 0 14px rgba(255,210,80,.5)}'+
'.zg{position:absolute;left:max(12px,env(safe-area-inset-left));top:max(10px,env(safe-area-inset-top));z-index:3}'+
'.zinfo{position:relative;z-index:2;text-align:center;margin-top:10px;display:flex;flex-direction:column;align-items:center;gap:2px;animation:zfade .5s .15s both}'+
'.zn{font-size:19px;color:#ffe27a;text-shadow:0 2px 0 #000,0 0 12px rgba(255,210,80,.65)}.zd{opacity:.85;font-size:12px;max-width:340px;line-height:1.3}.zc{font-size:11px;opacity:.65}'+
'.zact{display:flex;gap:8px;align-items:center;min-height:26px}.zact button{font-size:13px;padding:4px 14px;border-radius:10px;border:0;font-weight:800;background:var(--gold);color:#222;box-shadow:0 3px 0 #a97a10}.zact button:disabled{box-shadow:none}.zact small{opacity:.8}';
(function(){
  var zv=document.createElement('div');zv.id='zoomv';
  zv.innerHTML='<div class="zrays"></div><div class="zsp"></div><span class="chip zg"><img class=pc src=piece.png> <b id="zgv">0</b></span>'+
    '<button class="zx" aria-label="Fermer">✕</button><button class="zar zl" aria-label="Précédent">‹</button><button class="zar zr" aria-label="Suivant">›</button>'+
    '<div class="zstage"><div class="zitem"></div></div>'+
    '<div class="zinfo"><b class="zn"></b><span class="zd"></span><div class="zact"></div><span class="zc"></span></div>';
  document.body.appendChild(zv);
  var sp=zv.querySelector('.zsp'),k;
  for(k=0;k<16;k++){var s2=document.createElement('i');s2.textContent=k%3?'✦':'✧';s2.style.left=(Math.random()*96+1)+'%';s2.style.top=(Math.random()*90+4)+'%';s2.style.fontSize=(10+Math.random()*14)+'px';s2.style.animationDelay=(-Math.random()*2.6)+'s';s2.style.animationDuration=(2+Math.random()*2)+'s';sp.appendChild(s2)}
  var ZT=null,ZI=0,ZL=[],COIN='<img class=pc src=piece.png> ';
  var IAP=[[500,'0,99 €'],[1200,'1,99 €'],[3000,'4,99 €'],[7000,'9,99 €']];
  function zList(t){
    if(t==='sk')return SK.map(function(x,i){return{t:t,i:i,n:x.n,p:x.p}});
    if(t==='bk')return BK.map(function(x,i){return{t:t,i:i,n:x.n,p:x.p,bg:x.bg}});
    if(t==='bo')return BO.map(function(x){return{t:t,id:x.id,n:x.n,d:x.d,p:x.p,off:x.off}});
    return IAP.map(function(x,i){return{t:'iap',i:i,n:x[0]+' or',d:x[1]}});
  }
  function zh(){return(window.matchMedia&&matchMedia('(orientation:portrait)').matches)?innerWidth:innerHeight}
  function zInfo(){
    var it=ZL[ZI],a='';
    zv.querySelector('#zgv').textContent=PF.gold;
    if(it.t==='iap')a='<button disabled>Bientôt</button>';
    else if(it.t==='bo')a=it.off?'<button disabled>Bientôt</button>':'<button data-a="buy">'+COIN+it.p+'</button><small>En sac : '+(PF.bag[it.id]||0)+'</small>';
    else if(PF.eq[it.t]===it.i)a='<button disabled>Équipé ✓</button>';
    else if(PF.own[it.t].indexOf(it.i)>-1)a='<button data-a="equip">Équiper</button>';
    else a='<button data-a="buy">'+COIN+it.p+'</button>';
    zv.querySelector('.zact').innerHTML=a;
  }
  function zRender(dir){
    var it=ZL[ZI],box=zv.querySelector('.zitem'),ih=Math.max(120,Math.min(270,zh()*.56)),h='',cls='zitem';
    if(it.t==='sk'){var d=Math.round(ih*.95);cls+=' circ zav';h='<div style="width:'+(d-10)+'px;height:'+(d-10)+'px">'+avatar(it.i)+'</div>'}
    else if(it.t==='bk'){var bg=it.bg+(it.bg.indexOf('url(')===0?' center/cover no-repeat':'');cls+=' card zback';h='<div style="width:'+Math.round(ih*.7)+'px;height:'+Math.round(ih)+'px;background:'+bg+'"></div>'}
    else if(it.t==='bo'){cls+=' card';h=spriteHTML(BIDX[it.id]!==undefined?BIDX[it.id]:4,Math.round(ih*.671)+'px',Math.round(ih)+'px')}
    else{cls+=' circ';h='<img src="piece.png" style="width:'+Math.round(ih*.8)+'px;height:'+Math.round(ih*.8)+'px;display:block;padding:10px;background:radial-gradient(circle,#fff6c9,#f6b82e 70%)" alt="">'}
    box.className=cls+(dir>0?' nr':dir<0?' nl':'');box.innerHTML=h;
    if(it.t==='sk'){box.style.width=box.style.height=Math.round(ih*.95)+'px'}else{box.style.width=box.style.height=''}
    void box.offsetWidth;
    zv.querySelector('.zn').textContent=it.n;zv.querySelector('.zd').textContent=it.d||(it.t==='sk'?'Personnage':it.t==='bk'?'Dos de cartes':'');
    zv.querySelector('.zc').textContent=(ZI+1)+' / '+ZL.length;zInfo();
  }
  function open(t,i){ZT=t;ZL=zList(t);ZI=i;zv.classList.remove('on');void zv.offsetWidth;zv.classList.add('on');zRender(0);sCard()}
  function close(){zv.classList.remove('on')}
  function step(d){if(!zv.classList.contains('on')||!ZL.length)return;ZI=(ZI+d+ZL.length)%ZL.length;zRender(d);sCard()}
  zv.querySelector('.zx').onclick=close;zv.querySelector('.zl').onclick=function(){step(-1)};zv.querySelector('.zr').onclick=function(){step(1)};
  zv.querySelector('.zact').onclick=function(e){
    var b=e.target.closest&&e.target.closest('button');if(!b||b.disabled)return;var it=ZL[ZI],a=b.getAttribute('data-a');
    if(a==='buy')buy(it.t,it.t==='bo'?it.id:it.i);else if(a==='equip')equip(it.t,it.i);
    zInfo();
  };
  zv.addEventListener('click',function(e){if(e.target===zv||e.target.classList.contains('zsp')||e.target.classList.contains('zrays')||e.target.classList.contains('zstage'))close()});
  var x0=null;zv.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
  zv.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>50)step(dx<0?1:-1)},{passive:true});
  document.addEventListener('keydown',function(e){if(!zv.classList.contains('on'))return;if(e.key==='Escape')close();else if(e.key==='ArrowLeft')step(-1);else if(e.key==='ArrowRight')step(1)});
  window.addEventListener('resize',function(){if(zv.classList.contains('on'))zRender(0)});
  var _shop3=shop;shop=function(t){_shop3(t);try{
    Array.prototype.forEach.call($('shgrid').querySelectorAll('.it'),function(el,i){el.classList.add('zo');el.onclick=function(e){if(e.target.closest&&e.target.closest('button'))return;open(t,i)}});
  }catch(e){}};
  window.__zoom={open:open,close:close,step:step};
})();
// ===== menu : « Bientôt disponible » à côté du bouton Multijoueurs =====
(function(){
  var b=document.querySelector('#hm1 .mb.gr');if(!b||b.parentNode.classList.contains('soonw'))return;
  var w=document.createElement('div');w.className='soonw';w.style.position='relative';
  b.parentNode.insertBefore(w,b);w.appendChild(b);b.style.width='100%';
  var t=document.createElement('span');t.className='soon';t.innerHTML='<i>🚀</i>Bientôt<br>disponible';w.appendChild(t);
})();
// ===== bouton feinte : attente de 60 s avec un grisé qui se retire en tournant =====
startFeintCd=function(){
  var game=G;G.P[0].fcEnd=performance.now()+FEINT_CD*1000;
  var btn=$('feint');btn.classList.remove('cooldown');void btn.offsetWidth;btn.classList.add('cooldown');
  setTimeout(function(){if(G!==game)return;btn.classList.remove('cooldown');if(G&&G.P)render()},FEINT_CD*1000+50);
};
var _startCall=startCall;startCall=function(i,real,after){   // une feinte lancée par une IA déclenche aussi l'attente de 60 s
  _startCall(i,real,after);
  try{if(!real&&i!==0&&G&&G.P[i])G.P[i].fcEnd=performance.now()+FEINT_CD*1000}catch(e){}
};
Array.prototype.forEach.call(document.querySelectorAll('#rules p'),function(p){if(p.textContent.indexOf('45 secondes')>-1)p.textContent=p.textContent.replace(/45 secondes/g,FEINT_CD+' secondes')});
// ===== menu : onglet « Défis » au-dessus de Magasin, avec l'étiquette « Bientôt disponible » =====
(function(){
  var shopBtn=document.querySelector('#hm1 .col button[onclick="openShop()"]');if(!shopBtn||document.querySelector('#hm1 .mb.dfi'))return;
  var w=document.createElement('div');w.className='soonw';w.style.position='relative';
  var b=document.createElement('button');b.className='mb dfi';b.disabled=true;b.style.width='100%';b.textContent='🎯 DÉFIS';
  var t=document.createElement('span');t.className='soon l';t.innerHTML='<i>🚀</i>Bientôt<br>disponible';
  w.appendChild(b);w.appendChild(t);shopBtn.parentNode.insertBefore(w,shopBtn);
})();
// ----- branchement sur le jeu existant
var _render=render;render=function(){_render.apply(this,arguments);try{skin()}catch(e){}};
var _start=start;start=function(n){_start(n);try{['toilettes_bouchees.mp4','ventouse.mp4','mouches.mp4','insecticide.mp4'].forEach(function(u){fetch(u).catch(function(){})})}catch(e){}try{G.tas=buildTas();giveAIBonus();render()}catch(e){}};
var _fly=fly;fly=function(a,b,c){
  var n=document.body.children.length;_fly(a,b,c);
  try{
    if(c&&!c.hide&&document.body.children.length>n){
      var e=document.body.lastElementChild;
      if(e&&e.classList.contains('mc')){e.className='mc '+CL;sp(e,c.kid?kIdx(c):(c.r===6?sevenIdx(c):kIdx(c)))}
    }
  }catch(x){}
};

// ===== retour dans l'appli (après avoir réduit le jeu) : recalcul de la mise en page + pause =====
var lastBox=null,hiddenPause=false,refreshT=null,_bgBox=bgBox;
bgBox=function(){   // en portrait le jeu est tourné de 90° : largeur et hauteur de l'écran sont inversées
  var de=document.documentElement,vw=de.clientWidth||innerWidth,vh=de.clientHeight||innerHeight;
  var port=!!(window.matchMedia&&matchMedia('(orientation:portrait)').matches);
  var W=port?vh:vw,H=port?vw:vh;
  if(!(W>100&&H>100))return lastBox||_bgBox();
  var sc=Math.max(W/TBL.w,H/TBL.h);lastBox={s:sc,ox:(W-TBL.w*sc)/2,oy:(H-TBL.h*sc)*.5};return lastBox;
};
function refreshView(){
  if(typeof G==='undefined'||!G||!G.P)return;
  try{
    var rg=document.getElementById('rings');if(rg&&!rg.children.length&&G.n>1)buildRings();
    render();
    ['opps','fans','plates','rings','tpl'].forEach(function(id){var e=document.getElementById(id);if(e){e.style.display='none';void e.offsetHeight;e.style.display=''}});
  }catch(e){}
}
function scheduleRefresh(){clearTimeout(refreshT);refreshT=setTimeout(refreshView,150);setTimeout(refreshView,900)}
function backFromHidden(){
  if(hiddenPause){
    hiddenPause=false;
    var qv=document.getElementById('qv');if(!(qv&&qv.style.display==='flex'))paused=false;
    if(G&&G.P&&G.phase==='turn'&&G.cur===0){G.tk=(G.tk||0)+1;clearRing();startTimer()}   // ton chrono repart à zéro
  }
  scheduleRefresh();
}
document.addEventListener('visibilitychange',function(){
  if(document.hidden){if(G&&G.P&&G.phase!=='over'){hiddenPause=true;paused=true}}
  else backFromHidden();
});
['pageshow','focus'].forEach(function(ev){window.addEventListener(ev,backFromHidden)});
['resize','orientationchange','fullscreenchange'].forEach(function(ev){window.addEventListener(ev,scheduleRefresh)});
if(window.visualViewport)visualViewport.addEventListener('resize',scheduleRefresh);
try{if(typeof G!=='undefined'&&G&&G.P)render()}catch(e){}
})();
