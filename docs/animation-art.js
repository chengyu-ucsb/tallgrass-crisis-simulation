'use strict';
/* Layered editorial illustrations for the fictional Tallgrass case.
   All essential wording remains in the HTML evidence panel and transcript. */
(() => {
  const C = {
    ink:'#173e35', deep:'#12342e', forest:'#295c4b', sage:'#8ca790',
    pale:'#dbe5d4', paper:'#fff9e9', cream:'#ede4ce', stone:'#c4cbbb',
    line:'#8d9f8d', amber:'#b2764c', clay:'#ba7658', blue:'#809aa4',
    sky:'#c9dce0', darkBlue:'#567981', white:'#f9f7ed'
  };
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const group = (attrs, body) => '<g '+attrs+'>'+body+'</g>';
  const at = (x,y,body,more='') => group('transform="translate('+x+' '+y+')" '+more,body);
  const focus = (keys,body) => group('data-film-focus="'+keys+'"',body);
  const enter = (beat,body) => group('data-film-enter="'+beat+'"',body);
  const gesture = (kind,body,origin='0 0',seconds=0,duration=5,distance=null) =>
    group('data-film-gesture="'+kind+'" data-film-origin="'+origin+
      '" data-film-at="'+seconds+'" data-film-duration="'+duration+'"'+
      (distance===null?'':' data-film-distance="'+distance+'"'),body);
  const rect = (x,y,w,h,fill,rx=0,extra='') =>
    '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+rx+'" fill="'+fill+'" '+extra+'/>';
  const path = (d,stroke,sw=2,fill='none',extra='') =>
    '<path d="'+d+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+
      '" stroke-linecap="round" stroke-linejoin="round" '+extra+'/>';
  const circle = (x,y,r,fill,extra='') => '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+fill+'" '+extra+'/>';
  const ellipse = (x,y,rx,ry,fill,extra='') => '<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="'+fill+'" '+extra+'/>';
  const lines = (x,y,width,count=4,gap=13,color='#b7c6b1',sw=4) =>
    Array.from({length:count},(_,i)=>path('M'+x+' '+(y+i*gap)+'h'+Math.round(width*(i===count-1?.66:1-(i%3)*.1)),color,sw)).join('');
  const leafMark = (x,y,s=1) => at(x,y,group('transform="scale('+s+')"',
    path('M0 19V-14M0 4-10-5M0 11 11-2M0-5 7-12',C.paper,2.4)));
  const pin = (x,y,s=1,color=C.clay) => at(x,y,group('transform="scale('+s+')"',
    path('M0 22C-5 14-16 6-16-5a16 16 0 0 1 32 0C16 6 5 14 0 22Z','none',0,color)+circle(0,-5,5,C.paper)));
  const sun = (x,y,r=13) => circle(x,y,r,'#e8c681')+
    Array.from({length:8},(_,i)=>{
      const a=i*Math.PI/4,x1=x+Math.cos(a)*(r+6),y1=y+Math.sin(a)*(r+6);
      return path('M'+x1+' '+y1+'l'+Math.cos(a)*7+' '+Math.sin(a)*7,'#d6ad67',2.5);
    }).join('');
  // Elapsed-time symbol: essential times are stated in the HTML evidence.
  const clock = (x,y,r=34) => at(x,y,
    circle(2,5,r,C.ink+'18')+circle(0,0,r,C.paper,'stroke="#b3c1a9" stroke-width="3"')+
    group('transform="scale('+(r/34)+')"',
      path('M-13-20h26M-13 20h26',C.forest,3.3)+
      path('M-10-18v6q0 7 10 12-10 5-10 12v6M10-18v6q0 7-10 12 10 5 10 12v6',C.forest,2.4)+
      path('M-7-14H7q0 7-7 10-7-3-7-10Z','none',0,'#c5a266')+
      path('M-7 16 0 9 7 16Z','none',0,'#c5a266')+path('M0 2v3','#c5a266',2)));
  const desk = (uid,cool=false) => rect(0,0,760,500,'url(#'+uid+'-desk)')+
    path('M0 91h760M0 359h760',cool?'#c5d3c7':'#d8ccb4',2)+
    path('M0 99h760M0 365h760','#fff9e8',1,'none','opacity=".35"');
  const mug = (x,y,s=1) => at(x,y,group('transform="scale('+s+')"',
    ellipse(3,16,39,20,C.ink+'12')+circle(0,0,34,'#d3d9bc')+
    path('M27-10q25-5 22 13-2 12-20 9',C.paper,10)+circle(0,0,26,C.paper)+
    circle(0,0,19,'#87664e')+path('M-13-7q15-11 25 1','#bb9470',2)));
  const plant = (x,y,s=1) => at(x,y,group('transform="scale('+s+')"',
    ellipse(0,58,34,10,C.ink+'15')+
    path('M-25 15h50l-7 44h-36Z','none',0,'#ae7e61')+
    path('M0 18v-78',C.forest,3)+
    path('M0-13q-46-9-39-41 31 1 39 41M0-30q41-23 46 3-16 21-46 14M0-49q-29-43-7-55 28 16 7 55','none',0,'#83a17c')));
  const envelope = (x,y,w=76,h=52,color='#b5cbb7') => at(x,y,
    rect(2,4,w,h,C.ink+'12',7)+rect(0,0,w,h,color,7)+
    path('M3 4 '+(w/2)+' '+(h*.57)+' '+(w-3)+' 4',C.forest,2.3)+
    path('M2 '+(h-4)+' '+(w*.31)+' '+(h*.46)+'m'+(w*.38)+' 0 '+(w*.29)+' '+(h*.46),C.forest,1.3));
  const folder = (x,y,w=185,h=131,color='#b2c6a4') => at(x,y,
    path('M0 17V5q0-5 7-5h55l16 16h'+(w-85)+'q7 0 7 8v'+(h-31)+'q0 7-7 7H7q-7 0-7-7Z','none',0,color)+
    path('M1 35h'+(w-2)+'l-9 '+(h-41)+'q-1 6-7 6H14q-7 0-8-7Z','none',0,'#c5d4b6')+
    rect(18,53,w*.48,7,'#eef0d8',3));
  const card = (x,y,w=180,h=125,angle=0,accent=C.sage) => at(x,y,group('transform="rotate('+angle+' '+w/2+' '+h/2+')"',
    rect(5,8,w,h,C.ink+'12',9)+rect(0,0,w,h,C.paper,9,'stroke="#bfcbb4" stroke-width="1.5"')+
    rect(0,0,w,28,accent,9)+rect(0,17,w,11,accent)+
    lines(17,47,w-34,Math.max(2,Math.floor((h-65)/14)),14,'#b9c8b3',4)));
  const phone = (uid, {x=260,y=61,scale=1,angle=-5,kind='chat',caution=false,hook='phone',key=''}={}) => {
    const light=caution?'#ebd6aa':'#dce9d3';
    let screen='';
    if(kind==='video') {
      screen=rect(14,47,144,104,'#bfcbbb',8)+
        path('M14 48h144v104H14Z','none',0,'#cdd6c4')+
        path('M96 51 86 70l7 10-13 16 7 9-17 18 5 13-12 13','#667b68',3)+
        circle(86,98,20,'#fbf8e8e8')+path('m81 88 14 10-14 10Z','none',0,C.forest)+
        lines(16,174,134,2,15,'#779771',4)+
        [0,1,2].map((n)=>at(17+n*46,221,circle(0,0,11,'#a8c49f')+
          path(n===0?'M-4-4h8v6h-4l-4 4Z':n===1?'M-5-4 5 0-5 4Z':'M-5 0h10m-5-5v10',C.forest,1.8))).join('');
    } else if(kind==='post') {
      screen=circle(30,59,12,'#a5b99d')+lines(50,55,83,2,11,'#8ca287',3)+
        rect(15,86,142,109,light,9)+lines(29,104,114,5,16,'#927c4f',4)+
        path('M25 223h122M25 245h98','#b4c5aa',4)+
        [0,1,2].map(n=>circle(30+n*43,275,9,'#bbcdb0')).join('');
    } else if(kind==='call') {
      screen=circle(86,106,40,'#c1d4b9')+circle(86,92,14,'#8da782')+
        path('M58 133q4-29 28-29 24 0 28 29','none',0,'#8da782')+
        lines(40,171,92,2,13,'#9eb395',4)+circle(86,238,23,'#b47f5f')+
        path('M72 239q15-14 28 0m-28 0 2 7m26-7-2 7',C.paper,5);
    } else if(kind==='calendar') {
      screen=at(18,51,rect(0,0,136,116,C.paper,8,'stroke="#b1c5a5" stroke-width="2"')+
        rect(0,0,136,28,'#b9cca8',8)+path('M28-4v17m81-17v17',C.forest,5)+
        [0,1,2].map(r=>[0,1,2,3].map(c=>circle(23+c*29,49+r*25,4,'#94af87')).join('')).join('')+
        circle(81,99,11,'none','stroke="#b27b50" stroke-width="3"'))+
        at(19,197,rect(0,0,135,44,'#d7e4c9',8)+lines(13,15,109,2,12,'#96af8c',4))+
        [0,1,2].map(n=>circle(39+n*45,277,13,['#c2cba7','#b8ccc0','#d8b594'][n])).join('');
    } else {
      screen=[{y:47,w:132,x:16,c:light},{y:130,w:123,x:29,c:'#d7e4cd'},{y:216,w:133,x:16,c:'#e3ead9'}].map((v,n)=>
        group('data-film-enter="'+Math.min(n,2)+'"',rect(v.x,v.y,v.w,61,v.c,9)+
          path('M'+(v.x+10)+' '+(v.y+61)+'l-9 8 1-16','none',0,v.c)+
          lines(v.x+13,v.y+17,v.w-27,3,13,n===0?'#77976e':'#94ad87',4))).join('');
    }
    const shell=rect(7,12,172,334,C.ink+'15',26)+rect(0,0,172,334,'#224e42',24)+
      rect(8,9,156,315,'#94ac91',19)+rect(12,15,148,303,'#f2f3e5',16)+
      rect(57,17,58,10,'#214b40',5)+screen+
      path('M60 307h52','#a4b89b',4)+path('M3 77v31m0 8v31m166-37v49','#3c6c57',3);
    const body=gesture(hook,shell,'86 284',0,1.1);
    return at(x,y,group('transform="rotate('+angle+' 86 167) scale('+scale+')"',
      focus(key,body)));
  };
  function person({x=0,y=0,s=1,shirt=C.sage,skin='#c99d7e',hair='#2a4236',pose='stand',walk=null,hood=false}={}) {
    const limb=(name,origin,body)=>group('data-film-limb="'+name+'" data-film-origin="'+origin+'"',body);
    const legs=pose.startsWith('sit')
      ? path('M-13 63-26 98 7 119m14-56 13 37 18 18',C.ink,16)+
        path('M2 122h17m28 0h17',C.deep,9)
      : limb('left-leg','-10 59',path('M-10 59-15 111',C.ink,15)+path('M-15 112h-12',C.deep,10))+
        limb('right-leg','12 59',path('M12 59 17 111','#315647',15)+path('M17 112h13',C.deep,10));
    const leftArm=(pose==='phone'||pose==='sit-phone')
      ?path('M-19 12-31 49-2 54',shirt,13)+circle(-1,54,6,skin)
      :pose==='present'
        ?path('M-20 12-33 39-54 32',shirt,13)+ellipse(-54,32,7,6,skin)
        :limb('left-arm','-18 10',path('M-18 10-26 51',shirt,13)+circle(-26,54,6,skin));
    const rightArm=(pose==='phone'||pose==='sit-phone')
      ?path('M19 13 33 38 20 52',shirt,13)+circle(20,52,6,skin)
      :pose==='cold'
        ?path('M20 13 13 37-17 29',shirt,13)+ellipse(-17,29,6,5,skin)
        :pose==='present'
          ?path('M19 12 32 40 57 31',shirt,13)+ellipse(57,31,7,6,skin)
          :limb('right-arm','18 10',path('M18 10 27 51',shirt,13)+circle(27,54,6,skin));
    const head=rect(-5,-19,10,20,skin,4)+
      ellipse(0,-35,17,22,skin)+
      path('M-17-36q-5-30 21-27 22 1 13 28l-8-12q-9 9-25 6Z','none',0,hair)+
      path('M-6-36h1m12 0h1',hair,2.6)+
      path('M2-33l2 7-4 1m-5 6q6 4 12-1','#795b47',1.3)+
      ellipse(-16,-32,3,5,skin)+ellipse(16,-32,3,5,skin);
    const body=ellipse(0,122,34,8,C.ink+'18')+legs+
      leftArm+path('M-20 3Q0-8 20 3l7 62h-54Z','none',0,shirt)+
      path('M-19 6q17 14 38 0',hood?'#f0e6c5':shirt,hood?6:0)+
      path('M-13 59h27',C.ink+'30',1.7)+rightArm+
      gesture('look',head,'0 -9',.35,1.2)+
      ((pose==='phone'||pose==='sit-phone')?at(10,45,group('transform="rotate(-12)"',rect(-8,-11,18,30,C.deep,3)+rect(-5,-7,12,18,'#cde0bf',1))):'');
    return at(x,y,group('transform="scale('+s+')"',
      walk===null?body:group('data-film-walk="'+walk+'" data-film-distance="'+(walk===1?80:106)+
        '" data-film-at="'+(.3+walk*.23)+'" data-film-duration="'+(4.2+walk*.25)+'"',body)));
  }
  function city(uid,{rainy=false}={}) {
    return rect(0,0,760,500,'url(#'+uid+'-sky)')+
      circle(632,82,157,'#e8ece0','opacity=".7"')+
      path('M0 306V181h61v125h39V133h76v173h35V193h83v113h68V139h64v167h70V177h87v129h41V124h78v182h58v194H0Z','none',0,'#afc4bd')+
      path('M0 349V248h104v101h55V211h92v138h268V232h96v117h145v151H0Z','none',0,'#91aca2','opacity=".36"')+
      rect(0,385,760,115,'url(#'+uid+'-ground)')+
      path('M0 439h760M0 477h760','#9faf9a',2,'none','opacity=".65"')+
      (rainy?rainField(uid,0,0,760,400,.2):'');
  }
  function rainField(uid,x,y,w,h,opacity=.6) {
    const patternId=uid+'-rain-'+x+'-'+y, clipId=patternId+'-clip';
    // A tile repeats along (-7,24), the director's exact rain travel vector.
    const grid='<defs><pattern id="'+patternId+'" patternUnits="userSpaceOnUse" width="72" height="24" patternTransform="matrix(1 0 -.2916666667 1 0 0)">'+
      path('M18 3v12','#8baab0',1.6)+'</pattern><clipPath id="'+clipId+'">'+rect(0,0,w,h,'#fff')+'</clipPath></defs>';
    return at(x,y,grid+group('opacity="'+opacity+'" clip-path="url(#'+clipId+')"',
      [0,1].map(phase=>at(phase*36,phase*12,group('data-film-rain="'+phase+'"',
        rect(-60,-60,w+120,h+120,'url(#'+patternId+')')))).join('')));
  }
  function building(uid,{x=220,y=62,s=1,closed=false,hotel=false,highlight=false}={}) {
    const w=hotel?274:250,h=332;
    let windows='';
    for(let row=0;row<5;row++)for(let col=0;col<4;col++) {
      const xx=19+col*55,yy=37+row*46;
      windows+=rect(xx,yy,34,30,hotel?'#648b80':'#729388',2)+
        rect(xx+3,yy+3,28,24,'url(#'+uid+'-window)',1)+path('M'+(xx+17)+' '+yy+'v30','#c4d3bc',1.8)+
        path('M'+(xx-2)+' '+(yy+31)+'h38','#b3bda5',2.3);
    }
    return at(x,y,group('transform="scale('+s+')"',
      path('M-9 333 277 333 377 378H69Z','none',0,C.ink+'16')+
      path('M'+w+' 5l45-18v345h-45Z','none',0,'#a5b8a0')+
      rect(0,0,w,h,'url(#'+uid+'-facade)')+
      path('M-10-7h'+(w+59)+'v14H-10Z','none',0,C.forest)+windows+
      path('M8 106h'+(w-16)+'M8 152h'+(w-16)+'M8 198h'+(w-16)+'M8 244h'+(w-16),'#d0d1b6',2)+
      (highlight?focus('connection',rect(8,168,w-16,46,'#d2ad6a','2','opacity=".25"')+
        path('M12 168h'+(w-24),C.amber,3)):'')+
      rect(0,278,w,54,C.forest)+
      rect(w/2-35,278,70,54,closed?'#56766b':'#a9c5b5',2)+
      path('M'+w/2+' 280v52','#284f41',3)+
      path('M'+(w/2-49)+' 272h98v9h-98Z','none',0,C.deep)+
      rect(w/2-30,249,60,14,C.forest,3)+leafMark(w/2,256,.24)+
      path('M-9 333h'+(w+20)+'v9H-9Z','none',0,'#b1beaa')+
      (closed?focus('entry occupancy closure',at(w/2-17,289,
        rect(0,0,34,25,C.paper,2)+path('M7 8h20m-20 7h20',C.amber,2.2))):'')));
  }
  function hallway(uid,index=0) {
    const stage=rect(0,0,760,500,'url(#'+uid+'-wall)')+
      path('M0 0 222 91h326L760 0Z','none',0,'#f1eedc')+
      path('M0 0 222 91v276L0 500Z','none',0,'#c4d1c1')+
      path('M760 0 548 91v276L760 500Z','none',0,'#9fb5a6')+
      rect(222,91,326,277,'#e3e3ce')+
      path('M0 500 222 367h326L760 500Z','none',0,'url(#'+uid+'-floor)')+
      path('M222 90v278m326-278v278M0 491l225-129h323l212 129','#8da58e',2)+
      path('M380 368v132M151 411h454M76 455h611','#a8baa3',1.5)+
      at(0,0,rect(262,143,79,223,'#567c68',3)+rect(270,151,63,215,'#93ac92',2)+
        path('M272 157h60M278 170v181','#a9bca0',2)+circle(321,267,4,'#d4c390'))+
      focus('arrival entry security',at(451,127,rect(0,0,77,240,C.forest,3)+rect(8,9,61,231,'#6f977c',2)+
        path('M22 130h12v-17h12v-17h12v-17','#d9e7c6',3)+
        path('M22 135h36','#cadbbc',2)+rect(18,-21,42,12,'#d8e8c5',3)))+
      at(341,75,rect(0,0,82,8,'#b9c7b0',4)+rect(4,0,74,3,'#fffceb',1))+
      path('M352 83 322 362h145L414 83Z','none',0,'#fff9df','opacity=".11"');
    const crack=focus('crack report',path('M415 29 402 50l9 14-17 23 8 18-22 23 11 16-25 29 8 17-20 28',C.deep,3.4,'none',
      'data-film-draw="crack" pathLength="1"')+
      path('M394 87l-19 2-9 13m14 26-19-4-12 15',C.forest,1.8,'none','data-film-draw="crack" pathLength="1"'));
    return stage+crack+
      focus('report security',person({x:302,y:309,s:1.02,shirt:'#75967a',skin:'#cf9f7c',pose:'phone',hood:true}))+
      focus('crack',path('M411 45q39-5 57 12','#e7d092',1.5,'none','opacity=".4"'));
  }
  function evac(uid,variant='leave') {
    let art=city(uid,{rainy:variant==='tonight'})+
      building(uid,{x:235,y:55,s:1.02,closed:variant!=='leave'});
    art+=plant(84,359,.9)+plant(672,371,.75)+
      path('M112 424q117-12 232 6m190-8q68-9 123 0','#e1e8da',3,'none','opacity=".6"');
    if(variant==='leave') art+=focus('evacuation residents injuries unknown',
      person({x:335,y:348,s:.66,shirt:C.clay,skin:'#d4a17f',walk:0})+
      person({x:423,y:349,s:.73,shirt:C.blue,skin:'#8b5e45',walk:1,hood:true})+
      person({x:520,y:362,s:.64,shirt:'#8e9c63',skin:'#d9b195',walk:2}));
    if(variant==='waiting') art+=focus('waiting arrival return',clock(621,147,44))+
      focus('entry',at(210,392,path('M0 0h321',C.ink,5)+
        path('M7-10v35m304-35v35',C.ink,5)+
        path('M0-11h321','#d5bd72',10)+path('M7-11h26m35 0h26m35 0h26m35 0h26m35 0h26',C.forest,10)));
    if(variant==='tonight') art+=focus('housing',person({x:148,y:333,s:.94,shirt:C.blue,skin:'#8b5e45',pose:'phone'}))+
      focus('inspector closure',at(515,288,group('transform="rotate(6)"',
        rect(5,9,137,141,C.ink+'15',9)+rect(0,0,137,141,C.paper,9)+
        rect(14,17,109,25,'#dce7cc',4)+lines(17,63,100,4,18,'#a6b79b',4))));
    return art;
  }
  function shelter(uid,{campus=false}={}) {
    let art=rect(0,0,760,500,'url(#'+uid+'-wall)')+
      rect(0,363,760,137,'url(#'+uid+'-floor)')+
      path('M0 500 244 363m-13 137 105-137m178 137-62-137m308 137-177-137','#a8baa3',1.8)+
      rect(43,62,315,299,'#597d6e',9)+rect(55,74,291,274,'#c8dce0',4)+
      path('M55 315V216h39v-68h63v167h37V187h59v128h37V132h56v183Z','none',0,'#a6c1ba')+
      group('clip-path="url(#'+uid+'-lobby)"',rainField(uid,57,78,289,274,.7))+
      path('M201 74v274M55 247h291','#6e9180',10)+
      path('M66 80 207 338h28L94 80Z','none',0,'#ffffff','opacity=".2"')+
      rect(412,158,204,11,'#c2c7b0',4)+clock(577,115,29)+
      rect(418,110,57,42,C.paper,5)+lines(428,123,36,2,11,'#a2b595',3)+
      focus('shelter support',rect(375,324,258,46,'#88a77d',12)+rect(362,351,283,24,C.forest,9)+
        path('M388 375v43m231-43v43',C.deep,9))+
      focus('shelter essentials',person({x:430,y:290,s:.95,shirt:C.clay,skin:'#c99d7b',pose:'sit'})+
        person({x:559,y:290,s:.9,shirt:C.blue,skin:'#8d5e45',pose:'sit-phone'}))+
      focus('weather exams',person({x:283,y:296,s:1.1,shirt:'#8b9f63',skin:'#ddb595',pose:'cold',hood:true}))+
      plant(704,355,1.05);
    if(campus) art+=focus('university affiliation private',at(58,92,
      rect(0,0,270,214,'#d3e0d8',5)+path('M26 181V71l109-46 109 46v110Z','none',0,'#b2c7bb')+
      path('M47 179V90h177v89Z','none',0,'#e6e4cc')+
      [0,1,2,3,4].map(n=>rect(61+n*32,108,18,52,'#7e9e8b',2)).join('')+
      path('M32 81h207M53 185h165',C.forest,5)))+
      focus('support',at(385,313,group('transform="rotate(-7)"',
        rect(0,0,77,51,C.paper,4)+circle(18,25,9,'#afc5a4')+lines(36,17,27,2,11,'#9db390',3))));
    return art;
  }
  function contactBoard(uid) {
    const avatar=(x,y,shirt,skin)=>at(x,y,
      circle(0,0,39,'#c9d9c2')+circle(0,-6,15,skin)+
      path('M-28 30q3-28 28-28 25 0 28 28Z','none',0,shirt)+
      path('M-15-8q-2-22 17-20 17 1 13 21l-8-8q-10 8-22 7Z','none',0,C.deep));
    return desk(uid,true)+ellipse(386,415,260,36,C.ink+'12')+
      focus('onsite',enter(0,at(71,99,group('transform="rotate(-5)"',
        rect(6,8,197,238,C.ink+'10',13)+rect(0,0,197,238,C.paper,13)+
        avatar(99,68,C.sage,'#c99d7b')+lines(31,135,133,3,17,'#a1b695',4)+
        rect(30,199,137,17,'#c6d7b7',8)))))+
      phone(uid,{x:298,y:87,scale:.92,angle:0,kind:'call',key:'callbacks'})+
      focus('dana',enter(2,at(496,124,group('transform="rotate(5)"',
        rect(5,8,194,216,C.ink+'10',13)+rect(0,0,194,216,C.paper,13)+
        avatar(97,61,C.blue,'#d9b195')+lines(30,125,133,3,16,'#a1b695',4)+
        rect(29,182,137,17,'#d7e1ca',8)))))+
      path('M268 230h22m194 0h22','#99af98',2,'none','stroke-dasharray="3 5"')+
      mug(115,409,.66)+leafMark(670,421,.65);
  }
  function publicAttention(uid,variant='video') {
    let art=desk(uid,true)+ellipse(365,424,234,28,C.ink+'12')+
      phone(uid,{x:274,y:63,scale:1.08,angle:-6,kind:variant==='claims'?'post':variant==='protest'?'calendar':'video',
        caution:variant==='claims',key:variant==='claims'?'post source':variant==='protest'?'organizing time':'video views'});
    if(variant==='video') {
      art+=focus('chat',enter(2,at(497,140,group('transform="rotate(5)"',
        rect(4,7,187,133,C.ink+'10',12)+rect(0,0,187,133,C.paper,12)+
        [0,1,2].map(n=>circle(30+n*35,29,11,['#c5bd99','#9fb7a5','#b5c8a0'][n])).join('')+
        lines(22,64,143,3,18,'#9fb697',4)))))+
        focus('calls',enter(3,at(83,273,group('transform="rotate(-9)"',
          rect(4,6,143,101,C.ink+'10',11)+rect(0,0,143,101,'#d2dfc8',11)+
          circle(32,35,15,'#8eaa80')+path('M25 31q6 13 15 7',C.paper,3)+lines(64,29,58,2,13,'#96af8c',4)+
          path('M19 76h104','#a9bc9e',5)))))+
        focus('views',enter(1,at(94,112,
          rect(0,0,119,87,'#eff2df',12)+path('M23 54v-13m24 13V30m24 24V21m24 33V10','#87a179',10))));
    } else if(variant==='claims') {
      art+=focus('reach',enter(1,at(470,82,group('transform="rotate(8)"',
        card(0,0,162,94,0,'#d5bb87')+card(18,114,162,94,0,'#d8c699')))))+
        focus('facts',enter(3,at(91,265,group('transform="rotate(-7)"',
          card(0,0,176,135,0,'#a3bd9b')+
          circle(132,93,28,'#e8eddb','stroke="#456e56" stroke-width="6"')+
          path('M151 113l29 33',C.forest,11)+lines(117,86,29,2,11,'#8ca782',3)))))+
        focus('source',enter(2,at(96,107,circle(45,42,39,'#d8dec5')+
          circle(45,32,14,'#a2b496')+path('M22 69q2-25 23-25 21 0 23 25','none',0,'#a2b496')+
          circle(84,75,15,C.paper,'stroke="#9aae8f" stroke-width="2"')+
          path('M80 70q6-5 9 1 1 4-4 7m0 6h0',C.forest,2.6))));
    } else {
      art+=focus('location',enter(1,at(490,185,
        rect(0,0,176,173,'#d9e3d1',11)+rect(18,32,140,111,'#b6c7a6',2)+
        path('M11 29h155v11H11Z','none',0,C.forest)+
        rect(70,88,37,55,'#5b8064',2)+rect(31,54,91,25,'#8fae88',3)+pin(87,-12,.9))))+
        focus('organizing',at(84,151,
          [0,1,2].map(n=>at(n*27,31+(n%2)*35,circle(0,0,18,['#b6bf9a','#d4b28d','#92ad9b'][n])+
            path('M-12 18h24',C.paper,4))).join('')))+
        focus('time',enter(2,clock(123,344,37)));
    }
    return art;
  }
  function laptop(uid,{followup=false}={}) {
    const screen=rect(0,0,411,247,'#264f43',17)+rect(12,12,387,221,'#e9efdf',7)+
      rect(13,13,385,34,'#cbdcc0',7)+circle(28,30,4,'#8eaa7d')+circle(42,30,4,'#a8bd97')+
      rect(61,24,270,12,'#edf3e1',5)+
      focus('email questions',at(39,68,
        circle(21,17,17,'#abc6a0')+envelope(9,9,25,18,'#e4ecd7')+
        lines(57,10,237,2,14,'#789a71',5)+
        rect(0,61,332,86,'#fdfbed',8)+lines(17,78,291,4,16,'#adc1a3',4)))+
      path('M-9 246h430l52 44q8 13-9 16H-49q-15-3-7-16Z','none',0,'#b7c8ae')+
      path('M-53 293h524q-4 13-18 15H-34q-15-2-19-15','none',0,'#65866d')+
      path('M155 256h108l18 26H139Z','none',0,'#dce5cc')+
      path('M27 255h91m-87 11h86m176-11h88m-85 11h89','#96af91',4);
    let art=desk(uid)+ellipse(378,417,301,27,C.ink+'12')+
      focus('email screenshots',at(177,83,group('transform="rotate(-2 205 145)"',screen)))+
      focus('statement deadline',enter(2,clock(88,217,43)))+
      mug(646,385,.91)+plant(683,105,.6);
    if(followup) art+=focus('screenshots warnings',enter(0,at(70,297,group('transform="rotate(-11)"',
      card(0,0,167,135,0,'#afbf99')+rect(22,58,116,27,'#e2cca1',3)))))+
      focus('interview decision',enter(2,at(579,197,
        rect(0,0,118,77,C.forest,12)+circle(62,38,25,'#97ada1')+circle(62,38,17,C.deep)+
        circle(67,33,6,'#84a6a7')+rect(14,-12,31,15,C.forest,4)+path('M48 77l-19 54M83 77l25 54m-25-54v59',C.forest,5))));
    else art+=focus('interview',enter(3,at(68,337,
      rect(0,0,89,62,C.forest,10)+circle(48,31,20,'#8ca99a')+circle(48,31,13,C.deep)+
      rect(11,-9,25,12,C.forest,3)+path('M32 62l-9 31M56 62l14 31',C.forest,4))))+
      focus('questions',enter(1,envelope(538,313,97,62,'#b8caa7')));
    return art;
  }
  function recordSheet(uid,{x=0,y=0,w=225,h=300,angle=0,accent='#aec3a1',highlight=0,type='door',key=''}={}) {
    let diagram=type==='building'
      ? at(28,65,rect(0,0,72,120,'#d0dbc4',4)+
        [0,1,2,3,4].map(r=>[0,1,2].map(c=>rect(10+c*20,10+r*18,12,11,'#93ad88',2)).join('')).join('')+
        rect(29,99,20,21,'#6f936a',2)+rect(-4,62,80,17,'#d5b879',3,'opacity=".5"'))
      :type==='measure'
        ?at(29,70,path('M0 91V0h91v91Z',C.sage,6)+path('M15 77V16h60v61Z','#d3ddc9',3)+
          path('M0 47h91m-44 0v-47m0 94v-47',C.amber,2,'none','stroke-dasharray="4 5"'))
        :at(30,66,rect(0,0,88,106,'#9ab494',4)+rect(10,10,68,96,'#dde5ce',2)+
          circle(67,65,3,C.forest)+path('M93 8 88 25l7 13-10 16 8 15-9 18',C.amber,2.3));
    return at(x,y,group('transform="rotate('+angle+' '+w/2+' '+h/2+')"',focus(key,
      rect(5,9,w,h,C.ink+'16',9)+rect(0,0,w,h,'url(#'+uid+'-paper)',9,'stroke="#c0cbb4" stroke-width="1.5"')+
      rect(18,20,w-36,27,accent,5)+lines(31,33,w*.44,1,10,C.forest,4)+
      diagram+lines(138,77,w-157,3,14,'#a7ba9c',3.5)+
      lines(22,193,w-44,4,18,'#bac8b0',4)+
      (highlight?rect(17,highlight,w-34,28,'#e6c680',3,'opacity=".42"'):'')+
      rect(22,h-38,w*.57,17,'#dce5cd',8)+path('M34 '+(h-30)+'h'+w*.36,'#89a17c',3))));
  }
  function records(uid,variant='pair') {
    let art=desk(uid)+mug(665,398,.88)+plant(75,80,.7);
    if(variant==='pair') art+=focus('screenshots',folder(68,337,165,119))+
      enter(0,recordSheet(uid,{x:155,y:81,w:238,h:315,angle:-8,highlight:250,key:'request1 screenshots'}))+
      enter(2,recordSheet(uid,{x:387,y:85,w:238,h:315,angle:7,highlight:250,key:'request2 closure'}));
    else if(variant==='third') art+=
      recordSheet(uid,{x:214,y:76,w:300,h:348,angle:-3,highlight:251,key:'request3 repeat closure account'})+
      focus('repeat',enter(1,at(507,121,
        [0,1,2].map(n=>at(0,n*57,circle(0,0,23,n===2?'#d5ae70':'#bfd0ac')+
          path('M-8-4h16m-16 8h16',n===2?C.paper:C.forest,3))).join(''))))+
      focus('account',enter(3,at(123,295,rect(0,0,97,94,'#d6dfc4',10)+circle(48,31,15,'#90aa82')+
        path('M22 69q1-24 26-24 25 0 26 24','none',0,'#90aa82'))));
    else if(variant==='finding') art+=
      focus('connection occupancy',at(76,107,group('transform="scale(.77)"',
        building(uid,{x:0,y:0,s:1,closed:true,highlight:true}))))+
      enter(0,recordSheet(uid,{x:357,y:73,w:270,h:335,angle:4,type:'building',highlight:249,key:'connection duration retrieval'}))+
      focus('retrieval',enter(3,at(298,327,
        circle(0,0,34,'#d4dfc7')+path('M-13-5h26m-22-6v22m19-22v22',C.forest,4))));
    else if(variant==='statements') art+=
      enter(0,recordSheet(uid,{x:112,y:92,w:239,h:310,angle:-5,type:'building',key:'statements contractor'}))+
      enter(2,recordSheet(uid,{x:413,y:92,w:239,h:310,angle:5,type:'measure',key:'statements engineer'}))+
      focus('accounts',path('M371 147v214','#a0b59b',2,'none','stroke-dasharray="4 7"'));
    return art;
  }
  function deskPhone(uid,callback=false) {
    const receiver=path('M-73 0q-18-16-17-39 3-16 21-16 15 0 19 14l3 20q41 13 83 0l3-20q4-14 19-14 19 0 22 16 2 23-16 39-53 29-117 0Z','none',0,C.deep)+
      path('M-67-43q7 5 7 16m108-16q-7 5-7 16','#567967',4);
    let art=desk(uid)+ellipse(380,420,269,33,C.ink+'13')+
      focus('calls contractor',at(251,190,group('transform="rotate(-7 130 115)"',
        path('M23 41h211l34 163q2 19-21 25H17q-23-6-17-25Z','none',0,'#7f9b87')+
        path('M28 51h202l19 142H10Z','none',0,'#abc0a1')+
        rect(39,77,175,42,'#dbe6cc',8)+
        [0,1,2,3].map(r=>[0,1,2].map(c=>rect(58+c*47,135+r*17,32,10,r===3?'#6e8e6e':'#e6edd8',3)).join('')).join('')+
        path('M0 172q-67 48-50-18t-38-22',C.forest,4)+
        (callback?'':at(130,37,gesture('phone',receiver,'0 0',0,1.15))))))+
      mug(658,368,.9);
    if(callback) art+=focus('contractor counsel',at(381,227,
      gesture('receiver',group('transform="rotate(-7)"',receiver+
        path('M57-32q30-27 48-15l35 18-7 24-40-8q-23 18-34-19','none',0,'#c99c7b')+
        path('M130-33h500v43H130Z','none',0,C.blue)),'0 0',.73,.7,85)))+
      focus('counsel',enter(1,folder(76,94,181,124)))+
      focus('engineer',enter(2,card(539,90,139,151,6,'#bac8ac')));
    else art+=focus('parent',enter(1,at(87,99,
      card(0,0,146,132,-8,'#c5b88f')+circle(70,60,26,'#d4debf')+
      circle(70,52,10,'#8da67f')+path('M53 80q1-20 17-20 16 0 17 20','none',0,'#8da67f'))))+
      focus('leases resources',enter(2,at(535,106,group('transform="rotate(8)"',
        folder(0,29,147,145)+card(14,0,127,121,0,'#b0c39f')))));
    return art;
  }
  function interview(uid) {
    const head=person({x:418,y:258,s:1.45,shirt:'#6f8c7a',skin:'#c69a78',pose:'present'});
    return rect(0,0,760,500,'url(#'+uid+'-wall)')+
      rect(0,388,760,112,'#bdccb9')+
      focus('august response',at(80,83,
        rect(0,0,144,305,'#88a18b',5)+
        path('M16 17 129 10v295H16Z','none',0,'#cad6bc')+
        path('M16 17 129 10',C.amber,4)+circle(113,176,4,C.forest)+
        path('M2-7h142',C.sage,4)))+
      focus('account',head)+
      focus('account september',at(493,74,
        rect(0,0,180,132,'#d8e3ce',10)+
        path('M15 20h150M15 113h150','#9eb695',3)+
        [0,1,2].map(n=>circle(37+n*54,65,14,['#b0c79e','#d5ba81','#a8c0a7'][n])).join('')))+
      at(129,317,
        path('M0 64 106 5l14 25-106 61Z','none',0,C.forest)+
        ellipse(117,12,26,35,C.deep,'transform="rotate(55 117 12)"')+
        path('M105-3 126 26m-12-34 22 31','#4c6d60',2))+
      focus('account',at(599,309,
        rect(0,0,124,80,C.forest,12)+circle(58,39,26,'#a0b4a8')+
        circle(58,39,18,C.deep)+circle(64,33,6,'#88adb0')+
        path('M45 80l-20 85m20-85 16 85m-16-85v85',C.forest,5)));
  }
  function executive(uid) {
    return rect(0,0,760,500,'url(#'+uid+'-wall)')+
      rect(50,59,208,244,'#95afa3',8)+rect(62,71,184,220,'#d4e2db',3)+
      path('M154 73v217M62 202h184','#afc5b5',7)+
      path('M62 248v-71h32v71h38V144h49v104h32V173h33v75','none',0,'#b8ccc0')+
      focus('arrival',person({x:509,y:254,s:1.24,shirt:'#557b6b',skin:'#d9b095',pose:'present'}))+
      rect(0,367,760,133,'url(#'+uid+'-desk)')+
      path('M0 374h760','#f5ead4',4)+
      focus('proposal advice',enter(1,at(209,316,group('transform="rotate(-4 147 60)"',
        rect(5,7,292,132,C.ink+'15',7)+rect(0,0,292,132,C.paper,7)+
        rect(17,15,258,23,'#dfe6cd',4)+lines(25,58,239,3,19,'#9fb393',4)+
        path('M22 109h160',C.amber,3)))))+
      focus('deadline',clock(641,132,42))+
      focus('advice',at(145,422,group('transform="rotate(20)"',
        path('M-5 0V-79h10V0l-5 15Z','none',0,C.forest)+path('M0 10v5',C.deep,2))))+
      mug(656,429,.72);
  }
  function assistance(uid) {
    return city(uid)+
      focus('offer terms',at(321,70,group('transform="scale(.91)"',building(uid,{x:0,y:0,hotel:true}))))+
      focus('offer rate',enter(0,at(70,126,group('transform="rotate(-6 136 152)"',
        rect(5,9,257,306,C.ink+'16',9)+rect(0,0,257,306,C.paper,9)+
        rect(20,22,217,31,'#bfd1ad',5)+
        at(32,80,path('M0 62V0m0 28h167v34m-167-25h167',C.forest,7)+
          rect(9,7,37,23,'#c8d8bc',6)+rect(58,7,109,23,'#dce6cd',5))+
        lines(26,178,203,3,21,'#9eb594',4)+
        rect(23,253,211,29,'#e6d7ad',5)+path('M39 268h91',C.amber,4)))))+
      focus('warming',enter(3,at(509,301,group('transform="rotate(5)"',
        rect(5,7,181,131,C.ink+'16',10)+rect(0,0,181,131,C.paper,10)+
        sun(144,30,11)+rect(20,63,128,54,'#b9cba9',3)+
        path('M12 62 84 29l71 33Z','none',0,'#8eac86')+
        [0,1,2,3].map(n=>rect(31+n*28,78,16,38,'#73996b',2)).join('')))))+
      plant(708,381,.7);
  }
  function memo(uid,round=1) {
    const inkId=uid+'-ink';
    const sheet=rect(5,8,304,349,C.ink+'18',8)+rect(0,0,304,349,'url(#'+uid+'-paper)',8)+
      rect(20,22,264,40,'#dbe7cb',6)+leafMark(42,42,.42)+
      path('M66 41h150',C.forest,7)+
      [0,1,2,3].map(n=>at(23,85+n*63,
        circle(8,0,7,'#a9bf98')+path('M26 0h'+(n%2?101:139),'#8ba37e',5)+
        path('M0 22h258M0 37h258','#d0dbc4',2))).join('')+
      (round>1?lines(62,104,151,1,12,'#83a174',2.8)+lines(62,230,132,1,12,'#83a174',2.8):'')+
      path('M62 143 C90 132 126 157 153 142 S205 151 226 141',C.forest,2.8,'none',
        'id="'+inkId+'" pathLength="1" data-film-draw="ink"')+
      at(62,143,group('data-film-write="pen" data-film-path="'+inkId+'" data-film-start="62 143"',
        group('transform="rotate(28)"',
          path('M130 32 59 5Q37-4 27-22L14-48Q8-57 1-51L-5-38Q-12-29-5-20L12-1Q24 16 46 24L112 65Z','none',0,'#8d6048')+
          path('M112 17 730 270 697 385 93 72Z','none',0,C.blue)+
          path('M19-34q-15-9-20 1l3 15','#b18165',2)+
          path('M0 0-5-15v-112h10v112Z','none',0,C.forest)+
          path('M-5-15 0 0 5-15Z','none',0,'#c4a477')+
          path('M0-4v4',C.deep,2)+
          path('M-5-102h10','#c4d79c',4)+
          path('M6-110v34','#9cb77c',2))));
    return desk(uid)+mug(639,369,.96)+
      at(586,48,group('transform="rotate(9)"',
        rect(0,0,130,105,'#89a590',8)+rect(8,8,114,85,'#dce6d4',4)+
        path('M0 105h130l19 19h-166Z','none',0,'#bdcdb2')+lines(24,28,83,3,15,'#a0b696',4)))+
      focus('memo read review decision',at(236,76,group('transform="rotate(-4 152 175)"',sheet)))+
      focus('spokesperson briefing interview',at(73,140,group('transform="rotate(-8)"',
        rect(0,0,109,172,C.forest,16)+rect(8,10,93,148,'#dbe6cc',9)+
        circle(54,58,24,'#b3c9a5')+circle(54,51,9,'#8ca77f')+
        path('M37 79q1-19 17-19 16 0 17 19','none',0,'#8ca77f')+
        lines(23,110,61,2,15,'#9fb595',4))))+
      focus('handin decision',folder(40,354,151,95,'#c5cba6'))+
      path('M0 420h137q28-28 58-22l36 13q14 10-1 22l-49-1q-23 32-47 41H0Z','none',0,'#d0a27f')+
      path('M0 407h101l-11 93H0Z','none',0,'#839c6c');
  }

  function render(scene,{stageId='update1',index=0}={}) {
    const uid='cinema-'+String(stageId).replace(/[^a-z0-9_-]/gi,'')+'-'+Number(index);
    const defs='<defs>'+
      '<linearGradient id="'+uid+'-sky" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#b8cfd5"/><stop offset="1" stop-color="#ecedda"/></linearGradient>'+
      '<linearGradient id="'+uid+'-ground" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#b7c7b6"/><stop offset="1" stop-color="#d2d8bd"/></linearGradient>'+
      '<linearGradient id="'+uid+'-facade" x1="0" y1="0" x2="1" y2=".6"><stop stop-color="#f0ead1"/><stop offset="1" stop-color="#cdd1b4"/></linearGradient>'+
      '<linearGradient id="'+uid+'-window" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#c7d8c5"/><stop offset=".45" stop-color="#87a69a"/><stop offset="1" stop-color="#5c8374"/></linearGradient>'+
      '<linearGradient id="'+uid+'-wall" x1="0" y1="0" x2="1" y2=".6"><stop stop-color="#edead7"/><stop offset="1" stop-color="#cbd7c4"/></linearGradient>'+
      '<linearGradient id="'+uid+'-floor" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#a6bba7"/><stop offset="1" stop-color="#d0d8bd"/></linearGradient>'+
      '<linearGradient id="'+uid+'-desk" x1="0" y1="0" x2=".7" y2="1"><stop stop-color="#eee7d4"/><stop offset="1" stop-color="#d7d0b9"/></linearGradient>'+
      '<linearGradient id="'+uid+'-paper" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fffdf1"/><stop offset="1" stop-color="#eeeacf"/></linearGradient>'+
      '<radialGradient id="'+uid+'-light" cx=".2" cy=".15" r=".85"><stop stop-color="#fffdf1" stop-opacity=".19"/><stop offset=".8" stop-color="#fffdf1" stop-opacity="0"/><stop offset="1" stop-color="#183b32" stop-opacity=".04"/></radialGradient>'+
      '<clipPath id="'+uid+'-frame">'+rect(0,0,760,500,'#fff',0)+'</clipPath>'+
      '<clipPath id="'+uid+'-lobby">'+rect(55,74,291,274,'#fff',4)+'</clipPath>'+
      '</defs>';
    const variants={
      update1:[
        ()=>hallway(uid),()=>evac(uid,'leave'),()=>evac(uid,'waiting'),()=>shelter(uid),
        ()=>contactBoard(uid),()=>publicAttention(uid,'video'),()=>laptop(uid),()=>memo(uid,1)
      ],
      update2:[
        ()=>evac(uid,'tonight'),()=>publicAttention(uid,'claims'),()=>records(uid,'pair'),()=>records(uid,'third'),
        ()=>deskPhone(uid),()=>laptop(uid,{followup:true}),()=>deskPhone(uid,true),()=>memo(uid,2)
      ],
      update3:[
        ()=>records(uid,'finding'),()=>records(uid,'statements'),()=>shelter(uid,{campus:true}),()=>interview(uid),
        ()=>executive(uid),()=>assistance(uid),()=>publicAttention(uid,'protest'),()=>memo(uid,3)
      ]
    };
    const draw=variants[stageId]?.[index] || (()=>memo(uid,1));
    const camera=['hallway','shelter','evacuation'].includes(scene?.art)?'push':'still';
    return '<svg xmlns="http://www.w3.org/2000/svg" class="cinema-art" viewBox="0 0 760 500" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false" data-art-key="'+esc(stageId+'-'+index)+'">'+
      defs+group('clip-path="url(#'+uid+'-frame)"',
        group('data-film-camera="'+camera+'"',draw())+rect(0,0,760,500,'url(#'+uid+'-light)'))+'</svg>';
  }
  window.CrisisArtwork={render};
})();
