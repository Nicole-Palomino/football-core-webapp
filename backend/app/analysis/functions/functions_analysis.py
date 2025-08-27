import pandas as pd
import random 
import functools
import asyncio

from concurrent.futures import ThreadPoolExecutor
from app.analysis.functions import get_data

# Executor global
executor = ThreadPoolExecutor(max_workers=4)

def run_in_executor(func):
    """Decorator para ejecutar funciones síncronas de forma asíncrona"""
    @functools.wraps(func)
    async def wrapper(*args, **kwargs):
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(executor, func, *args, **kwargs)
    return wrapper

# used in analysis.py
@run_in_executor
def construir_estadisticas_equipos(df):
    equipos = pd.unique(pd.concat([df["HomeTeam"], df["AwayTeam"]]))

    stats = []

    for equipo in equipos:
        # Como local
        local = df[df["HomeTeam"] == equipo]
        # Como visitante
        visita = df[df["AwayTeam"] == equipo]

        partidos = len(local) + len(visita)
        if partidos == 0:
            continue

        # Tiros totales
        shots = local["HS"].sum() + visita["AS"].sum()
        shots_target = local["HST"].sum() + visita["AST"].sum()
        corners = local["HC"].sum() + visita["AC"].sum()
        goles = local["FTHG"].sum() + visita["FTAG"].sum()

        # Tarjetas
        yellow_cards = local["HY"].sum() + visita["AY"].sum()
        red_cards = local["HR"].sum() + visita["AR"].sum()

        # Métricas
        posesion_ofensiva = (shots + shots_target + corners) / partidos
        eficiencia_ofensiva = goles / shots_target if shots_target > 0 else 0
        disciplina = (yellow_cards + red_cards) / partidos
        fuerza_local = local["FTHG"].sum() / len(local) if len(local) > 0 else 0
        fuerza_visitante = visita["FTAG"].sum() / len(visita) if len(visita) > 0 else 0

        stats.append({
            "Equipo": equipo,
            "Partidos": partidos,
            "Posesión_ofensiva": round(posesion_ofensiva, 2),
            "Eficiencia_ofensiva": round(eficiencia_ofensiva, 2),
            "Indisciplina": round(disciplina, 2),
            "Goles_local_prom": round(fuerza_local, 2),
            "Goles_visita_prom": round(fuerza_visitante, 2),
        })

    return pd.DataFrame(stats).sort_values("Eficiencia_ofensiva", ascending=False)

# used in analysis.py
@run_in_executor
def goles_primer_tiempo_entre_dos(df, equipo1, equipo2):
    # Filtrar partidos donde participa equipo1
    eq1_local = df[df["HomeTeam"] == equipo1]["HTHG"].sum()
    eq1_visita = df[df["AwayTeam"] == equipo1]["HTAG"].sum()
    total_eq1 = eq1_local + eq1_visita

    # Filtrar partidos donde participa equipo2
    eq2_local = df[df["HomeTeam"] == equipo2]["HTHG"].sum()
    eq2_visita = df[df["AwayTeam"] == equipo2]["HTAG"].sum()
    total_eq2 = eq2_local + eq2_visita

    return total_eq1, total_eq2

# used in analysis.py
@run_in_executor
def ventaja_primer_tiempo_entre_equipos(df, equipo1, equipo2):
    # Filtrar solo partidos entre ambos
    partidos = get_data.filtrar_partidos_sin_importar_local_visita(df, equipo1, equipo2)

    # Ventajas al descanso
    ventaja_eq1 = (
        ((partidos["HomeTeam"] == equipo1) & (partidos["HTHG"] > partidos["HTAG"])) |
        ((partidos["AwayTeam"] == equipo1) & (partidos["HTAG"] > partidos["HTHG"]))
    ).sum()

    ventaja_eq2 = (
        ((partidos["HomeTeam"] == equipo2) & (partidos["HTHG"] > partidos["HTAG"])) |
        ((partidos["AwayTeam"] == equipo2) & (partidos["HTAG"] > partidos["HTHG"]))
    ).sum()

    empates = (partidos["HTHG"] == partidos["HTAG"]).sum()

    return ventaja_eq1, ventaja_eq2, empates, len(partidos)

def radar_estadisticas_completo(partidos, equipo1, equipo2):
    def sumar_estadisticas(equipo, col_local, col_visitante):
        return (
            partidos[(partidos["HomeTeam"] == equipo)][col_local].sum() +
            partidos[(partidos["AwayTeam"] == equipo)][col_visitante].sum()
        )

    # Goles
    goles_eq1 = sumar_estadisticas(equipo1, "FTHG", "FTAG")
    goles_eq2 = sumar_estadisticas(equipo2, "FTHG", "FTAG")

    # Tiros
    tiros_eq1 = sumar_estadisticas(equipo1, "HS", "AS")
    tiros_eq2 = sumar_estadisticas(equipo2, "HS", "AS")

    # Tiros al arco
    tiros_arco_eq1 = sumar_estadisticas(equipo1, "HST", "AST")
    tiros_arco_eq2 = sumar_estadisticas(equipo2, "HST", "AST")

    # Corners
    corners_eq1 = sumar_estadisticas(equipo1, "HC", "AC")
    corners_eq2 = sumar_estadisticas(equipo2, "HC", "AC")

    # Faltas
    faltas_eq1 = sumar_estadisticas(equipo1, "HF", "AF")
    faltas_eq2 = sumar_estadisticas(equipo2, "HF", "AF")

    # Amarillas
    amarillas_eq1 = sumar_estadisticas(equipo1, "HY", "AY")
    amarillas_eq2 = sumar_estadisticas(equipo2, "HY", "AY")

    categorias = ["⚽ Goles", "🎯 Tiros", "🎯 Tiros al arco", "🏁 Corners", "🚫 Faltas", "🟨 Amarillas"]
    stats_eq1 = [goles_eq1, tiros_eq1, tiros_arco_eq1, corners_eq1, faltas_eq1, amarillas_eq1]
    stats_eq2 = [goles_eq2, tiros_eq2, tiros_arco_eq2, corners_eq2, faltas_eq2, amarillas_eq2]

    max_val = max(stats_eq1 + stats_eq2) + 5  # Para escalar bien el radar

    # Colores personalizados
    color_eq1 = "rgba(0, 123, 255, 0.5)"   
    color_eq2 = "rgba(220, 53, 69, 0.5)"   

def comparacion_local_vs_visitante(df, equipo1, equipo2):
    total_partidos = len(df)
    # Filtrar partidos donde participa equipo1
    eq1_local = df[df["HomeTeam"] == equipo1]["FTHG"].sum()
    eq1_visita = df[df["AwayTeam"] == equipo1]["FTAG"].sum()
    goles_local = eq1_local + eq1_visita

    # Filtrar partidos donde participa equipo2
    eq2_local = df[df["HomeTeam"] == equipo2]["FTHG"].sum()
    eq2_visita = df[df["AwayTeam"] == equipo2]["FTAG"].sum()
    goles_visitante = eq2_local + eq2_visita

# used in analysis.py
def generar_sugerencias_enfrentamientos_directos(df: pd.DataFrame, equipo1: str, equipo2: str) -> list[str]:
    """
    Genera sugerencias basadas en enfrentamientos directos entre equipo1 y equipo2.
    Incluye historial, empates, rachas, goles y último partido con frases aleatorias.
    """
    sugerencias = []
    df = df.copy()
    df['Date'] = pd.to_datetime(df['Date'], errors="coerce")  
    df = df.dropna(subset=["Date"]).sort_values(by="Date", ascending=False).reset_index(drop=True)
    total = len(df)

    if total == 0:
        return ["⚠️ No hay datos de enfrentamientos entre ambos equipos."]

    # Conteo de resultados
    victorias_eq1, victorias_eq2, empates = 0, 0, 0
    goles_eq1, goles_eq2 = 0, 0
    for _, row in df.iterrows():
        if row['FTR'] == 'H':
            ganador = row['HomeTeam']
        elif row['FTR'] == 'A':
            ganador = row['AwayTeam']
        else:
            ganador = 'Empate'

        if ganador == equipo1:
            victorias_eq1 += 1
        elif ganador == equipo2:
            victorias_eq2 += 1
        else:
            empates += 1

        # Goles a favor acumulados
        if row['HomeTeam'] == equipo1:
            goles_eq1 += row['FTHG']
            goles_eq2 += row['FTAG']
        elif row['AwayTeam'] == equipo1:
            goles_eq1 += row['FTAG']
            goles_eq2 += row['FTHG']

    # --- Historial ---
    if victorias_eq1 > victorias_eq2:
        opciones = [
            f"🔥 {equipo1} ha ganado {victorias_eq1} de los últimos {total} partidos frente a {equipo2}.",
            f"🏆 {equipo1} tiene la ventaja en el historial con {victorias_eq1} victorias en {total} encuentros.",
            f"💪 {equipo1} se ha impuesto más veces que {equipo2} en los últimos {total} partidos."
        ]
        sugerencias.append(random.choice(opciones))
    elif victorias_eq2 > victorias_eq1:
        opciones = [
            f"🔥 {equipo2} domina este clásico con {victorias_eq2} victorias en los últimos {total} enfrentamientos.",
            f"🏆 {equipo2} ha superado a {equipo1} en {victorias_eq2} de sus últimos {total} duelos.",
            f"💪 {equipo2} lleva la ventaja reciente frente a {equipo1}."
        ]
        sugerencias.append(random.choice(opciones))
    else:
        opciones = [
            f"⚖️ Historial parejo: ambos han ganado {victorias_eq1} veces en {total} enfrentamientos.",
            f"🤝 Igualdad total: {equipo1} y {equipo2} tienen el mismo número de victorias ({victorias_eq1}).",
            f"⚔️ Los dos equipos se reparten las victorias en {total} partidos disputados."
        ]
        sugerencias.append(random.choice(opciones))

    # --- Empates ---
    if empates >= 2:
        opciones = [
            f"🤝 Han empatado en {empates} ocasiones recientes.",
            f"⚖️ El empate ha sido frecuente: {empates} veces en {total} enfrentamientos.",
            f"📊 De los últimos {total} partidos, {empates} terminaron sin ganador."
        ]
        sugerencias.append(random.choice(opciones))

    # --- Promedio de goles ---
    promedio_goles = (goles_eq1 + goles_eq2) / total
    if promedio_goles > 3:
        opciones = [
            f"⚡ Enfrentamientos muy ofensivos: promedian {promedio_goles:.1f} goles por partido.",
            f"🔥 Partidos con espectáculo: {promedio_goles:.1f} goles de media.",
            f"⚽ Muchos goles cuando juegan: {promedio_goles:.1f} por encuentro."
        ]
        sugerencias.append(random.choice(opciones))
    elif promedio_goles < 2:
        opciones = [
            f"🛡️ Partidos cerrados: promedian solo {promedio_goles:.1f} goles por encuentro.",
            f"🔒 Duelos muy tácticos, con apenas {promedio_goles:.1f} goles en promedio.",
            f"⚖️ Promedio bajo: {promedio_goles:.1f} goles por enfrentamiento."
        ]
        sugerencias.append(random.choice(opciones))

    # --- Racha reciente (últimos 5 partidos) ---
    ultimos5 = df.head(5)
    victorias_eq1_r5 = sum(
        (r['FTR'] == 'H' and r['HomeTeam'] == equipo1) or (r['FTR'] == 'A' and r['AwayTeam'] == equipo1)
        for _, r in ultimos5.iterrows()
    )
    victorias_eq2_r5 = sum(
        (r['FTR'] == 'H' and r['HomeTeam'] == equipo2) or (r['FTR'] == 'A' and r['AwayTeam'] == equipo2)
        for _, r in ultimos5.iterrows()
    )
    if victorias_eq1_r5 > victorias_eq2_r5:
        opciones = [
            f"📈 En los últimos 5 partidos, {equipo1} se impuso {victorias_eq1_r5} veces frente a {equipo2}.",
            f"🔥 {equipo1} domina la racha reciente con {victorias_eq1_r5} victorias en los últimos 5 duelos.",
            f"💪 {equipo1} está en ventaja en los últimos 5 choques contra {equipo2}."
        ]
        sugerencias.append(random.choice(opciones))
    elif victorias_eq2_r5 > victorias_eq1_r5:
        opciones = [
            f"📈 En los últimos 5 partidos, {equipo2} superó a {equipo1} en {victorias_eq2_r5} ocasiones.",
            f"🔥 {equipo2} manda en los últimos 5 enfrentamientos con {victorias_eq2_r5} victorias.",
            f"💪 {equipo2} lleva la racha reciente frente a {equipo1}."
        ]
        sugerencias.append(random.choice(opciones))

    # --- Último resultado ---
    ultimo = df.iloc[0]
    try:
        resultado = f"{ultimo['HomeTeam']} {int(ultimo['FTHG'])} - {int(ultimo['FTAG'])} {ultimo['AwayTeam']}"
        opciones = [
            f"🕓 El último duelo terminó {resultado} el {ultimo['Date'].date()}.",
            f"📅 En su más reciente enfrentamiento, el marcador fue {resultado} ({ultimo['Date'].date()}).",
            f"⏳ El último choque entre ambos acabó {resultado} el {ultimo['Date'].date()}."
        ]
        sugerencias.append(random.choice(opciones))
    except Exception:
        sugerencias.append(f"🕓 El último partido fue el {ultimo['Date'].date()}, pero no hay datos completos de goles.")

    return sugerencias

def generar_sugerencias_racha_equipo(df: pd.DataFrame, equipo: str) -> list[str]:
    """
    Genera frases inteligentes y variadas sobre la racha reciente de un equipo.
    Considera victorias, empates, derrotas, goles a favor y en contra.
    """
    sugerencias = []
    df = df.sort_values(by="Date", ascending=False).reset_index(drop=True)

    if df.empty:
        return [f"No hay datos recientes para {equipo}."]

    victorias, empates, derrotas = 0, 0, 0
    sin_goles, porterias_cero = 0, 0
    goles_a_favor_list, goles_en_contra_list = [], []

    for _, row in df.iterrows():
        if row['HomeTeam'] == equipo:
            gf, gc, resultado = row['FTHG'], row['FTAG'], row['FTR']
            if resultado == 'H': victorias += 1
            elif resultado == 'D': empates += 1
            else: derrotas += 1
        elif row['AwayTeam'] == equipo:
            gf, gc, resultado = row['FTAG'], row['FTHG'], row['FTR']
            if resultado == 'A': victorias += 1
            elif resultado == 'D': empates += 1
            else: derrotas += 1
        else:
            continue

        goles_a_favor_list.append(gf)
        goles_en_contra_list.append(gc)
        if gf == 0: sin_goles += 1
        if gc == 0: porterias_cero += 1

    total = len(df)
    promedio_gf = sum(goles_a_favor_list) / total if total else 0
    promedio_gc = sum(goles_en_contra_list) / total if total else 0

    # --- Racha de victorias ---
    if victorias >= 3:
        opciones = [
            f"🚀 {equipo} está en racha: {victorias} victorias en sus últimos {total} partidos.",
            f"🔥 {equipo} ha ganado {victorias} de sus últimos {total} encuentros.",
            f"🏆 {equipo} atraviesa un gran momento con {victorias} triunfos recientes."
        ]
        sugerencias.append(random.choice(opciones))

    # --- Falta de gol ---
    if sin_goles >= 2:
        opciones = [
            f"❌ {equipo} se quedó sin marcar en {sin_goles} de sus últimos {total} partidos.",
            f"🥱 {equipo} ha tenido problemas ofensivos: {sin_goles} juegos sin anotar.",
            f"⚠️ {equipo} no vio puerta en {sin_goles} de los últimos {total} encuentros."
        ]
        sugerencias.append(random.choice(opciones))

    # --- Producción ofensiva ---
    if promedio_gf >= 2:
        opciones = [
            f"🎯 {equipo} promedia {promedio_gf:.2f} goles por partido últimamente.",
            f"⚡ Ataque encendido: {equipo} convierte {promedio_gf:.2f} goles por encuentro.",
            f"🔥 La delantera de {equipo} está intratable con {promedio_gf:.2f} goles de media."
        ]
        sugerencias.append(random.choice(opciones))
    elif promedio_gf < 1:
        opciones = [
            f"🥱 Baja producción ofensiva: solo {promedio_gf:.2f} goles por partido.",
            f"⚠️ {equipo} genera poco peligro con {promedio_gf:.2f} goles en promedio.",
            f"🔒 La ofensiva de {equipo} anda apagada: apenas {promedio_gf:.2f} tantos por duelo."
        ]
        sugerencias.append(random.choice(opciones))

    # --- Defensa ---
    if porterias_cero >= 2:
        opciones = [
            f"🧱 {equipo} dejó su arco en cero en {porterias_cero} de sus últimos {total} partidos.",
            f"🛡️ {equipo} mostró solidez defensiva: {porterias_cero} veces sin recibir goles.",
            f"🔒 Defensa firme: {equipo} mantuvo la portería imbatida {porterias_cero} veces recientemente."
        ]
        sugerencias.append(random.choice(opciones))
    if promedio_gc >= 2:
        opciones = [
            f"😬 {equipo} recibe demasiados goles: {promedio_gc:.2f} en promedio.",
            f"⚠️ Problemas atrás: {equipo} encaja {promedio_gc:.2f} goles por partido.",
            f"📉 La defensa de {equipo} está floja: {promedio_gc:.2f} goles en contra de media."
        ]
        sugerencias.append(random.choice(opciones))
    elif promedio_gc < 1:
        opciones = [
            f"🛡️ Defensa sólida: solo {promedio_gc:.2f} goles en contra por partido.",
            f"🧱 {equipo} casi no concede: {promedio_gc:.2f} tantos recibidos en promedio.",
            f"✅ Seguridad defensiva: apenas {promedio_gc:.2f} goles encajados."
        ]
        sugerencias.append(random.choice(opciones))

    # --- Empates / derrotas ---
    if empates >= 3:
        opciones = [
            f"⚖️ {equipo} ha empatado {empates} de sus últimos {total} partidos.",
            f"📊 Muchos empates: {equipo} terminó igualado {empates} veces.",
            f"🤝 {equipo} acumula {empates} empates recientes."
        ]
        sugerencias.append(random.choice(opciones))
    if derrotas >= 3:
        opciones = [
            f"📉 {equipo} atraviesa una mala racha con {derrotas} derrotas.",
            f"⚠️ {equipo} cayó derrotado en {derrotas} de sus últimos {total} encuentros.",
            f"❌ {equipo} no levanta cabeza: {derrotas} derrotas recientes."
        ]
        sugerencias.append(random.choice(opciones))

    # Limitamos a 4 frases como máximo
    return random.sample(sugerencias, min(4, len(sugerencias)))
