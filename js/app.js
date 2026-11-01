// ---------------------------------------------------------------------------
// SG Gym Planner — UI + recommendation logic (no build step, plain JS).
// Depends on EQUIPMENT, GYMS, TARGETS, EXERCISES from data.js.
// ---------------------------------------------------------------------------

const STORAGE_KEY = "sg-gym-planner";
const SLOTS_BY_DURATION = { 30: 4, 45: 5, 60: 6, 75: 7, 90: 8 };
const ACTIVITY_FACTOR = { sedentary: 1.2, light: 1.375, moderate: 1.55, very: 1.725 };
const LEVEL = { beginner: 1, intermediate: 2, advanced: 3 };
const GOAL_LABEL = { general: "General fitness", fatloss: "Fat loss", muscle: "Build muscle", strength: "Strength" };
const JOINT_LABEL = { knee: "knees", back: "lower back", shoulder: "shoulders" };

const state = {
  gymId: null,
  equipment: new Set(),
  targetId: null,
  seed: 0,
  plan: null,
  disliked: new Set(), // exercise ids the user never wants suggested
  openAlt: -1,         // index of the card whose alternatives panel is open
};

const $ = (id) => document.getElementById(id);

// ---------- Helpers ----------
function hasEquip(ex, avail) {
  // every requirement must be met; "a|b" means either is fine
  return ex.equip.every((req) => req.split("|").some((e) => avail.has(e)));
}

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// equipment key to illustrate an exercise: first required item the gym has
function artKey(ex) {
  for (const req of ex.equip) {
    const key = req.split("|").find((e) => state.equipment.has(e));
    if (key) return key;
  }
  return "body";
}

function demoUrl(ex) {
  return "https://www.youtube.com/results?search_query=" + encodeURIComponent(`how to do ${ex.name} proper form`);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function save() {
  try {
    const p = readProfile();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      gymId: state.gymId,
      equipment: [...state.equipment],
      targetId: state.targetId,
      disliked: [...state.disliked],
      profile: p,
    }));
  } catch (_) { /* storage unavailable — fine */ }
}

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  } catch (_) {
    return null;
  }
}

// ---------- Rendering: step 1 & 2 ----------
function renderGyms() {
  $("gymGrid").innerHTML = GYMS.map((g) => `
    <button type="button" class="gym-card${g.id === state.gymId ? " selected" : ""}" data-gym="${g.id}" aria-pressed="${g.id === state.gymId}">
      <span class="gym-logo" style="background:${g.color}">${g.short}</span>
      <span>
        <strong>${g.name}</strong>
        <span class="meta">${g.vibe}</span><br />
        <span class="badge${g.access.startsWith("24/7") || g.access.startsWith("Anytime") ? " open" : ""}">${g.access}</span>
      </span>
    </button>`).join("");
}

function renderEquipment() {
  const gym = GYMS.find((g) => g.id === state.gymId);
  const panel = $("equipPanel");
  if (!gym) { panel.hidden = true; return; }
  panel.hidden = false;
  $("gymTip").textContent = "💡 " + gym.tip;
  $("gymFound").innerHTML = `<h4>What we found about ${escapeHtml(gym.name)}</h4>
    <ul>${gym.found.map((f) => `<li>${escapeHtml(f)}</li>`).join("")}</ul>
    ${gym.source ? `<a href="${gym.source}" target="_blank" rel="noopener">Source ↗</a>` : ""}`;
  $("equipGrid").innerHTML = Object.entries(EQUIPMENT).map(([key, label]) => `
    <label class="check equip-item">
      <input type="checkbox" value="${key}" ${state.equipment.has(key) ? "checked" : ""} />
      ${equipmentMedia(key, "sm")}
      <span>${label}</span>
    </label>`).join("");
  updateEquipCount();
}

function updateEquipCount() {
  $("equipCount").textContent = `${state.equipment.size} of ${Object.keys(EQUIPMENT).length} available`;
}

function renderTargets() {
  $("targetGrid").innerHTML = TARGETS.map((t) => `
    <button type="button" class="chip${t.id === state.targetId ? " selected" : ""}" data-target="${t.id}" aria-pressed="${t.id === state.targetId}">
      <span class="icon">${t.icon}</span>${t.name}
    </button>`).join("");
}

function selectGym(id, equipment) {
  const gym = GYMS.find((g) => g.id === id);
  if (!gym) return;
  state.gymId = id;
  state.equipment = new Set(equipment || gym.equipment);
  document.documentElement.style.setProperty("--accent", gym.color === "#111111" ? "#e8452c" : gym.color);
  renderGyms();
  renderEquipment();
}

// ---------- Profile ----------
function readProfile() {
  return {
    height: parseFloat($("height").value),
    weight: parseFloat($("weight").value),
    age: parseInt($("age").value, 10),
    sex: $("sex").value,
    activity: $("activity").value,
    experience: $("experience").value,
    goal: $("goal").value,
    duration: parseInt($("duration").value, 10),
    joints: [...document.querySelectorAll('input[name="joint"]:checked')].map((i) => i.value),
    prefs: [...document.querySelectorAll('input[name="pref"]:checked')].map((i) => i.value),
  };
}

// equipment-style preferences, shown with a photo of each
function renderPrefs() {
  $("prefGrid").innerHTML = Object.entries(PREFS).map(([id, pr]) => `
    <label class="pref">
      <input type="checkbox" name="pref" value="${id}" />
      ${equipmentMedia(pr.photo, "sm")}
      <span>${pr.label}</span>
    </label>`).join("");
}

function matchesPref(ex, prefs) {
  return prefs.some((id) => PREFS[id] && PREFS[id].match(ex));
}

function writeProfile(p) {
  if (!p) return;
  ["height", "weight", "age", "sex", "activity", "experience", "goal", "duration"].forEach((k) => {
    if (p[k] !== undefined && p[k] !== null && !Number.isNaN(p[k])) $(k).value = p[k];
  });
  document.querySelectorAll('input[name="joint"]').forEach((i) => { i.checked = (p.joints || []).includes(i.value); });
  document.querySelectorAll('input[name="pref"]').forEach((i) => { i.checked = (p.prefs || []).includes(i.value); });
}

function validate(p) {
  if (!state.gymId) return "Pick a gym first (step 1).";
  if (!state.targetId) return "Pick what you want to train (step 2).";
  if (!(p.height >= 120 && p.height <= 230)) return "Enter a height between 120 and 230 cm.";
  if (!(p.weight >= 30 && p.weight <= 250)) return "Enter a weight between 30 and 250 kg.";
  if (!(p.age >= 13 && p.age <= 90)) return "Enter an age between 13 and 90.";
  return "";
}

// Body stats. BMI categories use HPB's Asian cut-offs (Singapore).
function analyse(p) {
  const bmi = p.weight / (p.height / 100) ** 2;
  let bmiCat, bmiTone;
  if (bmi < 18.5) { bmiCat = "Underweight"; bmiTone = "warn"; }
  else if (bmi < 23) { bmiCat = "Healthy range"; bmiTone = "good"; }
  else if (bmi < 27.5) { bmiCat = "Moderate risk"; bmiTone = "warn"; }
  else { bmiCat = "High risk"; bmiTone = "bad"; }

  const sexAdj = p.sex === "male" ? 5 : p.sex === "female" ? -161 : -78;
  const bmr = 10 * p.weight + 6.25 * p.height - 5 * p.age + sexAdj; // Mifflin-St Jeor
  const tdee = bmr * ACTIVITY_FACTOR[p.activity];
  const calAdj = { fatloss: -400, muscle: 250, strength: 150, general: 0 }[p.goal];
  const proteinPerKg = p.goal === "general" ? 1.2 : 1.6;
  // for higher BMI, base protein on a healthy-BMI reference weight (BMI 23)
  const refWeight = bmi > 27.5 ? 23 * (p.height / 100) ** 2 : p.weight;

  const lvl = LEVEL[p.experience];
  return {
    bmi, bmiCat, bmiTone, tdee,
    calories: Math.round((tdee + calAdj) / 10) * 10,
    protein: Math.round(refWeight * proteinPerKg),
    lvl,
    lowImpact: bmi >= 27.5 || p.activity === "sedentary" || p.age >= 55,
    older: p.age >= 50,
    deconditioned: p.activity === "sedentary" || (p.activity === "light" && lvl === 1),
  };
}

// ---------- Recommendation engine ----------
function scoreExercise(ex, slot, idx, p, info, usedPatterns, rnd) {
  let s = 10;
  s += ex.muscles[0] === slot ? 6 : 1;

  if (ex.kind === "machine") s += (info.lvl === 1 ? 4 : 0) + (info.lowImpact ? 3 : 0) - (info.lvl === 3 ? 1 : 0);
  if (ex.kind === "cable") s += info.lvl === 1 ? 2 : 1;
  if (ex.kind === "free") {
    if (info.lvl === 3) s += 3;
    if (info.lvl === 1) s -= 1;
    if (p.goal === "strength" && ex.compound) s += 4;
  }
  if (ex.kind === "bodyweight" && !state.equipment.has("outdoor")) s -= 1;
  if (ex.compound && idx < 3) s += 3;

  // preferred equipment wins over our defaults, and we're a bit more lenient
  // on technique level — but joint and impact limits below still apply
  const preferred = p.prefs.length && matchesPref(ex, p.prefs);
  if (p.prefs.length) s += preferred ? 10 : -2;

  if (ex.level > info.lvl) s -= (ex.level - info.lvl) * (info.lvl === 1 ? 12 : 5) / (preferred ? 2 : 1);
  if (info.older && ex.level === 3) s -= 6;
  if (info.lowImpact && ex.impact) s -= 15;
  if (ex.bwLoad && (info.lowImpact || info.bmi >= 25)) s -= 8;
  (ex.stress || []).forEach((j) => { if (p.joints.includes(j)) s -= 30; });
  if (usedPatterns.has(ex.pattern)) s -= 8;

  return s + rnd() * 3;
}

function prescribe(ex, idx, p, info) {
  let sets, reps, rest;
  const bigLift = ex.compound && idx < 3;

  if (p.goal === "strength") {
    if (bigLift) { sets = 4; reps = info.lvl === 1 ? "6–8" : "4–6"; rest = "2–3 min"; }
    else { sets = 3; reps = "8–10"; rest = "90 s"; }
  } else if (p.goal === "muscle") {
    sets = info.lvl >= 2 && idx < 2 ? 4 : 3;
    reps = ex.compound ? "8–10" : "10–15";
    rest = ex.compound ? "90 s" : "60 s";
  } else if (p.goal === "fatloss") {
    sets = 3; reps = "12–15"; rest = "30–45 s";
  } else {
    sets = 3; reps = "10–12"; rest = "60 s";
  }

  if (info.lvl === 1) sets = Math.min(sets, 3);
  if (info.deconditioned) sets = Math.max(2, sets - 1);

  if (ex.id === "carry") reps = "30–40 m walk";
  else if (ex.timed) reps = info.lvl === 1 ? "20–30 s hold" : "30–45 s hold";
  else if (ex.muscles[0] === "core") reps = "10–15";
  if (["bss", "lunge", "stepup", "onearmrow", "sideplank", "slbridge", "woodchop", "pallof"].includes(ex.id)) reps += " / side";

  const effort = info.lvl === 1
    ? "Pick a weight you could lift ~3 more times. Form first."
    : info.lvl === 2 ? "Stop ~2 reps short of failure." : "Last set: 0–1 reps in reserve.";

  return { sets, reps, rest, effort };
}

function cardioCandidates(p, info, rnd) {
  return EXERCISES
    .filter((ex) => ex.kind === "cardio" && hasEquip(ex, state.equipment) && !state.disliked.has(ex.id))
    .map((ex) => {
      let s = 10;
      if (ex.level > info.lvl) s -= 6;
      if (info.lowImpact && ex.impact) s -= 20;
      if (info.lowImpact && ["bike", "elliptical", "inclinewalk"].includes(ex.id)) s += 4;
      if (info.lvl === 3 && ["sled", "run", "rower"].includes(ex.id)) s += 3;
      (ex.stress || []).forEach((j) => { if (p.joints.includes(j)) s -= 25; });
      return { ex, s: s + rnd() * 3 };
    })
    .sort((a, b) => b.s - a.s)
    .map((c) => c.ex);
}

function buildStrengthPlan(p, info, target, rnd) {
  const n = SLOTS_BY_DURATION[p.duration] || 6;
  const slots = Array.from({ length: n }, (_, i) => target.slots[i % target.slots.length]);
  const used = new Set();
  const usedPatterns = new Set();
  const items = [];

  slots.forEach((slot, idx) => {
    const ranked = EXERCISES
      .filter((ex) => ex.kind !== "cardio" && ex.muscles.includes(slot) && hasEquip(ex, state.equipment)
        && !used.has(ex.id) && !state.disliked.has(ex.id))
      .map((ex) => ({ ex, s: scoreExercise(ex, slot, idx, p, info, usedPatterns, rnd) }))
      .sort((a, b) => b.s - a.s);
    if (!ranked.length) return;
    const pick = ranked[0].ex;
    used.add(pick.id);
    usedPatterns.add(pick.pattern);
    items.push({ slot, ex: pick });
  });

  // big compound lifts first, isolation later
  items.sort((a, b) => (b.ex.compound ? 1 : 0) - (a.ex.compound ? 1 : 0));
  items.forEach((it, i) => { it.rx = prescribe(it.ex, i, p, info); });
  return items;
}

function buildCardioPlan(p, info, rnd) {
  const picks = cardioCandidates(p, info, rnd);
  const main = Math.max(15, p.duration - 10);
  const count = Math.min(picks.length, p.duration >= 60 ? 3 : 2);
  const each = Math.round(main / Math.max(count, 1));

  return picks.slice(0, count).map((ex, i) => {
    let reps, rest;
    const intervals = !info.lowImpact && info.lvl >= 2 && i === 0;
    if (intervals) {
      const rounds = Math.max(6, Math.round(each / 2));
      reps = info.lvl === 3 ? `${rounds} × 40 s hard / 80 s easy` : `${rounds} × 30 s hard / 90 s easy`;
      rest = "Intervals";
    } else {
      reps = `${each} min steady`;
      rest = "Zone 2 — can still talk";
    }
    return { slot: "cardio", ex, rx: { sets: "", reps, rest, effort: intervals ? "Hard = 8/10 effort." : "Easy-moderate, 5–6/10 effort." } };
  });
}

function buildNotes(p, info, gym) {
  const notes = [];
  if (info.bmi >= 27.5) notes.push(`BMI ${info.bmi.toFixed(1)} is in HPB's high-risk range, so we prioritised supported machines and joint-friendly moves — no jumping.`);
  else if (info.bmi >= 23) notes.push(`BMI ${info.bmi.toFixed(1)} (moderate risk, Asian cut-off) — a mix of strength and cardio will help most.`);
  else if (info.bmi < 18.5) notes.push(`BMI ${info.bmi.toFixed(1)} is underweight — focus on big compound lifts and eat in a small surplus to build muscle.`);

  if (p.prefs.length) {
    const usable = (id) => EXERCISES.some((ex) => ex.kind !== "cardio" && PREFS[id].match(ex) && hasEquip(ex, state.equipment));
    const have = p.prefs.filter(usable).map((id) => PREFS[id].label.toLowerCase());
    const missing = p.prefs.filter((id) => !usable(id)).map((id) => PREFS[id].label.toLowerCase());
    if (have.length) notes.push(`You prefer ${have.join(" & ")}, so those come first wherever they suit the muscle and your joints.`);
    if (missing.length) notes.push(`${gym.name} doesn't have ${missing.join(" or ")} (based on the equipment ticked in step 1), so we used what's there.`);
    if (info.lvl === 1 && p.prefs.some((id) => id === "bb")) notes.push("Barbell lifts take practice — start light, use the safety pins, and ask staff to check your form.");
  } else if (info.lvl === 1) {
    notes.push("As a beginner you'll mostly use machines and cables — fixed paths let you learn effort and form safely.");
  }
  if (info.lvl === 3) notes.push("Advanced: free-weight compounds come first while you're fresh.");
  if (p.activity === "sedentary") notes.push("Since you're mostly sitting during the day, volume starts lower — add a set per exercise once it feels easy.");
  if (info.older) notes.push("Over 50: we skip the most technical lifts and favour controlled machine work. Warm up a bit longer.");
  p.joints.forEach((j) => notes.push(`Going easy on your ${JOINT_LABEL[j]}: exercises that load them heavily were swapped out where possible. Keep everything pain-free.`));
  if (gym.id === "gympod") notes.push("The Gym Pod has no big machines, so the plan uses the rack, cables and dumbbells.");
  if (gym.id === "outdoor") notes.push("Outdoor fitness corner — bodyweight only. Slow the reps down (3 s lowering) to make them harder.");
  return notes;
}

function generate(reshuffle) {
  const p = readProfile();
  const err = validate(p);
  $("formError").textContent = err;
  if (err) return;

  state.seed = reshuffle ? state.seed + 1 : 0;
  state.openAlt = -1;
  const rnd = state.seed === 0 ? () => 0 : mulberry32(state.seed * 9973);
  const info = analyse(p);
  const gym = GYMS.find((g) => g.id === state.gymId);
  const target = TARGETS.find((t) => t.id === state.targetId);

  const items = target.id === "cardio" ? buildCardioPlan(p, info, rnd) : buildStrengthPlan(p, info, target, rnd);
  const finisherPick = cardioCandidates(p, info, () => 0)[0];

  state.plan = { p, info, gym, target, items, finisherPick, notes: buildNotes(p, info, gym) };
  renderResults();
  save();
  if (!reshuffle) $("results").scrollIntoView({ behavior: "smooth" });
}

// ---------- Rendering: results ----------
function renderResults() {
  const { p, info, gym, target, items, finisherPick, notes } = state.plan;
  $("results").hidden = false;
  $("resultsEyebrow").textContent = `${gym.name} · ${p.duration} min · ${GOAL_LABEL[p.goal]}`;
  $("resultsTitle").textContent = `${target.icon} ${target.name} workout`;

  $("stats").innerHTML = `
    <div class="stat"><div class="label">BMI</div><div class="value">${info.bmi.toFixed(1)}</div><div class="sub ${info.bmiTone}">${info.bmiCat}</div></div>
    <div class="stat"><div class="label">Est. daily calories</div><div class="value">${info.calories.toLocaleString()}</div><div class="sub">for ${GOAL_LABEL[p.goal].toLowerCase()}</div></div>
    <div class="stat"><div class="label">Protein target</div><div class="value">~${info.protein} g</div><div class="sub">per day</div></div>
    <div class="stat"><div class="label">Exercises</div><div class="value">${items.length}</div><div class="sub">${target.id === "cardio" ? "cardio blocks" : "+ warm-up & finisher"}</div></div>`;

  $("why").innerHTML = notes.length
    ? `<h3>Why this plan</h3><ul>${notes.map((n) => `<li>${escapeHtml(n)}</li>`).join("")}</ul>`
    : `<h3>Why this plan</h3><p class="muted">Balanced selection for your experience and goal.</p>`;
  $("why").hidden = false;

  const hidden = EXERCISES.filter((ex) => state.disliked.has(ex.id));
  $("hiddenBar").hidden = !hidden.length;
  $("hiddenBar").innerHTML = hidden.length
    ? `🚫 Not suggesting: ${hidden.map((ex) => escapeHtml(ex.name)).join(", ")}
       <button type="button" class="link-btn" id="resetHidden">Reset</button>`
    : "";

  const first = items[0];
  const warmCardio = finisherPick ? finisherPick.name.toLowerCase() : "brisk walking / marching on the spot";
  $("warmup").innerHTML = `<h3>🔥 Warm-up (${info.older || info.lowImpact ? "8–10" : "5–8"} min)</h3><ul>
    <li>5 min easy ${escapeHtml(warmCardio)}.</li>
    <li>Joint circles: neck, shoulders, hips, knees, ankles — 10 each.</li>
    ${first && target.id !== "cardio" ? `<li>2 light ramp-up sets of <strong>${escapeHtml(first.ex.name)}</strong> (about 50% then 75% of your working weight).</li>` : ""}
  </ul>`;

  if (!items.length) {
    $("exerciseList").innerHTML = `<li class="block"><p>No exercises match the equipment you've ticked. Tick a few more items in step 1.</p></li>`;
  } else {
    $("exerciseList").innerHTML = items.map((it, i) => {
      const ex = it.ex;
      const setsTxt = it.rx.sets ? `${it.rx.sets} × ${it.rx.reps}` : it.rx.reps;
      const key = artKey(ex);
      return `<li class="ex">
        <figure class="ex-art">
          <span class="ex-num">${i + 1}</span>
          <button type="button" class="zoom-btn" data-zoom="${key}" aria-label="Enlarge photo of ${escapeHtml(ex.name)}">
            ${equipmentMedia(key, "lg")}<span class="zoom-hint" aria-hidden="true">🔍</span>
          </button>
          <figcaption>${escapeHtml(key === "body" ? "Bodyweight" : EQUIPMENT[key])}</figcaption>
        </figure>
        <div>
          <h3>${escapeHtml(ex.name)}</h3>
          <div class="tags">
            <span class="tag kind-${ex.kind}">${ex.kind === "free" ? "free weight" : ex.kind}</span>
            ${ex.muscles.filter((m) => m !== "cardio").map((m) => `<span class="tag">${m}</span>`).join("")}
            ${ex.equip.map((e) => e.split("|").filter((k) => state.equipment.has(k))[0]).filter(Boolean).map((k) => `<span class="tag">${escapeHtml(EQUIPMENT[k])}</span>`).join("")}
          </div>
          <p class="cue">${escapeHtml(ex.cue)}</p>
          <p class="effort">🎯 ${escapeHtml(it.rx.effort)}</p>
          <a class="demo" href="${demoUrl(ex)}" target="_blank" rel="noopener">▶ Watch demo</a>
        </div>
        <div class="prescription">
          <div class="sets">${escapeHtml(setsTxt)}</div>
          <div class="rest">${it.rx.sets ? "Rest " : ""}${escapeHtml(it.rx.rest)}</div>
          <button type="button" class="btn-ghost" data-alt="${i}" aria-expanded="${state.openAlt === i}">
            ${state.openAlt === i ? "Close ✕" : "Don't like it? ⇄"}
          </button>
        </div>
        ${state.openAlt === i ? renderAlternatives(i) : ""}
      </li>`;
    }).join("");
  }

  // finisher / cool-down
  let fin = "";
  if (target.id === "cardio") {
    fin = `<h3>🧊 Cool-down</h3><p>5 min very easy pace, then stretch calves, quads, hip flexors and chest — 30 s each.</p>`;
  } else if (finisherPick) {
    const mins = p.goal === "fatloss" ? (info.lowImpact ? "12–15 min steady" : "10 min: 30 s hard / 60 s easy") : "5–10 min easy";
    fin = `<h3>🏁 Finisher &amp; cool-down</h3><ul>
      <li><strong>${escapeHtml(finisherPick.name)}</strong> — ${mins}.</li>
      <li>Stretch the muscles you trained, 30 s each.</li></ul>`;
  } else {
    fin = `<h3>🏁 Cool-down</h3><p>Easy walk for 5 min, then stretch the muscles you trained, 30 s each.</p>`;
  }
  $("finisher").innerHTML = fin;

  $("tips").innerHTML = `<h3>🇸🇬 Singapore tips</h3><ul>
    <li>It's hot and humid — drink 500 ml of water before you train and sip between sets.</li>
    <li>${escapeHtml(gym.tip)}</li>
    <li>Gyms are busiest 6–9pm on weekdays. If a machine is taken, tap “Don't like it? ⇄” for a backup.</li>
    <li>Wipe down equipment after use and re-rack your weights.</li>
  </ul>`;
}

// ---------- "Don't like it?" alternatives ----------
// Same muscle, available at this gym, not hidden, not already in the plan.
function alternativesFor(i) {
  const { p, info, items } = state.plan;
  const it = items[i];
  const inPlan = new Set(items.map((x) => x.ex.id));
  const cardio = it.slot === "cardio";
  return EXERCISES
    .filter((ex) => (cardio ? ex.kind === "cardio" : ex.kind !== "cardio")
      && ex.muscles.includes(it.slot) && hasEquip(ex, state.equipment)
      && !inPlan.has(ex.id) && !state.disliked.has(ex.id))
    .map((ex) => ({ ex, s: scoreExercise(ex, it.slot, i, p, info, new Set(), () => 0) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, 4)
    .map((r) => r.ex);
}

// short labels saying how an alternative differs from the current pick
function altReasons(alt, cur, joints) {
  const r = [];
  const kindLabel = {
    machine: "Machine — guided path",
    free: "Free weights",
    cable: "Cable — smooth tension",
    bodyweight: "No equipment",
    cardio: "Cardio",
  };
  const prefs = state.plan.p.prefs;
  if (prefs.length && matchesPref(alt, prefs) && !matchesPref(cur, prefs)) r.push("Your preference");
  if (alt.kind !== cur.kind) r.push(kindLabel[alt.kind]);
  const curStress = (cur.stress || []).filter((j) => joints.includes(j)).length || (cur.stress || []).length;
  const altStress = (alt.stress || []).filter((j) => joints.includes(j)).length || (alt.stress || []).length;
  if (altStress < curStress) r.push("Easier on joints");
  if (alt.level < cur.level) r.push("Easier to learn");
  if (alt.level > cur.level) r.push("More challenging");
  if (alt.pattern !== cur.pattern && alt.kind === cur.kind) r.push("Different angle");
  if (!r.length) r.push("Similar movement");
  return r.slice(0, 2);
}

function renderAlternatives(i) {
  const it = state.plan.items[i];
  const alts = alternativesFor(i);
  const list = alts.length
    ? `<div class="alt-grid">${alts.map((alt) => {
        const key = artKey(alt);
        return `<div class="alt">
          <button type="button" class="zoom-btn" data-zoom="${key}" aria-label="Enlarge photo of ${escapeHtml(alt.name)}">
            ${equipmentMedia(key, "md")}<span class="zoom-hint" aria-hidden="true">🔍</span>
          </button>
          <button type="button" class="alt-body" data-pick="${i}:${alt.id}">
            <strong>${escapeHtml(alt.name)}</strong>
            <span class="alt-reasons">${altReasons(alt, it.ex, state.plan.p.joints).map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("")}</span>
            <span class="alt-equip">${escapeHtml(key === "body" ? "Bodyweight" : EQUIPMENT[key])} · tap to use</span>
          </button>
        </div>`;
      }).join("")}</div>`
    : `<p class="muted small">No other ${escapeHtml(it.slot)} exercises match your gym's equipment. Tick more equipment in step 1 to see more options.</p>`;
  return `<div class="alts">
    <p class="alts-title">Machine taken, don't like it, or can't do it? Try one of these instead:</p>
    ${list}
    <button type="button" class="link-btn" data-never="${i}">🚫 Never suggest “${escapeHtml(it.ex.name)}” again</button>
  </div>`;
}

function replaceExercise(i, ex) {
  const { p, info, target } = state.plan;
  const it = state.plan.items[i];
  it.ex = ex;
  if (target.id !== "cardio") it.rx = prescribe(ex, i, p, info);
}

function pickAlternative(i, id) {
  const ex = EXERCISES.find((e) => e.id === id);
  if (!ex) return;
  replaceExercise(i, ex);
  state.openAlt = -1;
  renderResults();
}

function neverSuggest(i) {
  const it = state.plan.items[i];
  state.disliked.add(it.ex.id);
  const next = alternativesFor(i)[0];
  if (next) replaceExercise(i, next);
  else state.plan.items.splice(i, 1);
  state.openAlt = -1;
  save();
  renderResults();
}

function planAsText() {
  const { p, gym, target, items, finisherPick } = state.plan;
  const lines = [`${target.name} workout @ ${gym.name} (${p.duration} min, ${GOAL_LABEL[p.goal]})`, ""];
  items.forEach((it, i) => {
    const sets = it.rx.sets ? `${it.rx.sets} x ${it.rx.reps}` : it.rx.reps;
    lines.push(`${i + 1}. ${it.ex.name} — ${sets}${it.rx.sets ? `, rest ${it.rx.rest}` : ""}`);
  });
  if (finisherPick && target.id !== "cardio") lines.push("", `Finisher: ${finisherPick.name}`);
  return lines.join("\n");
}

// ---------- Events ----------
function bind() {
  $("gymGrid").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-gym]");
    if (btn) { selectGym(btn.dataset.gym); save(); }
  });

  $("equipGrid").addEventListener("change", (e) => {
    if (e.target.type !== "checkbox") return;
    if (e.target.checked) state.equipment.add(e.target.value);
    else state.equipment.delete(e.target.value);
    updateEquipCount();
    save();
  });

  $("targetGrid").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-target]");
    if (!btn) return;
    state.targetId = btn.dataset.target;
    renderTargets();
    save();
  });

  $("profileForm").addEventListener("submit", (e) => { e.preventDefault(); generate(false); });
  $("shuffleBtn").addEventListener("click", () => generate(true));

  $("exerciseList").addEventListener("click", (e) => {
    const zoom = e.target.closest("[data-zoom]");
    if (zoom) { openLightbox(zoom.dataset.zoom); return; }
    const toggle = e.target.closest("[data-alt]");
    const pick = e.target.closest("[data-pick]");
    const never = e.target.closest("[data-never]");
    if (toggle) {
      const i = parseInt(toggle.dataset.alt, 10);
      state.openAlt = state.openAlt === i ? -1 : i;
      renderResults();
    } else if (pick) {
      const [i, id] = pick.dataset.pick.split(":");
      pickAlternative(parseInt(i, 10), id);
    } else if (never) {
      neverSuggest(parseInt(never.dataset.never, 10));
    }
  });

  $("hiddenBar").addEventListener("click", (e) => {
    if (e.target.id !== "resetHidden") return;
    state.disliked.clear();
    save();
    generate(false);
  });

  $("copyBtn").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(planAsText());
      $("copyBtn").textContent = "Copied ✓";
    } catch (_) {
      $("copyBtn").textContent = "Copy failed";
    }
    setTimeout(() => { $("copyBtn").textContent = "Copy plan"; }, 1500);
  });
}

// ---------- Photo lightbox (tap a photo to enlarge, tap again / + to zoom) ----------
const ZOOM_LEVELS = [1, 2, 3];
const lb = { level: 0, drag: null };

function largeSrc(src) {
  // ask Wikimedia for a bigger thumbnail; falls back to the normal one on error
  return src.replace(/\/\d+px-/, "/1280px-");
}

function openLightbox(key) {
  const photo = PHOTOS[key];
  const name = key === "body" ? "Bodyweight" : EQUIPMENT[key];
  $("lbStage").innerHTML = photo
    ? `<img id="lbImg" src="${largeSrc(photo.src)}" alt="${escapeHtml(photo.title)}" referrerpolicy="no-referrer"
         onerror="if (this.src !== '${photo.src}') this.src = '${photo.src}'" draggable="false" />`
    : equipmentArt(key, "art lb-art");
  $("lbCaption").innerHTML = `<strong>${escapeHtml(name)}</strong>` + (photo
    ? `<br /><a href="${photo.page}" target="_blank" rel="noopener">${escapeHtml(photo.title)}</a> · ${escapeHtml(photo.artist)} (${escapeHtml(photo.license)})`
    : `<br /><span class="muted">Illustration — no free photo available yet.</span>`);
  setZoom(0);
  $("lightbox").showModal();
}

function setZoom(level, cx = 0.5, cy = 0.5) {
  const stage = $("lbStage");
  lb.level = Math.max(0, Math.min(ZOOM_LEVELS.length - 1, level));
  const z = ZOOM_LEVELS[lb.level];
  stage.style.setProperty("--zoom", z);
  stage.classList.toggle("zoomed", z > 1);
  $("lbIn").disabled = lb.level === ZOOM_LEVELS.length - 1;
  $("lbOut").disabled = lb.level === 0;
  // keep the tapped point roughly under the finger/cursor
  requestAnimationFrame(() => {
    stage.scrollLeft = (stage.scrollWidth - stage.clientWidth) * cx;
    stage.scrollTop = (stage.scrollHeight - stage.clientHeight) * cy;
  });
}

function bindLightbox() {
  const dlg = $("lightbox");
  const stage = $("lbStage");
  $("lbClose").addEventListener("click", () => dlg.close());
  $("lbIn").addEventListener("click", () => setZoom(lb.level + 1));
  $("lbOut").addEventListener("click", () => setZoom(lb.level - 1));
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); }); // backdrop

  // drag to pan when zoomed; a click without dragging zooms in/out
  stage.addEventListener("pointerdown", (e) => {
    lb.drag = { x: e.clientX, y: e.clientY, left: stage.scrollLeft, top: stage.scrollTop, moved: false };
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener("pointermove", (e) => {
    if (!lb.drag) return;
    const dx = e.clientX - lb.drag.x, dy = e.clientY - lb.drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) lb.drag.moved = true;
    stage.scrollLeft = lb.drag.left - dx;
    stage.scrollTop = lb.drag.top - dy;
  });
  stage.addEventListener("pointerup", (e) => {
    const d = lb.drag;
    lb.drag = null;
    if (!d || d.moved) return;
    const r = stage.getBoundingClientRect();
    const cx = (stage.scrollLeft + e.clientX - r.left) / stage.scrollWidth;
    const cy = (stage.scrollTop + e.clientY - r.top) / stage.scrollHeight;
    setZoom(lb.level === ZOOM_LEVELS.length - 1 ? 0 : lb.level + 1, cx, cy);
  });
  stage.addEventListener("wheel", (e) => {
    if (!e.ctrlKey && lb.level === 0 && e.deltaY > 0) return; // let normal scroll through
    e.preventDefault();
    setZoom(lb.level + (e.deltaY < 0 ? 1 : -1));
  }, { passive: false });
}

function renderCredits() {
  $("credits").innerHTML = Object.entries(PHOTOS).map(([key, ph]) =>
    `<li>${escapeHtml(EQUIPMENT[key])}: <a href="${ph.page}" target="_blank" rel="noopener">${escapeHtml(ph.title)}</a>
      by ${escapeHtml(ph.artist)} (${escapeHtml(ph.license)})</li>`).join("");
}

// ---------- Init ----------
(function init() {
  renderCredits();
  renderPrefs();
  bindLightbox();
  const saved = load();
  renderGyms();
  renderTargets();
  bind();
  if (saved) {
    state.disliked = new Set(saved.disliked || []);
    if (saved.gymId) selectGym(saved.gymId, saved.equipment);
    if (saved.targetId) { state.targetId = saved.targetId; renderTargets(); }
    writeProfile(saved.profile);
  }
})();
