import pandas as pd

from app.analysis.functions import get_data

def construir_estadisticas_equipos(df):
    equipos = pd.unique(df["HomeTeam"].tolist() + df["AwayTeam"].tolist())

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

def generar_sugerencias_enfrentamientos_directos(df: pd.DataFrame, equipo1: str, equipo2: str) -> list[str]:
    """
    Genera sugerencias basadas únicamente en enfrentamientos entre equipo1 y equipo2.
    """
    sugerencias = []
    df = df.copy()
    df['Date'] = pd.to_datetime(df['Date'])  # ✅ Conversión aquí
    df = df.sort_values(by="Date", ascending=False).reset_index(drop=True)
    total = len(df)

    if total == 0:
        return ["No hay datos de enfrentamientos entre ambos equipos."]

    # Conteo de resultados
    victorias_eq1 = 0
    victorias_eq2 = 0
    empates = 0
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
        elif ganador == 'Empate':
            empates += 1

    # Frases generadas
    if victorias_eq1 > victorias_eq2:
        sugerencias.append(f"🔥 {equipo1} ha ganado {victorias_eq1} de los últimos {total} partidos frente a {equipo2}.")
    elif victorias_eq2 > victorias_eq1:
        sugerencias.append(f"🔥 {equipo2} ha dominado este clásico con {victorias_eq2} victorias en los últimos {total} enfrentamientos.")
    else:
        sugerencias.append(f"⚖️ El historial reciente está parejo: ambos equipos han ganado {victorias_eq1} veces cada uno.")

    if empates >= 2:
        sugerencias.append(f"🤝 Empataron en {empates} de sus últimos {total} enfrentamientos.")

    # Último resultado
    ultimo = df.iloc[0]
    resultado = f"{ultimo['HomeTeam']} {int(ultimo['FTHG'])} - {int(ultimo['FTAG'])} {ultimo['AwayTeam']}"
    sugerencias.append(f"🕓 El último enfrentamiento terminó {resultado} el {ultimo['Date'].date()}.")  # Ya no dará error

    return sugerencias

def generar_sugerencias_racha_equipo(df: pd.DataFrame, equipo: str) -> list[str]:
    """
    Genera frases inteligentes sobre la racha reciente del equipo.
    Considera victorias, empates, derrotas, goles a favor y en contra.
    """
    sugerencias = []
    df = df.sort_values(by="Date", ascending=False).reset_index(drop=True)

    if df.empty:
        return [f"No hay datos recientes para {equipo}."]

    victorias = 0
    empates = 0
    derrotas = 0
    sin_goles = 0
    porterias_cero = 0
    goles_a_favor_list = []
    goles_en_contra_list = []

    for _, row in df.iterrows():
        if row['HomeTeam'] == equipo:
            gf = row['FTHG']
            gc = row['FTAG']
            resultado = row['FTR']
            if resultado == 'H':
                victorias += 1
            elif resultado == 'D':
                empates += 1
            else:
                derrotas += 1
        elif row['AwayTeam'] == equipo:
            gf = row['FTAG']
            gc = row['FTHG']
            resultado = row['FTR']
            if resultado == 'A':
                victorias += 1
            elif resultado == 'D':
                empates += 1
            else:
                derrotas += 1
        else:
            continue

        goles_a_favor_list.append(gf)
        goles_en_contra_list.append(gc)

        if gf == 0:
            sin_goles += 1
        if gc == 0:
            porterias_cero += 1

    total = len(df)
    promedio_gf = sum(goles_a_favor_list) / total if total else 0
    promedio_gc = sum(goles_en_contra_list) / total if total else 0

    # Análisis ofensivo
    if victorias >= 3:
        sugerencias.append(f"🚀 {equipo} viene encendido: {victorias} victorias en sus últimos {total} partidos.")
    if sin_goles >= 2:
        sugerencias.append(f"❌ {equipo} no ha marcado en {sin_goles} de sus últimos {total} encuentros.")
    if promedio_gf >= 2:
        sugerencias.append(f"🎯 {equipo} promedia {promedio_gf:.2f} goles por partido últimamente.")
    if promedio_gf < 1:
        sugerencias.append(f"🥱 Baja producción ofensiva: solo {promedio_gf:.2f} goles por partido.")

    # Análisis defensivo
    if porterias_cero >= 2:
        sugerencias.append(f"🧱 {equipo} mantuvo su portería a cero en {porterias_cero} de sus últimos {total} juegos.")
    if promedio_gc >= 2:
        sugerencias.append(f"😬 {equipo} recibe muchos goles: promedio de {promedio_gc:.2f} goles en contra.")
    if promedio_gc < 1:
        sugerencias.append(f"🛡️ Defensa sólida: solo {promedio_gc:.2f} goles en contra por partido.")

    # Empates/derrotas
    if empates >= 3:
        sugerencias.append(f"⚠️ {equipo} ha empatado {empates} de sus últimos {total} encuentros.")
    if derrotas >= 3:
        sugerencias.append(f"📉 {equipo} atraviesa una mala racha con {derrotas} derrotas.")

    return sugerencias[:4]
