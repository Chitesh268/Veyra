# Veyra — Automotive Intelligence

Veyra is a React + TypeScript + Vite, local-first automotive web app designed to run without a paid backend or paid API. It is an evolving prototype, not a live vehicle marketplace.

## What's included (v1.4)

- **Resale value (machine learning)**: a Random Forest trained on **real data** (301 CarDekho used-car listings, `ml/car data.csv`) predicts the resale value from the exact variant, age, kilometres, fuel, gearbox and owners, in the browser with no backend. Shows a range, a 5-year forecast, "what moves your price" and feature importance.
- **Discover cars (CarWale-style)**: price range filter (on-road or ex-showroom), brand/fuel/body/gearbox filters. Each car opens a full page with a photo gallery, overview, every variant, specifications, features, price breakup with EMI, and similar cars. Each variant has its own page with a full feature list.
- **Car match**: 8-question quiz that ranks cars with a match score and reasons.
- **Engine explorer**: animated engine cutaway (pistons, valves, spark/injection, turbo, hybrid and EV energy flow) with speed control, plus power/torque curves.
- **Mechanic**: 25 step-by-step guides with built-in diagrams, an AI **photo helper** (upload a dashboard light, tyre or leak) and an offline warning-light guide.
- **AI pilot**: when online it searches the web (Wikipedia, plus Tavily if you add a key) and answers with an LLM, citing sources. Offline it uses built-in knowledge.
- Also: Financial planner, Ownership costs (with insurance calculation), Compare cars. Theme: light beige, dark brown, olive.

## Machine learning (resale)

```bash
pip install -r ml/requirements.txt
python ml/train.py                      # trains a Random Forest on ml/car data.csv and writes public/ml/resale-model.json
python ml/train.py --algo gbr           # same data, gradient boosting instead
python ml/train.py --demo               # synthetic demo data only (NOT real sales)
```
- **Data**: Kaggle "Vehicle dataset from CarDekho" (301 rows, collected around 2018). Age is measured as `2018 - Year`, so it means the same thing as the "age" the app computes today.
- **Target**: retention (resale price / new price), so the model also works for expensive cars. It is multiplied back by the variant's new price.
- **Model**: Random Forest, 100 trees, depth 12, with monotonic constraints (more age, kilometres or owners can never raise the value), so a small dataset cannot produce silly what-if results.
- **Accuracy (5-fold cross-validation)**: R² 0.97 on resale price and an average error of about 0.5 lakh. On the stricter "% of new price retained" measure R² is about 0.77; the Resale page shows both.
- **Browser inference**: the forest is exported as JSON and `src/ml.ts` walks the trees. `ml/reference.json` holds scikit-learn outputs that match the browser results.
- **Limits**: only petrol, diesel and CNG cars are in the data. Hybrids and EVs fall back to a simple depreciation rule and the page says so. Almost all cars have one owner, so the owner effect is weak. Condition and accident history are fixed adjustments, not learned. There are no live market prices.

## AI pilot, photo helper and web search

Settings (gear icon in AI pilot) choose the provider: a free OpenAI-compatible endpoint by default (third-party, may be slow or unavailable), or any OpenAI-compatible endpoint or Anthropic Claude with your own key. Photo analysis needs a vision-capable model. Keys stay in your browser. For broader live web search add a free Tavily key.

## Data and accuracy

- `src/data/catalog.ts`: 110 models, 22 brands, about 650 named variants (petrol, diesel, CNG, hybrid, electric). Model price ranges and specs are entered from public sources and are indicative. **Variant prices are estimated** inside each model's range, and **variant feature lists are estimated** from the variant's place in the trim ladder plus the model's top-variant equipment (`src/data/features.ts`). Confirm with the dealer or brochure.
- Photos load at runtime from Wikipedia and Wikimedia Commons, validated against the car's name, with attribution. They are representative and may show a different model year.
- Engine curves and the cutaway animation are illustrative, built from published peak figures.

## Run locally in VS Code

1. Install the current Node.js LTS release.
2. Extract the ZIP.
3. In VS Code, choose **File → Open Folder** and select the `veyra` folder (the one containing `package.json`).
4. Open **Terminal → New Terminal**.
5. Run:

```bash
npm install
npm run dev
```

6. Open the local URL printed by Vite, usually `http://localhost:5173`.

To run the production build locally:

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

1. Create a GitHub repository, for example `veyra`.
2. Push the contents of this project to the repository's `main` branch.
3. In repository **Settings → Pages**, select **GitHub Actions** as the build/deployment source.
4. The included workflow installs dependencies, builds the app and deploys the `dist` folder.

Vite is configured with `base: "./"` so assets use relative paths on a GitHub Pages repository URL.

## Suggested next development milestones

1. Replace demonstration catalogue data with a sourced, versioned India vehicle dataset and provenance for each field.
2. Add verified model-specific photos with appropriate usage rights and local fallbacks.
3. Train and evaluate a used-car model on a lawful, documented dataset; report MAE/RMSE and keep a held-out test set.
4. Add detailed ownership timelines, reminders and export/import backup for local records.
5. Build a retrieval-backed assistant from curated automotive documents; a truly generative local model will be optional and device-dependent.
6. Add PWA/offline support and accessibility testing.

## Tech stack

- React 18 + TypeScript
- Vite 6
- lucide-react icons
- CSS responsive layout
- Browser LocalStorage for personal records
