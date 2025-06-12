from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app import crud, schemas
from app.core.security import get_current_admin_user, get_current_active_user
from app.crud import crud_rol, crud_estado

router = APIRouter(
    prefix="/users",
    tags=["Users"],
    dependencies=[Depends(get_current_active_user)], # Todos los terminales requieren un usuario activo
    responses={404: {"description": "Not found"}},
)

# Nota: El POST /users/ endpoint para crear un usuario ha sido movido a /auth/register
# ya que suele formar parte del flujo de autenticación.

@router.get("/{user_id}", response_model=schemas.User)
async def read_user(user_id: int, db: AsyncSession = Depends(get_db), current_user: schemas.User = Depends(get_current_admin_user)):
    """
    Recupera un único usuario por ID. Requiere privilegios de administrador.
    """
    db_user = await crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return db_user

@router.put("/{user_id}", response_model=schemas.User)
async def update_user_endpoint(
    user_id: int, 
    user_update: schemas.UserUpdate, 
    db: AsyncSession = Depends(get_db), 
    current_user: schemas.User = Depends(get_current_admin_user)
):
    """
    Actualiza un usuario existente por ID. Requiere privilegios de administrador.
    """
    try:
        db_user = await crud.update_user(db, user_id, user_update)
        if db_user is None:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        return db_user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Error de integridad de datos. Verifique los IDs de estado y rol, o unicidad de usuario/correo.")


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_endpoint(user_id: int, db: AsyncSession = Depends(get_db), current_user: schemas.User = Depends(get_current_admin_user)):
    """
    Elimina un usuario por ID. Requiere privilegios de administrador.
    """
    success = await crud.delete_user(db, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return {"message": "Usuario eliminado exitosamente"}

# Los métodos de asignación/eliminación de roles ya no son necesarios ya que id_rol es directo sobre la tabla User.
# Si necesitas cambiar el rol de un usuario, usarías el endpoint PUT /users/{user_id} y actualizarías id_rol.
