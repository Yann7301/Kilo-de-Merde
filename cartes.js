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
'#bot .avw .ring{width:106px;height:106px}'+
'#bot .mt2{align-items:center;margin-top:-10px;position:relative;z-index:4}';
st.textContent+=
'#srt{display:none!important}'+
'.c7.kdmc.bUse{box-shadow:0 0 0 2px var(--gold),0 0 10px 2px var(--gold)}'+
'.c7.kdmc.tpArmed{animation:tpblink .5s infinite alternate}'+
'.op.tpt{pointer-events:auto;cursor:pointer}'+
'.op.tpt .avw2{border-radius:50%;animation:tpblink .55s infinite alternate}'+
'@keyframes tpblink{from{box-shadow:0 0 0 3px #ff2d2d,0 0 8px 2px #ff2d2d88}to{box-shadow:0 0 0 6px #ff6b6b,0 0 26px 10px #ff2d2d}}'+
'.tpb{position:absolute;top:4px;width:40px;height:60px;z-index:6;pointer-events:none;filter:drop-shadow(0 2px 3px #000a)}'+
'.tpb.r{right:-26px;transform:rotate(8deg)}.tpb.l{left:-26px;transform:rotate(-8deg)}'+
'#tpfx{position:fixed;inset:0;z-index:9;background:#000b;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px}'+
'#tpfx video{width:min(420px,80vw);max-height:68vh;border-radius:14px;border:4px solid var(--gold);box-shadow:0 8px 30px #000;background:#07301a}'+
'#tpfx p{margin:0;font-size:22px;font-weight:800;text-shadow:0 2px 6px #000}';
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
  fe.call(document.getElementById('mym').children,function(el,i){if(k4[i])sp(el,kIdx(k4[i]))});
  renderTray();markOpponents();
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
      var h2=document.createElement('h3');h2.textContent='Bonus : papier toilette et ventouse';var p2=document.createElement('p');p2.textContent='Papier toilette : à ton tour, touche la carte puis un adversaire. Ses toilettes sont bouchées jusqu\'à la fin de la manche : il ne peut plus tirer la chasse d\'eau, et s\'il pioche un 7, le 7 retourne sous le tas sans évacuer ses kilos. Ventouse : à ton tour, retire le papier toilette qu\'on t\'a donné.';p.parentNode.insertBefore(h2,p.nextSibling);p.parentNode.insertBefore(p2,h2.nextSibling)}
  }
}
fixRules();

// ===== BONUS : papier toilette (toilettes bouchées) et ventouse =====
var BIDX={papier:2,ventouse:3,chasse:4};   // place des cartes bonus dans la planche
BO[1]={id:'papier',n:'Papier toilette',e:'🧻',p:100,d:'Bouche les toilettes d\'un adversaire pendant la manche'};
BO[2]={id:'ventouse',n:'Ventouse',e:'🪠',p:100,d:'Débouche tes toilettes'};   // prix provisoire
function spriteHTML(i,w,h){
  return '<div class="'+CL+'" style="display:inline-block;width:'+w+';height:'+h+';background-image:url('+SHEET+');background-size:1000% 1000%;background-position:'+((i%10)/9*100)+'% '+(Math.floor(i/10)/9*100)+'%"></div>';
}
function fixBonusPv(box,list){
  var its=box.querySelectorAll('.it');
  list.forEach(function(x,i){var pv=its[i]&&its[i].querySelector('.pv');if(pv&&x.id!=='chasse'&&BIDX[x.id]!==undefined)pv.innerHTML=spriteHTML(BIDX[x.id],'40px','60px')});
}
var inBag=function(x){return !x.off&&(PF.bag[x.id]||0)>0};
var _shop=shop;shop=function(t){_shop(t);try{if(t==='bo')fixBonusPv($('shgrid'),BO)}catch(e){}};
var _bag=bag;bag=function(){_bag();try{fixBonusPv($('bagl'),BO.filter(inBag))}catch(e){}};
var _bsm=bagSelectMode;bagSelectMode=function(){_bsm();try{fixBonusPv($('bagl'),BO.filter(inBag))}catch(e){}};
var _rbs=renderBonusSlots;renderBonusSlots=function(){_rbs();try{document.querySelectorAll('.bslot').forEach(function(el,i){var id=PF.selSlots[i];if(id&&id!=='chasse'&&BIDX[id]!==undefined)el.innerHTML=spriteHTML(BIDX[id],'100%','100%')})}catch(e){}};
useBonus=function(){
  if(!Array.isArray(PF.selSlots))PF.selSlots=[null,null,null];
  var me=G.P[0];me.bn=me.bn||[];
  PF.selSlots.forEach(function(id){
    if(!id||!((PF.bag[id]||0)>0))return;
    PF.bag[id]--;
    if(id==='chasse'){me.s.push({r:6,s:Math.floor(Math.random()*4),b:1});toast('🚽 Bonus activé : un 7 chasse d\'eau en plus')}
    else if(BIDX[id]!==undefined){me.bn.push({id:id});toast((id==='papier'?'🧻 Bonus papier toilette prêt':'🪠 Bonus ventouse prêt'))}
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
    if(x.t==='papier'&&G.tpSel)d.classList.add('tpArmed');
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
  if(t==='papier'){
    if(G.tpSel){G.tpSel=false;render();return}
    if(!G.P.some(function(p){return !p.me&&!p.tp})){toast('Tous les adversaires ont déjà les toilettes bouchées');return}
    G.tpSel=true;render();msg('🧻 Touche l\'adversaire à qui donner le papier toilette');return;
  }
  if(t==='ventouse'){
    if(!me.tp){toast('🪠 Tu n\'as pas de papier toilette à retirer');return}
    var k=me.bn.findIndex(function(b){return b.id==='ventouse'});if(k<0)return;
    me.bn.splice(k,1);me.tp=null;sPlop();render();toast('🪠 Ventouse : tes toilettes sont débouchées !');
  }
}
function sideOf(p){var q=SEATS[G.seats[p.i-1]];return (q[2]-q[0])>100?'l':'r'}
function markOpponents(){
  if(G.tpSel&&!usableNow())G.tpSel=false;
  G.P.forEach(function(p){
    if(p.me)return;var el=document.getElementById('op'+p.i);if(!el)return;
    el.classList.toggle('tpt',!!G.tpSel&&!p.tp);
    var old=el.querySelector('.tpb');if(old)old.remove();
    if(p.tp){var b=document.createElement('div');b.className='tpb '+sideOf(p);sp(b,BIDX.papier);el.appendChild(b)}
  });
}
document.addEventListener('click',function(e){
  if(!G||!G.tpSel||!e.target.closest)return;
  var el=e.target.closest('.op.tpt');if(!el)return;
  var p=G.P[parseInt(el.id.slice(2),10)];if(p&&!p.me&&!p.tp)giveTP(p);
},true);
function fxAnim(done){
  var ov=document.createElement('div');ov.id='tpfx';
  ov.innerHTML='<video src="toilettes_bouchees.mp4" playsinline preload="auto"></video><p>🧻 Toilettes bouchées !</p>';
  document.body.appendChild(ov);fxp++;var ended=false;
  function end(){if(ended)return;ended=true;fxp--;ov.remove();done()}
  var v=ov.querySelector('video');v.muted=!(PF.set&&PF.set.sound);
  var pr=v.play();if(pr&&pr.catch)pr.catch(function(){v.muted=true;var q=v.play();if(q&&q.catch)q.catch(function(){})});
  v.onerror=function(){setTimeout(end,1200)};
  v.ontimeupdate=function(){if(v.currentTime>=3.95)end()};
  v.onended=end;setTimeout(end,4300);
}
function giveTP(p){
  var me=G.P[0],k=(me.bn||[]).findIndex(function(b){return b.id==='papier'});if(k<0)return;
  me.bn.splice(k,1);G.tpSel=false;G.tk=(G.tk||0)+1;clearRing();render();sWhoosh();
  fxAnim(function(){
    p.tp={round:G.round};render();sPlop();
    msg('🧻 '+p.nm+' : toilettes bouchées jusqu\'à la fin de la manche !');toast('🧻 Toilettes bouchées pour '+p.nm+' !',2600);
    if(G.phase==='turn'&&G.cur===0)startTimer();
  });
}
// l'effet se termine à chaque nouvelle manche ; les bonus non utilisés retournent dans le sac à la fin de la partie
var _sr=startRound;startRound=function(){try{G.P.forEach(function(p){p.tp=null});G.tpSel=false}catch(e){}_sr()};
var _fin=finish;finish=function(){
  try{if(G&&G.P&&!G.finalResultsApplied){var n=0;(G.P[0].bn||[]).forEach(function(b){PF.bag[b.id]=(PF.bag[b.id]||0)+1;n++});G.P[0].bn=[];if(n){Store.save(PF);setTimeout(function(){toast('👝 Bonus non utilisé : retourné dans ton sac',3000)},3400)}}}catch(e){}
  _fin.apply(this,arguments);
};
// ----- branchement sur le jeu existant
var _render=render;render=function(){_render.apply(this,arguments);try{skin()}catch(e){}};
var _start=start;start=function(n){_start(n);try{fetch('toilettes_bouchees.mp4').catch(function(){})}catch(e){}try{G.tas=buildTas();render()}catch(e){}};
var _fly=fly;fly=function(a,b,c){
  var n=document.body.children.length;_fly(a,b,c);
  try{
    if(c&&!c.hide&&document.body.children.length>n){
      var e=document.body.lastElementChild;
      if(e&&e.classList.contains('mc')){e.className='mc '+CL;sp(e,c.kid?kIdx(c):(c.r===6?sevenIdx(c):kIdx(c)))}
    }
  }catch(x){}
};
try{if(typeof G!=='undefined'&&G&&G.P)render()}catch(e){}
})();
