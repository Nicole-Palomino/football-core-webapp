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
            "Posesión ofensiva": round(posesion_ofensiva, 2),
            "Eficiencia ofensiva": round(eficiencia_ofensiva, 2),
            "Indisciplina": round(disciplina, 2),
            "Goles local/prom": round(fuerza_local, 2),
            "Goles visita/prom": round(fuerza_visitante, 2),
        })

    return pd.DataFrame(stats).sort_values("Eficiencia ofensiva", ascending=False)

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