# CaseOps — Paralegal Packet Builder

Click-to-fill legal packet builder for CACD (California) and NDGA (Georgia).

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Run in browser (no Tauri required for UI dev)
npm run dev
# → http://localhost:1420
```

---

## Project structure

```
caseops/
├── src/
│   ├── App.jsx                   # Root — sidebar + routing
│   ├── main.jsx                  # Entry point
│   ├── index.css                 # Tailwind + component classes
│   ├── lib/
│   │   └── store.js              # localStorage data layer (swap for SQLite later)
│   ├── components/
│   │   ├── ui/index.jsx          # Card, Input, Modal, Toggle, etc.
│   │   ├── layout/Page.jsx       # PageHeader / PageBody
│   │   └── library/LibraryPage.jsx  # Reusable library layout
│   └── pages/
│       ├── Dashboard.jsx
│       ├── PacketBuilder.jsx     # ← Main workflow (8 steps)
│       ├── PacketsPage.jsx
│       ├── ClientsPage.jsx
│       ├── AttorneysPage.jsx
│       ├── DefendantsPage.jsx
│       └── ViolationsPage.jsx
│
├── scripts/
│   └── fill_forms.py             # PDF form filler (called by Tauri sidecar)
│
├── templates/
│   ├── california/               # ← DROP YOUR PDFs HERE
│   │   ├── ao440.pdf
│   │   ├── CV-030.pdf
│   │   └── CV-071.pdf
│   └── georgia/                  # ← DROP YOUR PDFs HERE
│       ├── ao440.pdf
│       └── JS44_202409.pdf
│
└── src-tauri/                    # Tauri shell (scaffold with `npm run tauri init`)
```

---

## Adding your PDF templates

Drop your 5 PDFs into the template folders:

```
templates/california/ao440.pdf
templates/california/CV-030.pdf
templates/california/CV-071.pdf
templates/georgia/ao440.pdf        ← same AO440, just copied
templates/georgia/JS44_202409.pdf
```

---

## Testing the PDF filler standalone

```bash
pip install pypdf

python scripts/fill_forms.py '{
  "packet":     { "district": "california", "caseNumber": "2:24-cv-04821", "amountDemanded": "75000", "juryDemand": true, "cacdDivision": "Western" },
  "client":     { "name": "Maria Torres", "county": "Los Angeles" },
  "attorney":   { "name": "Patricia Nguyen", "firm": "Nguyen & Holloway LLP", "address": "633 W 5th St Ste 2800, Los Angeles CA 90071", "phone": "(213) 555-0210", "email": "p.nguyen@firm.com" },
  "defendants": [{ "name": "Apex Property Management LLC", "serviceAddress": "350 S Grand Ave, Los Angeles CA 90071", "county": "Los Angeles" }],
  "violations": [{ "statute": "29 U.S.C. § 207", "description": "Overtime violation", "cv071CheckboxField": "710 Fair Labor Standards", "js44CheckboxField": null }]
}' './exports/Maria_Torres/'
```

---

## Tauri wiring (when ready)

In `src-tauri/src/main.rs`, add a command that:
1. Receives the packet JSON from the frontend
2. Calls `fill_forms.py` as a sidecar with the JSON + output path
3. Returns the list of generated file paths

Then in `PacketBuilder.jsx` replace the `generate()` simulation with:
```js
import { invoke } from "@tauri-apps/api/tauri";
const files = await invoke("generate_packet", { payload, outputDir });
```

---

## Roadmap / next up

- [ ] Wire Tauri sidecar → `fill_forms.py`
- [ ] SQLite via Drizzle (replace localStorage in `store.js`)
- [ ] Export to organized folder: `Exports/ClientName/`
- [ ] Open generated files from app (Tauri `shell.open`)
- [ ] Batch queue — multiple clients before generating
- [ ] Georgia forms second attorney block
- [ ] CSV import for bulk clients
