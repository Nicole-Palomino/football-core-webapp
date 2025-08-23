import os
import pandas as pd

from pathlib import Path

# Datos de ligas y equipos
LIGAS_DATA = {
    "LaLiga": {
        "equipos": ["Real Madrid", "Barcelona", "Atlético Madrid", "Sevilla", "Real Betis", 
                   "Valencia", "Villarreal", "Athletic Bilbao", "Real Sociedad", "Osasuna"],
        "logo": "🟡🔴",
        "color": "#FF6B6B"
    },
    # "Premier League": {
    #     "equipos": ["Manchester City", "Arsenal", "Liverpool", "Chelsea", "Newcastle", 
    #                "Manchester United", "Tottenham", "Brighton", "Aston Villa", "West Ham"],
    #     "logo": "⚪🔴",
    #     "color": "#4ECDC4"
    # },
    "Serie A": {
        "equipos": ["Napoli", "AC Milan", "Inter Milan", "Juventus", "AS Roma", 
                   "Lazio", "Atalanta", "Fiorentina", "Bologna", "Torino"],
        "logo": "🟢⚪🔴",
        "color": "#45B7D1"
    },
    "Bundesliga": {
        "equipos": ["Bayern Munich", "Borussia Dortmund", "RB Leipzig", "Union Berlin", "SC Freiburg",
                   "Bayer Leverkusen", "Eintracht Frankfurt", "Wolfsburg", "Mainz", "Borussia M'gladbach"],
        "logo": "🔴🟡⚫",
        "color": "#96CEB4"
    },
    "Ligue 1": {
        "equipos": ["PSG", "Lens", "Marseille", "Rennes", "Monaco", 
                   "Lille", "Lyon", "Nice", "Clermont", "Toulouse"],
        "logo": "🔵⚪🔴",
        "color": "#FFEAA7"
    }
}

def obtener_datos_liga(nombre_liga):
    """
    Obtiene todos los equipos de cada liga

    Args:
        nombre_liga (str): El nombre de la liga seleccionada.

    Returns:
        json: un JSON con los equipos, el logo representativo y
                el color para la liga
    """
    # Normalizar el nombre para formar la ruta del .txt
    # Contiene todos lo nombres de los equipos activos de la liga seleccionada
    liga_folder = (
        nombre_liga.lower()
        .replace(" ", "-")
        .replace("á", "a")
        .replace("é", "e")
    )
    base_dir = Path(__file__).parent 
    ruta_txt = (base_dir / ".." / liga_folder / "teams.txt").resolve()
    # Verificar si existe la ruta
    # Si existe trae los equipos sino coloca los mencionados en LIGAS_DATA
    if os.path.exists(ruta_txt):
        with open(ruta_txt, "r", encoding="utf-8") as f:
            equipos = [line.strip() for line in f if line.strip()]
        print(f"✅ Equipos cargados desde archivo: {ruta_txt}")
    else:
        equipos = LIGAS_DATA[nombre_liga]["equipos"]
        print(f"⚠️ Equipos cargados desde LIGAS_DATA para: {nombre_liga}")
    
    # Retorna los equipos, logo y el color de cada liga
    return {
        "equipos": equipos,
        "logo": LIGAS_DATA[nombre_liga]["logo"],
        "color": LIGAS_DATA[nombre_liga]["color"]
    }

def leer_y_filtrar_csv(nombre_liga):
    """
    Lee todos los archivos CSV de una carpeta y los concatena.

    Args:
        nombre_liga (str): El nombre de la liga para la ruta de carpeta.

    Returns:
        pandas.DataFrame: Un DataFrame que contiene todos los partidos de la liga seleccionada,
                          o None si no se encuentran archivos CSV o partidos.
    """
    todos_los_datos = []
    archivos_encontrados = False
    liga_folder = (
        nombre_liga.lower()
        .replace(" ", "-")
        .replace("á", "a")
        .replace("é", "e")
    )
    base_dir = Path(__file__).parent 
    ruta_carpeta = (base_dir / ".." / liga_folder).resolve()

    # Itera sobre todos los archivos en la carpeta seleccionada
    # Verifica que sea un .csv
    for archivo in os.listdir(ruta_carpeta):
        if archivo.endswith(".csv"):
            ruta_completa_archivo = os.path.join(ruta_carpeta, archivo)
            try:
                # Lee el archivo CSV
                # Se agregan todos los partidos de una liga
                df = pd.read_csv(ruta_completa_archivo)
                todos_los_datos.append(df)
                archivos_encontrados = True
            except Exception as e:
                print(f"Error al leer {archivo}: {e}")
    
    if not archivos_encontrados:
        print(f"No se encontraron archivos CSV en la carpeta: {ruta_carpeta}")
        return None
    
    # Concatena todos los DataFrames en uno solo Dataframe
    if todos_los_datos:
        df_completo = pd.concat(todos_los_datos, ignore_index=True)
    else:
        print("No se pudo concatenar ningún DataFrame. Posiblemente no se leyeron correctamente.")
        return None
    
    return df_completo

def obtener_fecha_ultima_modificacion_csv(nombre_liga: str) -> float:
    """
    Devuelve el timestamp de última modificación de los CSVs de una liga.
    """
    liga_folder = (
        nombre_liga.lower()
        .replace(" ", "-")
        .replace("á", "a")
        .replace("é", "e")
    )
    base_dir = Path(__file__).parent 

    ruta_carpeta = Path(
        (base_dir / ".." / liga_folder).resolve()
    )

    if not ruta_carpeta.exists():
        print(f"❌ Carpeta no encontrada: {ruta_carpeta}")
        return 0

    ultima_modificacion = 0
    for archivo in ruta_carpeta.glob("*.csv"):
        mtime = archivo.stat().st_mtime
        if mtime > ultima_modificacion:
            ultima_modificacion = mtime

    return ultima_modificacion

def filtrar_partidos_entre_equipos(df: pd.DataFrame, equipo1: str, equipo2: str) -> pd.DataFrame:
    """
    Filtra todos los partidos o enfrentamientos entre dos equipos.

    Args:
        df (pd.Dataframe): Dataframe completo de los partidos de la liga.
        equipo1 (str): Equipo Local.
        equipo2 (str): Equipo Visitante.

    Returns:
        pandas.DataFrame: Un DataFrame que contiene todos los partidos o enfrentamientos entre dos equipos,
                          o None si no se encuentran archivos partidos entre esos equipos.
    """
    equipo1 = equipo1.lower()
    equipo2 = equipo2.lower()

    partidos = df[
        ((df['HomeTeam'].str.lower() == equipo1) & (df['AwayTeam'].str.lower() == equipo2)) |
        ((df['HomeTeam'].str.lower() == equipo2) & (df['AwayTeam'].str.lower() == equipo1))
    ]

    return partidos

def filtrar_ultimos_partidos_de_equipo(df: pd.DataFrame, equipo: str, limite: int = 40) -> pd.DataFrame:
    """
    Devuelve los últimos partidos jugados por un equipo (local o visitante) desde un DataFrame.

    Args:
        df (pd.DataFrame): DataFrame con los datos de los partidos.
        equipo (str): Nombre del equipo (sensible a mayúsculas/minúsculas).
        limite (int): Número de partidos a devolver.

    Returns:
        pd.DataFrame: DataFrame con los últimos `limite` partidos del equipo.
    """
    equipo = equipo.lower()

    # Asegura que las columnas estén en minúsculas para evitar errores
    df = df.copy()
    df["HomeTeam_lower"] = df["HomeTeam"].str.lower()
    df["AwayTeam_lower"] = df["AwayTeam"].str.lower()

    # Filtra partidos donde el equipo fue local o visitante
    partidos_filtrados = df[
        (df["HomeTeam_lower"] == equipo) | (df["AwayTeam_lower"] == equipo)
    ]

    # Ordena por fecha (columna 'Date' o 'dia' si es tu caso)
    if "Date" in df.columns:
        partidos_filtrados = partidos_filtrados.sort_values(by="Date", ascending=False)
    elif "dia" in df.columns:
        partidos_filtrados = partidos_filtrados.sort_values(by="dia", ascending=False)
    else:
        raise ValueError("El DataFrame debe contener una columna de fecha como 'Date' o 'dia'.")

    # Devuelve los últimos N
    return partidos_filtrados.head(limite).reset_index(drop=True)

def filtrar_partidos_sin_importar_local_visita(df: pd.DataFrame, equipo1: str, equipo2: str) -> pd.DataFrame:
    """
    Devuelve un DataFrame con todos los partidos entre dos equipos,
    sin importar quién fue local o visitante.
    
    Args:
        df (pd.DataFrame): DataFrame con columnas 'HomeTeam' y 'AwayTeam'
        equipo1 (str): Nombre del primer equipo
        equipo2 (str): Nombre del segundo equipo

    Returns:
        pd.DataFrame: Partidos entre equipo1 y equipo2 ordenados por fecha descendente
    """
    partidos = df[
        ((df["HomeTeam"] == equipo1) & (df["AwayTeam"] == equipo2)) |
        ((df["HomeTeam"] == equipo2) & (df["AwayTeam"] == equipo1))
    ]

    partidos = partidos.sort_values(by="Date", ascending=False)
    return partidos

def obtener_ultima_temporada(nombre_liga):
    """
    Obtiene los resultados para una tabla de clasificación de la última temporada que ha pasado.

    Args:
        nombre_liga (str): Nombre de la liga seleccionada.

    Returns:
        pd.DataFrame: DataFrame con los datos de la última temporada jugada.
    """
    liga_slug = (
        nombre_liga.lower()
        .replace(" ", "-")
        .replace("á", "a")
        .replace("é", "e")
    )

    base_dir = Path(__file__).parent 
    carpeta_liga = (base_dir / ".." / liga_slug / f"{liga_slug}-2526.csv").resolve()
    if os.path.exists(carpeta_liga):
        return pd.read_csv(carpeta_liga)
    else:
        return None
    
from typing import Optional

def obtener_ultimo_partido_entre_equipos(df: pd.DataFrame, equipo1: str, equipo2: str) -> Optional[pd.Series]:
    """
    Obtiene el último partido entre dos equipos de una liga seleccionada.
    """
    equipo1 = equipo1.lower()
    equipo2 = equipo2.lower()

    mask = (
        ((df["HomeTeam"].str.lower() == equipo1) & (df["AwayTeam"].str.lower() == equipo2)) |
        ((df["HomeTeam"].str.lower() == equipo2) & (df["AwayTeam"].str.lower() == equipo1))
    )
    partidos = df.loc[mask].copy()  # copia para evitar warnings al mutar

    if partidos.empty:
        return None

    # Asegurarse de que exista la columna 'Date' y esté en datetime
    if "Date" in partidos.columns:
        if not pd.api.types.is_datetime64_any_dtype(partidos["Date"]):
            partidos.loc[:, "Date"] = pd.to_datetime(partidos["Date"], errors="coerce")
        partidos = partidos.sort_values(by="Date", ascending=False)
    else:
        # Sin fecha, no podemos ordenar; simplemente tomamos el primero (pero quizá quieras loggear esto)
        partidos = partidos

    ultimo_partido = partidos.iloc[0]
    return ultimo_partido