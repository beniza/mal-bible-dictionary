# CLAUDE.md — Project Specifics

## Tech Stack

- **CSS Framework**: Tailwind CSS 4 (imported from CDN via `<script src="https://cdn.tailwindcss.com"></script>`)
- **JavaScript**: Vanilla (no frameworks; Chart.js for visualization)
- **Fonts**: Google Fonts (Noto Sans/Serif Malayalam)
- **Testing**: Node.js `test()` module with `assert` (no external frameworks)

**Tailwind CSS 4 notes:**
- Using latest Tailwind v4 from CDN
- All utility classes available; no custom config needed for CDN version
- For offline work or custom config: migrate to `npm` + `@tailwindcss/cli` and add `tailwind.config.js`

---

## Data Sources

### 1. UBS Fauna Lexicon English (`orig/` folder)

**Location**: `orig/` → symlinked to `/Documents/Projects/tfbf/ffr/entries/fauna/`

**Format**: SFM (Scripture Formatted Markup) files, organized by key:
- `01.sfm`, `02.sfm`, `02-01.sfm`, etc. (hierarchical numbering)
- Each file contains:
  - `\key` — unique identifier (e.g., "1", "02-01")
  - `\title` — entry name
  - `\heb` — Hebrew word(s)
  - `\trl` — transliteration
  - `\cont` — content/discussion
  - `\grk` — Greek equivalents
  - `\ref` — scripture references (encoded format)
  - Image references within content

**Usage**: Lookup birds by their UBS key to get authoritative etymologies, definitions, and scholarly context.

**Example key structure**:
- `01` = General category (e.g., "Animals, general")
- `02` = Subcategory (e.g., "Unclean birds")
- `02-01`, `02-02`, etc. = Specific bird entries

### 2. UBS Fauna Lexicon Malayalam (`mal/` folder)

**Location**: `mal/` → symlinked to `/My Paratext 9 Projects/TBDML/`

**Format**: Paratext 9 project with SFM markup
- Main file: `94XXATBDML.SFM`
- Same key structure as `orig/` but with Malayalam translations and commentary
- Contains:
  - `\key` — matches `orig/` keys
  - Malayalam headings (`\s1`, `\s2`, `\s3`)
  - Malayalam `\cont` translations of English content
  - Metadata: `\rem gen:date`, `\rem gen:model` (auto-generated date & model)
  - Status markers: `\rem gen:status converted` and `\rem gen:stage ml`

**Usage**: Source-of-truth for Malayalam bird names and scholarly translations; auto-sync with app data when needed.

### 3. Bird Images (`image/` folder)

**Location**: `image/` → symlinked to `/Documents/Projects/tfbf/ffr/images/`

**CDN Access**: All images also available at:
```
https://raw.githubusercontent.com/tfbf/scripture-resource-studio-app/main/images/
```

**Naming Pattern**: `OAI-NNNN_description_lang.jpg`
- `NNNN` = entry key identifier (e.g., `0018`, `0031`)
- `description` = human-readable label (e.g., `writing_pen_case`, `windows`)
- `lang` = language code (`en`, `hans`, `hant`, `prt`, `sp`, etc.)

**Example**:
```
OAI-0018_writing_pen_case_en.jpg
OAI-0018_writing_pen_case_sp.jpg  (same image, Spanish label)
```

---

## How to Link Resources

### Mapping Birds to UBS Entries & Images

Currently, bird data in `biblical_aviary_explorer.html` uses:
- Strong's Hebrew numbers (`id: "H5404"`)
- Custom scientific identifications
- Manual translations

**To integrate UBS Fauna Lexicon:**

1. **Find the UBS key** for each bird (e.g., hoopoe → `02-09`)
2. **Parse the SFM file** (`orig/02-09.sfm`) to extract:
   - Hebrew word, transliteration
   - Scholarly discussion
   - References
3. **Link to images** using the key:
   ```javascript
   // In bird data object:
   ubes_key: "02-09",
   image_url: "https://raw.githubusercontent.com/tfbf/scripture-resource-studio-app/main/images/OAI-0209_hoopoe_en.jpg"
   ```

### Example Bird Mapping (to be completed)

| Bird | Strong's | UBS Key | Image URL |
|------|----------|---------|-----------|
| Hoopoe | H1744 | 02-09 | `OAI-0209_hoopoe_*.jpg` |
| Eagle | H5404 | 02-01 | `OAI-0201_eagle_*.jpg` |
| ... | ... | ... | ... |

---

## File Organization

```
biblical_aviary_explorer.html     # Main SPA (55KB)
verse-tabs.test.mjs                # Structure validation tests
AGENTS.md                          # AI agent instructions
CLAUDE.md                          # This file
image/  → (symlink to ../tfbf/ffr/images)
orig/   → (symlink to ../tfbf/ffr/entries/fauna) [UBS English]
mal/    → (symlink to ../My Paratext 9 Projects/TBDML) [UBS Malayalam]
```

---

## Common Tasks

### ✅ Add Bird Image to Explorer

1. **Locate UBS entry** in `orig/` by bird name
2. **Note the UBS key** (e.g., `02-09` for hoopoe)
3. **Add to bird data**:
   ```javascript
   {
     id: "H1744",
     heb: "...",
     ubes_key: "02-09",
     image_url: "https://raw.githubusercontent.com/tfbf/scripture-resource-studio-app/main/images/OAI-0209_hoopoe_en.jpg",
     // ... other fields
   }
   ```
4. **Render image** in bird card template (in `renderBirds()`)

### ✅ Migrate to Local Tailwind 4 Setup

If CDN becomes unreliable:

```bash
npm install -D tailwindcss @tailwindcss/cli
npx tailwindcss init
# Add to tailwind.config.js if custom colors needed
# Run: npx tailwindcss -i input.css -o output.css --watch
```

Then update HTML:
```html
<link href="output.css" rel="stylesheet">
```

### ✅ Parse UBS Fauna Entries Programmatically

To auto-populate bird data from SFM files:

```javascript
// Pseudo-code: Node.js script to extract bird info from either orig/ or mal/
import fs from 'fs';
const sfmContent = fs.readFileSync('orig/02-09.sfm', 'utf-8'); // or mal/ for Malayalam
const lines = sfmContent.split('\n');
// Parse lines starting with `\` to extract key, title, heb, trl, etc.
```

**Two sources available:**
- **English source** (`orig/`): Use for Strong's numbers, Hebrew transliterations, scientific IDs
- **Malayalam source** (`mal/`): Use for Malayalam translations and commentaries (auto-generated from English via Claude)

Both use identical `\key` structures, so parsing logic is reusable.

---

## Known Constraints

- **Tailwind CDN**: Requires internet; consider pre-generating CSS for offline use
- **GitHub image CDN**: Fallback if local symlink breaks; ensure image URLs match naming convention
- **SFM parsing**: Currently manual; no automated sync between UBS entries (both `orig/` and `mal/`) and bird data
- **Malayalam support**: Font loading from Google works reliably; test offline rendering
- **Paratext project**: `mal/` is a live Paratext 9 project; always re-export or snapshot before major changes

---

## Links & References

- **UBS Fauna Lexicon repo**: https://github.com/tfbf/scripture-resource-studio-app
- **Images endpoint**: `https://raw.githubusercontent.com/tfbf/scripture-resource-studio-app/main/images/`
- **Tailwind CSS 4 docs**: https://tailwindcss.com/ (check for latest syntax changes if upgrading)
