/* Kilo de merde - cartes illustrées (planche_cartes.webp).
   À charger APRÈS le script principal : <script src="cartes.js"></script> juste avant </body>. */
(function(){
'use strict';
var SHEET='planche_cartes.webp';
// couleur « 4 » = carte sans couleur (kilo) : le texte des messages n'affiche plus de symbole
if(typeof S!=='undefined'&&S.length===4)S.push('');
var st=document.createElement('style');
st.textContent=
'.sp{background-color:transparent!important;background-repeat:no-repeat!important;color:transparent!important;font-size:0!important;border-radius:4px!important}'+
'.c.sp{width:52px;height:78px}'+
'.mc2.sp{width:38px;height:57px}'+
'.c7.sp{width:40px;height:60px}'+
'.mc.sp{width:46px;height:69px}'+
'.c7.b{background:url('+SHEET+') 44.444% 0%/1000% 1000% no-repeat!important;border:0!important;color:transparent!important;font-size:0!important;width:40px;height:60px}'+
'.c7.b i,.c7.b small{display:none}';
document.head.appendChild(st);
new Image().src=SHEET;

// ----- positions dans la planche (voir planche_cartes.json)
var KC=[[2,4],[3,6],[4,6],[5,6],[6,6],[8,6],[9,6],[10,6],[11,3],[12,3],[13,3],[100,4]]; // [poids, exemplaires]
var RP={12:0,11:1,10:2,1:3,2:4,3:5,4:6,5:7}; // rang du jeu -> place dans le bloc d'une couleur (R,D,V,2..6)
function kIdx(c){
  var v=val(c),cp=c.kid?(parseInt(String(c.kid).split('_')[2],10)||1):1+((c.s|0)%3),o=41,i;
  for(i=0;i<KC.length;i++){if(KC[i][0]===v)return o+Math.min(Math.max(cp,1),KC[i][1])-1;o+=KC[i][1]}
  return -1;
}
function handIdx(c){return c&&RP[c.r]!==undefined?9+(c.s|0)*8+RP[c.r]:-1}
function sevenIdx(c){return c.b?4:5+(c.s|0)}
function sp(el,i){
  if(!el||i<0)return;
  el.classList.add('sp');el.textContent='';
  el.style.backgroundImage='url('+SHEET+')';el.style.backgroundSize='1000% 1000%';
  el.style.backgroundPosition=((i%10)/9*100)+'% '+(Math.floor(i/10)/9*100)+'%';
}
function skin(){
  if(typeof G==='undefined'||!G||!G.P)return;
  var me=G.P[0],k4=me.k.slice(-4);
  Array.prototype.forEach.call(document.getElementById('hand').children,function(el,i){sp(el,handIdx(me.h[i]))});
  Array.prototype.forEach.call(document.getElementById('mym').children,function(el,i){if(k4[i])sp(el,kIdx(k4[i]))});
  if(me.s.length)Array.prototype.forEach.call(document.getElementById('flush').querySelectorAll('.c7'),function(el,i){if(me.s[i])sp(el,sevenIdx(me.s[i]))});
}
// ----- nouveau tas de pioche : les 4 sept chasse d'eau + 59 cartes kilo de merde
function buildTas(){
  var t=[],i,k;
  for(k=0;k<4;k++)t.push({r:6,s:k});
  KC.forEach(function(e){for(i=1;i<=e[1];i++)t.push({r:e[0]===100?0:e[0]-1,s:4,kid:'kilo_'+e[0]+'_'+i})});
  return shuf(t);
}
// ----- branchement sur le jeu existant
var _render=render;render=function(){_render.apply(this,arguments);try{skin()}catch(e){}};
var _start=start;start=function(n){_start(n);try{G.tas=buildTas();render()}catch(e){}};
var _fly=fly;fly=function(a,b,c){
  var n=document.body.children.length;_fly(a,b,c);
  try{
    if(c&&!c.hide&&document.body.children.length>n){
      var e=document.body.lastElementChild;
      if(e&&e.classList.contains('mc')){e.className='mc sp';sp(e,c.kid?kIdx(c):(c.r===6?sevenIdx(c):kIdx(c)))}
    }
  }catch(x){}
};
try{if(typeof G!=='undefined'&&G&&G.P)render()}catch(e){}
})();
