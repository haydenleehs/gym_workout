// ---------------------------------------------------------------------------
// Line-drawing illustrations of each piece of equipment (inline SVG, so they
// work offline and follow the light/dark theme). Keys match EQUIPMENT in
// data.js, plus "body" for bodyweight moves.
//   .a   = accent colour (the part you hold / push)
//   .pad = thick stroke for cushions and platforms
// ---------------------------------------------------------------------------

const FLOOR = '<path class="fl" d="M6 84H114"/>';
const STACK = (x, y, w, h) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2"/>` +
  [0.55, 0.65, 0.75, 0.85].map((f) => `<path class="thin" d="M${x + 4} ${y + h * f}h${w - 8}"/>`).join("");

const ART = {
  chestpress: FLOOR + STACK(86, 10, 22, 74) +
    '<path class="pad" d="M30 24v32"/><path class="pad" d="M30 58h26"/><path d="M43 62v22M28 84h32"/>' +
    '<path d="M86 22H62"/><path class="a" d="M62 22v22"/><circle class="a" cx="62" cy="44" r="3"/>',

  shoulderpress: FLOOR + STACK(86, 10, 22, 74) +
    '<path class="pad" d="M32 26v32"/><path class="pad" d="M32 60h24"/><path d="M44 64v20M30 84h30"/>' +
    '<path d="M86 34H56"/><path class="a" d="M56 34V12"/><circle class="a" cx="56" cy="12" r="3"/>',

  legpress: FLOOR +
    '<path d="M30 84L100 14M100 14v70M14 84h96"/>' +
    '<path class="pad" d="M18 78l14-24"/><path class="pad" d="M20 78h22"/>' +
    '<path class="a pad" d="M70 22l18 18"/><circle cx="92" cy="30" r="7"/>',

  hacksquat: FLOOR +
    '<path d="M30 8l28 76M86 84V20M16 84h90"/>' +
    '<path class="pad" d="M40 26l18 46"/><path class="a" d="M34 22h16"/>' +
    '<path class="a pad" d="M58 78l24-6"/>',

  latpull: FLOOR + STACK(84, 20, 22, 64) +
    '<path d="M84 8H40M84 8v12"/><circle cx="40" cy="11" r="3"/><path class="thin" d="M40 14v22"/>' +
    '<path class="a" d="M20 40l4-4h32l4 4"/>' +
    '<path class="pad" d="M30 58h22"/><path class="pad" d="M30 72h22"/><path d="M41 76v8"/>',

  row: FLOOR + STACK(90, 14, 20, 70) +
    '<path class="pad" d="M22 66h26"/><path d="M35 70v14"/>' +
    '<path class="pad" d="M60 40v24"/><path d="M60 64l8 16"/>' +
    '<path class="a" d="M70 46v10"/><path class="thin" d="M70 51h20"/>',

  pecdeck: FLOOR +
    '<path d="M36 12h48M60 12v10"/>' +
    '<rect x="50" y="22" width="20" height="38" rx="4"/><path class="pad" d="M46 64h28"/><path d="M60 68v16M44 84h32"/>' +
    '<path class="a" d="M50 28Q34 22 24 34v24M70 28Q86 22 96 34v24"/>',

  legext: FLOOR +
    '<path class="pad" d="M28 24v34"/><path class="pad" d="M30 60h32"/><path d="M44 64v20M26 84h40"/>' +
    '<circle cx="64" cy="62" r="3"/><path class="a" d="M64 62l20-12"/><circle class="a" cx="88" cy="48" r="5"/>',

  legcurl: FLOOR +
    '<path class="pad" d="M14 46h66"/><path d="M24 50v34M70 50v34M14 84h70"/>' +
    '<circle cx="80" cy="46" r="3"/><path class="a" d="M80 46l16-14"/><circle class="a" cx="99" cy="29" r="5"/>',

  hipthrust: FLOOR +
    '<path class="pad" d="M14 44h22"/><path d="M18 48v36M32 48v36"/>' +
    '<path class="pad" d="M40 80h50"/>' +
    '<circle cx="96" cy="60" r="3"/><path d="M96 60v24"/><path d="M96 60L78 42"/><path class="a pad" d="M52 40h28"/>',

  abductor: FLOOR +
    '<rect x="50" y="18" width="20" height="38" rx="4"/><path class="pad" d="M40 60h40"/><path d="M60 64v20M42 84h36"/>' +
    '<path class="a pad" d="M44 58L28 40M76 58l16-18"/><path d="M36 74h14M70 74h14"/>',

  calfm: FLOOR +
    '<path d="M92 6v78M80 84h24M92 24H82"/>' +
    '<path class="a pad" d="M56 24h26"/>' +
    '<rect x="50" y="72" width="34" height="12" rx="2"/>',

  assisted: FLOOR +
    '<path d="M28 6v78M92 6v78M24 8h72"/>' +
    '<path class="a" d="M28 16h16M92 16H76"/><path d="M34 46h12M74 46h12"/>' +
    '<path class="a pad" d="M48 58h24"/><path d="M60 62v12M44 74h32"/>',

  plateloaded: FLOOR +
    '<path d="M18 84l12-34 12 34"/><circle cx="30" cy="50" r="3"/>' +
    '<path d="M30 50l66-20"/><circle cx="86" cy="33" r="12"/><circle cx="86" cy="33" r="3"/>' +
    '<path class="a" d="M100 28v14"/>',

  smith: FLOOR +
    '<path d="M28 6v78M92 6v78M22 6h76M20 84h20M80 84h20"/>' +
    '<path class="a" d="M14 40h92"/><rect x="8" y="30" width="6" height="20" rx="2"/><rect x="106" y="30" width="6" height="20" rx="2"/>',

  bb: FLOOR +
    '<path d="M34 10v74M86 10v74M26 84h16M78 84h16M34 32h6M86 32h-6M28 58h14M78 58h14"/>' +
    '<path class="a" d="M10 30h100"/><rect x="12" y="18" width="7" height="24" rx="2"/><rect x="101" y="18" width="7" height="24" rx="2"/>',

  db: FLOOR +
    '<path class="a" d="M30 36h30"/><rect x="20" y="26" width="10" height="20" rx="2"/><rect x="60" y="26" width="10" height="20" rx="2"/>' +
    '<path class="a" d="M56 66h30"/><rect x="46" y="56" width="10" height="20" rx="2"/><rect x="86" y="56" width="10" height="20" rx="2"/>',

  bench: FLOOR +
    '<path class="pad" d="M26 62h32"/><path class="a pad" d="M60 60l26-30"/>' +
    '<path d="M70 52v32M30 66v18M20 84h76"/>',

  cable: FLOOR +
    STACK(52, 6, 26, 78) +
    '<path d="M44 6v78"/><circle class="a" cx="40" cy="30" r="4"/>' +
    '<path class="thin" d="M37 33L20 50"/><path class="a" d="M20 50l-5 10M20 50l5 10"/>',

  pullupbar: FLOOR +
    '<path d="M24 20v64M96 20v64M16 84h16M88 84h16"/><path class="a" d="M16 20h88"/>',

  dipstation: FLOOR +
    '<path d="M24 40v44M70 34v50M46 50v34M94 44v40"/>' +
    '<path class="a" d="M18 40l58-6M40 50l60-6"/>',

  backext: FLOOR +
    '<path d="M18 84l52-44M70 40v44M10 84h70"/>' +
    '<path class="a pad" d="M60 32l18 14"/>' +
    '<path class="pad" d="M22 74l10-8"/><circle cx="36" cy="64" r="4"/>',

  kb: FLOOR +
    '<circle cx="60" cy="58" r="22"/><path class="a" d="M44 42Q44 18 60 18T76 42"/>',

  sled: FLOOR +
    '<path class="pad" d="M16 78h70"/><path d="M86 78q10 0 10-10"/>' +
    '<path class="a" d="M40 78L50 22M64 78l10-56"/><rect x="46" y="60" width="16" height="16" rx="2"/>',

  treadmill: FLOOR +
    '<path class="pad" d="M12 76h80"/><circle cx="16" cy="78" r="4"/>' +
    '<path d="M90 76l8-52M98 34L76 42"/><path class="a pad" d="M92 22h18"/>',

  bike: FLOOR +
    '<circle cx="80" cy="64" r="12"/><circle cx="54" cy="66" r="5"/>' +
    '<path d="M42 36l12 30M54 66l26-2M84 24l-6 34M28 84h82M54 66l-4 18"/>' +
    '<path class="a pad" d="M32 34h20"/><path class="a" d="M80 24h16"/>',

  rower: FLOOR +
    '<path d="M8 74h86M14 74v10M86 74v10"/><circle cx="96" cy="56" r="14"/>' +
    '<path class="pad" d="M34 68h16"/><path class="pad" d="M74 74l6-14"/>' +
    '<path class="thin" d="M70 46l16 6"/><path class="a" d="M70 40v12"/>',

  stairs: FLOOR +
    '<path class="a" d="M24 84V70h14V56h14V42h14V28"/>' +
    '<path d="M66 28l26-8v64M88 30L64 38"/><path class="pad" d="M88 20h14"/>',

  elliptical: FLOOR +
    '<circle cx="24" cy="64" r="12"/><path d="M10 84h94M24 64l46 10M86 84L78 20"/>' +
    '<path class="a pad" d="M62 74h16"/><path class="a" d="M78 20l-8-6"/><path class="pad" d="M88 28h12"/>',

  outdoor: FLOOR +
    '<path d="M28 84V54"/><circle cx="28" cy="40" r="16"/>' +
    '<path class="thin" d="M58 84q20-24 52-28M80 84q10-16 34-20"/><circle class="a" cx="96" cy="20" r="7"/>',

  body: FLOOR +
    '<circle cx="60" cy="16" r="7"/><path d="M60 23v31M60 54l-12 30M60 54l12 30"/>' +
    '<path class="a" d="M60 32L44 48M60 32l16 16"/>',
};

function equipmentArt(key, cls = "art") {
  const body = ART[key] || ART.body;
  return `<svg class="${cls}" viewBox="0 0 120 90" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}

// Real photo when we have one (PHOTOS from photos.js), drawing otherwise.
// If the photo fails to load, the .no-photo class swaps the drawing back in.
function equipmentMedia(key, size = "lg") {
  const art = equipmentArt(key, size === "lg" ? "art" : size === "md" ? "art-alt" : "art-sm");
  const photo = typeof PHOTOS !== "undefined" && PHOTOS[key];
  if (!photo) return `<span class="media media-${size} no-photo">${art}</span>`;
  return `<span class="media media-${size}">
    <img src="${photo.src}" alt="${photo.title.replace(/"/g, "&quot;")}" loading="lazy" referrerpolicy="no-referrer"
      onerror="this.parentNode.classList.add('no-photo')" />${art}</span>`;
}
