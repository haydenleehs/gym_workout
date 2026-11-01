// ---------------------------------------------------------------------------
// Gym + exercise data for the Singapore gym workout planner.
//
// Equipment lists are TYPICAL for each chain — individual outlets differ,
// so the app lets users untick equipment their branch doesn't have.
// ---------------------------------------------------------------------------

const EQUIPMENT = {
  bb: "Barbell & squat rack",
  db: "Dumbbells",
  bench: "Adjustable bench",
  cable: "Cable machine",
  smith: "Smith machine",
  legpress: "Leg press",
  hacksquat: "Hack squat",
  chestpress: "Chest press machine",
  shoulderpress: "Shoulder press machine",
  pecdeck: "Pec deck / rear delt machine",
  latpull: "Lat pulldown",
  row: "Seated row machine",
  legext: "Leg extension",
  legcurl: "Leg curl",
  hipthrust: "Hip thrust / glute machine",
  abductor: "Hip abductor machine",
  calfm: "Calf raise machine",
  assisted: "Assisted pull-up/dip machine",
  plateloaded: "Plate-loaded machines",
  pullupbar: "Pull-up bar",
  dipstation: "Dip station / captain's chair",
  backext: "Back extension bench",
  kb: "Kettlebells",
  sled: "Sled / turf",
  treadmill: "Treadmill",
  bike: "Stationary bike",
  rower: "Rowing machine",
  stairs: "Stair climber",
  elliptical: "Elliptical",
  outdoor: "Outdoor space (park connector / void deck)",
};

const FULL_GYM = [
  "bb", "db", "bench", "cable", "smith", "legpress", "hacksquat", "chestpress",
  "shoulderpress", "pecdeck", "latpull", "row", "legext", "legcurl", "hipthrust",
  "abductor", "calfm", "assisted", "plateloaded", "pullupbar", "dipstation",
  "backext", "kb", "sled", "treadmill", "bike", "rower", "stairs", "elliptical",
];

// `equipment` = what a typical outlet has (users can untick per outlet).
// `found` = what we found when researching each chain (reviews, official
// pages, press). Researched Nov 2026 — outlets change, so check yours.
const GYMS = [
  {
    id: "anytime",
    name: "Anytime Fitness",
    short: "AF",
    color: "#6a2c91",
    access: "24/7",
    vibe: "Neighbourhood club, keyfob access",
    tip: "Clubs vary a lot in size — untick anything your outlet doesn't have. Quietest before 7am and after 10pm.",
    found: [
      "Squat/power racks, free weights and plate-loaded machines at most clubs.",
      "Smith machine and deadlift platforms at many clubs (e.g. Queensway, Clementi).",
      "Glute / hip-thrust machines and hack squats only at some clubs — Clementi City has none, Nanyang CC has a glute machine.",
      "Community-club outlets (e.g. Tampines West CC) are smaller.",
    ],
    source: "https://www.anytimefitness.sg/",
    equipment: [
      "bb", "db", "bench", "cable", "smith", "legpress", "chestpress", "shoulderpress",
      "pecdeck", "latpull", "row", "legext", "legcurl", "abductor", "calfm",
      "plateloaded", "pullupbar", "dipstation", "backext", "kb", "treadmill",
      "bike", "rower", "stairs", "elliptical",
    ],
  },
  {
    id: "247fitness",
    name: "24/7 Fitness (ex-Gymm Boxx)",
    short: "24/7",
    color: "#e30613",
    access: "24/7",
    vibe: "11 outlets, face-recognition entry",
    tip: "Took over Gymm Boxx in 2024. Strong on racks and plate-loaded machines — great for strength training.",
    found: [
      "Acquired Gymm Boxx in May 2024; about 11 outlets, all open 24/7.",
      "Plate-loaded machines from Life Fitness, GYM80 and Hammer Strength.",
      "Orchard (Pacific Plaza) flagship: 4 power racks, 2 deadlift platforms, 2 Smith machines.",
      "Functional training areas for circuits and mobility.",
    ],
    source: "https://mothership.sg/2024/09/24-7-fitness-gym-no-hidden-fees",
    equipment: [
      "bb", "db", "bench", "cable", "smith", "legpress", "hacksquat", "plateloaded",
      "pecdeck", "latpull", "row", "legext", "legcurl", "abductor", "pullupbar",
      "dipstation", "backext", "kb", "treadmill", "bike", "rower", "stairs",
    ],
  },
  {
    id: "fitnessfirst",
    name: "Fitness First",
    short: "FF",
    color: "#d71920",
    access: "Staffed hours",
    vibe: "Large CBD & mall clubs",
    tip: "CBD clubs get packed at lunch (12–2pm) and after work (6–8pm).",
    found: [
      "Free-weight areas and strength machines across clubs; Tampines has two free-weight areas.",
      "Hammer Strength free-weight stations reported at clubs.",
      "Market Street is often called one of the best-equipped CBD gyms.",
      "No turf/sled confirmed — check your club.",
    ],
    source: "https://www.fitnessfirst.com/sg/en",
    equipment: FULL_GYM.filter((e) => e !== "sled"),
  },
  {
    id: "virginactive",
    name: "Virgin Active",
    short: "VA",
    color: "#c8102e",
    access: "Staffed hours",
    vibe: "Premium clubs, spa-style",
    tip: "Functional zones have kettlebells and suspension trainers. Some clubs have small weight areas, so machines are your friend.",
    found: [
      "~$5M refit in 2024 with Technogym Pure Line strength equipment.",
      "Raffles Place functional zone: suspension ropes, kettlebells, Bulgarian bags.",
      "Some reviewers find the Tanjong Pagar weights area small.",
    ],
    source: "https://ausleisure.com.au/news/virgin-active-invests-5-million-to-transform-singapore-clubs",
    equipment: FULL_GYM.filter((e) => e !== "sled"),
  },
  {
    id: "pure",
    name: "PURE Fitness",
    short: "PF",
    color: "#1a1a1a",
    access: "Staffed hours",
    vibe: "Premium, serious lifting kit",
    tip: "Ocean Financial Centre has a 29 m sled track — perfect for low-impact conditioning.",
    found: [
      "Life Fitness, Keiser, Technogym and Eleiko equipment across clubs.",
      "Ocean Financial Centre: 29 m sled track with push sleds, strongman kit, battle ropes.",
      "Suntec: 14+ treadmills, cross trainers, WattBikes and PowerMill climbers.",
    ],
    source: "https://thesmartlocal.com/read/pure-fitness-nac/",
    equipment: FULL_GYM,
  },
  {
    id: "energyone",
    name: "EnergyOne (SAFRA)",
    short: "E1",
    color: "#f39200",
    access: "6:30am – 10:30pm",
    vibe: "SAFRA gyms, Hammer Strength centre",
    tip: "Choa Chu Kang is the biggest and has two of each popular machine. Punggol & CCK may open till midnight — check your branch.",
    found: [
      "First community gym accredited as a Hammer Strength Training Centre.",
      "Hammer Strength hack squat and plate-loaded range.",
      "Choa Chu Kang: largest E1, with doubles of popular machines.",
      "Not 24/7 — about 6:30am to 10:30pm (some branches later).",
    ],
    source: "https://safra.sg/amenities-offerings/energyone-gym",
    equipment: FULL_GYM.filter((e) => !["sled", "hipthrust"].includes(e)),
  },
  {
    id: "activesg",
    name: "ActiveSG Gym",
    short: "SG",
    color: "#00a19a",
    access: "~7am – 10pm",
    vibe: "Affordable, pay-per-entry",
    tip: "Pay with ActiveSG credits. Evenings are busy — machines are the easiest to grab.",
    found: [
      "28–29 gyms islandwide; all have cardio machines, free weights and stacked-weight machines.",
      "Several (e.g. Toa Payoh, Tampines, Jurong Lake Gardens) have HUR air-pressure machines — very beginner- and senior-friendly.",
      "ActiveSG instructors can help beginners plan around the machines.",
    ],
    source: "https://www.activesgcircle.gov.sg/facilities/gyms",
    equipment: [
      "bb", "db", "bench", "cable", "smith", "legpress", "chestpress", "shoulderpress",
      "pecdeck", "latpull", "row", "legext", "legcurl", "abductor", "calfm",
      "assisted", "pullupbar", "dipstation", "backext", "treadmill", "bike",
      "rower", "elliptical",
    ],
  },
  {
    id: "gympod",
    name: "The Gym Pod",
    short: "GP",
    color: "#ff5a36",
    access: "24/7 (booked)",
    vibe: "Private pod, book by the hour",
    tip: "Every pod is slightly different — check the pod's listing in the app before booking.",
    found: [
      "50+ private pods islandwide.",
      "Most have a treadmill, power rack, cable pulley, chin-up bar, bench and dumbbells.",
      "Some pods have a Smith machine; dumbbells around 2–40 kg.",
      "No large selectorised machines.",
    ],
    source: "https://thehoneycombers.com/singapore/private-gym-pods-singapore/",
    equipment: ["bb", "db", "bench", "cable", "smith", "pullupbar", "treadmill"],
  },
  {
    id: "outdoor",
    name: "Outdoor Fitness Corner",
    short: "HDB",
    color: "#2e8b57",
    access: "Anytime, free",
    vibe: "HDB / park fitness corner",
    tip: "Go early morning or after sunset to beat the heat. Bring water — it's humid!",
    found: [
      "Most HDB estates and parks have a fitness corner with pull-up bars and parallel bars.",
      "Park connectors are great for brisk walks and jogs.",
    ],
    source: "",
    equipment: ["pullupbar", "dipstation", "outdoor"],
  },
];

// "What do you prefer to train with?" options. `photo` is the EQUIPMENT key
// used to illustrate it; `match` says which exercises count.
const usesEquip = (ex, key) => ex.equip.some((req) => req.split("|").includes(key));
const PREFS = {
  machine: { label: "Machines", photo: "chestpress", match: (ex) => ex.kind === "machine" },
  db: { label: "Dumbbells", photo: "db", match: (ex) => usesEquip(ex, "db") },
  bb: { label: "Barbells", photo: "bb", match: (ex) => usesEquip(ex, "bb") },
  cable: { label: "Cables", photo: "cable", match: (ex) => ex.kind === "cable" || usesEquip(ex, "cable") },
  kb: { label: "Kettlebells", photo: "kb", match: (ex) => usesEquip(ex, "kb") },
  bodyweight: { label: "Bodyweight", photo: "pullupbar", match: (ex) => ex.kind === "bodyweight" },
};

// Body-part targets. `slots` is the ordered list of muscles to fill;
// compounds/big muscles come first so the workout flows heavy -> light.
const TARGETS = [
  { id: "full", name: "Full Body", icon: "🏋️", slots: ["quads", "chest", "back", "hamstrings", "shoulders", "core", "glutes", "biceps", "triceps"] },
  { id: "upper", name: "Upper Body", icon: "💪", slots: ["chest", "back", "shoulders", "chest", "back", "biceps", "triceps", "shoulders"] },
  { id: "lower", name: "Lower Body", icon: "🦵", slots: ["quads", "hamstrings", "glutes", "quads", "hamstrings", "calves", "core", "glutes"] },
  { id: "push", name: "Push", icon: "⬆️", slots: ["chest", "shoulders", "chest", "triceps", "shoulders", "triceps", "chest"] },
  { id: "pull", name: "Pull", icon: "⬇️", slots: ["back", "back", "shoulders", "biceps", "back", "biceps", "core"] },
  { id: "chest", name: "Chest", icon: "🛡️", slots: ["chest", "chest", "chest", "chest", "triceps", "chest", "triceps"] },
  { id: "back", name: "Back", icon: "🪽", slots: ["back", "back", "back", "back", "biceps", "back", "biceps"] },
  { id: "shoulders", name: "Shoulders", icon: "🎯", slots: ["shoulders", "shoulders", "shoulders", "shoulders", "triceps", "shoulders", "shoulders"] },
  { id: "arms", name: "Arms", icon: "💥", slots: ["biceps", "triceps", "biceps", "triceps", "biceps", "triceps", "biceps"] },
  { id: "legs", name: "Legs", icon: "🦿", slots: ["quads", "hamstrings", "quads", "glutes", "hamstrings", "calves", "quads"] },
  { id: "glutes", name: "Glutes", icon: "🍑", slots: ["glutes", "glutes", "hamstrings", "glutes", "quads", "glutes", "glutes"] },
  { id: "core", name: "Core / Abs", icon: "🧱", slots: ["core", "core", "core", "core", "core", "core"] },
  { id: "cardio", name: "Cardio", icon: "❤️", slots: [] },
];

// Exercise fields:
//   muscles  – first entry is the primary muscle
//   equip    – all required; "a|b" means either a or b
//   kind     – machine | free | cable | bodyweight | cardio
//   level    – 1 beginner-friendly, 2 needs some technique, 3 advanced
//   stress   – joints it loads hard: knee | back | shoulder
//   impact   – jumping/pounding movements
//   bwLoad   – you lift most of your own bodyweight
//   timed    – prescribed as a hold/duration instead of reps
const EXERCISES = [
  // ---------------- Chest ----------------
  { id: "chestpress", name: "Machine Chest Press", muscles: ["chest", "triceps"], pattern: "h-press", equip: ["chestpress"], kind: "machine", level: 1, compound: true, cue: "Handles at mid-chest, shoulder blades pinned back, press without locking elbows hard." },
  { id: "plchestpress", name: "Plate-Loaded Chest Press", muscles: ["chest", "triceps"], pattern: "h-press", equip: ["plateloaded"], kind: "machine", level: 1, compound: true, cue: "Seat so handles line up with lower chest. Control the stretch on the way back." },
  { id: "dbbench", name: "Dumbbell Bench Press", muscles: ["chest", "triceps"], pattern: "h-press", equip: ["db", "bench"], kind: "free", level: 1, compound: true, cue: "Feet planted, slight arch, lower dumbbells to chest level with elbows ~45°." },
  { id: "bbbench", name: "Barbell Bench Press", muscles: ["chest", "triceps"], pattern: "h-press", equip: ["bb", "bench"], kind: "free", level: 2, compound: true, stress: ["shoulder"], cue: "Grip just outside shoulders, touch lower chest, drive feet into floor. Use safety arms or a spotter." },
  { id: "inclinedb", name: "Incline Dumbbell Press", muscles: ["chest", "shoulders"], pattern: "incline", equip: ["db", "bench"], kind: "free", level: 1, compound: true, cue: "Bench at 30°. Press up and slightly in, don't clank the dumbbells." },
  { id: "inclinesmith", name: "Smith Machine Incline Press", muscles: ["chest", "shoulders"], pattern: "incline", equip: ["smith", "bench"], kind: "machine", level: 1, compound: true, cue: "Bench at 30°, bar touches upper chest. Fixed path makes it a safe solo lift." },
  { id: "inclinebb", name: "Incline Barbell Press", muscles: ["chest", "shoulders"], pattern: "incline", equip: ["bb", "bench"], kind: "free", level: 2, compound: true, stress: ["shoulder"], cue: "Bar to upper chest, elbows slightly tucked." },
  { id: "pecdeck", name: "Pec Deck Fly", muscles: ["chest"], pattern: "fly", equip: ["pecdeck"], kind: "machine", level: 1, cue: "Soft elbows, squeeze chest at the middle, slow on the way back." },
  { id: "cablefly", name: "Cable Fly (high-to-low)", muscles: ["chest"], pattern: "fly", equip: ["cable"], kind: "cable", level: 1, cue: "Step forward, hug a big tree, hands meet around belly button." },
  { id: "pushup", name: "Push-up (hands on bench if needed)", muscles: ["chest", "triceps"], pattern: "h-press", equip: [], kind: "bodyweight", level: 1, compound: true, bwLoad: true, cue: "Straight line head to heels. Elevate hands on a bench/bar to make it easier." },
  { id: "dips", name: "Parallel Bar Dips", muscles: ["chest", "triceps"], pattern: "dip", equip: ["dipstation|assisted"], kind: "bodyweight", level: 3, compound: true, bwLoad: true, stress: ["shoulder"], cue: "Lean slightly forward, lower until shoulders are level with elbows — no deeper." },

  // ---------------- Back ----------------
  { id: "latpull", name: "Lat Pulldown", muscles: ["back", "biceps"], pattern: "v-pull", equip: ["latpull"], kind: "machine", level: 1, compound: true, cue: "Chest up, pull bar to upper chest by driving elbows down to your ribs." },
  { id: "assistpull", name: "Assisted Pull-up", muscles: ["back", "biceps"], pattern: "v-pull", equip: ["assisted"], kind: "machine", level: 1, compound: true, cue: "More counterweight = easier. Full hang at the bottom, chin over bar at the top." },
  { id: "pullup", name: "Pull-up", muscles: ["back", "biceps"], pattern: "v-pull", equip: ["pullupbar"], kind: "bodyweight", level: 3, compound: true, bwLoad: true, cue: "Dead hang, pull chest toward the bar. Can't do one yet? Do slow 5-second negatives." },
  { id: "chinup", name: "Chin-up (underhand)", muscles: ["back", "biceps"], pattern: "v-pull", equip: ["pullupbar"], kind: "bodyweight", level: 2, compound: true, bwLoad: true, cue: "Palms facing you, shoulder-width. Slightly easier than pull-ups and hits biceps more." },
  { id: "seatedrow", name: "Seated Row Machine", muscles: ["back", "biceps"], pattern: "h-pull", equip: ["row|cable"], kind: "machine", level: 1, compound: true, cue: "Sit tall, pull handles to your stomach, squeeze shoulder blades together." },
  { id: "plrow", name: "Plate-Loaded / T-Bar Row", muscles: ["back", "biceps"], pattern: "h-pull", equip: ["plateloaded"], kind: "machine", level: 1, compound: true, cue: "Chest on the pad, pull with elbows, pause at the top." },
  { id: "csdbrow", name: "Chest-Supported Dumbbell Row", muscles: ["back", "biceps"], pattern: "h-pull", equip: ["db", "bench"], kind: "free", level: 1, compound: true, cue: "Lie face-down on a 30° bench. Row dumbbells to hips — zero lower-back strain." },
  { id: "onearmrow", name: "One-Arm Dumbbell Row", muscles: ["back", "biceps"], pattern: "h-pull", equip: ["db", "bench"], kind: "free", level: 1, compound: true, cue: "Hand and knee on bench, flat back, row dumbbell to your hip pocket." },
  { id: "bbrow", name: "Barbell Bent-Over Row", muscles: ["back", "biceps"], pattern: "h-pull", equip: ["bb"], kind: "free", level: 2, compound: true, stress: ["back"], cue: "Hinge to ~45°, neutral spine, pull bar to lower ribs." },
  { id: "invrow", name: "Inverted Row", muscles: ["back", "biceps"], pattern: "h-pull", equip: ["smith|bb|pullupbar"], kind: "bodyweight", level: 1, compound: true, cue: "Under a low bar, body straight, pull chest to bar. Bend knees to make it easier." },
  { id: "straightarm", name: "Straight-Arm Cable Pulldown", muscles: ["back"], pattern: "lat-iso", equip: ["cable"], kind: "cable", level: 1, cue: "Arms almost straight, sweep the bar down to thighs using your lats." },
  { id: "deadlift", name: "Barbell Deadlift", muscles: ["back", "hamstrings", "glutes"], pattern: "hinge", equip: ["bb"], kind: "free", level: 3, compound: true, stress: ["back"], cue: "Bar over mid-foot, brace hard, push the floor away. Keep the bar close." },
  { id: "backext", name: "45° Back Extension", muscles: ["back", "glutes", "hamstrings"], pattern: "back-ext", equip: ["backext"], kind: "bodyweight", level: 1, cue: "Hinge at the hips, rise until body is straight — don't hyperextend." },

  // ---------------- Shoulders ----------------
  { id: "mshoulder", name: "Machine Shoulder Press", muscles: ["shoulders", "triceps"], pattern: "ohp", equip: ["shoulderpress"], kind: "machine", level: 1, compound: true, cue: "Handles start at chin height, press up without shrugging." },
  { id: "dbshoulder", name: "Seated Dumbbell Shoulder Press", muscles: ["shoulders", "triceps"], pattern: "ohp", equip: ["db", "bench"], kind: "free", level: 1, compound: true, stress: ["shoulder"], cue: "Bench upright, dumbbells at ear level, press up in a slight arc." },
  { id: "smithohp", name: "Smith Machine Shoulder Press", muscles: ["shoulders", "triceps"], pattern: "ohp", equip: ["smith", "bench"], kind: "machine", level: 1, compound: true, cue: "Bench upright under the bar, lower to chin level." },
  { id: "ohp", name: "Standing Barbell Overhead Press", muscles: ["shoulders", "triceps"], pattern: "ohp", equip: ["bb"], kind: "free", level: 2, compound: true, stress: ["shoulder", "back"], cue: "Squeeze glutes, press bar straight up, move your head through at the top." },
  { id: "pikepush", name: "Pike Push-up", muscles: ["shoulders", "triceps"], pattern: "ohp", equip: [], kind: "bodyweight", level: 2, compound: true, bwLoad: true, stress: ["shoulder"], cue: "Hips high in an upside-down V, lower head toward the floor between hands." },
  { id: "latraise", name: "Dumbbell Lateral Raise", muscles: ["shoulders"], pattern: "lateral", equip: ["db"], kind: "free", level: 1, cue: "Light weight! Raise to shoulder height leading with elbows, slow down." },
  { id: "cablelat", name: "Cable Lateral Raise", muscles: ["shoulders"], pattern: "lateral", equip: ["cable"], kind: "cable", level: 1, cue: "Cable at the lowest setting, pull across and out to shoulder height." },
  { id: "revpec", name: "Reverse Pec Deck", muscles: ["shoulders", "back"], pattern: "rear", equip: ["pecdeck"], kind: "machine", level: 1, cue: "Face the pad, arms slightly bent, open out wide to work rear delts." },
  { id: "facepull", name: "Cable Face Pull", muscles: ["shoulders", "back"], pattern: "rear", equip: ["cable"], kind: "cable", level: 1, cue: "Rope at eye level, pull to your face with elbows high. Great for posture." },
  { id: "rearfly", name: "Dumbbell Rear Delt Fly", muscles: ["shoulders", "back"], pattern: "rear", equip: ["db"], kind: "free", level: 1, cue: "Hinge forward or lie chest-down on a bench, raise arms out wide." },

  // ---------------- Biceps ----------------
  { id: "dbcurl", name: "Dumbbell Bicep Curl", muscles: ["biceps"], pattern: "curl", equip: ["db"], kind: "free", level: 1, cue: "Elbows pinned to your sides, no swinging." },
  { id: "hammer", name: "Hammer Curl", muscles: ["biceps"], pattern: "hammer", equip: ["db"], kind: "free", level: 1, cue: "Neutral (thumbs-up) grip. Also builds forearms." },
  { id: "bbcurl", name: "Barbell / EZ-Bar Curl", muscles: ["biceps"], pattern: "curl", equip: ["bb"], kind: "free", level: 1, cue: "Shoulder-width grip, curl without leaning back." },
  { id: "cablecurl", name: "Cable Curl", muscles: ["biceps"], pattern: "curl", equip: ["cable"], kind: "cable", level: 1, cue: "Constant tension — squeeze hard at the top." },
  { id: "inclinecurl", name: "Incline Dumbbell Curl", muscles: ["biceps"], pattern: "curl-stretch", equip: ["db", "bench"], kind: "free", level: 2, cue: "Bench at 45°, arms hang behind you for a big stretch." },

  // ---------------- Triceps ----------------
  { id: "pushdown", name: "Cable Triceps Pushdown", muscles: ["triceps"], pattern: "pushdown", equip: ["cable"], kind: "cable", level: 1, cue: "Elbows glued to sides, spread the rope at the bottom." },
  { id: "ohcable", name: "Overhead Cable Triceps Extension", muscles: ["triceps"], pattern: "oh-ext", equip: ["cable"], kind: "cable", level: 1, cue: "Face away from the stack, extend rope overhead, feel the stretch." },
  { id: "dboh", name: "Dumbbell Overhead Extension", muscles: ["triceps"], pattern: "oh-ext", equip: ["db"], kind: "free", level: 1, cue: "Hold one dumbbell with both hands, lower behind your head." },
  { id: "skull", name: "Skull Crusher", muscles: ["triceps"], pattern: "lying-ext", equip: ["bb|db", "bench"], kind: "free", level: 2, cue: "Lower weight to forehead / just behind head, elbows pointing up." },
  { id: "cgbench", name: "Close-Grip Bench Press", muscles: ["triceps", "chest"], pattern: "cg-press", equip: ["bb|smith", "bench"], kind: "free", level: 2, compound: true, cue: "Hands shoulder-width, elbows tucked close." },
  { id: "benchdip", name: "Bench Dips", muscles: ["triceps"], pattern: "dip", equip: ["bench|dipstation"], kind: "bodyweight", level: 1, stress: ["shoulder"], cue: "Hands on bench edge, lower until elbows are at 90°. Bend knees to make easier." },

  // ---------------- Quads ----------------
  { id: "legpress", name: "Leg Press", muscles: ["quads", "glutes"], pattern: "squat", equip: ["legpress"], kind: "machine", level: 1, compound: true, stress: ["knee"], cue: "Feet shoulder-width mid-platform, lower until knees ~90°, lower back stays on pad." },
  { id: "hacksquat", name: "Hack Squat", muscles: ["quads", "glutes"], pattern: "squat", equip: ["hacksquat"], kind: "machine", level: 2, compound: true, stress: ["knee"], cue: "Back flat on pad, sit deep under control, drive through mid-foot." },
  { id: "backsquat", name: "Barbell Back Squat", muscles: ["quads", "glutes"], pattern: "squat", equip: ["bb"], kind: "free", level: 2, compound: true, stress: ["knee", "back"], cue: "Bar on upper back, brace, sit between your hips, knees track over toes. Set safety pins." },
  { id: "goblet", name: "Goblet Squat", muscles: ["quads", "glutes"], pattern: "squat", equip: ["db|kb"], kind: "free", level: 1, compound: true, stress: ["knee"], cue: "Hold weight at chest, elbows inside knees, sit down tall." },
  { id: "smithsquat", name: "Smith Machine Squat", muscles: ["quads", "glutes"], pattern: "squat", equip: ["smith"], kind: "machine", level: 1, compound: true, stress: ["knee"], cue: "Feet slightly in front of the bar, squat to a comfortable depth." },
  { id: "boxsquat", name: "Bodyweight Box Squat", muscles: ["quads", "glutes"], pattern: "squat", equip: [], kind: "bodyweight", level: 1, compound: true, cue: "Sit back to a bench or ledge, tap it lightly, stand up. Great starter move." },
  { id: "legext", name: "Leg Extension", muscles: ["quads"], pattern: "leg-ext", equip: ["legext"], kind: "machine", level: 1, stress: ["knee"], cue: "Pad on lower shin, kick up and squeeze quads for a second." },
  { id: "bss", name: "Bulgarian Split Squat", muscles: ["quads", "glutes"], pattern: "lunge", equip: ["bench"], kind: "free", level: 2, compound: true, stress: ["knee"], cue: "Rear foot on bench, drop straight down. Hold dumbbells if you have them." },
  { id: "lunge", name: "Dumbbell Walking Lunge", muscles: ["quads", "glutes"], pattern: "lunge", equip: ["db"], kind: "free", level: 2, compound: true, stress: ["knee"], cue: "Long steps, back knee kisses the floor, torso upright." },
  { id: "stepup", name: "Step-up", muscles: ["quads", "glutes"], pattern: "lunge", equip: ["bench|outdoor"], kind: "bodyweight", level: 1, compound: true, cue: "Whole foot on the step, push through the heel, control the step down." },

  // ---------------- Hamstrings ----------------
  { id: "legcurl", name: "Lying / Seated Leg Curl", muscles: ["hamstrings"], pattern: "leg-curl", equip: ["legcurl"], kind: "machine", level: 1, cue: "Pad just above heels, curl fully, slow on the way back." },
  { id: "rdl", name: "Barbell Romanian Deadlift", muscles: ["hamstrings", "glutes"], pattern: "hinge", equip: ["bb"], kind: "free", level: 2, compound: true, stress: ["back"], cue: "Soft knees, push hips back, bar slides down thighs until you feel a hamstring stretch." },
  { id: "dbrdl", name: "Dumbbell Romanian Deadlift", muscles: ["hamstrings", "glutes"], pattern: "hinge", equip: ["db|kb"], kind: "free", level: 1, compound: true, stress: ["back"], cue: "Same as barbell RDL — hips back, flat back, dumbbells close to legs." },
  { id: "kbswing", name: "Kettlebell Swing", muscles: ["hamstrings", "glutes"], pattern: "swing", equip: ["kb"], kind: "free", level: 2, compound: true, stress: ["back"], cue: "Hike the bell back, snap hips forward. It's a hinge, not a squat." },
  { id: "pullthrough", name: "Cable Pull-Through", muscles: ["hamstrings", "glutes"], pattern: "hinge-cable", equip: ["cable"], kind: "cable", level: 1, compound: true, cue: "Face away from low cable, rope between legs, hinge back and drive hips through." },
  { id: "slbridge", name: "Single-Leg Hamstring Bridge", muscles: ["hamstrings", "glutes"], pattern: "bridge-ham", equip: [], kind: "bodyweight", level: 1, cue: "Heel on a bench or step, push hips up through the heel." },

  // ---------------- Glutes ----------------
  { id: "hipthrustm", name: "Hip Thrust / Glute Drive Machine", muscles: ["glutes", "hamstrings"], pattern: "thrust", equip: ["hipthrust"], kind: "machine", level: 1, compound: true, cue: "Chin tucked, drive hips up and squeeze glutes hard for 1 second." },
  { id: "bbthrust", name: "Barbell Hip Thrust", muscles: ["glutes", "hamstrings"], pattern: "thrust", equip: ["bb", "bench"], kind: "free", level: 2, compound: true, cue: "Upper back on bench, use a bar pad, ribs down at the top." },
  { id: "dbthrust", name: "Dumbbell Hip Thrust", muscles: ["glutes", "hamstrings"], pattern: "thrust", equip: ["db", "bench"], kind: "free", level: 1, compound: true, cue: "Dumbbell on hips, upper back on bench, full lockout with glutes." },
  { id: "bridge", name: "Glute Bridge", muscles: ["glutes", "hamstrings"], pattern: "bridge", equip: [], kind: "bodyweight", level: 1, cue: "Lie on back, feet flat, squeeze glutes to lift hips. Pause at the top." },
  { id: "abductor", name: "Hip Abduction Machine", muscles: ["glutes"], pattern: "abduct", equip: ["abductor"], kind: "machine", level: 1, cue: "Lean slightly forward to hit upper glutes more, push knees out." },
  { id: "kickback", name: "Cable Glute Kickback", muscles: ["glutes"], pattern: "kickback", equip: ["cable"], kind: "cable", level: 1, cue: "Ankle strap, kick back and slightly out without arching your back." },

  // ---------------- Calves ----------------
  { id: "calfm", name: "Standing / Seated Calf Raise", muscles: ["calves"], pattern: "calf", equip: ["calfm"], kind: "machine", level: 1, cue: "Full stretch at the bottom, pause on tiptoes at the top." },
  { id: "lpcalf", name: "Leg Press Calf Raise", muscles: ["calves"], pattern: "calf", equip: ["legpress"], kind: "machine", level: 1, cue: "Balls of feet on platform edge, push through toes. Keep the safety locks on." },
  { id: "smithcalf", name: "Smith Machine Calf Raise", muscles: ["calves"], pattern: "calf", equip: ["smith"], kind: "machine", level: 1, cue: "Stand on a plate for extra range, slow and controlled." },
  { id: "bwcalf", name: "Single-Leg Calf Raise (on a step)", muscles: ["calves"], pattern: "calf", equip: [], kind: "bodyweight", level: 1, cue: "Hold something for balance, heel drops below the step then rise up." },

  // ---------------- Core ----------------
  { id: "plank", name: "Plank", muscles: ["core"], pattern: "anti-ext", equip: [], kind: "bodyweight", level: 1, timed: true, cue: "Elbows under shoulders, squeeze glutes, don't let hips sag." },
  { id: "deadbug", name: "Dead Bug", muscles: ["core"], pattern: "anti-ext", equip: [], kind: "bodyweight", level: 1, cue: "Lower back pressed to floor, extend opposite arm & leg slowly." },
  { id: "sideplank", name: "Side Plank", muscles: ["core"], pattern: "anti-lat", equip: [], kind: "bodyweight", level: 1, timed: true, cue: "Stack feet (or knees to make easier), hips high. Each side." },
  { id: "pallof", name: "Pallof Press", muscles: ["core"], pattern: "anti-rot", equip: ["cable"], kind: "cable", level: 1, cue: "Stand side-on to cable, press handle straight out, resist the twist." },
  { id: "woodchop", name: "Cable Woodchop", muscles: ["core"], pattern: "rotation", equip: ["cable"], kind: "cable", level: 1, cue: "Rotate through your torso, high to low, arms stay long." },
  { id: "cablecrunch", name: "Kneeling Cable Crunch", muscles: ["core"], pattern: "flexion", equip: ["cable"], kind: "cable", level: 1, cue: "Rope by your head, crunch elbows toward knees — hips stay still." },
  { id: "captain", name: "Captain's Chair Knee Raise", muscles: ["core"], pattern: "flexion", equip: ["dipstation"], kind: "bodyweight", level: 1, cue: "Back on pad, curl knees to chest, don't swing." },
  { id: "hangknee", name: "Hanging Knee Raise", muscles: ["core"], pattern: "flexion", equip: ["pullupbar"], kind: "bodyweight", level: 2, bwLoad: true, cue: "Hang from bar, curl pelvis up, control the lowering." },
  { id: "carry", name: "Farmer's Carry", muscles: ["core"], pattern: "carry", equip: ["db|kb"], kind: "free", level: 1, timed: true, cue: "Heavy dumbbells by your sides, walk tall for 30–40 m." },

  // ---------------- Cardio ----------------
  { id: "inclinewalk", name: "Incline Treadmill Walk", muscles: ["cardio"], pattern: "walk", equip: ["treadmill"], kind: "cardio", level: 1, cue: "Incline 8–12%, speed 4.5–5.5 km/h, don't hold the handrails." },
  { id: "bike", name: "Stationary Bike", muscles: ["cardio"], pattern: "bike", equip: ["bike"], kind: "cardio", level: 1, cue: "Seat at hip height, steady cadence 80–90 rpm. Very joint-friendly." },
  { id: "elliptical", name: "Elliptical", muscles: ["cardio"], pattern: "elliptical", equip: ["elliptical"], kind: "cardio", level: 1, cue: "Use the arms too, keep a pace you can just about talk at." },
  { id: "rower", name: "Rowing Machine", muscles: ["cardio"], pattern: "row", equip: ["rower"], kind: "cardio", level: 1, stress: ["back"], cue: "Legs → hips → arms, then reverse. Damper around 4–6." },
  { id: "stairs", name: "Stair Climber", muscles: ["cardio"], pattern: "stairs", equip: ["stairs"], kind: "cardio", level: 2, stress: ["knee"], cue: "Stand tall, light grip on rails, full steps." },
  { id: "run", name: "Treadmill Run Intervals", muscles: ["cardio"], pattern: "run", equip: ["treadmill"], kind: "cardio", level: 2, impact: true, stress: ["knee"], cue: "Fast run for the work interval, walk to recover." },
  { id: "sled", name: "Sled Push", muscles: ["cardio"], pattern: "sled", equip: ["sled"], kind: "cardio", level: 2, cue: "Arms locked, low body angle, short powerful steps. No impact on joints." },
  { id: "pcn", name: "Park Connector Brisk Walk / Jog", muscles: ["cardio"], pattern: "walk", equip: ["outdoor"], kind: "cardio", level: 1, cue: "Go before 8am or after 7pm to avoid the heat. Brisk enough to breathe harder." },
  { id: "burpee", name: "Burpees", muscles: ["cardio"], pattern: "hiit", equip: [], kind: "cardio", level: 2, impact: true, bwLoad: true, stress: ["knee", "shoulder"], cue: "Squat, kick back to plank, jump up. Step back instead of jumping to reduce impact." },
];
