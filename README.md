# SG Gym Planner (gym_workout)

A small webpage that recommends a workout for Singapore gyms.

1. **Pick your gym** — Anytime Fitness, 24/7 Fitness (ex-Gymm Boxx), Fitness First, Virgin Active, PURE Fitness, EnergyOne (SAFRA), ActiveSG, The Gym Pod, or an HDB/park outdoor fitness corner. Each gym shows what we found about its equipment; untick anything your outlet doesn't have.
2. **Pick a focus** — Full body, Upper, Lower, Push, Pull, Chest, Back, Shoulders, Arms, Legs, Glutes, Core or Cardio.
3. **Tell it about you** — height, weight, age, activity level, experience, goal, session length, what you prefer to train with (machines, dumbbells, barbells, cables, kettlebells, bodyweight — optional) and any joints to go easy on.

It then picks machines/exercises available at that gym and suited to you (e.g. machines for beginners or higher BMI, free-weight compounds for advanced lifters, swaps out knee/back/shoulder-heavy moves), and sets your sets, reps and rest. BMI uses HPB's Asian cut-offs.

Each exercise shows a real photo of the machine/equipment (freely licensed, from Wikimedia Commons — credits in the page footer; a drawing is used where no good photo exists or when offline) and a **▶ Watch demo** link. Tap any photo to open it large; tap again or use **+ / −** to zoom in, and drag to look around. Tap **Don't like it? ⇄** for up to 4 alternatives for the same muscle (labelled e.g. "Machine — guided path", "Easier on joints"), or **Never suggest again** to hide an exercise for good (remembered in the browser; *Reset* brings it back).

## Run it

No install needed — open `index.html` in a browser.

**On your phone:** double-click `start-server.bat` (needs Python), then open the `http://192.168.x.x:8000` address it prints on your phone's browser. The phone must be on the same Wi-Fi/network as the PC. Close the window to stop it.

In VS Code, the recommended **Live Server** extension auto-reloads as you edit: right-click `index.html` → *Open with Live Server*.

## Files

| File | What it does |
| --- | --- |
| `index.html` | Page layout |
| `css/style.css` | Styles (auto light/dark) |
| `js/data.js` | Gyms, equipment, body-part targets, exercise library — edit this to add gyms or exercises |
| `js/photos.js` | Real equipment photos (Wikimedia Commons links + credits) |
| `js/illustrations.js` | SVG drawings used when there's no photo |
| `js/app.js` | Recommendation logic and UI |

Gym equipment lists are typical for each chain, not exact per outlet. General guidance only — not medical advice.
