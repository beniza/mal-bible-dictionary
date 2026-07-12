 # Agent Instructions for Biblical Aviary Explorer

## Project Overview

**Biblical Aviary Explorer** is an interactive, single-page web application that explores unclean birds mentioned in Leviticus 11:13–19 and Deuteronomy 14:12–18. It provides detailed biblical scholarship with:

- 8 Bible translations (4 Malayalam, 4 English) with side-by-side verse comparison
- 18 bird species with Hebrew etymologies, scientific identifications, and Malayalam translation notes
- Interactive categorization (Predators, Night Dwellers, Water Fowls, Other)
- A classification dashboard explaining ancient Hebrew bird taxonomy
- Discussion of translation challenges and cultural equivalencies

**Tech Stack**: Vanilla HTML/CSS/JavaScript + Tailwind CSS + Chart.js + Google Fonts (Noto Sans/Serif Malayalam)

**Language**: Malayalam primary UI + English supplementary content

---

## Architecture & File Structure

```
biblical_aviary_explorer.html   # Single-file SPA (55KB)
verse-tabs.test.mjs              # Node test file (validates verse structure)
```

### HTML Structure Conventions

- **Sections**: `<section id="verses">`, `<section id="dashboard">`, `<section id="explorer">`, `<section id="pitfalls">`
- **Navigation**: sticky navbar with anchor links to main sections
- **Glass-card pattern**: `.glass-card` class for semi-transparent panels with backdrop blur
- **Malayalam text**: Uses `class="serif"` for serif font (Noto Serif Malayalam), `lang="ml"` where applicable
- **Interactive elements**: Tabs use `data-verse-tab` / `data-verse-panel` attributes for switching between Leviticus (LEV) and Deuteronomy (DEU) passages

---

## Data Model

### Bird Data Object

```javascript
{
  id: "H5404",                                    // Strong's Hebrew concordance number
  heb: "നെഷെർ (Nesher)",                        // Hebrew name in Malayalam script + transliteration
  eng: "Eagle / Vulture",                         // Traditional English rendering
  ident: "യൂറേഷ്യൻ ഗ്രിഫൻ കഴുകൻ (Griffon Vulture)",  // Modern scientific identification
  mal: "കഴുകൻ / കടൽറാഞ്ചൻ",                    // How this bird appears in Malayalam Bible translations
  cat: "ശവംതീനികൾ",                            // Category for filtering
  note: "വേരുവാക്കിൻ്റെ അർത്ഥം '...'..."        // Etymology and scholarly context
}
```

**Categories** (filter buttons in explorer):
- `"ശവംതീനികൾ"` — Predators (carrion-eaters, raptors)
- `"രാത്രിഞ്ചരന്മാർ"` — Night Dwellers (owls, creatures of darkness)
- `"നീർപ്പക്ഷികൾ"` — Water Fowls (aquatic birds)
- `"മറ്റു പറവകൾ"` — Other (ravens, hoopoe, bat)

---

## Key JavaScript Functions

### Verse Tab Switching
```javascript
switchVerseTab(button, book)  // book = 'lev' or 'deu'
```
- Toggles between Leviticus and Deuteronomy passages in each translation card
- Updates `aria-selected`, `.active` class, `hidden` attribute on panels
- Called by inline `onclick` handlers on tab buttons

### Bird Filtering & Display
```javascript
filterBirds(category)        // Accepts category string or 'all'
renderBirds(data)            // Renders bird grid from data array
```
- Dynamically generates bird cards in `#birdGrid`
- Each card displays Hebrew name, scientific ID, Malayalam translation, and scholarly note

### Chart Initialization
```javascript
initChart()                  // Initializes Chart.js doughnut chart
```
- Shows category distribution (5 predators, 4 night dwellers, 6 water fowls, 3 other)
- Uses Malayalam labels and custom fonts

---

## Common Tasks

### ✅ Add a New Bible Translation

1. **Add translation card** in the `#verses` section:
   ```html
   <div class="glass-card verse-card p-6 rounded-2xl" data-translation="ABBR">
       <div class="mb-4 inline-flex rounded-full bg-stone-100 p-1" role="tablist">
           <button id="ABBR-tab-lev" class="verse-tab" data-verse-tab="lev" onclick="switchVerseTab(this, 'lev')">LEV 11:13-19</button>
           <button id="ABBR-tab-deu" class="verse-tab active" data-verse-tab="deu" onclick="switchVerseTab(this, 'deu')">DEU 14:12-18</button>
       </div>
       <div>
           <p id="ABBR-panel-lev" data-verse-panel="lev" hidden>Leviticus text...</p>
           <p id="ABBR-panel-deu" data-verse-panel="deu">Deuteronomy text...</p>
       </div>
   </div>
   ```
2. **Update test** in `verse-tabs.test.mjs`: Add abbreviation to `translations` array and verify counts match (8 translations = 8 LEV tabs, 8 DEU tabs, etc.)

### ✅ Add a New Bird Species

1. **Add object to `birdData` array**:
   ```javascript
   { id: "H####", heb: "...", eng: "...", ident: "...", mal: "...", cat: "...", note: "..." }
   ```
2. **Update chart data** in `initChart()` if category counts change
3. Chart shows only the 4 main categories; if adding a bird to existing category, no chart changes needed

### ✅ Modify Styling

- **Color scheme**: CSS custom properties in `:root` (`--paper`, `--ink`, `--accent`, `--highlight`)
- **Fonts**: Tailwind utilities; `.serif` class uses Noto Serif Malayalam
- **Layout**: Tailwind grid system (`grid-cols-1 lg:grid-cols-2`, etc.)
- **Glass morphism**: `.glass-card` uses backdrop blur; adjust opacity/blur in CSS

### ✅ Update Verse Text

- Find the relevant `data-translation="ABBR"` card
- Edit the `<p>` with `data-verse-panel="lev"` or `data-verse-panel="deu"`
- Preserve Malayalam text encoding (UTF-8); test by opening in browser

### ✅ Adjust Category Filter Buttons

- **To add a category**: Add `<button onclick="filterBirds('NEW_CAT')">Label</button>` to `#categoryFilters` and add birds with `"cat": "NEW_CAT"`
- **To rename a category**: Find-replace all occurrences of old category name in both HTML buttons and bird data objects

---

## Testing

**Test file**: `verse-tabs.test.mjs` (Node.js, no external test framework)

**Run tests**:
```bash
node verse-tabs.test.mjs
```

**What it checks**:
- All 8 translation cards exist with correct `data-translation` attributes
- All 8 translations have 1 LEV tab and 1 DEU tab (16 tabs total each)
- All 8 translations have matching panels (16 panels total each)
- `switchVerseTab()` function is defined
- BSI OV card contains both Leviticus and Deuteronomy Malayalam text

**To add new tests**: Use Node.js `test()` and `assert.match()` / `assert.equal()` on the HTML string. Check line/element counts with regex.

---

## Common Pitfalls

### ⚠️ Malayalam Encoding
- File must be UTF-8 encoded; if Malayalam text appears as garbled characters, check encoding in editor
- Use `<meta charset="UTF-8">` in `<head>` (already present)

### ⚠️ Tab Activation Logic
- `onclick="switchVerseTab(this, 'lev')"` passes the button itself; the function finds its parent card with `.closest('.verse-card')`
- If a new translation card is added outside this structure, tab switching will fail
- Ensure each translation card has `class="verse-card"`

### ⚠️ Chart Category Naming
- Category labels in `initChart()` must match exact category strings in bird data (case-sensitive)
- The chart hardcodes counts `[5, 4, 6, 3]`; if adding birds, update these numbers

### ⚠️ Bird Card Rendering
- `renderBirds()` empties `#birdGrid` and rebuilds; all filtering is done in JavaScript, not CSS
- If HTML structure changes, check that `document.getElementById('birdGrid')` still points to the correct element

---

## Styling & Layout Conventions

| Pattern | Example | Usage |
|---------|---------|-------|
| `.glass-card` | Verse cards, bird cards | Semi-transparent panel with blur effect |
| `.serif` | Headings, Malayalam text | Noto Serif Malayalam font |
| `.category-btn.active` | Active filter button | Accent background color |
| `.bird-card:hover` | Hover on bird card | Subtle lift + shadow animation |
| `.verse-tab.active` | Active verse tab | White background, accent text color |

---

## Performance Notes

- **Single file**: No build step required; open `.html` in browser directly
- **External CDNs**: Tailwind CSS, Chart.js, Google Fonts (requires internet connection)
- **Bird data**: Hardcoded in `<script>` (18 birds = ~3KB); no API calls
- **Chart**: Rendered once on page load; re-renders only if chart data changes

---

## Future Extensions

**Natural next steps** (if project grows):

1. **Add Hebrew etymologies**: Expand `note` field or create a modal for deeper linguistic analysis
2. **Export/share**: Add button to generate PDF or JSON export of a filtered bird list
3. **Compare translations**: Side-by-side highlight of differing Malayalam terms for the same bird
4. **Dark mode**: Toggle between light and dark themes using CSS custom properties
5. **Multilingual UI**: Localize buttons and section headers (currently Malayalam + English mixed)
6. **Search**: Add text search across Hebrew names, English translations, Malayalam terms
7. **External sources**: Link to Strong's Concordance, BibleHub, scientific databases for each bird
8. **Taxonomy map**: Show relationships between bird categories in a visual tree or network

---

## Contact & Scope

This is a **hobby/educational project** focused on biblical scholarship and Malayalam Bible translation studies. Scope is intentionally narrow: compare unclean birds across translations, provide etymologies, explain translation decisions.

**Not in scope**: Comparative theology, dietary law debates, ornithological treatises (though all welcome as enrichment).
