import joblib
from pathlib import Path

def cargar_modelo_guardado():
    ruta = Path("app/storage/modelo_kmeans.pkl")
    if ruta.exists():
        return joblib.load(ruta)
    return None

def guardar_modelo(modelo):
    ruta = Path("app/storage/modelo_kmeans.pkl")
    joblib.dump(modelo, ruta)

def guardar_modelo_predictivo(modelo):
    ruta = Path("app/storage/modelo_predictivo.pkl")
    joblib.dump(modelo, ruta)

def cargar_modelo_predictivo():
    ruta = Path("app/storage/modelo_predictivo.pkl")
    if ruta.exists():
        return joblib.load(ruta)
    return None