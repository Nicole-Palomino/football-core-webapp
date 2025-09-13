from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app import crud, schemas, models
from app.core.security import get_current_admin_user, get_current_active_user
from app.core.logger import logger
from app.middlewares.rate_limit import limiter

router = APIRouter(
    prefix="/users",
    tags=["Users"],
    dependencies=[Depends(get_current_active_user)], # Todos los terminales requieren un usuario activo
    responses={404: {"description": "Not found"}},
)

# finished || tested || used
@router.get("/", response_model=list[schemas.User], dependencies=[Depends(get_current_admin_user)])
@limiter.limit("5/minute")
async def read_users(
    request: Request,
    skip: int = 0, 
    limit: int = 100, 
    db: AsyncSession = Depends(get_db),
):
    """
    Recupera una lista de todos los Usuarios. 
    ⚠️ Solo accesible por administradores.
    """
    client_ip = request.client.host
    logger.info(f"[ACCESO ADMIN] Consulta desde {client_ip} a {request.url.path}")

    usuarios = await crud.crud_user.get_all_users(db, skip=skip, limit=limit)
    return usuarios

# finished || tested
@router.get("/{user_id}", response_model=schemas.User, dependencies=[Depends(get_current_admin_user)])
@limiter.limit("5/minute")
async def read_user_by_id(
    request: Request,
    user_id: int,
    db: AsyncSession = Depends(get_db), 
):
    """
    Recupera un único usuario por ID. Requiere privilegios de administrador.
    """
    client_ip = request.client.host
    logger.info(f"[ACCESO ADMIN] Consulta desde {client_ip} a {request.url.path} (user_id={user_id})")

    db_user = await crud.get_user(db, user_id=user_id)
    if db_user is None:
        logger.warning(f"[NO ENCONTRADO] Usuario con id={user_id} solicitado desde {client_ip}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Usuario no encontrado"
        )
    
    logger.info(f"[ENCONTRADO] Usuario con id={user_id} consultado exitosamente por {client_ip}")
    return db_user

# finished || tested
@router.put("/{user_id}")
async def update_user_endpoint(
    user_id: int, 
    user_update: schemas.UserUpdate, 
    db: AsyncSession = Depends(get_db), 
):
    """
    Actualiza un usuario existente por ID.
    """
    try:
        logger.info(f"Intentando actualizar usuario con ID: {user_id}")
        
        # Llamamos al CRUD robusto
        db_user = await crud.update_user(db, user_id, user_update)

        if db_user is None:
            logger.warning(f"Usuario con ID {user_id} no encontrado.")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Usuario no encontrado"
            )

        logger.info(f"Usuario con ID {user_id} actualizado exitosamente.")
        return db_user

    except ValueError as e:
        logger.error(f"Error de validación al actualizar usuario {user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=str(e)
        )
    except IntegrityError as e:
        logger.error(f"Error de integridad al actualizar usuario {user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Error de integridad de datos. Verifique los IDs de estado y rol, o unicidad de usuario/correo."
        )

# finished || tested || used
@router.put("/admin/{user_id}", dependencies=[Depends(get_current_admin_user)])
async def update_admin_endpoint(
    user_id: int, 
    user_update: schemas.user.UserUpdateAdmin, 
    db: AsyncSession = Depends(get_db), 
    admin_user: schemas.user.User = Depends(get_current_admin_user)
):
    """
    Actualiza un usuario existente por ID (solo administradores).
    Permite modificar todos los campos.
    """
    try:
        db_user = await crud.crud_user.update_admin(db, user_id, user_update)
        if db_user is None:
            logger.warning(f"Admin {admin_user.id_usuario} intentó actualizar usuario {user_id} pero no fue encontrado.")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Usuario no encontrado"
            )

        logger.info(f"Admin {admin_user.id_usuario} actualizó usuario {user_id} con datos: {user_update.model_dump(exclude_unset=True)}")
        return db_user

    except ValueError as e:
        logger.error(f"Error al actualizar usuario {user_id} por admin {admin_user.id_usuario}: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except IntegrityError:
        logger.error(f"Error de integridad al actualizar usuario {user_id} por admin {admin_user.id_usuario}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error de integridad de datos. Verifique los IDs de estado y rol, o unicidad de usuario/correo."
        )
    
# finished || tested || used
@router.delete("/{user_id}", status_code=status.HTTP_200_OK, dependencies=[Depends(get_current_admin_user)])
async def delete_user_endpoint(
    user_id: int, 
    db: AsyncSession = Depends(get_db), 
    admin_user: schemas.user.User = Depends(get_current_admin_user)
):
    """
    Elimina un usuario por ID. Requiere privilegios de administrador.
    """
    success = await crud.delete_user(db, user_id)
    if not success:
        logger.warning(f"Admin {admin_user.id_usuario} intentó eliminar usuario {user_id} pero no fue encontrado.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    logger.info(f"Admin {admin_user.id_usuario} eliminó usuario {user_id}")
    return {"message": "Usuario eliminado exitosamente"}

# finished || tested || used
@router.get("/stats/total", response_model=int, status_code=status.HTTP_200_OK)
async def get_total_users(db: AsyncSession = Depends(get_db)):
    """Devuelve el total de usuarios registrados"""
    result = await db.execute(select(func.count()).select_from(models.User))
    total = result.scalar()
    logger.info(f"Total de usuarios consultado: {total}")
    return total

# finished || tested || used
@router.get("/stats/usuarios-por-dia", status_code=status.HTTP_200_OK)
async def stat_users_by_date(db: AsyncSession = Depends(get_db)):
    """Devuelve la cantidad de usuarios registrados por día"""
    datos = await crud.crud_user.get_usuarios_por_dia(db)
    logger.info(f"Usuarios por día: {datos}")
    return [{"fecha": str(fecha), "cantidad": cantidad} for fecha, cantidad in datos]