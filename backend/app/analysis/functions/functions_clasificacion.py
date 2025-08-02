import pandas as pd

def generar_clasificacion(df):
    equipos = pd.concat([df["HomeTeam"], df["AwayTeam"]]).unique()
    
    # Crear tabla base
    tabla = pd.DataFrame(index=equipos, columns=[
        "PJ", "PG", "PE", "PP", "GF", "GC", "DG", "Puntos"
    ]).fillna(0)

    for _, row in df.iterrows():
        home = row["HomeTeam"]
        away = row["AwayTeam"]
        fthg = row["FTHG"]
        ftag = row["FTAG"]

        # PJ
        tabla.loc[home, "PJ"] += 1
        tabla.loc[away, "PJ"] += 1

        # Goles a favor y en contra
        tabla.loc[home, "GF"] += fthg
        tabla.loc[home, "GC"] += ftag
        tabla.loc[away, "GF"] += ftag
        tabla.loc[away, "GC"] += fthg

        # Resultado
        if fthg > ftag:
            tabla.loc[home, "PG"] += 1
            tabla.loc[away, "PP"] += 1
            tabla.loc[home, "Puntos"] += 3
        elif fthg < ftag:
            tabla.loc[away, "PG"] += 1
            tabla.loc[home, "PP"] += 1
            tabla.loc[away, "Puntos"] += 3
        else:
            tabla.loc[home, "PE"] += 1
            tabla.loc[away, "PE"] += 1
            tabla.loc[home, "Puntos"] += 1
            tabla.loc[away, "Puntos"] += 1

    # Diferencia de goles
    tabla["DG"] = tabla["GF"] - tabla["GC"]

    # Ordenar por Puntos, DG, GF
    tabla = tabla.sort_values(by=["Puntos", "DG", "GF"], ascending=False).reset_index()
    tabla.rename(columns={"index": "Equipo"}, inplace=True)
    
    return tabla