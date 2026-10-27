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
  if(me.s.length)fe.call(document.getElementById('flush').querySelectorAll('.c7'),function(el,i){if(me.s[i])sp(el,sevenIdx(me.s[i]))});
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
  if(c.r===6){var n=p.k.length;G.tas.push(c);Array.prototype.push.apply(G.tas,p.k);p.k=[];return{p:p,c:c,sv:1,fl:n}}
  p.k.push(c);return{p:p,c:c};
};
drawFor=function(list){
  var res=list.map(drawKilo);render();
  res.forEach(function(r,k){
    var who=r.p.me?'Tu pioches ':r.p.nm+' pioche ';
    r.txt=!r.c?nm(r.p)+' : tas vide':r.sv?(r.p.me?'Tu pioches un 7 🚽 : ':r.p.nm+' pioche un 7 🚽 : ')+(r.fl>0?'chasse d\'eau, '+r.fl+' kilo'+(r.fl>1?'s':'')+' évacué'+(r.fl>1?'s':''):'aucun kilo à évacuer, le 7 retourne sous le tas'):who+R[r.c.r]+S[r.c.s]+' → +'+val(r.c)+' kg';
    setTimeout(function(){
      if(!r.c)return;
      fly($('tas'),r.p.me?$('myav'):$('op'+r.p.i),r.c);
      setTimeout(function(){
        if(r.sv){if(r.fl>0)chasse(r.p,r.fl);else sLevel()}
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
    if(h.textContent.indexOf('chasse d')>-1)p.textContent='Si tu pioches un 7, tu tires la chasse d\'eau tout de suite : tous tes kilos de merde et le 7 retournent sous le tas de pioche. Si tu n\'as aucun kilo, le 7 retourne quand même sous le tas. Un bonus acheté au magasin ajoute un 7 spécial que tu gardes en réserve et peux utiliser quand tu veux.';
  }
}
fixRules();
// ----- branchement sur le jeu existant
var _render=render;render=function(){_render.apply(this,arguments);try{skin()}catch(e){}};
var _start=start;start=function(n){_start(n);try{G.tas=buildTas();render()}catch(e){}};
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
