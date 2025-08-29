import pandas as pd
import numpy as np
import hashlib
import joblib
import os
import asyncio
import functools

from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from pathlib import Path
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from typing import Dict

from app.analysis.functions import get_data

# Executor para funciones síncronas
executor = ThreadPoolExecutor(max_workers=4)

def run_in_executor(func):
    """Decorator para ejecutar funciones síncronas de forma asíncrona"""
    @functools.wraps(func)
    async def wrapper(*args, **kwargs):
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, func, *args, **kwargs)
    return wrapper

# used in analizar_clusters_partidos_entre_equipos
def encontrar_k_optimo(df: pd.DataFrame, k_min: int = 2, k_max: int = 6):
    resultados = []

    for k in range(k_min, k_max + 1):
        _, modelo, scaler = aplicar_kmeans(df.copy(), n_clusters=k)
        sse = modelo.inertia_
        sst = np.sum((scaler.transform(df) - scaler.transform(df).mean(axis=0)) ** 2)
        pseudo_r2 = 1 - (sse / sst)
        resultados.append({"n_clusters": k, "pseudo_r2": pseudo_r2})

    df_resultados = pd.DataFrame(resultados)
    print(df_resultados)

    # Elegir el k con mayor pseudo R²
    k_optimo = df_resultados.sort_values(by="pseudo_r2", ascending=False).iloc[0]["n_clusters"]
    return int(k_optimo), df_resultados

# used in analizar_clusters_partidos_entre_equipos
def preparar_dataset_para_kmeans(df: pd.DataFrame) -> pd.DataFrame:
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

    print("✅ Dataset preparado para KMeans con shape:", df.shape)
    return df

# used in analizar_clusters_partidos_entre_equipos
def aplicar_kmeans(df: pd.DataFrame, n_clusters: int = 3):
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(df)

    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init='auto')
    etiquetas = kmeans.fit_predict(X_scaled)

    df['cluster'] = etiquetas

    # Calcular pseudo R² = 1 - (SSE / SST)
    sse = kmeans.inertia_
    sst = np.sum((X_scaled - X_scaled.mean(axis=0)) ** 2)
    pseudo_r2 = 1 - (sse / sst)

    print(f"Aplicar Kmeans (pseudo R²):  {pseudo_r2:.6f}")
    return df, kmeans, scaler

# used in analizar_clusters_partidos_entre_equipos
def describir_clusters_avanzado(df_clusterizado: pd.DataFrame) -> dict:
    descripciones = {}

    total_clusters = df_clusterizado["cluster"].nunique()

    for cluster_id in range(total_clusters):
        df = df_clusterizado[df_clusterizado["cluster"] == cluster_id]
        cantidad_partidos = len(df)

        if df.empty:
            descripciones[cluster_id] = {
                "titulo": f"Clúster {cluster_id}",
                "descripcion": "⚠️ Este clúster no contiene partidos."
            }
            continue

        # Estadísticas básicas
        promedio_goles_local = df["goles_local"].mean()
        promedio_goles_visitante = df["goles_visitante"].mean()
        total_goles = promedio_goles_local + promedio_goles_visitante

        promedio_ht_local = df["goles_ht_local"].mean()
        promedio_ht_visitante = df["goles_ht_visitante"].mean()
        total_ht_goles = promedio_ht_local + promedio_ht_visitante

        tiros_arco_local = df["tiros_arco_local"].mean()
        tiros_arco_visitante = df["tiros_arco_visitante"].mean()
        total_tiros_arco = tiros_arco_local + tiros_arco_visitante

        total_tiros = (df["tiros_local"] + df["tiros_visitante"]).mean()
        total_faltas = (df["faltas_local"] + df["faltas_visitante"]).mean()
        total_tarjetas = (
            df["amarillas_local"] + df["amarillas_visitante"] +
            df["rojas_local"] + df["rojas_visitante"]
        ).mean()

        empates = df[df["goles_local"] == df["goles_visitante"]].shape[0]
        porcentaje_empates = round((empates / cantidad_partidos) * 100, 1)

        goleadas_local = df[(df["goles_local"] - df["goles_visitante"]) >= 3].shape[0]
        goleadas_visitante = df[(df["goles_visitante"] - df["goles_local"]) >= 3].shape[0]

        # ---- CREAR TITULO AUTOMÁTICO ----
        if porcentaje_empates > 40:
            titulo = "Clúster de empates"
        elif promedio_goles_local > promedio_goles_visitante + 1:
            titulo = "Clúster de dominio local"
        elif promedio_goles_visitante > promedio_goles_local + 1:
            titulo = "Clúster de dominio visitante"
        elif total_goles > 4:
            titulo = "Clúster goleador"
        elif total_goles < 2:
            titulo = "Clúster defensivo"
        elif total_tarjetas > 4 or total_faltas > 22:
            titulo = "Clúster físico"
        else:
            titulo = "Clúster equilibrado"

        # ---- DESCRIPCIÓN DETALLADA ----
        descripcion = f"🤖 **Clúster {cluster_id}** \n\n"
        descripcion += f"📊 Título: **{titulo}**\n\n"

        # Dominio en el marcador
        if promedio_goles_local > promedio_goles_visitante + 1:
            descripcion += "📌 El equipo local suele dominar el marcador, mostrando ventaja significativa.\n"
        elif promedio_goles_visitante > promedio_goles_local + 1:
            descripcion += "📌 El equipo visitante tiende a controlar el resultado con claridad.\n"
        else:
            descripcion += "📌 Los encuentros son equilibrados en cuanto al marcador.\n"

        # Medio tiempo vs segundo tiempo
        if total_ht_goles < total_goles * 0.4:
            descripcion += "⏱️ La mayoría de los goles se marcan en el segundo tiempo.\n"
        elif total_ht_goles > total_goles * 0.6:
            descripcion += "⏱️ Muchos partidos se definen en la primera mitad.\n"
        else:
            descripcion += "⏱️ Los goles se distribuyen de forma equilibrada entre ambas mitades.\n"

        # Goleadas
        if goleadas_local + goleadas_visitante > 0:
            descripcion += f"🔥 Se observaron **{goleadas_local} goleadas locales** y **{goleadas_visitante} visitantes**.\n"

        # Empates
        descripcion += f"🤝 Aproximadamente el **{porcentaje_empates}%** de los partidos terminan en empate.\n"

        # Intensidad ofensiva
        if total_tiros > 25:
            descripcion += "🎯 Alta intensidad ofensiva: muchos intentos de gol por partido.\n"
        elif total_tiros < 15:
            descripcion += "🎯 Baja presencia ofensiva: pocos disparos totales.\n"
        else:
            descripcion += "🎯 Intensidad ofensiva moderada: oportunidades distribuidas.\n"

        # Tiros al arco
        if total_tiros_arco > 10:
            descripcion += "🥅 Alta efectividad en tiros al arco.\n"
        elif total_tiros_arco < 6:
            descripcion += "🥅 Poca precisión: escasos remates directos a portería.\n"

        # Juego físico
        if total_tarjetas > 4:
            descripcion += "💥 Partido de alta fricción: se muestran muchas tarjetas.\n"
        elif total_faltas > 22:
            descripcion += "💪 Estilo físico: se cometen muchas faltas.\n"
        elif total_tarjetas < 2 and total_faltas < 15:
            descripcion += "⚽️ Encuentros con buen fair play y pocas interrupciones.\n"

        # Guardar resultado
        descripciones[cluster_id] = {
            "titulo": titulo,
            "descripcion": descripcion.strip(),
            "cantidad_partidos": cantidad_partidos
        }

    return descripciones

# used in cluster.py
async def analizar_clusters_partidos_entre_equipos(equipo1, equipo2, liga):
    df_liga = await get_data.leer_y_filtrar_csv(liga)
    partidos = await get_data.filtrar_partidos_entre_equipos(df_liga, equipo1, equipo2)

    df = preparar_dataset_para_kmeans(partidos)
    # ✅ Buscar el mejor número de clústeres usando pseudo R²
    k_optimo, tabla_r2 = encontrar_k_optimo(df, k_min=2, k_max=6)
    print(f"📊 Mejor número de clústeres según pseudo R²: {k_optimo} y {tabla_r2}")

    # Aplicar KMeans con el k óptimo
    df_clusterizado, modelo, scaler = aplicar_kmeans(df, n_clusters=k_optimo)

    resumen_clusters = df_clusterizado.groupby('cluster').mean().round(2).to_dict(orient="index")
    descripcion_clusters = describir_clusters_avanzado(df_clusterizado)

    return {
        "partidos_clusterizados": df_clusterizado.to_dict(orient="records"),
        "resumen_por_cluster": resumen_clusters,
        "descripcion_clusters": descripcion_clusters,
        "modelo": modelo,
        "scaler": scaler
    }

# used in predecir_cluster_automatico
def generar_perfil_por_cluster(df: pd.DataFrame, etiquetas: np.ndarray) -> dict:
    print("Función generar_perfil_por_cluster llamada")
    df_cluster = df.copy()
    df_cluster["cluster"] = etiquetas

    perfiles = {}
    for cluster in sorted(df_cluster["cluster"].unique()):
        datos = df_cluster[df_cluster["cluster"] == cluster]
        cantidad = len(datos)

        perfil = {
            # Metadata
            "cantidad_partidos": cantidad,

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

        # ---- PERFIL RESUMIDO ----
        if perfil["prob_empate"] > 0.4:
            perfil_resumido = "Muchos empates"
        elif perfil["prob_victoria_local"] > 0.6:
            perfil_resumido = "Domina Local"
        elif perfil["prob_victoria_visitante"] > 0.6:
            perfil_resumido = "Domina Visitante"
        elif perfil["goles_esperados_local"] + perfil["goles_esperados_visitante"] > 4:
            perfil_resumido = "Clúster goleador"
        elif perfil["goles_esperados_local"] + perfil["goles_esperados_visitante"] < 2:
            perfil_resumido = "Clúster defensivo"
        else:
            perfil_resumido = "Clúster equilibrado"

        perfil["perfil_resumido"] = perfil_resumido

        perfiles[cluster] = perfil

    return perfiles

BASE_DIR = Path(__file__).resolve().parent.parent
MODELOS_DIR = BASE_DIR / "storage" / "models"
MODELOS_DIR.mkdir(parents=True, exist_ok=True)

def get_model_path(equipo_1, equipo_2, liga):
    clave = f"{liga}_{equipo_1}_{equipo_2}".lower().replace(" ", "_")
    hash_id = hashlib.md5(clave.encode()).hexdigest()[:8]
    return MODELOS_DIR / f"modelo_{clave}_{hash_id}.pkl"

# used in predecir_cluster_automatico
async def verificar_o_entrenar_modelo(equipo_1, equipo_2, liga):
    modelo_path = get_model_path(equipo_1, equipo_2, liga)

    # Leer datos de la liga y partidos entre equipos
    df_liga = await get_data.leer_y_filtrar_csv(liga)
    df_partidos = await get_data.filtrar_partidos_entre_equipos(df_liga, equipo_1, equipo_2)

    if df_partidos.empty:
        print("⚠️ No hay partidos entre los equipos.")
        return None

    # Verificar si modelo existe y si el CSV no ha sido modificado después
    if modelo_path.exists():
        modelo_mtime = datetime.fromtimestamp(os.path.getmtime(modelo_path))
        try:
            csv_path = df_liga._filepath_or_buffer
            csv_mtime = datetime.fromtimestamp(os.path.getmtime(csv_path))
        except:
            csv_mtime = datetime.now()

        if csv_mtime <= modelo_mtime:
            try:
                cargado = joblib.load(modelo_path)

                modelo = cargado["modelo"]
                scaler = cargado["scaler"]

                df = preparar_dataset_para_kmeans(df_partidos)
                df_scaled = scaler.transform(df)

                etiquetas = modelo.predict(df_scaled)
                perfiles = generar_perfil_por_cluster(df, etiquetas)

                print(f"🔁 Modelo cargado: {modelo_path.name}")
                return {
                    "ok": True,
                    "modelo": modelo,
                    "scaler": scaler,
                    "perfiles": perfiles,
                }
            except Exception as e:
                print(f"❌ Error al cargar modelo: {e}")
                pass  # Forzar reentrenamiento si falla carga

    # ENTRENAR NUEVO MODELO
    resultado = await analizar_clusters_partidos_entre_equipos(equipo_1, equipo_2, liga)
    df_clusterizado = pd.DataFrame(resultado["partidos_clusterizados"])
    etiquetas = df_clusterizado["cluster"].values

    modelo = resultado["modelo"]
    scaler = resultado["scaler"]
    perfiles = generar_perfil_por_cluster(df_clusterizado, etiquetas)

    # Guardar modelo
    joblib.dump({"modelo": modelo, "scaler": scaler}, modelo_path)
    print(f"✅ Modelo entrenado y guardado en: {modelo_path.name}")

    return {
        "ok": True,
        "modelo": modelo,
        "scaler": scaler,
        "perfiles": perfiles,
    }

# used in predecir_cluster_automatico
def predecir_cluster_partido(modelo, scaler, partido_input: Dict[str, float]) -> int:
    df_input = pd.DataFrame([partido_input])
    df_scaled = scaler.transform(df_input)
    return int(modelo.predict(df_scaled)[0])

# Calcular promedios de estadísticas para el input del modelo
# used in predecir_cluster_automatico
def calcular_promedios(partidos, equipo):
    return {
        "goles": (partidos[partidos["HomeTeam"] == equipo]["FTHG"].mean() +
                        partidos[partidos["AwayTeam"] == equipo]["FTAG"].mean()) / 2,
        "goles_ht": (partidos[partidos["HomeTeam"] == equipo]["HTHG"].mean() +
                        partidos[partidos["AwayTeam"] == equipo]["HTAG"].mean()) / 2,
        "tiros": (partidos[partidos["HomeTeam"] == equipo]["HS"].mean() +
                        partidos[partidos["AwayTeam"] == equipo]["AS"].mean()) / 2,
        "tiros_arco": (partidos[partidos["HomeTeam"] == equipo]["HST"].mean() +
                        partidos[partidos["AwayTeam"] == equipo]["AST"].mean()) / 2,
        "corners": (partidos[partidos["HomeTeam"] == equipo]["HC"].mean() +
                        partidos[partidos["AwayTeam"] == equipo]["AC"].mean()) / 2,
        "faltas": (partidos[partidos["HomeTeam"] == equipo]["HF"].mean() +
                        partidos[partidos["AwayTeam"] == equipo]["AF"].mean()) / 2,
        "amarillas": (partidos[partidos["HomeTeam"] == equipo]["HY"].mean() +
                        partidos[partidos["AwayTeam"] == equipo]["AY"].mean()) / 2,
        "rojas": (partidos[partidos["HomeTeam"] == equipo]["HR"].mean() +
                        partidos[partidos["AwayTeam"] == equipo]["AR"].mean()) / 2,
    }

# used in cluster.py 
async def predecir_cluster_automatico(equipo_1, equipo_2, liga):
    verificacion = await verificar_o_entrenar_modelo(equipo_1, equipo_2, liga)

    if verificacion is None:
        print("❌ No se pudo analizar los clusters.")
        return

    modelo = verificacion.get("modelo")
    scaler = verificacion.get("scaler")
    perfiles_clusters = verificacion.get("perfiles")

    if modelo is None or scaler is None or perfiles_clusters is None:
        print("❌ El modelo, el scaler o los perfiles de clusters no están disponibles.")
        return
    
    df_liga = await get_data.leer_y_filtrar_csv(liga)
    
    # Obtener últimos partidos de cada equipo
    partidos_eq1 = get_data.filtrar_ultimos_partidos_de_equipo(df_liga, equipo_1, limite=40)
    partidos_eq2 = get_data.filtrar_ultimos_partidos_de_equipo(df_liga, equipo_2, limite=40)

    if partidos_eq1.empty or partidos_eq2.empty:
        print("⚠️ No se encontraron suficientes partidos recientes para los equipos.")
        return
    
    promedio_eq1 = calcular_promedios(partidos_eq1, equipo_1)
    promedio_eq2 = calcular_promedios(partidos_eq2, equipo_2)

    datos_partido = {
        "goles_local": promedio_eq1["goles"],
        "goles_visitante": promedio_eq2["goles"],
        "goles_ht_local": promedio_eq1["goles_ht"],
        "goles_ht_visitante": promedio_eq2["goles_ht"],
        "tiros_local": promedio_eq1["tiros"],
        "tiros_visitante": promedio_eq2["tiros"],
        "tiros_arco_local": promedio_eq1["tiros_arco"],
        "tiros_arco_visitante": promedio_eq2["tiros_arco"],
        "corners_local": promedio_eq1["corners"],
        "corners_visitante": promedio_eq2["corners"],
        "faltas_local": promedio_eq1["faltas"],
        "faltas_visitante": promedio_eq2["faltas"],
        "amarillas_local": promedio_eq1["amarillas"],
        "amarillas_visitante": promedio_eq2["amarillas"],
        "rojas_local": promedio_eq1["rojas"],
        "rojas_visitante": promedio_eq2["rojas"],
    }

    cluster_predicho = predecir_cluster_partido(modelo, scaler, datos_partido)
    perfil = perfiles_clusters.get(cluster_predicho)

    if perfil is None:
        print(f"⚠️ No se encontró perfil para el clúster {cluster_predicho}")
        return

    goles_local = perfil.get('goles_esperados_local', 0)
    goles_visitante = perfil.get('goles_esperados_visitante', 0)
    total_goles = goles_local + goles_visitante

    resumen = (
        f"📊 Los datos del modelo ubican este partido en el **clúster {cluster_predicho}**, "
        f"un escenario donde {equipo_1} parte con una clara ventaja: "
        f"{perfil.get('prob_victoria_local', 0)*100:.1f}% de probabilidades de ganar. "
        f"{equipo_2}, en cambio, apenas alcanza un {perfil.get('prob_victoria_visitante', 0)*100:.1f}%, "
        f"mientras que el empate ronda el {perfil.get('prob_empate', 0)*100:.1f}%.\n\n"

        f"⚡ En el **primer tiempo**, el local suele anotar {perfil.get('goles_ht_local',0):.1f} goles, "
        f"frente a los {perfil.get('goles_ht_visitante',0):.1f} del visitante. "
        f"Esto se traduce en una probabilidad de {perfil.get('prob_ht_local_gana',0)*100:.1f}% "
        f"de irse al descanso en ventaja.\n\n"

        f"⚽ A nivel global, el marcador esperado es de "
        f"{perfil.get('goles_esperados_local',0):.1f} - {perfil.get('goles_esperados_visitante',0):.1f}. "
        f"{'Se anticipa un partido abierto con goles de ambos lados' if perfil.get('ambos_marcan',0) >= 0.5 else 'El partido apunta a ser más cerrado, con dificultades para que marquen ambos equipos'}. "
        f"En total, se esperan {total_goles:.1f} goles, lo que sitúa la línea en "
        f"{'over' if total_goles > 2.5 else 'under'} 2.5.\n\n"

        f"🎯 En cuanto a juego ofensivo, {equipo_1} promedia {perfil.get('tiros_arco_local',0):.1f} tiros al arco, "
        f"contra los {perfil.get('tiros_arco_visitante',0):.1f} de {equipo_2}. "
        f"También se esperan {perfil.get('corners_local',0):.1f} corners para el local "
        f"y {perfil.get('corners_visitante',0):.1f} para la visita.\n\n"

        f"🟨 La disciplina puede influir: el local recibe en promedio "
        f"{perfil.get('amarillas_local',0):.1f} amarillas y {perfil.get('rojas_local',0):.2f} rojas, "
        f"mientras que {equipo_2} promedia {perfil.get('amarillas_visitante',0):.1f} amarillas y "
        f"{perfil.get('rojas_visitante',0):.2f} expulsiones.\n\n"

        f"🔮 En conclusión, el marcador más probable sería **{round(perfil.get('goles_esperados_local',0))} - {round(perfil.get('goles_esperados_visitante',0))}**, "
        f"con una narrativa que favorece a {equipo_1}."
    )

    return {
        "cluster_predicho": int(cluster_predicho),
        "partido_usado": datos_partido,
        "predicciones": {
            "prob_victoria_local": perfil.get("prob_victoria_local"),
            "prob_empate": perfil.get("prob_empate"),
            "prob_victoria_visitante": perfil.get("prob_victoria_visitante"),
            "ambos_marcan": perfil.get("ambos_marcan"),
            "goles_esperados_local": perfil.get("goles_esperados_local"),
            "goles_esperados_visitante": perfil.get("goles_esperados_visitante"),
            "corners_local": perfil.get("corners_local"),
            "corners_visitante": perfil.get("corners_visitante"),
            "amarillas_local": perfil.get("amarillas_local"),
            "amarillas_visitante": perfil.get("amarillas_visitante"),
            "rojas_local": perfil.get("rojas_local"),
            "rojas_visitante": perfil.get("rojas_visitante"),
            "goles_ht_local": perfil.get("goles_ht_local"),
            "goles_ht_visitante": perfil.get("goles_ht_visitante"),
            "prob_ht_local_gana": perfil.get("prob_ht_local_gana"),
            "prob_ht_empate": perfil.get("prob_ht_empate"),
            "prob_ht_visitante_gana": perfil.get("prob_ht_visitante_gana"),
            "tiros_arco_local": perfil.get("tiros_arco_local"),
            "tiros_arco_visitante": perfil.get("tiros_arco_visitante"),
        },
        "resumen": resumen
    }
