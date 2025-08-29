import pandas as pd
import hashlib
import os
import joblib
import numpy as np

from datetime import datetime
from pathlib import Path
from app.analysis.functions import get_data
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import accuracy_score, mean_squared_error
from sklearn.model_selection import train_test_split

# used in verificar_o_entrenar_modelos_estadisticos
def preparar_dataset_estadistico(df: pd.DataFrame) -> pd.DataFrame:
    """
    Prepara un DataFrame con variables estadísticas renombradas y agrega columnas objetivo:
    - resultado (FT)
    - ambos_marcan (FT)
    - resultado_ht (HT)
    - ambos_marcan_ht (HT)
    """
    columnas = [
        "FTHG", "FTAG", "HTHG", "HTAG", "HS", "AS", "HST", "AST",
        "HC", "AC", "HF", "AF", "HY", "AY", "HR", "AR"
    ]

    df = df.copy()

    for col in columnas:
        if col not in df.columns:
            print(f"❌ FALTA COLUMNA: {col}")

    df = df[columnas]

    df.columns = [
        "goles_local", "goles_visitante",
        "goles_ht_local", "goles_ht_visitante",
        "tiros_local", "tiros_visitante",
        "tiros_arco_local", "tiros_arco_visitante",
        "corners_local", "corners_visitante",
        "faltas_local", "faltas_visitante",
        "amarillas_local", "amarillas_visitante",
        "rojas_local", "rojas_visitante"
    ]

    # Objetivos FT
    df["ambos_marcan"] = (df["goles_local"] > 0) & (df["goles_visitante"] > 0)
    df["ambos_marcan"] = df["ambos_marcan"].astype(int)

    df["resultado"] = df.apply(
        lambda row: 1 if row["goles_local"] > row["goles_visitante"]
        else -1 if row["goles_local"] < row["goles_visitante"]
        else 0,
        axis=1
    )

    # Objetivos HT
    df["ambos_marcan_ht"] = (df["goles_ht_local"] > 0) & (df["goles_ht_visitante"] > 0)
    df["ambos_marcan_ht"] = df["ambos_marcan_ht"].astype(int)

    df["resultado_ht"] = df.apply(
        lambda row: 1 if row["goles_ht_local"] > row["goles_ht_visitante"]
        else -1 if row["goles_ht_local"] < row["goles_ht_visitante"]
        else 0,
        axis=1
    )

    print("✅ Dataset preparado con shape:", df.shape)
    return df

# used in verificar_o_entrenar_modelos_estadisticos
def entrenar_modelos_individuales(df: pd.DataFrame) -> dict:
    modelos = {}

    objetivo_cols = [
        "resultado", "ambos_marcan",
        "resultado_ht", "ambos_marcan_ht",
        "goles_local", "goles_visitante",
        "corners_local", "corners_visitante",
        "amarillas_local", "amarillas_visitante",
        "rojas_local", "rojas_visitante",
        "tiros_arco_local", "tiros_arco_visitante"
    ]

    # Avisar si faltan columnas objetivo
    missing = [col for col in objetivo_cols if col not in df.columns]
    if missing:
        print(f"Faltan columnas objetivo y se omiten: {missing}")

    # Construir X excluyendo solo las columnas que existen
    X = df.drop(columns=[c for c in objetivo_cols if c in df.columns], errors="ignore")
    if X.empty:
        print("No hay features disponibles para entrenar.")
        return modelos

    # Dividir índices para concordancia entre X e y
    train_idx, test_idx = train_test_split(X.index, test_size=0.2, random_state=42, shuffle=True)

    # Clasificadores
    clasificadores = {
        "resultado": "🎯",
        "ambos_marcan": "✅",
        "resultado_ht": "⏱️",
        "ambos_marcan_ht": "⏱️"
    }

    for objetivo, icono in clasificadores.items():
        if objetivo not in df.columns:
            continue
        y_train_full = df.loc[train_idx, objetivo]
        y_test_full = df.loc[test_idx, objetivo]

        # Filtrar NaN
        mask_train = y_train_full.notna()
        mask_test = y_test_full.notna()

        y_train = y_train_full[mask_train]
        y_test = y_test_full[mask_test]
        X_train = X.loc[train_idx[mask_train.values]]
        X_test = X.loc[test_idx[mask_test.values]]

        if y_train.empty or y_test.empty:
            print(f"{icono} No hay datos válidos para '{objetivo}', se omite.")
            continue
        if y_train.nunique() < 2:
            print(f"{icono} '{objetivo}' tiene una sola clase en entrenamiento ({y_train.unique()}); se omite.")
            continue

        clf = RandomForestClassifier(n_estimators=100, random_state=42)
        try:
            clf.fit(X_train, y_train)
            if not X_test.empty and not y_test.empty:
                acc = accuracy_score(y_test, clf.predict(X_test))
                print(f"{icono} Accuracy {objetivo}: {acc:.2f}")
            else:
                print(f"{icono} Clasificador '{objetivo}' entrenado sin validación válida.")
            modelos[objetivo] = clf
        except Exception as e:
            print(f"{icono} Error al entrenar '{objetivo}': {e}")

    # Regresores
    regresiones = [
        "goles_local", "goles_visitante",
        "corners_local", "corners_visitante",
        "amarillas_local", "amarillas_visitante",
        "rojas_local", "rojas_visitante",
        "tiros_arco_local", "tiros_arco_visitante"
    ]

    for target in regresiones:
        if target not in df.columns:
            continue
        y_train_full = df.loc[train_idx, target]
        y_test_full = df.loc[test_idx, target]

        mask_train = y_train_full.notna()
        mask_test = y_test_full.notna()

        y_train = y_train_full[mask_train]
        y_test = y_test_full[mask_test]
        X_train = X.loc[train_idx[mask_train.values]]
        X_test = X.loc[test_idx[mask_test.values]]

        if y_train.empty or y_test.empty:
            print(f"📈 No hay datos válidos para '{target}', se omite.")
            continue

        reg = RandomForestRegressor(n_estimators=100, random_state=42)
        try:
            reg.fit(X_train, y_train)
            if not X_test.empty and not y_test.empty:
                mse = mean_squared_error(y_test, reg.predict(X_test))
                print(f"📈 MSE {target}: {mse:.2f}")
            else:
                print(f"📈 Regresor '{target}' entrenado sin validación válida.")
            modelos[target] = reg
        except Exception as e:
            print(f"📈 Error al entrenar '{target}': {e}")

    if not modelos:
        print("No se entrenó ningún modelo: faltaban datos válidos para todos los objetivos.")

    return modelos

BASE_DIR = Path(__file__).resolve().parent.parent
MODELOS_DIR = BASE_DIR / "storage" / "predict"
MODELOS_DIR.mkdir(parents=True, exist_ok=True)

# used in verificar_o_entrenar_modelos_estadisticos
def get_model_path(equipo_1, equipo_2, liga):
    clave = f"{liga}_{equipo_1}_{equipo_2}".lower().replace(" ", "_")
    hash_id = hashlib.md5(clave.encode()).hexdigest()[:8]
    return MODELOS_DIR / f"modelo_{clave}_{hash_id}.pkl"

# used in predictions.py
async def verificar_o_entrenar_modelos_estadisticos(equipo_1, equipo_2, liga):
    modelo_path = get_model_path(equipo_1, equipo_2, liga)
    csv_mtime = get_data.obtener_fecha_ultima_modificacion_csv(liga)  # 🔄 usa esta

    if modelo_path.exists():
        modelo_mtime = os.path.getmtime(modelo_path)
        if modelo_mtime > csv_mtime:
            try:
                modelos = joblib.load(modelo_path)["modelos"]
                print(f"🔁 Modelos cargados (sin necesidad de reentrenar): {modelo_path.name}")
                return modelos
            except Exception as e:
                print(f"❌ Error al cargar modelos: {e}")

    # Si no existe el modelo o el CSV fue actualizado: reentrena
    df_liga = await get_data.leer_y_filtrar_csv(liga)
    partidos_equipo_1 = get_data.filtrar_ultimos_partidos_de_equipo(df_liga, equipo_1, limite=40)
    partidos_equipo_2 = get_data.filtrar_ultimos_partidos_de_equipo(df_liga, equipo_2, limite=40)
    partidos = partidos_equipo_1 + partidos_equipo_2

    if partidos.empty:
        print("⚠️ No hay partidos entre los equipos.")
        return None

    df = preparar_dataset_estadistico(pd.DataFrame(partidos))
    modelos = entrenar_modelos_individuales(df)
    joblib.dump({"modelos": modelos}, modelo_path)
    print(f"✅ Modelos entrenados y guardados: {modelo_path.name}")
    return modelos

# used in predictions.py
def predecir_estadisticas_partido(modelos: dict, datos_partido: dict) -> dict:
    df = pd.DataFrame([datos_partido])

    predicciones = {}

    # Clasificadores
    if "resultado" in modelos:
        df_resultado = df[modelos["resultado"].feature_names_in_]
        predicciones["resultado"] = modelos["resultado"].predict(df_resultado)[0]

    if "ambos_marcan" in modelos:
        df_ambos = df[modelos["ambos_marcan"].feature_names_in_]
        predicciones["prob_ambos_marcan"] = modelos["ambos_marcan"].predict_proba(df_ambos)[0][1]

    if "resultado_ht" in modelos:
        df_res_ht = df[modelos["resultado_ht"].feature_names_in_]
        predicciones["resultado_ht"] = modelos["resultado_ht"].predict(df_res_ht)[0]

    if "ambos_marcan_ht" in modelos:
        df_ambos_ht = df[modelos["ambos_marcan_ht"].feature_names_in_]
        predicciones["prob_ambos_marcan_ht"] = modelos["ambos_marcan_ht"].predict_proba(df_ambos_ht)[0][1]

    # Regresores
    for variable in modelos:
        if variable in ["resultado", "ambos_marcan", "resultado_ht", "ambos_marcan_ht"]:
            continue
        df_target = df[modelos[variable].feature_names_in_]
        predicciones[variable] = modelos[variable].predict(df_target)[0]

    return predicciones