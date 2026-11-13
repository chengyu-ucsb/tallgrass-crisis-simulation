'use strict';

/* Illustrated case overviews. Recorded narration and original effects never change case progress. */
(() => {
  const symbol = name => {
    const paths = {
      narrator: '<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M6 10v2a6 6 0 0 0 12 0v-2M12 18v3m-4 0h8"/>',
      close: '<path d="m6 6 12 12M18 6 6 18"/>',
      sound: '<path d="M3 9h4l5-4v14l-5-4H3zM16 8q4 4 0 8m3-11q7 7 0 14"/>',
      muted: '<path d="M3 9h4l5-4v14l-5-4H3zM16 9l5 6m0-6-5 6"/>',
      play: '<path d="m8 5 11 7-11 7z" fill="currentColor" stroke="none"/>',
      pause: '<path d="M7 5h3v14H7zm7 0h3v14h-3z" fill="currentColor" stroke="none"/>',
      replay: '<path d="M3 10a9 9 0 1 1 1 7M3 4v6h6"/>',
      expand: '<path d="M8 3H3v5m13-5h5v5m0 8v5h-5M3 16v5h5"/>',
      text: '<path d="M4 4h16v16H4zM8 8h8M8 12h8M8 16h5"/>',
      arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>'
    };
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths[name] + '</svg>';
  };
  const person = (x, y, scale, shirt, skin, extra = '') =>
    '<g transform="translate(' + x + ' ' + y + ') scale(' + scale + ')"><g class="' + extra + '">' +
    '<ellipse cx="0" cy="75" rx="22" ry="5" fill="#163e3320"/>' +
    '<path d="M-10 40-12 69m22-29 8 29" fill="none" stroke="#25483f" stroke-width="10" stroke-linecap="round"/>' +
    '<path d="M-12 4Q-25 10-27 35M12 4q18 8 16 28" fill="none" stroke="' + shirt + '" stroke-width="9" stroke-linecap="round"/>' +
    '<path d="M-12 2Q0-4 12 2l5 37h-35Z" fill="' + shirt + '"/>' +
    '<rect x="-4" y="-7" width="8" height="12" rx="4" fill="' + skin + '"/>' +
    '<circle cy="-16" r="12" fill="' + skin + '"/><path d="M-12-17q-1-17 13-13 14 1 11 14l-7-7q-10 8-17 6" fill="#24483e"/>' +
    '</g></g>';
  const rain = (x, y, width, height) =>
    '<g transform="translate(' + x + ' ' + y + ')" opacity=".42"><g class="film-rain">' +
    Array.from({length: 24}, (_, n) => {
      const px = (n * 73) % width, py = (n * 47) % height;
      return '<path d="m' + px + ' ' + py + ' -5 16" stroke="#71918b" stroke-width="2" stroke-linecap="round"/>';
    }).join('') + '</g></g>';
  const svg = body => '<svg class="film-art" viewBox="0 0 1000 400" fill="none" aria-hidden="true" focusable="false">' + body + '</svg>';

  function evacuation() {
    const windows = Array.from({length: 20}, (_, n) => {
      const x = 385 + (n % 4) * 48, y = 91 + Math.floor(n / 4) * 39;
      return '<rect x="' + x + '" y="' + y + '" width="28" height="25" rx="2" fill="' + (n % 5 === 0 ? '#c3d2a7' : '#628d7a') + '"/><path d="M' + (x + 14) + ' ' + y + 'v25" stroke="#d2ddbd" stroke-opacity=".35" stroke-width="2"/>';
    }).join('');
    return svg(
      '<defs><linearGradient id="film-sky" x2="0" y2="1"><stop stop-color="#dce7df"/><stop offset="1" stop-color="#edf0df"/></linearGradient></defs>' +
      '<path fill="url(#film-sky)" d="M0 0h1000v400H0z"/><circle cx="165" cy="115" r="155" fill="#e7eddf"/>' +
      '<path d="M0 285h110V140h76v145h49V188h62v97h406V145h60v140h72V112h95v173h70v115H0Z" fill="#c9d9cd"/>' +
      '<path d="M0 345h1000v55H0z" fill="#d2d9c6"/><path d="M0 358h1000M0 387h1000" stroke="#bac9b5"/>' +
      '<g class="film-building"><path d="m342 331 304-1 122 39H455Z" fill="#52796119"/>' +
      '<path d="M350 65h258v280H350z" fill="#eeeacb"/><path d="M608 65h42v280h-42z" fill="#b6c5a5"/>' +
      '<path d="M340 59h317v11H340z" fill="#244d3d"/><path d="M350 303h258v42H350z" fill="#3e6a54"/>' +
      windows + '<rect x="446" y="299" width="64" height="46" rx="2" fill="#b8d2bf"/>' +
      '<path d="M478 299v46" stroke="#477461" stroke-width="3"/><path d="M426 295h105v8H426z" fill="#244d3d"/>' +
      '<rect x="440" y="275" width="76" height="14" rx="3" fill="#315d47"/>' +
      '<path d="M455 281h46" stroke="#dce6bd" stroke-width="2"/>' +
      '<path d="M355 130h247M355 169h247M355 208h247M355 247h247" stroke="#d6dabb" stroke-width="2"/></g>' +
      '<g><path d="M730 253h152v92H730z" fill="#a4bea7"/><path d="M720 245h172v14H720z" fill="#577e64"/>' +
      '<rect x="759" y="268" width="93" height="77" fill="#dce7c8"/><path d="M805 268v77" stroke="#729780" stroke-width="4"/></g>' +
      '<g class="film-walk film-walk-one">' + person(523, 307, .68, '#b97155', '#d5a784') + '</g>' +
      '<g class="film-walk film-walk-two">' + person(582, 301, .72, '#8c9dbe', '#8b5d43') + '</g>' +
      '<g class="film-walk film-walk-three">' + person(667, 310, .65, '#839f62', '#e0b998') + '</g>' +
      '<g transform="translate(277 290)"><path d="M0 51V-17" stroke="#4e7155" stroke-width="4"/><ellipse cy="-21" rx="22" ry="38" fill="#93ad74"/></g>' +
      '<g transform="translate(908 292)"><path d="M0 53V-8" stroke="#4e7155" stroke-width="4"/><ellipse cy="-21" rx="18" ry="34" fill="#a3b988"/></g>'
    );
  }

  function shelter() {
    return svg(
      '<path fill="#e9e8d6" d="M0 0h1000v400H0z"/><path d="M0 312h1000v88H0z" fill="#c9d4ba"/>' +
      '<path d="m0 400 210-88m120 88 63-88m280 88-62-88m389 88-210-88" stroke="#b4c3a5" stroke-width="2"/>' +
      '<rect x="112" y="64" width="340" height="248" rx="8" fill="#5f7d6b"/>' +
      '<rect x="125" y="77" width="314" height="220" rx="3" fill="#d0dfe0"/>' +
      '<path d="M125 258h314V176h-43v-49h-76v93h-41V111h-60v147h-44v-74h-50Z" fill="#a9c3bd"/>' +
      '<defs><clipPath id="film-lobby-rain"><rect x="125" y="77" width="314" height="220"/></clipPath></defs><g clip-path="url(#film-lobby-rain)">' + rain(130, 77, 300, 200) + '</g>' +
      '<path d="M282 77v220M125 207h314" stroke="#6b8b79" stroke-width="10"/>' +
      '<path d="m140 83 120 205h28L168 83Z" fill="#fff" opacity=".16"/>' +
      '<rect x="510" y="123" width="244" height="12" rx="5" fill="#d6d1b8"/>' +
      '<rect x="527" y="63" width="80" height="58" rx="5" fill="#f7f4e8"/>' +
      '<path d="M540 80h54m-54 11h42m-42 11h35" stroke="#9dad91" stroke-width="4" stroke-linecap="round"/>' +
      '<circle cx="692" cy="91" r="26" fill="#f6f4e5" stroke="#bfccb0" stroke-width="5"/><path d="M692 75v17l11 7" stroke="#57775d" stroke-width="3" stroke-linecap="round"/>' +
      '<g><rect x="492" y="251" width="235" height="42" rx="11" fill="#89a779"/><rect x="480" y="278" width="258" height="21" rx="8" fill="#587b54"/><path d="M501 299v35m218-35v35" stroke="#36583f" stroke-width="9" stroke-linecap="round"/></g>' +
      '<g class="film-waiting"><path d="m541 270 0 27 16 24m29-51 1 26 15 25" stroke="#355449" stroke-width="13" stroke-linecap="round"/><path d="M539 214q20-14 40 0l15 62h-63Z" fill="#b97155"/><circle cx="558" cy="196" r="18" fill="#d5a784"/><path d="M540 196q-1-26 20-24 20 3 15 24l-10-11-12 9Z" fill="#304c40"/><path d="m539 225-17 31 30 4m31-35 17 29-27 5" stroke="#b97155" stroke-width="12" stroke-linecap="round"/></g>' +
      '<g transform="translate(651 215)"><g class="film-phone-check"><path d="m-10 51-9 28 21 23m15-49 9 26 8 22" stroke="#3f5d59" stroke-width="12" stroke-linecap="round"/><path d="M-17-2q17-13 34 0l11 59h-53Z" fill="#8c9dbe"/><circle cy="-23" r="17" fill="#8b5d43"/><path d="M-17-22q-1-25 19-23 22 3 14 25l-8-11-15 10Z" fill="#24483e"/><path d="m-19 11-10 30 30-5m19-26 8 20-18 3" stroke="#8c9dbe" stroke-width="11" stroke-linecap="round"/><rect x="-2" y="23" width="16" height="25" rx="3" transform="rotate(-12)" fill="#2d5043"/><path d="m2 30 7-2" stroke="#d2e6b8" stroke-width="3"/></g></g>' +
      person(439, 224, 1.25, '#839f62', '#e0b998', 'film-standing') +
      '<path d="M815 296h49l-8 40h-33Z" fill="#b88166"/><path d="M840 299V188" stroke="#567654" stroke-width="4"/><path d="M838 254q-59-19-41-51 38 8 43 51m2-33q51-22 59 5-21 27-59 26m-3-40q-28-49 3-60 27 24-3 60" fill="#89a56e"/>'
    );
  }

  function reporter() {
    return svg(
      '<path fill="#dce7db" d="M0 0h1000v400H0z"/><circle cx="867" cy="120" r="144" fill="#ccdccc"/><circle cx="159" cy="322" r="173" fill="#e9ecdc"/>' +
      '<ellipse cx="500" cy="346" rx="360" ry="24" fill="#52796120"/>' +
      '<rect x="221" y="42" width="558" height="291" rx="18" fill="#355949"/><rect x="236" y="57" width="528" height="258" rx="8" fill="#f1f3e8"/>' +
      '<path d="M221 323h558l72 40q7 11-12 14H160q-17-3-10-14Z" fill="#afc5a7"/><path d="M150 364h700q-2 17-25 17H175q-23-1-25-17" fill="#6c8c72"/><path d="M437 332h126l24 22H413Z" fill="#d4e0c9"/>' +
      '<path d="M125 330h51v32h-51z" fill="#b97f60"/><path d="M176 337q26-3 15 16h-15" stroke="#b97f60" stroke-width="7"/>' +
      '<path d="M865 266v77" stroke="#52714f" stroke-width="3"/><path d="M865 310q-40-28-26-46 29 7 26 46m0-16q32-39 48-17-7 26-48 17" fill="#8ca676"/><path d="M841 329h47l-9 37h-29Z" fill="#b6c4a3"/>'
    );
  }

  function memo() {
    return svg(
      '<path fill="#e9e1ce" d="M0 0h1000v400H0z"/><path d="M0 81h1000M0 321h1000" stroke="#dad1bb" stroke-width="3"/>' +
      '<g transform="translate(672 37) rotate(12)"><rect width="165" height="107" rx="7" fill="#9ab29c"/><rect x="8" y="8" width="149" height="91" rx="4" fill="#e6eddd"/><path d="M0 107h165l20 19H-20Z" fill="#c2cfb5"/><path d="M20 29h124m-124 16h92m-92 16h108" stroke="#a3b798" stroke-width="5" stroke-linecap="round"/></g>' +
      '<g class="film-memo-sheet"><path d="m340 41 293-4 20 341H326Z" fill="#375b4720"/><rect x="337" y="29" width="294" height="337" rx="6" fill="#fffdf1"/><rect x="357" y="52" width="254" height="39" rx="5" fill="#e3ebd3"/><path d="M376 71h117" stroke="#42684b" stroke-width="8" stroke-linecap="round"/><path d="M358 109h178" stroke="#c5d1b7" stroke-width="4" stroke-linecap="round"/><path d="M359 139h94m-94 80h108m-108 74h86" stroke="#748e6c" stroke-width="6" stroke-linecap="round"/><path d="M359 162h248m-248 16h248m-248 64h248m-248 16h248m-248 57h248m-248 16h248" stroke="#d8dfcb" stroke-width="2"/><path class="film-written-line" d="M359 178h85" stroke="#355d43" stroke-width="3" stroke-linecap="round" stroke-dasharray="85" stroke-dashoffset="85"/></g>' +
      '<g class="film-pen"><g transform="translate(599 250) rotate(28)"><rect x="-5" y="-85" width="10" height="106" rx="4" fill="#3c6451"/><path d="m-5 21 5 18 5-18" fill="#c4a778"/><path d="m-1 34 1 5 1-5" fill="#244b3b"/><path d="M-5-70h10" stroke="#b9cc91" stroke-width="4"/></g></g>' +
      '<g transform="translate(202 182) rotate(-8)"><rect width="93" height="135" rx="12" fill="#517a69"/><rect x="8" y="12" width="77" height="109" rx="6" fill="#dce7d5"/><circle cx="47" cy="127" r="3" fill="#c5d4b8"/><path d="M22 37h49m-49 15h40m-40 15h45" stroke="#9bb58d" stroke-width="5" stroke-linecap="round"/></g>' +
      '<g transform="translate(741 249)"><circle r="44" fill="#c1ceb0"/><circle r="32" fill="#fff9e8"/><circle r="23" fill="#8c6649"/><path d="M30-12q34-2 21 21L34 16" stroke="#fff9e8" stroke-width="10" fill="none"/></g>' +
      '<path d="M0 355h185q31-36 67-31l35 9q16 12-1 22l-49-1q-29 43-61 46H0Z" fill="#d0a17e"/><path d="M0 339h133l-14 61H0Z" fill="#839f62"/>' +
      '<path d="M1000 348H849q-32-28-56-18l-29 15q-8 15 10 20l39-6q20 31 54 41h133Z" fill="#8b5d43"/><path d="M1000 335H903l14 65h83Z" fill="#8c9dbe"/>'
    );
  }


  function hallwayDiscovery() {
    return svg(
      '<path d="M0 0h1000v400H0z" fill="#eeeada"/><path d="M0 0h1000L770 102H230Z" fill="#f6f3e5"/>' +
      '<path d="M0 0 230 102v220L0 400Zm1000 0L770 102v220l230 78Z" fill="#d6deca"/>' +
      '<path d="M230 102h540v220H230z" fill="#ece8cf"/><path d="m0 400 230-78h540l230 78Z" fill="#bfcdb5"/>' +
      '<path d="M230 103h540M230 314h540M0 400l230-78m770 78-230-78" stroke="#a5b79c" stroke-width="3"/>' +
      '<rect x="283" y="134" width="97" height="189" rx="4" fill="#6c8b73"/><rect x="294" y="145" width="75" height="178" rx="2" fill="#95ae8e"/><circle cx="354" cy="239" r="4" fill="#e9ebce"/>' +
      '<rect x="619" y="126" width="109" height="197" rx="4" fill="#466f59"/><rect x="631" y="139" width="85" height="184" rx="2" fill="#789b7e"/>' +
      '<path d="M649 212h14v-15h14v-15h14v-15" stroke="#e1e9d3" stroke-width="4" stroke-linejoin="round"/>' +
      '<path d="M549 43 530 63l11 13-24 26 13 15-27 27 11 14-28 26 9 18-19 25" stroke="#6c7160" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="m516 102-22 3-10 11m18 28-22-3-13 12" stroke="#7b806e" stroke-width="2" stroke-linecap="round"/>' +
      '<rect x="460" y="69" width="82" height="9" rx="4" fill="#dedfc7"/>' +
      person(427,260,1,'#839f62','#e0b998','film-observer') +
      '<g transform="translate(452 276) rotate(-10)"><g class="film-device-glance"><rect x="-8" y="-17" width="17" height="30" rx="3" fill="#355d49"/><rect x="-5" y="-13" width="11" height="19" rx="1" fill="#e3edce"/><circle cy="9" r="1.5" fill="#a9c398"/></g></g>'
    );
  }
  function informationDesk(records = false) {
    const paper = (x,y,angle,extra='') =>
      '<g transform="translate('+x+' '+y+') rotate('+angle+')"><g class="film-document-arrive '+extra+'">' +
      '<rect width="210" height="270" rx="8" fill="#fffdf1" stroke="#c6d1b8" stroke-width="2"/><rect x="18" y="20" width="174" height="31" rx="4" fill="#e4ecd5"/>' +
      '<path d="M31 35h87" stroke="#52724e" stroke-width="5" stroke-linecap="round"/><path d="M23 77h157m-157 14h126m-126 28h154m-154 14h142m-142 28h156m-156 14h118" stroke="#becdb0" stroke-width="4" stroke-linecap="round"/>' +
      '<rect x="21" y="211" width="112" height="27" rx="5" fill="#dce5cc"/><path d="M33 225h70" stroke="#81996f" stroke-width="4" stroke-linecap="round"/></g></g>';
    const phone =
      '<g transform="rotate(-5 500 202)"><g class="film-device-glance"><rect x="415" y="48" width="170" height="302" rx="24" fill="#355d49"/><rect x="427" y="64" width="146" height="262" rx="14" fill="#eef2df"/><rect x="474" y="68" width="52" height="8" rx="4" fill="#9eb695"/><circle cx="500" cy="337" r="5" fill="#b1c59d"/>' +
      '<g class="film-message-arrive"><path d="M441 100h116v57H453l-12 10Z" fill="#c8dcb8"/><path d="M453 116h91m-91 13h75m-75 13h52" stroke="#6c8d61" stroke-width="4" stroke-linecap="round"/></g>' +
      '<g class="film-message-arrive film-message-later"><path d="M441 183h116v66l-12-10H441Z" fill="#dce6d0"/><path d="M453 199h92m-92 13h80m-80 13h56" stroke="#8fa582" stroke-width="4" stroke-linecap="round"/></g>' +
      '<rect x="441" y="279" width="116" height="25" rx="12" fill="#d1ddc1"/><circle cx="458" cy="291" r="3" fill="#789467"/><path d="M470 291h63" stroke="#a2b493" stroke-width="4" stroke-linecap="round"/></g></g>';
    return svg('<path d="M0 0h1000v400H0z" fill="#e7e4d3"/><circle cx="196" cy="95" r="180" fill="#eff0df"/><path d="M0 354h1000v46H0z" fill="#c8d4ba"/><path d="M70 365h860" stroke="#b6c5a7" stroke-width="2"/>' +
      (records ? paper(376,58,-7,'film-document-back')+paper(417,51,5,'film-document-later')+paper(397,73,0) : paper(274,91,-9,'film-document-back')+paper(566,88,8,'film-document-later')+phone) +
      '<g transform="translate(785 294)"><circle r="37" fill="#c2cfb0"/><circle r="27" fill="#fff9e7"/><circle r="18" fill="#90704f"/><path d="M27-9q25-2 17 17l-16 3" stroke="#fff9e7" stroke-width="8"/></g>');
  }
  function housingOffer() {
    const windows = Array.from({length:12},(_,n)=>{
      const x=391+n%4*55, y=111+Math.floor(n/4)*52;
      return '<rect x="'+x+'" y="'+y+'" width="33" height="33" rx="3" fill="#87a68c"/><path d="M'+(x+16)+' '+y+'v33" stroke="#dbe6cb" stroke-width="2"/>';
    }).join('');
    return svg('<path d="M0 0h1000v400H0z" fill="#dce7dc"/><circle cx="812" cy="98" r="166" fill="#eaf0de"/><path d="M0 313h1000v87H0z" fill="#ccd7bf"/><path d="M0 352h1000" stroke="#b7c7aa" stroke-width="2"/>' +
      '<path d="M363 83h274v254H363z" fill="#eee9cd"/><path d="M637 83h33v254h-33z" fill="#aec19e"/><path d="M352 75h326v13H352z" fill="#456e52"/>'+windows+
      '<path d="M363 278h274v59H363z" fill="#709168"/><rect x="467" y="279" width="73" height="58" fill="#c1d7ba"/><path d="M503 279v58" stroke="#4d795d" stroke-width="4"/><path d="M448 268h111v12H448z" fill="#355c44"/>' +
      '<g transform="translate(330 243) rotate(-5)"><g class="film-offer-sheet"><rect width="119" height="112" rx="7" fill="#fffdf1" stroke="#cad5bd" stroke-width="2"/><rect x="13" y="15" width="93" height="19" rx="4" fill="#e0eacd"/><path d="M17 51h84m-84 13h70m-70 13h79m-79 17h53" stroke="#a4b792" stroke-width="4" stroke-linecap="round"/></g></g>' +
      '<g transform="translate(736 282)"><path d="M0 55V-18" stroke="#527653" stroke-width="4"/><ellipse cy="-22" rx="28" ry="43" fill="#95af79"/><path d="M-20 54h40l-6 28h-28Z" fill="#b58b6a"/></g><path d="M142 255h123v81H142z" fill="#afc6aa"/><path d="M133 249h141v12H133z" fill="#71926c"/><rect x="162" y="273" width="84" height="63" fill="#d9e5ca"/>');
  }

  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const timecode = value => Math.floor(value / 60) + ':' + String(Math.floor(value % 60)).padStart(2,'0');
  function filmFor(stageId) {
    const film = window.CrisisFilms?.[stageId];
    if (!film) return null;
    const track = window.CrisisNarrationTracks?.[stageId];
    const recorded = track?.scenes?.length === film.scenes.length &&
      film.scenes.every((scene, n) => track.scenes[n].label === scene.label);
    let length = 0;
    const scenes = film.scenes.map((scene, n) => {
      const spoken = recorded ? track.scenes[n] : null;
      const seconds = spoken?.seconds || scene.seconds;
      const next = {...scene, seconds, start:length, cue:spoken?.cue || scene.cue, narration:spoken?.text || '', speechStart:spoken?.speechStart ?? 1.7, speechSeconds:spoken?.speechSeconds || 0};
      length += seconds;
      return next;
    });
    return {...film, scenes, length, narrationSrc:recorded ? track.src : ''};
  }
  function visualDetails(scene) {
    return [
      scene.place ? scene.place + (scene.time ? ' · ' + scene.time : '') : '',
      scene.badge || '',
      scene.stat ? scene.stat.value + ' ' + scene.stat.label : '',
      ...(scene.card ? [scene.card.eyebrow, scene.card.heading, ...scene.card.rows.map(row => row[0] + ': ' + row[1])] : []),
      ...(scene.stats || []).map(row => row[0] + ' ' + row[1])
    ].filter(Boolean);
  }
  function sceneMarkup(scene, n, stageId) {
    const art = {hallway:hallwayDiscovery, evacuation, shelter, reporter, memo,
      messages:()=>informationDesk(false), records:()=>informationDesk(true), housing:housingOffer}[scene.art];
    let illustration = art ? art() : informationDesk(true);
    illustration = illustration.replaceAll('film-sky','film-sky-'+stageId+'-'+n).replaceAll('film-lobby-rain','film-lobby-rain-'+stageId+'-'+n);
    const card = scene.card ? '<div class="film-visual-card'+(scene.tone==='caution'?' film-visual-card-caution':'')+'"><p class="film-card-eyebrow">'+escape(scene.card.eyebrow)+'</p><h3>'+escape(scene.card.heading)+'</h3><dl>'+scene.card.rows.map(row=>'<div><dt>'+escape(row[0])+'</dt><dd>'+escape(row[1])+'</dd></div>').join('')+'</dl></div>' : '';
    const stats = scene.stats ? '<div class="film-stat-grid">'+scene.stats.map(row=>'<div><strong>'+escape(row[0])+'</strong><span>'+escape(row[1])+'</span></div>').join('')+'</div>' : '';
    return '<div class="film-scene'+(card||stats?' film-scene-with-card':'')+'" data-film-scene="'+n+'"'+(n?' hidden':'')+'>'+illustration+
      (scene.place?'<span class="film-place">'+escape(scene.place)+(scene.time?'<span>'+escape(scene.time)+'</span>':'')+'</span>':'')+
      (scene.stat?'<div class="film-fact"><strong>'+escape(scene.stat.value)+'</strong><span>'+escape(scene.stat.label)+'</span></div>':'')+
      (scene.badge?'<span class="film-uncertain">'+escape(scene.badge)+'</span>':'')+card+stats+'</div>';
  }
  function markup(stageId) {
    const film=filmFor(stageId);
    if (!film) return '';
    const {scenes,length}=film;
    const duration=Math.floor(length/60)+' min '+(length%60)+' sec';
    return '<section class="case-film" aria-labelledby="film-title" data-case-film data-film-stage="'+escape(stageId)+'">' +
      '<header class="film-header"><div><h2 id="film-title">Watch '+escape(film.label)+'</h2><p>Illustrated overview <span aria-hidden="true">·</span> '+duration+' <span aria-hidden="true">·</span> Narration &amp; sound effects</p></div><button type="button" class="film-expand" data-film-expand aria-label="Expand animation">'+symbol('expand')+'<span>Expand</span></button></header>'+
      '<div class="film-screen" aria-hidden="true">'+scenes.map((scene,n)=>sceneMarkup(scene,n,stageId)).join('')+'</div>'+
      '<div class="film-caption" aria-live="polite" aria-atomic="true"><span class="film-caption-number" aria-hidden="true" data-film-number>1 / '+scenes.length+'</span><div><h3 data-film-heading>'+escape(scenes[0].title)+'</h3><p data-film-caption>'+escape(scenes[0].caption)+'</p></div></div>'+
      '<div class="film-controls"><div class="film-seek"><input type="range" min="0" max="'+length+'" step="0.1" value="0" aria-label="Animation position" aria-valuetext="0 seconds of '+length+'" data-film-seek><span class="film-time" aria-live="off"><span data-film-time>0:00</span> / '+timecode(length)+'</span></div>'+
      '<div class="film-buttons"><div class="film-transport"><button type="button" class="film-play" data-film-play>'+symbol('play')+'<span>Play overview</span></button><button type="button" class="film-replay" data-film-replay>'+symbol('replay')+'<span>Replay</span></button></div>'+
      '<div class="film-audio-options" role="group" aria-label="Audio options"><button type="button" class="film-narration" data-film-narration aria-pressed="true" title="Turn off the narrator">'+symbol('narrator')+'<span>Narration on</span></button><button type="button" class="film-sound" data-film-sound aria-pressed="true" title="Turn off scene sound effects">'+symbol('sound')+'<span>Effects on</span></button></div>'+
      '<button type="button" class="film-read" data-read-update>'+symbol('text')+'<span>Read the full update</span>'+symbol('arrow')+'</button></div>'+
      '<p class="film-audio-notice" role="status" data-film-notice hidden></p></div>'+
      '<nav class="film-chapters" aria-label="Animation scenes">'+scenes.map((scene,n)=>'<button type="button" data-film-chapter="'+n+'" aria-label="Show scene '+(n+1)+': '+escape(scene.label)+'"'+(n===0?' aria-current="step"':'')+'><span class="film-chapter-dot" aria-hidden="true"></span>'+escape(scene.label)+'</button>').join('')+'</nav>'+
      '<div class="film-mobile-scenes"><label for="film-scene-select">Scene</label><select id="film-scene-select" aria-label="Choose animation scene" data-film-select>'+scenes.map((scene,n)=>'<option value="'+n+'">'+escape(scene.label)+'</option>').join('')+'</select></div>'+
      '<div class="film-foot"><p>AI narration and dramatized sound effects. You can turn either off. Read the documents below for the full update. <a href="audio-credits.html" target="_blank" rel="noopener">Sound credits</a>.</p><details class="film-transcript"><summary>Read the animation text</summary><ol>'+scenes.map(scene=>'<li><strong>'+escape(scene.title)+'</strong><p>'+escape(scene.narration || scene.caption)+'</p>'+(scene.narration?'':'<ul class="film-transcript-details">'+visualDetails(scene).map(detail=>'<li>'+escape(detail)+'</li>').join('')+'</ul>')+'</li>').join('')+'</ol></details></div>'+
      (film.narrationSrc?'<audio data-film-audio preload="metadata" src="'+escape(film.narrationSrc)+'" aria-label="Recorded narration" hidden></audio>':'')+
      '<p class="screen-reader-only" role="status" data-film-status>Animation ready. Press Play to start. Narration and sound effects can be turned off separately.</p></section>';
  }
  function mount(container) {
    const root = container.querySelector('[data-case-film]');
    if (!root) return null;
    const film = filmFor(root.dataset.filmStage);
    if (!film) return null;
    const {scenes, length} = film;
    const panels = [...root.querySelectorAll('[data-film-scene]')];
    const chapters = [...root.querySelectorAll('[data-film-chapter]')];
    const playButton = root.querySelector('[data-film-play]');
    const seekInput = root.querySelector('[data-film-seek]');
    const selectInput = root.querySelector('[data-film-select]');
    const soundButton = root.querySelector('[data-film-sound]');
    const narratorButton = root.querySelector('[data-film-narration]');
    const audio = root.querySelector('[data-film-audio]');
    const effectsData = window.CrisisEffects;
    const sound = effectsData && window.CrisisSound?.create({clips:effectsData.clips, events:effectsData.tracks[root.dataset.filmStage] || [], scenes});
    const replayButton = root.querySelector('[data-film-replay]');
    const clock = root.querySelector('[data-film-time]');
    const status = root.querySelector('[data-film-status]');
    const notice = root.querySelector('[data-film-notice]');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const expandButton = root.querySelector('[data-film-expand]');
    const home = document.createComment('Illustrated overview position');
    const expandedDialog = document.createElement('dialog');
    expandedDialog.className = 'film-expanded-dialog';
    expandedDialog.setAttribute('aria-label', film.label + ' animated overview');
    root.after(home);
    document.body.append(expandedDialog);

    let position=0, sceneIndex=-1, playing=false, starting=false, request=0, lastFrame=0;
    let effects=[], destroyed=false, playTicket=0, soundTicket=0, loadTimer=0, buffering=false;
    let effectsOn=Boolean(sound?.supported), narratorOn=Boolean(audio), pendingAudioSeek=null;
    let effectsLoading=Boolean(sound?.supported&&!sound?.ready), preparationTicket=0;

    function showNotice(message='') {
      notice.hidden=!message;
      notice.textContent=message;
    }
    function seekAudio(value) {
      if (!audio) return;
      pendingAudioSeek=value;
      try {
        audio.currentTime=value;
        if(audio.readyState>0) pendingAudioSeek=null;
      } catch (_) {}
    }
    function restoreView() {
      if (root.parentElement === expandedDialog) home.before(root);
      root.classList.remove('is-expanded');
      expandButton.setAttribute('aria-label', 'Expand animation');
      expandButton.innerHTML = symbol('expand') + '<span>Expand</span>';
      if (!destroyed) {
        collectEffects(); paint();
        expandButton.focus({preventScroll:true});
        status.textContent='Animation returned to the page.';
      }
    }
    function expandView() {
      if(expandedDialog.open) { expandedDialog.close(); return; }
      expandedDialog.append(root);
      root.classList.add('is-expanded');
      expandButton.setAttribute('aria-label','Close expanded animation');
      expandButton.innerHTML=symbol('close')+'<span>Close</span>';
      expandedDialog.showModal();
      collectEffects(); paint();
      expandButton.focus({preventScroll:true});
      status.textContent='Animation expanded. Use Close or press Escape to return to the page.';
    }
    function collectEffects() {
      effects=motion.matches || !panels[sceneIndex]?.getAnimations ? [] : panels[sceneIndex].getAnimations({subtree:true});
      effects.forEach(effect=>effect.pause());
    }
    function paint() {
      let nextScene=0;
      scenes.forEach((scene,n)=>{if(position>=scene.start) nextScene=n;});
      if(nextScene!==sceneIndex) {
        sceneIndex=nextScene;
        panels.forEach((panel,n)=>{panel.hidden=n!==sceneIndex;});
        chapters.forEach((chapter,n)=>{
          if(n===sceneIndex) chapter.setAttribute('aria-current','step');
          else chapter.removeAttribute('aria-current');
        });
        root.querySelector('[data-film-number]').textContent=(sceneIndex+1)+' / '+scenes.length;
        root.querySelector('[data-film-heading]').textContent=scenes[sceneIndex].title;
        root.querySelector('[data-film-caption]').textContent=scenes[sceneIndex].caption;
        selectInput.value=String(sceneIndex);
        collectEffects();
      }
      const sceneTime=Math.max(0,position-scenes[sceneIndex].start);
      effects.forEach(effect=>{effect.currentTime=sceneTime*1000;});
      seekInput.value=String(position);
      seekInput.style.setProperty('--film-fill',(position/length*100)+'%');
      const seconds=Math.floor(position);
      clock.textContent=timecode(seconds);
      seekInput.setAttribute('aria-valuetext',seconds+' seconds of '+length+', '+scenes[sceneIndex].label);
      root.classList.toggle('is-ended',position>=length);
      sound?.update(position,sceneIndex,scenes[sceneIndex].cue,sceneTime,narratorOn);
    }
    function buttonState() {
      const loadingEffects=effectsOn&&effectsLoading&&!playing&&!starting;
      const label=loadingEffects?'Loading effects…':starting?'Cancel loading':playing?'Pause':position>=length?'Play again':position>0?'Resume':'Play overview';
      playButton.disabled=loadingEffects;
      replayButton.disabled=effectsOn&&effectsLoading;
      playButton.innerHTML=symbol(playing||starting?'pause':'play')+'<span>'+label+'</span>';
      root.classList.toggle('is-playing',playing);
      root.classList.toggle('is-loading-audio',starting);
      root.querySelector('.film-caption').setAttribute('aria-live',playing&&narratorOn?'off':'polite');
    }
    function audioButtonState() {
      soundButton.disabled=!sound?.supported;
      soundButton.setAttribute('aria-pressed',String(effectsOn));
      soundButton.innerHTML=symbol(effectsOn?'sound':'muted')+'<span>'+(!sound?.supported?'Effects unavailable':effectsOn?'Effects on':'Effects off')+'</span>';
      soundButton.title=effectsOn?'Turn off scene sound effects':'Turn on scene sound effects';
      narratorButton.disabled=!audio;
      narratorButton.setAttribute('aria-pressed',String(narratorOn));
      narratorButton.innerHTML=symbol('narrator')+'<span>'+(!audio?'Narration unavailable':narratorOn?'Narration on':'Narration off')+'</span>';
      narratorButton.title=narratorOn?'Turn off the narrator':'Turn on the narrator';
    }
    async function prepareEffects(retry=false) {
      if(!sound?.supported) return false;
      const ticket=++preparationTicket;
      effectsLoading=true; buttonState();
      const ready=await sound.prepare({retry});
      if(destroyed||ticket!==preparationTicket) return false;
      effectsLoading=false;
      if(ready&&notice.textContent.startsWith('Sound effects')) showNotice();
      if(!ready&&effectsOn) {
        effectsOn=false; sound.mute();
        showNotice('Sound effects could not load. Narration is ready to use. Turn Effects on to retry.');
      }
      buttonState(); audioButtonState();
      return ready;
    }
    function pause(announce=true) {
      const wasActive=playing||starting;
      ++playTicket; ++soundTicket;
      playing=false; starting=false; buffering=false;
      clearTimeout(loadTimer); loadTimer=0;
      cancelAnimationFrame(request); request=0; lastFrame=0;
      sound?.stop();
      if(audio) audio.pause();
      buttonState();
      if(announce && wasActive) status.textContent='Animation paused.';
    }
    function finish() {
      position=length; paint(); pause(false);
      status.textContent='Overview complete. Read the written evidence and write on your memo handout.';
    }
    function tick(now) {
      if(destroyed||!playing) return;
      if(narratorOn&&audio) {
        if(pendingAudioSeek===null && !audio.seeking) position=Math.min(length,audio.currentTime);
      } else if(lastFrame) position=Math.min(length,position+(now-lastFrame)/1000);
      lastFrame=now;
      paint();
      if(position>=length) finish();
      else request=requestAnimationFrame(tick);
    }
    function effectsCanPlay() {
      return !destroyed && effectsOn && playing && (!narratorOn || !audio ||
        (!buffering && !audio.paused && !audio.seeking && audio.readyState>=3));
    }
    async function startEffects() {
      const ticket=++soundTicket;
      if(!sound?.supported||!effectsCanPlay()) return;
      const ready=await sound.enable();
      if(ticket!==soundTicket||!effectsCanPlay()) return;
      const started=ready && await sound.start(sceneIndex,position);
      if(ticket!==soundTicket||!effectsCanPlay()) {
        if(ticket===soundTicket) sound.stop();
        return;
      }
      if(!started) {
        effectsOn=false; sound.mute(); audioButtonState();
        showNotice('Sound effects could not start. You can turn Effects on to try again.');
      } else {
        if(notice.textContent.startsWith('Sound effects')) showNotice();
        paint();
      }
    }
    function play() {
      if(destroyed||playing||starting||(effectsOn&&effectsLoading)) return;
      if(position>=length) position=0;
      const ticket=++playTicket;
      showNotice();
      paint();
      // Request both audio systems from the same user gesture.
      if(effectsOn&&sound?.supported) void sound.enable();
      if(narratorOn&&audio) {
        starting=true;
        if(audio.error) audio.load();
        seekAudio(position);
        buttonState();
        status.textContent='Loading narration.';
        const attempt=audio.play();
        loadTimer=setTimeout(()=>{
          if(destroyed||ticket!==playTicket||!starting) return;
          pause(false);
          showNotice('Narration is taking longer to load. Try Play again, or turn narration off to watch without it.');
        },15000);
        Promise.resolve(attempt).then(()=>{
          if(destroyed||ticket!==playTicket) return;
          clearTimeout(loadTimer); loadTimer=0;
          starting=false; playing=true; lastFrame=0;
          showNotice(); buttonState();
          status.textContent='Animation playing.';
          request=requestAnimationFrame(tick);
          if(effectsOn) void startEffects();
        }).catch(()=>{
          if(destroyed||ticket!==playTicket) return;
          pause(false);
          showNotice('Narration could not start. Try Play again, or turn narration off to watch without it.');
        });
      } else {
        playing=true; lastFrame=0; buttonState();
        status.textContent='Animation playing.';
        request=requestAnimationFrame(tick);
        if(effectsOn) void startEffects();
      }
    }
    function seek(value) {
      pause(false); showNotice();
      position=Math.max(0,Math.min(length,Number(value)||0));
      seekAudio(position); paint(); buttonState();
      status.textContent=scenes[sceneIndex].label+'. Animation paused.';
    }
    function toggleEffects() {
      if(!sound?.supported) return;
      effectsOn=!effectsOn; ++soundTicket;
      if(!effectsOn) sound.mute();
      else if(!sound.ready) {
        // Unlock from this click; preparation itself never starts playback.
        void sound.enable();
        void prepareEffects(true).then(ready=>{
          if(ready&&!destroyed&&effectsOn&&playing) void startEffects();
        });
      } else if(playing) void startEffects();
      audioButtonState(); buttonState();
      status.textContent=effectsOn?'Scene sound effects on.':'Scene sound effects off.';
    }
    function toggleNarrator() {
      if(!audio) return;
      const continuePlaying=playing||starting;
      pause(false); showNotice();
      narratorOn=!narratorOn;
      audioButtonState();
      if(continuePlaying) play();
      else status.textContent=narratorOn?'Narration on. Press Play to listen.':'Narration off.';
    }
    function click(event) {
      const button=event.target.closest('button');
      if(!button||!root.contains(button)) return;
      if(button.hasAttribute('data-film-play')) {
        if(playing||starting) pause(); else play();
      } else if(button.hasAttribute('data-film-replay')) {
        pause(false); position=0; seekAudio(0); play();
      } else if(button.hasAttribute('data-film-chapter')) {
        seek(scenes[Number(button.dataset.filmChapter)].start);
      } else if(button.hasAttribute('data-film-sound')) toggleEffects();
      else if(button.hasAttribute('data-film-narration')) toggleNarrator();
      else if(button.hasAttribute('data-film-expand')) expandView();
    }
    const input=()=>seek(seekInput.value);
    const select=()=>seek(scenes[Number(selectInput.value)].start);
    const hidden=()=>{if(document.hidden) pause(false);};
    const read=event=>{
      if(event.target.closest('[data-read-update], [data-artifact], [data-reference]')) pause(false);
    };
    const changedMotion=()=>{pause(false); collectEffects(); paint();};
    const metadata=()=>{
      if(pendingAudioSeek!==null) seekAudio(pendingAudioSeek);
    };
    const audioEnded=()=>{if(audio.ended&&narratorOn&&(playing||starting)) finish();};
    const audioPaused=()=>{if(audio.paused&&narratorOn&&playing&&!audio.ended) pause(false);};
    const audioWaiting=()=>{
      if(narratorOn&&playing&&!audio.paused&&audio.readyState<3) {
        buffering=true; ++soundTicket; sound?.stop();
        showNotice('Loading the next part of the narration…');
        clearTimeout(loadTimer);
        const ticket=playTicket;
        loadTimer=setTimeout(()=>{
          if(destroyed||ticket!==playTicket||!playing||!buffering) return;
          pause(false);
          showNotice('Narration stopped loading. Try Play again, or turn narration off to continue without it.');
        },15000);
      }
    };
    const audioPlaying=()=>{
      if(narratorOn&&playing&&!audio.paused&&!audio.seeking&&audio.readyState>=3) {
        buffering=false; clearTimeout(loadTimer); loadTimer=0;
        showNotice();
        if(effectsOn&&!sound?.active) void startEffects();
      }
    };
    const audioError=()=>{
      if(narratorOn&&(playing||starting)) {
        pause(false);
        showNotice('Narration could not load. Try Play again, or turn narration off to watch without it.');
      }
    };
    root.addEventListener('click',click);
    seekInput.addEventListener('input',input);
    selectInput.addEventListener('change',select);
    document.addEventListener('click',read);
    document.addEventListener('visibilitychange',hidden);
    expandedDialog.addEventListener('close',restoreView);
    motion.addEventListener('change',changedMotion);
    if(audio) {
      audio.volume=.95;
      audio.addEventListener('loadedmetadata',metadata);
      audio.addEventListener('ended',audioEnded);
      audio.addEventListener('pause',audioPaused);
      audio.addEventListener('waiting',audioWaiting);
      audio.addEventListener('playing',audioPlaying);
      audio.addEventListener('error',audioError);
    }
    paint(); buttonState(); audioButtonState();
    if(effectsLoading) void prepareEffects();
    return {pause,destroy() {
      pause(false); destroyed=true; ++preparationTicket; sound?.destroy();
      root.removeEventListener('click',click);
      seekInput.removeEventListener('input',input);
      selectInput.removeEventListener('change',select);
      document.removeEventListener('click',read);
      document.removeEventListener('visibilitychange',hidden);
      expandedDialog.removeEventListener('close',restoreView);
      if(expandedDialog.open) expandedDialog.close();
      restoreView(); expandedDialog.remove(); home.remove();
      motion.removeEventListener('change',changedMotion);
      if(audio) {
        audio.removeEventListener('loadedmetadata',metadata);
        audio.removeEventListener('ended',audioEnded);
        audio.removeEventListener('pause',audioPaused);
        audio.removeEventListener('waiting',audioWaiting);
        audio.removeEventListener('playing',audioPlaying);
        audio.removeEventListener('error',audioError);
        audio.removeAttribute('src'); audio.load();
      }
      effects.forEach(effect=>effect.cancel());
    }};
  }
  window.CrisisAnimation = {markup, mount};
})();
