from app.utils.model_storage import cargar_modelo_guardado, cargar_modelo_predictivo

class GlobalState:
    def __init__(self):
        self.modelo_global = cargar_modelo_guardado()
        self.modelo_predictivo = cargar_modelo_predictivo()
        self.perfiles_clusters = None

state = GlobalState()