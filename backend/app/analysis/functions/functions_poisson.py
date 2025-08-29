import pandas as pd
import statsmodels.formula.api as smf
import numpy as np
from scipy.stats import poisson
from collections import Counter

# used in poisson.py
def estandarizar_columnas_futbol(df: pd.DataFrame) -> pd.DataFrame:
    return df.rename(columns={
        'FTHG': 'goles_local',
        'FTAG': 'goles_visitante',
        'HS': 'tiros_local',
        'AS': 'tiros_visitante',
        'HST': 'tiros_arco_local',
        'AST': 'tiros_arco_visitante',
        'HC': 'corners_local',
        'AC': 'corners_visitante',
        'HF': 'faltas_local',
        'AF': 'faltas_visitante',
        'HY': 'amarillas_local',
        'AY': 'amarillas_visitante',
        'HR': 'rojas_local',
        'AR': 'rojas_visitante'
    })

def calcular_probabilidades_resultado(goles_local_esp: float, goles_visitante_esp: float, max_goles: int = 5):
    prob_1 = 0.0  # local gana
    prob_X = 0.0  # empate
    prob_2 = 0.0  # visitante gana

    for goles_local in range(0, max_goles + 1):
        for goles_visitante in range(0, max_goles + 1):
            p_local = poisson.pmf(goles_local, goles_local_esp)
            p_visit = poisson.pmf(goles_visitante, goles_visitante_esp)
            prob = p_local * p_visit

            if goles_local > goles_visitante:
                prob_1 += prob
            elif goles_local == goles_visitante:
                prob_X += prob
            else:
                prob_2 += prob

    total = prob_1 + prob_X + prob_2
    return {
        "local": round(prob_1 * 100, 2),
        "empate": round(prob_X * 100, 2),
        "visita": round(prob_2 * 100, 2),
        "check_total": round(total * 100, 2)
    }

# used in poisson.py
def simular_resultados_monte_carlo(goles_local_esp: float, goles_visitante_esp: float, n_simulaciones: int = 10000):
    resultados = []

    for _ in range(n_simulaciones):
        g_local = poisson.rvs(goles_local_esp)
        g_visit = poisson.rvs(goles_visitante_esp)

        if g_local > g_visit:
            resultado = "1"
        elif g_local == g_visit:
            resultado = "X"
        else:
            resultado = "2"
        
        resultados.append((g_local, g_visit, resultado))

    # Contar frecuencias
    conteo_score = Counter((g, v) for g, v, _ in resultados)
    conteo_resultado = Counter(r for _, _, r in resultados)

    return conteo_resultado, conteo_score

# used in poisson.py
def matriz_score_exacto(goles_local_esp: float, goles_visitante_esp: float, max_goles: int = 5):
    matriz = pd.DataFrame(index=range(max_goles+1), columns=range(max_goles+1))

    for g_local in range(max_goles+1):
        for g_visit in range(max_goles+1):
            p = poisson.pmf(g_local, goles_local_esp) * poisson.pmf(g_visit, goles_visitante_esp)
            matriz.loc[g_local, g_visit] = round(p * 100, 2)

    matriz.index.name = "Goles Local"
    matriz.columns.name = "Goles Visitante"
    return matriz

# used in poisson.py
def entrenar_modelo_poisson(df: pd.DataFrame, target: str, equipo: str, correlacion_umbral: float = 0.95):
    columnas = [ f"goles_{equipo}",
        f"tiros_{equipo}", f"tiros_arco_{equipo}",
        f"corners_{equipo}", f"faltas_{equipo}",
        f"amarillas_{equipo}", f"rojas_{equipo}"
    ]
    
    # 1. Columnas existentes y con más de un valor único
    columnas_existentes = [col for col in columnas if col in df.columns and df[col].nunique() > 1]

    if len(df) < 5:
        raise ValueError(f"⚠️ Muy pocos datos para entrenar modelo Poisson: {len(df)} filas.")

    if not columnas_existentes:
        raise ValueError(f"⚠️ Todas las variables del equipo '{equipo}' son constantes o faltan en el dataset.")

    # 2. Eliminar colineales (correlación > umbral)
    df_sub = df[columnas_existentes].copy()
    correlacion = df_sub.corr().abs()
    upper = correlacion.where(np.triu(np.ones(correlacion.shape), k=1).astype(bool))
    to_drop = [column for column in upper.columns if any(upper[column] > correlacion_umbral)]
    columnas_finales = [col for col in columnas_existentes if col not in to_drop]

    if not columnas_finales:
        raise ValueError(f"❌ No quedan variables tras eliminar colineales para equipo '{equipo}'.")

    # 3. Crear fórmula y entrenar
    formula = f"{target} ~ " + " + ".join(columnas_finales)
    print(f"📌 Fórmula Poisson para {equipo}: {formula}")
    print(f"📊 Variables utilizadas: {columnas_finales}")
    print(f"📊 Total de partidos: {len(df)}")

    try:
        modelo = smf.poisson(formula=formula, data=df).fit(disp=0)
    except np.linalg.LinAlgError:
        raise ValueError(f"❌ Error: matriz singular al entrenar Poisson para '{equipo}'. Revisa correlaciones o datos nulos.")

    return modelo

# used in poisson.py
def predecir_goles(modelo, datos_partido: dict, equipo: str):
    entrada = {
        f"goles_{equipo}": datos_partido[f"goles_{equipo}"],
        f"tiros_{equipo}": datos_partido[f"tiros_{equipo}"],
        f"tiros_arco_{equipo}": datos_partido[f"tiros_arco_{equipo}"],
        f"corners_{equipo}": datos_partido[f"corners_{equipo}"],
        f"faltas_{equipo}": datos_partido[f"faltas_{equipo}"],
        f"amarillas_{equipo}": datos_partido[f"amarillas_{equipo}"],
        f"rojas_{equipo}": datos_partido[f"rojas_{equipo}"],
    }

    df = pd.DataFrame([entrada])
    return modelo.predict(df)[0]