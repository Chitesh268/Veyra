"""Veyra resale-value model trainer.

Trains a tree-ensemble model (Random Forest by default, gradient boosting optional) that predicts RETENTION (resale price / new price) and exports it
as JSON for in-browser inference (public/ml/resale-model.json).

Usage
  python ml/train.py                              # REAL data: ml/car data.csv (Kaggle "Vehicle dataset from CarDekho"), Random Forest
  python ml/train.py --csv "other.csv" --algo gbr # another CSV, or gradient boosting instead
  python ml/train.py --demo                       # synthetic demo data (NOT real sales)
Expected CSV columns: Car_Name, Year, Selling_Price, Present_Price, Kms_Driven, Fuel_Type, Transmission, Owner
(Selling_Price and Present_Price in lakh rupees). Requires: numpy, pandas, scikit-learn.
"""
import argparse, json, math, os
import numpy as np, pandas as pd
from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor
from sklearn.model_selection import KFold, cross_val_predict, train_test_split

FEATURES = ["age", "km_k", "km_per_year_k", "log_price", "diesel", "cng", "electric", "hybrid", "automatic", "owners", "brand_dep", "luxury"]
DEP = {"toyota": .07, "maruti": .08, "suzuki": .08, "mahindra": .08, "honda": .085, "hyundai": .09, "kia": .09, "tata": .10, "skoda": .11, "volkswagen": .11, "vw": .11,
       "mg": .12, "renault": .12, "nissan": .12, "jeep": .12, "citroen": .13, "byd": .14, "ford": .11, "datsun": .13, "fiat": .13, "chevrolet": .12}

def feats(age, km, price, fuel, trans, owners, brand_dep):
    a = max(age, 0.0)
    return [a, km / 1000, km / max(a, 1) / 1000, math.log10(max(price, 1e4)), fuel == "Diesel", fuel == "CNG", fuel == "Electric", fuel == "Hybrid", trans == "Automatic", owners, brand_dep, price > 3e6]

def demo_data(n=9000, seed=7):
    """Synthetic data generated from a transparent depreciation rule + noise. NOT real market data."""
    r = np.random.default_rng(seed); rows, y = [], []
    for _ in range(n):
        price = float(np.exp(r.uniform(math.log(4e5), math.log(1.6e7)))); age = float(r.uniform(0, 14)); kmpy = float(r.uniform(4000, 22000)); km = age * kmpy
        fuel = r.choice(["Petrol", "Diesel", "CNG", "Hybrid", "Electric"], p=[.5, .28, .08, .06, .08]); trans = r.choice(["Manual", "Automatic"], p=[.6, .4]); owners = int(r.choice([1, 2, 3, 4], p=[.6, .25, .1, .05]))
        d = float(r.choice(list(DEP.values())))
        ret = (.85 if price > 3e6 else .88) * (1 - d - (.02 if fuel == "Electric" else 0)) ** age
        ret *= 1 - np.clip((km - 12000 * max(age, 1)) / 10000 * .012, -.12, .15)
        if fuel == "Diesel": ret *= .85 if age > 10 else .92 if age > 8 else 1
        if trans == "Automatic" and fuel != "Electric": ret *= 1.02
        ret *= [1, 1, .95, .9, .85][owners] * r.normal(1, .05)
        rows.append(feats(age, km, price, fuel, trans, owners, d)); y.append(max(.04, ret))
    return np.array(rows, float), np.array(y), "synthetic demo data (generated from a depreciation rule, not real sales)"

def csv_data(path, ref_year):
    df = pd.read_csv(path).dropna(); rows, y = [], []
    for _, x in df.iterrows():
        price = float(x["Present_Price"]) * 1e5; sell = float(x["Selling_Price"]) * 1e5
        if price <= 0 or sell <= 0: continue
        brand = str(x["Car_Name"]).split()[0].lower(); d = DEP.get(brand, .12)
        rows.append(feats(ref_year - int(x["Year"]), float(x["Kms_Driven"]), price, str(x["Fuel_Type"]), str(x["Transmission"]), int(x["Owner"]) + 1, d)); y.append(min(1.2, max(.02, sell / price)))
    return np.array(rows, float), np.array(y), f"real data: {os.path.basename(path)} ({len(y)} rows)"

def make(algo):
    if algo == "gbr": return GradientBoostingRegressor(n_estimators=120, max_depth=4, learning_rate=.08, subsample=.8, min_samples_leaf=5, random_state=1), "GradientBoostingRegressor (120 trees, depth 4)"
    # Monotonic constraints: more age, more kilometres, higher km per year or more owners can never RAISE the predicted value.
    # With only ~300 rows this stops the forest from learning noisy, unrealistic wiggles (e.g. "more km = higher price").
    mono = [-1 if f in ("age", "km_k", "km_per_year_k", "owners") else 0 for f in FEATURES]
    return RandomForestRegressor(n_estimators=100, max_depth=12, min_samples_leaf=2, random_state=1, n_jobs=-1, monotonic_cst=mono), "RandomForestRegressor (100 trees, depth 12, min leaf 2, monotonic in age / km / owners)"

def export(model, algo, meta):
    """Both algorithms are written in one format: prediction = base + lr * sum(tree values).
    Gradient boosting: base = initial constant, lr = learning rate. Random forest: base = 0, lr = 1 / number of trees (i.e. the average)."""
    ests = model.estimators_[:, 0] if algo == "gbr" else model.estimators_
    trees = []
    for est in ests:
        t = est.tree_
        trees.append({"l": t.children_left.tolist(), "r": t.children_right.tolist(), "f": [int(i) if i >= 0 else -1 for i in t.feature], "t": [round(float(v), 4) for v in t.threshold], "v": [round(float(v[0][0]), 5) for v in t.value]})
    base, lr = (float(model.init_.constant_[0][0]), float(model.learning_rate)) if algo == "gbr" else (0.0, 1.0 / len(trees))
    return {"meta": meta, "features": FEATURES, "base": base, "lr": lr, "trees": trees}

if __name__ == "__main__":
    here = os.path.dirname(os.path.abspath(__file__)); default_csv = os.path.join(here, "car data.csv")
    ap = argparse.ArgumentParser(); ap.add_argument("--csv"); ap.add_argument("--demo", action="store_true"); ap.add_argument("--algo", choices=["rf", "gbr"], default="rf"); ap.add_argument("--ref-year", type=int, default=2018, help="year the dataset was collected; age = ref-year - Year")
    ap.add_argument("--out", default=os.path.join(here, "..", "public", "ml", "resale-model.json")); a = ap.parse_args()
    csv = None if a.demo else (a.csv or (default_csv if os.path.exists(default_csv) else None))
    X, y, source = csv_data(csv, a.ref_year) if csv else demo_data()
    price_lakh = 10 ** X[:, 3] / 1e5                       # new price in lakh, to report errors in rupees as well as in retention
    Xtr, Xte, ytr, yte, ptr, pte = train_test_split(X, y, price_lakh, test_size=.2, random_state=1)
    model, algo_name = make(a.algo); model.fit(Xtr, ytr)
    pred = model.predict(Xte); r2 = 1 - ((yte - pred) ** 2).sum() / ((yte - yte.mean()) ** 2).sum(); mae = float(np.abs(yte - pred).mean())
    cvp = cross_val_predict(make(a.algo)[0], X, y, cv=KFold(5, shuffle=True, random_state=1))
    r2_ret = 1 - ((y - cvp) ** 2).sum() / ((y - y.mean()) ** 2).sum()
    r2_price = 1 - (((y - cvp) * price_lakh) ** 2).sum() / (((y * price_lakh) - (y * price_lakh).mean()) ** 2).sum(); mae_lakh = float(np.abs((y - cvp) * price_lakh).mean())
    res = (yte - pred) / np.maximum(pred, .02); final, _ = make(a.algo); final.fit(X, y)   # the exported model uses every row
    fuels = ["Petrol", "Diesel", "CNG"] if csv else ["Petrol", "Diesel", "CNG", "Hybrid", "Electric"]
    meta = {"source": source, "rows": int(len(y)), "real": bool(csv), "r2_holdout": round(float(r2), 4), "r2_cv5": round(float(r2_ret), 4), "mae_retention": round(mae, 4), "resid_lo": round(float(np.quantile(res, .05)), 4), "resid_hi": round(float(np.quantile(res, .95)), 4),
            "importances": {f: round(float(v), 4) for f, v in zip(FEATURES, final.feature_importances_)}, "algorithm": algo_name, "target": "retention = resale price / new price", "r2_price_cv5": round(float(r2_price), 4), "mae_lakh_cv5": round(mae_lakh, 3), "fuels": fuels}
    out = export(final, a.algo, meta); os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True); json.dump(out, open(a.out, "w"), separators=(",", ":"))
    # reference vectors so the browser implementation can be verified against scikit-learn
    rs = np.random.default_rng(3); idx = rs.choice(len(X), 30, replace=False); json.dump([{"x": X[i].tolist(), "y": float(final.predict(X[i:i+1])[0])} for i in idx], open(os.path.join(here, "reference.json"), "w"))
    print(f"source: {source}\nalgorithm: {algo_name}\nhold-out R2 (retention)={r2:.3f}  5-fold CV: R2 retention={r2_ret:.3f}, R2 price={r2_price:.3f}, MAE={mae_lakh:.2f} lakh")
    print("importances:", sorted(meta["importances"].items(), key=lambda kv: -kv[1])[:6]); print("wrote", os.path.abspath(a.out), f"({os.path.getsize(a.out)//1024} KB)")
