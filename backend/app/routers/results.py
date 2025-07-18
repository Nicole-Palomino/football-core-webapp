from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db
from app import crud, schemas, routers
from app.core.security import get_current_admin_user, get_current_active_user

router = APIRouter(
    prefix="/resultados", 
    tags=["Resultados"],
    dependencies=[Depends(get_current_active_user)], # Todos los endpoints de este router requieren un usuario activo
    responses={404: {"description": "Not found"}},
),

# ----- KMeans -----
# ✅ 
@router.get("/kmeans/", response_model=list[schemas.kmeans.ResultadoKMeans])
async def read_kmeans(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    return await crud.crud_results_kmeans.get_resultados_kmeans(db, skip, limit)

# ⚠️
@router.get("/kmeans/{id_historial}", response_model=schemas.kmeans.ResultadoKMeans)
async def read_kmeans_resultado(id_historial: int, db: AsyncSession = Depends(get_db)):
    db_resultado = await crud.crud_results_kmeans.get_resultado_kmeans(db, id_historial)
    if not db_resultado:
        raise HTTPException(status_code=404, detail="Resultado no encontrado")
    return db_resultado

# ✅ 
@router.post("/kmeans/", response_model=schemas.kmeans.ResultadoKMeans)
async def create_kmeans_resultado(
    id_partido: int, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede crear
):
    partido = await crud.crud_match.get_partido_by_id(db, id_partido)
    if not partido:
        raise HTTPException(status_code=404, detail="Partido no encontrado")
    
    equipo_1_id = partido.id_equipo_local
    equipo_2_id = partido.id_equipo_visita

    resultado = await routers.matches.predecir_cluster_automatico(equipo_1_id, equipo_2_id, db)

    nuevo_resultado = schemas.ResultadoKMeansCreate(
        id_partido=id_partido,
        cluster_predicho=resultado["cluster_predicho"],
        resumen=resultado["resumen"],
        predicciones=resultado["predicciones"]
    )

    resultado_creado = await crud.crud_results_kmeans.create_resultado_kmeans(db, nuevo_resultado)
    return resultado_creado

# ✅ 
@router.put("/kmeans/{id_historial}", response_model=schemas.kmeans.ResultadoKMeans)
async def update_kmeans_resultado(
    id_historial: int, 
    resultado: schemas.kmeans.ResultadoKMeansUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede crear
):
    return await crud.crud_results_kmeans.update_resultado_kmeans(db, id_historial, resultado)

# ✅ 
@router.delete("/kmeans/{id_historial}")
async def delete_kmeans_resultado(
    id_historial: int, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede crear
):
    success = await crud.crud_results_kmeans.delete_resultado_kmeans(db, id_historial)
    if not success:
        raise HTTPException(status_code=404, detail="Resultado no encontrado")
    return {"ok": True}


# ----- Random Forest -----
# ✅ 
@router.get("/rf/", response_model=list[schemas.random_forest.ResultadoRF])
async def read_rf(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    return await crud.crud_results_rf.get_resultados_rf(db, skip, limit)

# ⚠️
@router.get("/rf/{id_historial}", response_model=schemas.random_forest.ResultadoRF)
async def read_rf_resultado(id_historial: int, db: AsyncSession = Depends(get_db)):
    db_resultado = await crud.crud_results_rf.get_resultado_rf(db, id_historial)
    if not db_resultado:
        raise HTTPException(status_code=404, detail="Resultado no encontrado")
    return db_resultado

# ✅ 
@router.post("/rf/", response_model=schemas.random_forest.ResultadoRF)
async def create_rf_resultado(
    id_partido: int, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede crear
):
    partido = await crud.crud_match.get_partido_by_id(db, id_partido)
    if not partido:
        raise HTTPException(status_code=404, detail="Partido no encontrado")
    
    equipo_1_id = partido.id_equipo_local
    equipo_2_id = partido.id_equipo_visita

    resultado = await routers.matches.predecir_cluster_modelo(equipo_1_id, equipo_2_id, db)

    nuevo_resultado = schemas.ResultadoRFCreate(
        id_partido=id_partido,
        cluster_predicho=resultado["cluster_predicho"],
        resumen=resultado["resumen"],
        predicciones=resultado["predicciones"]
    )
    
    resultado_creado = await crud.crud_results_rf.create_resultado_rf(db, nuevo_resultado)
    return resultado_creado

# ✅ 
@router.put("/rf/{id_historial}", response_model=schemas.random_forest.ResultadoRF)
async def update_rf_resultado(
    id_historial: int, 
    resultado: schemas.random_forest.ResultadoRFUpdate, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede crear
):
    return await crud.crud_results_rf.update_resultado_rf(db, id_historial, resultado)

# ✅
@router.delete("/rf/{id_historial}")
async def delete_rf_resultado(
    id_historial: int, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede crear
):
    success = await crud.crud_results_rf.delete_resultado_rf(db, id_historial)
    if not success:
        raise HTTPException(status_code=404, detail="Resultado no encontrado")
    return {"ok": True}