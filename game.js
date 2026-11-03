/* MiniRP — primeiro teste de cenário 3/4.
   Sprite art authored by Nasha and Ranitaya Studios, supplied by the user.
   No generated substitutes. Storefronts, vehicles, characters are static samples,
   so this deliberately does NOT pretend to have directional driving animations. */
(()=>{'use strict';
const W=3072,H=2112,$=id=>document.getElementById(id),main=$('world'),ctx=main.getContext('2d',{alpha:false}),images={},keys=new Set();
let vw=innerWidth,vh=innerHeight,dpr=1,zoom=1.35,playing=false,mapShown=false,clock=0,toastSec=0,last=0,holdingRun=false;
const stick={x:0,y:0,id:null},player={x:1680,y:1155,face:1},cam={x:1680,y:1120};let motion=0;
const items=[];function add(id,x,foot,options={}){items.push({id,x,foot,...options})}
// All named buildings below are intact original PNGs from Ranitaya, not rectangles.
for(const [id,x,foot,label] of [
 ['building1',155,378,'LOJAS'],['building7',470,385,'APARTAMENTOS'],['building3',753,380,'MERCEARIA'],
 ['building6',1290,383,'CENTRO COMERCIAL'],['building2',1915,375,'CAFÉ DO CENTRO'],
 ['building5',2428,372,'GALPÃO'],['building4',2718,370,'COMÉRCIO'],
 ['building2',118,1010,'PADARIA'],['building4',470,1030,'LOJAS'],['building1',744,1040,'SALÃO'],
 ['building3',2460,1020,'MERCADO'],['building7',2712,1016,'SOBRADO'],
 ['building6',1252,1700,'ESCRITÓRIOS'],['building4',1863,1720,'LOJA'],
 ['building5',2430,1740,'OFICINA'],['building7',2742,1790,'RESIDÊNCIAS'],
 ['building1',92,1700,'LOJA'],['building2',292,1715,'PRÉDIO'],
 ['building3',750,1635,'COMÉRCIO'],
 ['building7',220,2054,'CASAS'],['building4',1230,2065,'BAIRRO SUL'],['building2',1970,2065,'CENTRO SUL'],['building1',2780,2075,'CASA']
])add(id,x,foot,{solid:true,role:'building',label});
// Nasha's shopfronts are stand-alone visual samples. Do not distort or paste into unrelated roofs.
for(const [id,x,foot,label] of [['bakery',260,880,'PADARIA'],['barber',656,888,'BARBEARIA'],['cafe',1965,985,'CAFÉ'],['cafe',1520,1835,'CAFETERIA'],['bakery',2750,1545,'PÃO QUENTE']])add(id,x,foot,{solid:true,label,role:'front'});
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
 ['ranbush',360,1780],['ranbush',430,1770],['ranger',1820,1065],['barista',2040,1018],['baker',343,915],
 ['citizen',2275,1103],['dogwalker',1450,1090],['father',1516,1200],['photographer',1732,1070],['runner',1960,1242],['visitor',1850,1308],['pug',690,1114],['cyclist',2900,1337],
])add(id,x,y,{role:id==='suv'||id==='motorcycle'||id==='foodtruck'||id==='bike'?'vehicle':'prop'});
const walkers=[
 {id:'ranger',x:1645,y:1220,homeX:1645,homeY:1220,phase:0},
 {id:'player',x:1985,y:1288,homeX:1985,homeY:1288,phase:2},
 {id:'runner',x:510,y:1303,homeX:510,homeY:1303,phase:5},
 {id:'visitor',x:2242,y:710,homeX:2242,homeY:710,phase:1}
];
const info=[{x:1690,y:880,r:130,heading:'PARQUE CENTRAL',desc:'Parque com árvores, bancos e objetos do pacote Nasha City Park.'},
{x:2000,y:915,r:104,heading:'CAFÉ',desc:'Fachada comercial incluída na amostra gratuita de Nasha.'},
{x:760,y:1110,r:180,heading:'VEÍCULOS',desc:'Sprites originais de Nasha. Condução indisponível sem sprites direcionais.'},
{x:1380,y:1650,r:180,heading:'EDIFÍCIOS',desc:'Sprite de fachada Ranitaya. A perspectiva ainda está sendo avaliada.'}];
function nearby(){let near=null,d=100;for(const i of items){if(!i.label)continue;let dist=Math.hypot(player.x-(i.x+images[i.id].width*.5),player.y-i.foot);if(dist<d){d=dist;near=i}}for(const p of info){let dist=Math.hypot(p.x-player.x,p.y-player.y);if(dist<p.r&&dist<d){d=dist;near={label:p.heading,desc:p.desc}}}return near}
function isSolid(x,y){if(x<22||y<24||x>W-22||y>H-24)return true;for(const it of items)if(it.solid){let im=images[it.id];if(!im)continue;let left=it.x+Math.min(20,im.width*.09),right=it.x+im.width-8; // collision just at building base, not roof above
if(x>left-11&&x<right+11&&y>it.foot-38&&y<it.foot+10)return true}return false}
function layout(){vw=innerWidth;vh=innerHeight;dpr=Math.min(devicePixelRatio||1,1.5);main.width=vw*dpr;main.height=vh*dpr;zoom=vw<650?.95:vw<900?1.1:1.4;}
window.addEventListener('resize',layout);layout();
function toast(t){$('msg').textContent=t;$('msg').classList.remove('hidden');toastSec=4.2}
function interact(){if(!playing||mapShown)return;let n=nearby();if(n)toast(n.desc||n.label+' — este prédio é apenas um teste visual por enquanto.');else toast('Aproxime-se de um prédio, praça ou veículo para examinar.')}
function toggleMap(){if(!playing)return;mapShown=!mapShown;$('mapLayer').classList.toggle('hidden',!mapShown);if(mapShown)drawFullMap()}
function visit(which){const coords={shops:[510,1110],park:[1680,1155],south:[2020,1420]};const a=coords[which];if(!a)return;player.x=a[0];player.y=a[1];cam.x=a[0];cam.y=a[1];mapShown=false;$('mapLayer').classList.add('hidden');toast('Local: '+{shops:'CENTRO COMERCIAL',park:'PARQUE CENTRAL',south:'BAIRRO SUL'}[which])}['Shops','Park','South'].forEach(n=>{$('go'+n).onclick=()=>visit(n.toLowerCase()==='shops'?'shops':n.toLowerCase()==='park'?'park':'south')});
function drawFullMap(){const c=$('fullMap'),g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(images.bg,0,0,c.width,c.height);for(const a of items){let im=images[a.id];if(!im)continue;g.drawImage(im,a.x/W*c.width,(a.foot-im.height)/H*c.height,im.width/W*c.width,im.height/H*c.height)}g.fillStyle='#ffe19b';g.beginPath();g.arc(player.x/W*c.width,player.y/H*c.height,7,0,Math.PI*2);g.fill();g.lineWidth=2;g.strokeStyle='#0d222e';g.stroke()}
function drawMini(){const c=$('mini'),g=c.getContext('2d');g.imageSmoothingEnabled=false;let w=870,h=586,x=Math.max(0,Math.min(W-w,player.x-w/2)),y=Math.max(0,Math.min(H-h,player.y-h/2));g.drawImage(images.bg,x,y,w,h,0,0,c.width,c.height);
// minimap is intentionally just roads & position: no tiny building screenshots that become confusing.
g.fillStyle='#f5d18a';g.beginPath();g.arc((player.x-x)/w*c.width,(player.y-y)/h*c.height,4.5,0,Math.PI*2);g.fill();g.strokeStyle='#082028';g.lineWidth=2;g.stroke()}
function paint(){ctx.setTransform(dpr,0,0,dpr,0,0);ctx.imageSmoothingEnabled=false;ctx.fillStyle='#465e51';ctx.fillRect(0,0,vw,vh);ctx.save();
 const x=Math.max(0,Math.min(W-vw/zoom,cam.x-vw/zoom/2)),y=Math.max(0,Math.min(H-vh/zoom,cam.y-vh/zoom/2));
 ctx.translate(-Math.round(x*zoom),-Math.round(y*zoom));ctx.scale(zoom,zoom);
 ctx.drawImage(images.bg,0,0);
 const drawables=items.map(it=>({...it,sort:it.foot}));for(const w of walkers)drawables.push({...w,role:'walker',sort:w.y});drawables.push({id:'player',x:player.x,foot:player.y,sort:player.y,role:'main'});
 drawables.sort((a,b)=>a.sort-b.sort);for(const it of drawables){let im=images[it.id];if(!im)continue;
  let px=it.x,py=(it.role==='main'||it.role==='walker'?it.sort:it.foot)-im.height;
  if(it.role==='main'||it.role==='walker')px-=im.width/2;
  if(px+im.width<x-30||px>x+vw/zoom+30||py>y+vh/zoom+30||py+im.height<y-30)continue;
  if(it.role==='main'){
   ctx.fillStyle='rgba(12,39,46,.35)';ctx.beginPath();ctx.ellipse(it.x,it.foot-3,21,6,0,0,Math.PI*2);ctx.fill();
   // Assets only have a front view: never rotate 360° pretending there are 4 animation directions.
   ctx.drawImage(im,Math.round(px),Math.round(py));
   ctx.strokeStyle='#f1d18a';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(it.x,it.foot-3,22,8,0,0,Math.PI*2);ctx.stroke();
  }else ctx.drawImage(im,Math.round(px),Math.round(py));
 }
 ctx.restore();}
function tick(time){requestAnimationFrame(tick);if(!playing)return;let dt=Math.min(.06,Math.max(0,(time-last)/1000||.016));last=time;clock+=dt;
 if(!mapShown){let dx=stick.x,dy=stick.y;if(keys.has('KeyA')||keys.has('ArrowLeft'))dx-=1;if(keys.has('KeyD')||keys.has('ArrowRight'))dx+=1;if(keys.has('KeyW')||keys.has('ArrowUp'))dy-=1;if(keys.has('KeyS')||keys.has('ArrowDown'))dy+=1;let v=Math.hypot(dx,dy);if(v>1){dx/=v;dy/=v}let vel=dt*(holdingRun||keys.has('ShiftLeft')||keys.has('ShiftRight')?225:143);
 if(v>.06){if(!isSolid(player.x+dx*vel,player.y))player.x+=dx*vel;if(!isSolid(player.x,player.y+dy*vel))player.y+=dy*vel;motion+=dt;}
 cam.x+=(player.x-cam.x)*Math.min(1,dt*5);cam.y+=(player.y-cam.y)*Math.min(1,dt*5);
 for(const w of walkers){w.x=w.homeX+Math.sin(clock*.32+w.phase)*42;w.y=w.homeY+Math.cos(clock*.27+w.phase)*15}
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
let list=Object.entries(data),done=0;return Promise.all(list.map(([id,record])=>new Promise(resolve=>{let im=new Image();im.onload=()=>{images[id]=im;done++;$('progress').style.width=(done/list.length*100).toFixed(0)+'%';$('status').textContent=`Preparando ${done} de ${list.length} sprites...`;resolve()};im.onerror=()=>{done++;console.error('Sprite não carregou',record.file);resolve()};im.src='./'+record.file})))}).then(()=>{for(const i of items)if(!images[i.id])console.warn('Sprite indisponível:',i.id);$('play').disabled=false;$('play').textContent='ENTRAR NO BAIRRO';$('status').textContent='Tudo pronto. Explore o bairro e avalie o visual.'}).catch(e=>{$('status').textContent='Erro: '+e.message;console.error(e)});
})();
