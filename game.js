/* MiniRP — Alpha 0.3: Anokolisa personagens reais ANIMADOS, com roupas variáveis.
   Mapa e edifícios mantidos da Alpha 0.2.
   Personagens construídos a partir das partes oficiais do Body_A, com caminhada
   de 6 quadros, corrida de 6 e idle de 4 em 4 direções (lateral espelhada).
   Créditos: Anokolisa, Nasha, Ranitaya Studios. */
(()=>{'use strict';
const W=3072,H=2112,$=id=>document.getElementById(id),main=$('world'),ctx=main.getContext('2d',{alpha:false}),images={},keys=new Set();
let vw=innerWidth,vh=innerHeight,dpr=1,zoom=1.35,playing=false,mapShown=false,clock=0,toastSec=0,last=0,holdingRun=false;
const stick={x:0,y:0,id:null},player={x:1680,y:1155,face:'down',flip:false,moving:false,running:false},cam={x:1680,y:1120};let motion=0;
const items=[];function add(id,x,foot,options={}){items.push({id,x,foot,...options})}
// Fachadas originais com ESCALA ARQUITETÔNICA revisada.
// Um personagem Nasha possui 80px de altura; edifícios médios agora possuem
// aproximadamente 280–380px e estabelecimentos pequenos 150–220px.
// Posições foram recombinadas dentro dos lotes; não é apenas um zoom da câmera.
for(const [id,x,foot,scale,label] of [
 // Quarteirão noroeste: rua superior com edifícios de 2 pavimentos
 ['building2',80,388,1.88,'PRÉDIO COMERCIAL'],
 ['building3',435,389,2.06,'MERCEARIA'],
 ['building7',715,392,1.90,'APARTAMENTOS'],
 // Quarteirão norte central: comércio maior, prédio de esquina
 ['building6',1190,388,1.65,'CENTRO COMERCIAL'],
 ['building2',1865,390,1.83,'CAFÉ DO CENTRO'],
 // Quarteirão nordeste: construções com volumes diferentes
 ['building4',2455,392,1.80,'LOJAS'],
 ['building1',2800,394,2.08,'SOBRADO'],
 // Comércio na faixa oeste, sem atravessar a avenida
 ['building5',70,1029,1.68,'OFICINA E LOJAS'],
 ['building7',552,1034,1.94,'EDIFÍCIO RESIDENCIAL'],
 // Dois estabelecimentos na margem leste
 ['building3',2446,1031,2.10,'MERCADO'],
 ['building5',2690,1035,1.44,'COMÉRCIO'],
 // A parte sul mantém ruas em L livres
 ['building2',72,1822,1.95,'ESCRITÓRIOS'],
 ['building1',728,1615,1.96,'CASA'],
 ['building6',1188,1828,1.42,'GALERIA COMERCIAL'],
 ['building4',2452,1824,2.00,'MECÂNICA'],
 ['building1',2854,1828,1.87,'MORADIA']
])add(id,x,foot,{scale,solid:true,role:'building',label});
// Pequenas fachadas Nasha (lojas de uma porta): aumentadas individualmente,
// nunca apresentadas como prédios de múltiplos andares.
for(const [id,x,foot,scale,label] of [
 ['bakery',152,752,2.22,'PADARIA'],
 ['barber',752,746,2.10,'BARBEARIA'],
 ['cafe',2660,755,2.30,'CAFETERIA'],
 ['bakery',2500,1420,2.15,'PÃO QUENTE']
])add(id,x,foot,{scale,solid:false,role:'front',label});
// 3/4 objects from free park & sample, on sidewalks and inside green blocks.
for(const [id,x,y] of [
 ['tree1',1360,745],['tree2',1475,810],['tree3',1530,900],['tree1',2015,710],['tree2',2077,950],['treeyellow',1920,890],['tree1',1380,1010],['tree2',2110,1042],
 ['tree1',64,560],['tree3',346,590],['tree2',785,580],['tree1',290,1378],['tree3',814,1340],['tree2',2510,1350],['tree1',2930,1420],
 ['tree1',1195,1620],['tree2',2130,1490],['treeyellow',2210,1780],['tree1',101,1870],
 ['bench',1503,766],['bench',1905,767],['longbench',1800,940],['fountain',1748,910],['rose',1460,996],['flowers',1890,1025],['flowers',1545,1030],
 ['kiosk',2100,1034],['popcorn',1350,1042],['bush',1400,1028],['bush',1950,1000],['lamppark',1685,730],['lamppark',2050,920],['lamppark',1350,870],
 ['flowerlamp',885,1075],['flowerlamp',1125,1045],['flowerlamp',2460,1105],['flowerlamp',2715,1100],
 ['ranstreetlamp',1185,1327],['ranstreetlamp',2520,1325],['ranbin',1390,1285],['trash',1970,1017],
 ['suv',770,1150],['motorcycle',2520,1230],['foodtruck',345,1176],['bike',2228,1066],['busstop',2415,1095],
 ['ranbush',360,1780],['ranbush',430,1770],['pug',690,1114],
])add(id,x,y,{role:id==='suv'||id==='motorcycle'||id==='foodtruck'||id==='bike'?'vehicle':'prop'});
// NPCs com sprites oficiais Anokolisa: caminho curto no passeio, 10 variações de roupas.
// Partes originais foram sobrepostas e coloridas; estes NPCs NÃO são imagens estáticas.
const npcPositions=[
 [1645,1090],[1985,1090],[510,1090],[2180,710],[1720,1040],
 [2040,1018],[343,915],[2333,1090],[1450,1090],[1516,1080],
 [1732,1070],[1960,1095],[1730,1420],[2670,1108],[2920,1090],
 [1070,1700],[420,1670],[1640,1510],[1150,840],[2830,1610]
];
const walkers=npcPositions.map((a,i)=>({id:'npc',charVariant:(i+1)%10,x:a[0],y:a[1],homeX:a[0],homeY:a[1],phase:i*2.13,face:i%2?'side':'down',flip:i%3===0,frameSeed:i*.21,moving:true}));
const CHAR_W=40,CHAR_H=76,CHAR_SCALE=1.36,CHAR_BASE=66;
function drawAnimated(g,it,main){
 const mode=main?(player.moving?(player.running?'run':'walk'):'idle'):'walk';
 const dir=it.face==='up'?'up':it.face==='side'?'side':'down';
 const sprite=images[`anok_${String(main?0:it.charVariant).padStart(2,'0')}_${mode}_${dir}`];
 if(!sprite)return;
 const len=mode==='idle'?4:6;
 const frame=Math.floor((clock+(it.frameSeed||0))*(mode==='run'?12:mode==='walk'?9:3.2))%len;
 const dw=CHAR_W*CHAR_SCALE,dh=CHAR_H*CHAR_SCALE;
 g.save();g.translate(Math.round(it.x),Math.round(it.sort===undefined?it.y:it.sort));
 if(it.flip)g.scale(-1,1);
 g.imageSmoothingEnabled=false;
 g.drawImage(sprite,CHAR_W*frame,0,CHAR_W,CHAR_H,-dw/2,-CHAR_BASE*CHAR_SCALE,dw,dh);
 g.restore();
}
const info=[{x:1690,y:880,r:130,heading:'PARQUE CENTRAL',desc:'Parque com árvores, bancos e objetos do pacote Nasha City Park.'},
{x:2000,y:915,r:104,heading:'CAFÉ',desc:'Fachada comercial incluída na amostra gratuita de Nasha.'},
{x:760,y:1110,r:180,heading:'VEÍCULOS',desc:'Sprites originais de Nasha. Condução indisponível sem sprites direcionais.'},
{x:1380,y:1650,r:180,heading:'EDIFÍCIOS',desc:'Sprite de fachada Ranitaya. A perspectiva ainda está sendo avaliada.'}];
function renderedSize(it,im){const scale=it.scale||1;return {w:im.width*scale,h:im.height*scale}}
function nearby(){let near=null,d=100;for(const i of items){if(!i.label)continue;let dist=Math.hypot(player.x-(i.x+images[i.id].width*(i.scale||1)*.5),player.y-i.foot);if(dist<d){d=dist;near=i}}for(const p of info){let dist=Math.hypot(p.x-player.x,p.y-player.y);if(dist<p.r&&dist<d){d=dist;near={label:p.heading,desc:p.desc}}}return near}
function isSolid(x,y){if(x<22||y<24||x>W-22||y>H-24)return true;for(const it of items)if(it.solid){let im=images[it.id];if(!im)continue;let sz=renderedSize(it,im),left=it.x+Math.min(35,sz.w*.08),right=it.x+sz.w-18; // collision just at building base, not roof above
if(x>left-11&&x<right+11&&y>it.foot-Math.min(75,28*(it.scale||1))&&y<it.foot+12)return true}return false}
function layout(){vw=innerWidth;vh=innerHeight;dpr=Math.min(devicePixelRatio||1,1.5);main.width=vw*dpr;main.height=vh*dpr;zoom=vw<650?.95:vw<900?1.1:1.4;}
window.addEventListener('resize',layout);layout();
function toast(t){$('msg').textContent=t;$('msg').classList.remove('hidden');toastSec=4.2}
function interact(){if(!playing||mapShown)return;let n=nearby();if(n)toast(n.desc||n.label+' — este prédio é apenas um teste visual por enquanto.');else toast('Aproxime-se de um prédio, praça ou veículo para examinar.')}
function toggleMap(){if(!playing)return;mapShown=!mapShown;$('mapLayer').classList.toggle('hidden',!mapShown);if(mapShown)drawFullMap()}
function visit(which){const coords={shops:[510,1110],park:[1680,1155],south:[2020,1420]};const a=coords[which];if(!a)return;player.x=a[0];player.y=a[1];cam.x=a[0];cam.y=a[1];mapShown=false;$('mapLayer').classList.add('hidden');toast('Local: '+{shops:'CENTRO COMERCIAL',park:'PARQUE CENTRAL',south:'BAIRRO SUL'}[which])}['Shops','Park','South'].forEach(n=>{$('go'+n).onclick=()=>visit(n.toLowerCase()==='shops'?'shops':n.toLowerCase()==='park'?'park':'south')});
function drawFullMap(){const c=$('fullMap'),g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(images.bg,0,0,c.width,c.height);for(const a of items){let im=images[a.id];if(!im)continue;g.drawImage(im,a.x/W*c.width,(a.foot-renderedSize(a,im).h)/H*c.height,renderedSize(a,im).w/W*c.width,renderedSize(a,im).h/H*c.height)}g.fillStyle='#ffe19b';g.beginPath();g.arc(player.x/W*c.width,player.y/H*c.height,7,0,Math.PI*2);g.fill();g.lineWidth=2;g.strokeStyle='#0d222e';g.stroke()}
function drawMini(){const c=$('mini'),g=c.getContext('2d');g.imageSmoothingEnabled=false;let w=870,h=586,x=Math.max(0,Math.min(W-w,player.x-w/2)),y=Math.max(0,Math.min(H-h,player.y-h/2));g.drawImage(images.bg,x,y,w,h,0,0,c.width,c.height);
// minimap is intentionally just roads & position: no tiny building screenshots that become confusing.
g.fillStyle='#f5d18a';g.beginPath();g.arc((player.x-x)/w*c.width,(player.y-y)/h*c.height,4.5,0,Math.PI*2);g.fill();g.strokeStyle='#082028';g.lineWidth=2;g.stroke()}
function paint(){ctx.setTransform(dpr,0,0,dpr,0,0);ctx.imageSmoothingEnabled=false;ctx.fillStyle='#465e51';ctx.fillRect(0,0,vw,vh);ctx.save();
 const x=Math.max(0,Math.min(W-vw/zoom,cam.x-vw/zoom/2)),y=Math.max(0,Math.min(H-vh/zoom,cam.y-vh/zoom/2));
 ctx.translate(-Math.round(x*zoom),-Math.round(y*zoom));ctx.scale(zoom,zoom);
 ctx.drawImage(images.bg,0,0);
 const drawables=items.map(it=>({...it,sort:it.foot}));for(const w of walkers)drawables.push({...w,role:'walker',sort:w.y});drawables.push({id:'player',x:player.x,foot:player.y,face:player.face,flip:player.flip,sort:player.y,role:'main'});
 drawables.sort((a,b)=>a.sort-b.sort);for(const it of drawables){
  if(it.role==='walker'||it.role==='main'){
   if(it.x<x-70||it.x>x+vw/zoom+70||it.y<y-130||it.y>y+vh/zoom+70)continue;
   if(it.role==='main'){
    ctx.fillStyle='rgba(12,39,46,.35)';ctx.beginPath();ctx.ellipse(it.x,it.foot-3,19,6,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#f1d18a';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(it.x,it.foot-3,22,8,0,0,Math.PI*2);ctx.stroke();
   }
   drawAnimated(ctx,it,it.role==='main');continue;
  }
  let im=images[it.id];if(!im)continue;let sz=renderedSize(it,im),px=it.x,py=it.foot-sz.h;
  if(px+sz.w<x-30||px>x+vw/zoom+30||py>y+vh/zoom+30||py+sz.h<y-30)continue;
  ctx.drawImage(im,Math.round(px),Math.round(py),Math.round(sz.w),Math.round(sz.h));
 }
 ctx.restore();}
function tick(time){requestAnimationFrame(tick);if(!playing)return;let dt=Math.min(.06,Math.max(0,(time-last)/1000||.016));last=time;clock+=dt;
 if(!mapShown){let dx=stick.x,dy=stick.y;if(keys.has('KeyA')||keys.has('ArrowLeft'))dx-=1;if(keys.has('KeyD')||keys.has('ArrowRight'))dx+=1;if(keys.has('KeyW')||keys.has('ArrowUp'))dy-=1;if(keys.has('KeyS')||keys.has('ArrowDown'))dy+=1;let v=Math.hypot(dx,dy);if(v>1){dx/=v;dy/=v}let vel=dt*(holdingRun||keys.has('ShiftLeft')||keys.has('ShiftRight')?225:143);
 player.moving=v>.06;player.running=player.moving&&(holdingRun||keys.has('ShiftLeft')||keys.has('ShiftRight'));
 if(player.moving){
  if(Math.abs(dx)>Math.abs(dy)) {player.face='side';player.flip=dx<0;}
  else {player.face=dy<0?'up':'down';player.flip=false;}
  if(!isSolid(player.x+dx*vel,player.y))player.x+=dx*vel;
  if(!isSolid(player.x,player.y+dy*vel))player.y+=dy*vel;motion+=dt;
 }
 cam.x+=(player.x-cam.x)*Math.min(1,dt*5);cam.y+=(player.y-cam.y)*Math.min(1,dt*5);
 for(const w of walkers){let prevX=w.x,prevY=w.y;
  w.x=w.homeX+Math.sin(clock*.32+w.phase)*42;
  w.y=w.homeY+Math.cos(clock*.27+w.phase)*15;
  let vx=w.x-prevX,vy=w.y-prevY;
  if(Math.abs(vx)>Math.abs(vy)){w.face='side';w.flip=vx<0;}
  else {w.face=vy<0?'up':'down';w.flip=false;}
 }
 paint();if(Math.floor(clock*4)!==Math.floor((clock-dt)*4)){drawMini();let hit=nearby();$('hint').classList.toggle('hidden',!hit);if(hit)$('hint').textContent=(hit.label||'EXAMINAR')+' · E / EXAMINAR';$('area').textContent=player.x<1120?'CENTRO · COMÉRCIO':player.y>1340?'BAIRRO SUL':player.x>2260?'ZONA LESTE':'CENTRO · PARQUE'}}
 if(toastSec>0){toastSec-=dt;if(toastSec<=0)$('msg').classList.add('hidden')}
}
$('play').onclick=()=>{playing=true;$('opening').classList.add('hidden');$('ui').classList.remove('hidden');last=performance.now();requestAnimationFrame(tick)};
$('mapButton').onclick=toggleMap;$('mobileMap').onclick=toggleMap;$('closeMap').onclick=toggleMap;$('action').onclick=interact;
$('zoomOut').onclick=()=>zoom=Math.max(.7,zoom-.15);$('zoomIn').onclick=()=>zoom=Math.min(2.3,zoom+.15);
window.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();keys.add(e.code);if(!e.repeat){if(e.code==='KeyE')interact();if(e.code==='KeyM'||e.code==='Escape')toggleMap();if(e.code==='Digit1')visit('shops');if(e.code==='Digit2')visit('park');if(e.code==='Digit3')visit('south');if(e.code==='Equal')zoom=Math.min(2.3,zoom+.15);if(e.code==='Minus')zoom=Math.max(.7,zoom-.15)}});window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>keys.clear());
const pad=$('pad');function movePad(e){let b=pad.getBoundingClientRect(),x=(e.clientX-(b.left+b.width/2))/(b.width*.3),y=(e.clientY-(b.top+b.height/2))/(b.height*.3),l=Math.hypot(x,y);if(l>1){x/=l;y/=l}stick.x=x;stick.y=y;$('thumb').style.transform=`translate(${Math.round(x*31)}px,${Math.round(y*31)}px)`}
pad.addEventListener('pointerdown',e=>{stick.id=e.pointerId;pad.setPointerCapture(e.pointerId);movePad(e);e.preventDefault()});pad.addEventListener('pointermove',e=>{if(stick.id===e.pointerId)movePad(e)});for(const ev of ['pointerup','pointercancel','lostpointercapture'])pad.addEventListener(ev,()=>{stick.id=null;stick.x=stick.y=0;$('thumb').style.transform='' });
$('mobileRun').addEventListener('pointerdown',e=>{holdingRun=true;e.preventDefault()});for(const ev of ['pointerup','pointercancel','pointerleave'])$('mobileRun').addEventListener(ev,()=>holdingRun=false);
Promise.all([fetch('./asset_manifest.json').then(r=>r.json()),new Promise((resolve,reject)=>{let im=new Image();im.onload=()=>{images.bg=im;resolve()};im.onerror=()=>reject(new Error('Não foi possível carregar o mapa'));im.src='./background.png'})]).then(([data])=>{
let list=Object.entries(data),done=0;
for(let i=0;i<10;i++)for(const mode of ['idle','walk','run'])for(const dir of ['down','side','up']){
 const id=`anok_${String(i).padStart(2,'0')}_${mode}_${dir}`;
 list.push([id,{file:'assets/'+id+'.png'}]);
}
return Promise.all(list.map(([id,record])=>new Promise(resolve=>{let im=new Image();im.onload=()=>{images[id]=im;done++;$('progress').style.width=(done/list.length*100).toFixed(0)+'%';$('status').textContent=`Preparando ${done} de ${list.length} sprites...`;resolve()};im.onerror=()=>{done++;console.error('Sprite não carregou',record.file);resolve()};im.src='./'+record.file})))}).then(()=>{for(const i of items)if(!images[i.id])console.warn('Sprite indisponível:',i.id);$('play').disabled=false;$('play').textContent='ENTRAR NO BAIRRO';$('status').textContent='Animações carregadas. Ande, corra e teste as quatro direções.'}).catch(e=>{$('status').textContent='Erro: '+e.message;console.error(e)});
})();
