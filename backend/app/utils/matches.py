import pandas as pd
import numpy as np

from pathlib import Path
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from app.core.state import state
from app.utils.model_storage import guardar_modelo, cargar_modelo_predictivo, guardar_modelo_predictivo
from app import crud
from sqlalchemy.ext.asyncio import AsyncSession

# analisis estadistico
def analizar_estadisticas(partidos: List[Dict[str, Any]]) -> Dict[str, Any]:
    resumen = {
        "total_partidos": len(partidos),
        "goles_local": 0,
        "goles_visitante": 0,
        "corners_local": 0,
        "corners_visitante": 0,
        "tarjetas_amarillas_local": 0,
        "tarjetas_amarillas_visitante": 0,
        "tarjetas_rojas_local": 0,
        "tarjetas_rojas_visitante": 0,
        "victorias_local": 0,
        "victorias_visitante": 0,
        "empates": 0,
        "total_tiros_local": 0,
        "total_tiros_visitante": 0,
        "tiros_arco_local": 0,
        "tiros_arco_visitante": 0,
        "faltas_local": 0,
        "faltas_visitante": 0,
        "goles_ht_local": 0,
        "goles_ht_visitante": 0,
        "victorias_ht_local": 0,
        "victorias_ht_visitante": 0,
        "empates_ht": 0,
    }

    for partido in partidos:
        est = partido.estadisticas  # Si es un ORM object
        resumen["goles_local"] += est.FTHG
        resumen["goles_visitante"] += est.FTAG

        resumen["corners_local"] += est.HC
        resumen["corners_visitante"] += est.AC

        resumen["tarjetas_amarillas_local"] += est.HY
        resumen["tarjetas_amarillas_visitante"] += est.AY

        resumen["tarjetas_rojas_local"] += est.HR
        resumen["tarjetas_rojas_visitante"] += est.AR

        resumen["total_tiros_local"] += est.HS
        resumen["total_tiros_visitante"] += est.AS_

        resumen["tiros_arco_local"] += est.HST
        resumen["tiros_arco_visitante"] += est.AST

        resumen["faltas_local"] += est.HF
        resumen["faltas_visitante"] += est.AF

        resumen["goles_ht_local"] += est.HTHG
        resumen["goles_ht_visitante"] += est.HTAG

        if est.FTR == "H":
            resumen["victorias_local"] += 1
        elif est.FTR == "A":
            resumen["victorias_visitante"] += 1
        elif est.FTR == "D":
            resumen["empates"] += 1

        if est.HTR == "H":
            resumen["victorias_ht_local"] += 1
        elif est.HTR == "A":
            resumen["victorias_ht_visitante"] += 1
        elif est.HTR == "D":
            resumen["empates_ht"] += 1

    return resumen

# k-means
def preparar_dataset_para_kmeans(partidos):
    datos = []

    for p in partidos:
        est = p.estadisticas
        datos.append({
            "goles_local": est.FTHG,
            "goles_visitante": est.FTAG,
            "goles_ht_local": est.HTHG,
            "goles_ht_visitante": est.HTAG,
            "tiros_local": est.HS,
            "tiros_visitante": est.AS_,
            "tiros_arco_local": est.HST,
            "tiros_arco_visitante": est.AST,
            "corners_local": est.HC,
            "corners_visitante": est.AC,
            "faltas_local": est.HF,
            "faltas_visitante": est.AF,
            "amarillas_local": est.HY,
            "amarillas_visitante": est.AY,
            "rojas_local": est.HR,
            "rojas_visitante": est.AR
        })

    df = pd.DataFrame(datos)
    return df

def aplicar_kmeans(df: pd.DataFrame, n_clusters: int = 3):
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(df)

    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init='auto')
    df['cluster'] = kmeans.fit_predict(X_scaled)

    return df, kmeans

def describir_clusters_avanzado(df_clusterizado: pd.DataFrame) -> dict:
    descripciones = {}

    total_clusters = df_clusterizado["cluster"].nunique()

    for cluster_id in range(total_clusters):
        df = df_clusterizado[df_clusterizado["cluster"] == cluster_id]
        cantidad_partidos = len(df)

        # Goles
        promedio_goles_local = df["goles_local"].mean()
        promedio_goles_visitante = df["goles_visitante"].mean()
        promedio_total_goles = promedio_goles_local + promedio_goles_visitante

        # Medio tiempo
        promedio_goles_ht_local = df["goles_ht_local"].mean()
        promedio_goles_ht_visitante = df["goles_ht_visitante"].mean()
        promedio_total_goles_ht = promedio_goles_ht_local + promedio_goles_ht_visitante

        # Tiros al arco medio tiempo
        promedio_tiros_arco_local = df["tiros_arco_local"].mean()
        promedio_tiros_arco_visitante = df["tiros_arco_visitante"].mean()
        promedio_tiros_arco_total = promedio_tiros_arco_local + promedio_tiros_arco_visitante

        # Empates
        empates = df[df["goles_local"] == df["goles_visitante"]].shape[0]
        porcentaje_empates = round((empates / cantidad_partidos) * 100, 1)

        # Goleadas
        goleadas_local = df[(df["goles_local"] - df["goles_visitante"]) >= 3].shape[0]
        goleadas_visitante = df[(df["goles_visitante"] - df["goles_local"]) >= 3].shape[0]

        # Intensidad ofensiva total
        tiros_total = df["tiros_local"] + df["tiros_visitante"]
        promedio_tiros_total = tiros_total.mean()

        # Juego físico
        faltas_total = df["faltas_local"] + df["faltas_visitante"]
        tarjetas_total = (
            df["amarillas_local"] + df["amarillas_visitante"] +
            df["rojas_local"] + df["rojas_visitante"]
        )
        promedio_faltas = faltas_total.mean()
        promedio_tarjetas = tarjetas_total.mean()

        # Descripción inicial
        descripcion = f"📊 Este clúster contiene {cantidad_partidos} partidos. "

        # Dominio en el marcador
        if promedio_goles_local > promedio_goles_visitante + 1:
            descripcion += "El equipo local suele dominar en el marcador. "
        elif promedio_goles_visitante > promedio_goles_local + 1:
            descripcion += "El equipo visitante suele imponerse con claridad. "
        else:
            descripcion += "Los partidos tienden a ser equilibrados. "

        # Medio tiempo vs segundo tiempo
        if promedio_total_goles_ht < promedio_total_goles * 0.4:
            descripcion += "La mayoría de los goles se marcan en el segundo tiempo. "
        elif promedio_total_goles_ht > promedio_total_goles * 0.6:
            descripcion += "Muchos partidos se definen en la primera mitad. "
        else:
            descripcion += "La distribución de goles entre ambos tiempos es equilibrada. "

        # Goleadas
        if goleadas_local + goleadas_visitante > 0:
            descripcion += f"Se detectaron {goleadas_local} goleadas del local y {goleadas_visitante} del visitante. "

        # Empates
        descripcion += f"El {porcentaje_empates}% de los partidos terminaron en empate. "

        # Intensidad ofensiva
        if promedio_tiros_total > 25:
            descripcion += "Los encuentros son ofensivos, con muchas oportunidades de gol. "
        elif promedio_tiros_total < 15:
            descripcion += "Se trata de partidos con pocas acciones ofensivas. "
        else:
            descripcion += "La ofensiva es de intensidad media. "

        # Tiros al arco (efectividad)
        if promedio_tiros_arco_total > 10:
            descripcion += "Los equipos generan varios tiros claros a portería. "
        elif promedio_tiros_arco_total < 6:
            descripcion += "Se generan pocos tiros directos al arco. "

        # Juego físico
        if promedio_tarjetas > 4:
            descripcion += "Además, son partidos intensos con muchas tarjetas. "
        elif promedio_faltas > 22:
            descripcion += "El juego es bastante físico, con muchas faltas cometidas. "
        elif promedio_tarjetas < 2 and promedio_faltas < 15:
            descripcion += "En general, se juega con deportividad y pocas infracciones. "

        descripciones[cluster_id] = descripcion.strip()

    return descripciones

# modelo predictivo
def entrenar_modelo_predictivo(df_clusterizado: pd.DataFrame):
    X = df_clusterizado.drop(columns=["cluster"])
    y = df_clusterizado["cluster"]

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)

    return model

def predecir_cluster_partido(model, partido_input: Dict[str, float]) -> int:
    df_input = pd.DataFrame([partido_input])
    print(df_input.head())
    return int(model.predict(df_input)[0])

def generar_perfil_por_cluster(df: pd.DataFrame, etiquetas: np.ndarray) -> dict:
    print("Función generar_perfil_por_cluster llamada")
    df_cluster = df.copy()
    df_cluster["cluster"] = etiquetas
    print(df_cluster.head())

    perfiles = {}
    for cluster in sorted(df_cluster["cluster"].unique()):
        datos = df_cluster[df_cluster["cluster"] == cluster]
        perfil = {
            # Resultado final
            "prob_victoria_local": round((datos["goles_local"] > datos["goles_visitante"]).mean(), 2),
            "prob_empate": round((datos["goles_local"] == datos["goles_visitante"]).mean(), 2),
            "prob_victoria_visitante": round((datos["goles_local"] < datos["goles_visitante"]).mean(), 2),  
            "ambos_marcan": round(((datos["goles_local"] > 0) & (datos["goles_visitante"] > 0)).mean(), 2),
            
            # Goles esperados
            "goles_esperados_local": round(datos["goles_local"].mean(), 2),            
            "goles_esperados_visitante": round(datos["goles_visitante"].mean(), 2),   

            # Medio tiempo
            "goles_ht_local": round(datos["goles_ht_local"].mean(), 2),
            "goles_ht_visitante": round(datos["goles_ht_visitante"].mean(), 2),
            "prob_ht_local_gana": round((datos["goles_ht_local"] > datos["goles_ht_visitante"]).mean(), 2),
            "prob_ht_empate": round((datos["goles_ht_local"] == datos["goles_ht_visitante"]).mean(), 2),
            "prob_ht_visitante_gana": round((datos["goles_ht_local"] < datos["goles_ht_visitante"]).mean(), 2),

            # Disparos a puerta
            "tiros_arco_local": round(datos["tiros_arco_local"].mean(), 2),
            "tiros_arco_visitante": round(datos["tiros_arco_visitante"].mean(), 2),

            # Otras estadísticas
            "corners_local": round(datos["corners_local"].mean(), 2),
            "corners_visitante": round(datos["corners_visitante"].mean(), 2),
            "amarillas_local": round(datos["amarillas_local"].mean(), 2),
            "amarillas_visitante": round(datos["amarillas_visitante"].mean(), 2),
            "rojas_local": round(datos["rojas_local"].mean(), 2),
            "rojas_visitante": round(datos["rojas_visitante"].mean(), 2),
        }
        perfiles[cluster] = perfil
    return perfiles

def predecir_cluster_nuevo_partido(datos_partido: dict) -> dict:
    modelo = cargar_modelo_predictivo()
    df = pd.DataFrame([datos_partido])
    cluster_predicho = modelo.predict(df)[0]
    return {"cluster": int(cluster_predicho)}

FECHA_ENTRENAMIENTO = Path("app/storage/last_trained_at.txt")

async def verificar_o_entrenar_modelo(
    db: AsyncSession,
    equipo_1_id: int,
    equipo_2_id: int,
    k: int = 3
) -> dict:
    
    hoy = datetime.now().date()

    necesita_entrenar = (
        state.modelo_global is None or
        state.perfiles_clusters is None or
        not FECHA_ENTRENAMIENTO.exists()
    )

    if not necesita_entrenar:
        with open(FECHA_ENTRENAMIENTO, "r") as f:
            fecha_str = f.read().strip()
            ultima_fecha = datetime.strptime(fecha_str, "%Y-%m-%d").date()
            print('ULTIMA FECHA: ', ultima_fecha)
            if (hoy - ultima_fecha).days >= 15:
                necesita_entrenar = True

    if necesita_entrenar:
        resultado = await crud.crud_match.analizar_clusters_partidos_entre_equipos(
            db, equipo_1_id, equipo_2_id, k
        )
        print("DEBUG - Resultado de analizar_clusters_partidos_entre_equipos:", resultado)
        
        if "error" in resultado:
            return {"error": resultado["error"]}
        
        if "modelo" not in resultado:
            return {"error": "No se pudo entrenar el modelo, resultado incompleto."}

        df_clusterizado = pd.DataFrame(resultado["partidos_clusterizados"])
        etiquetas = df_clusterizado["cluster"].values

        # KMeans
        state.modelo_global = resultado["modelo"]
        state.perfiles_clusters = generar_perfil_por_cluster(df_clusterizado, etiquetas)
        guardar_modelo(state.modelo_global)

        # RandomForest
        modelo_predictivo = entrenar_modelo_predictivo(df_clusterizado)
        guardar_modelo_predictivo(modelo_predictivo)
        state.modelo_predictivo = modelo_predictivo

        with open(FECHA_ENTRENAMIENTO, "w") as f:
            f.write(hoy.strftime("%Y-%m-%d"))
        
        print("✅ Modelo entrenado y guardado.")

        return {
            "ok": True,
            "modelo": state.modelo_global,
            "perfiles": state.perfiles_clusters,
            "modelo_predictivo": state.modelo_predictivo
        }
    else:
        print("🔁 Modelo válido, no es necesario reentrenar.")
        return {
            "ok": True,
            "modelo": state.modelo_global,
            "perfiles": state.perfiles_clusters,
            "modelo_predictivo": state.modelo_predictivo
        }