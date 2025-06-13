from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from app import crud, schemas
from app.dependencies import get_db
from app.core.security import get_current_admin_user, get_current_active_user

router = APIRouter(
    prefix="/balances_usuario",
    tags=["Balances de Usuario"],
    dependencies=[Depends(get_current_active_user)], # Todos los terminales requieren un usuario activo
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=schemas.BalanceUsuario)
async def create_balance_usuario(
    balance: schemas.BalanceUsuarioCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede crear o inicializar
):
    """
    Crea un nuevo BalanceUsuario para un usuario.
    Esto debería ser llamado automáticamente al registrarse el usuario.
    Requiere privilegios de administrador si se ejecuta manualmente.
    """
    try:
        return await crud.create_balance_usuario(db=db, balance=balance)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Error de integridad de datos. Verifique el ID de usuario o si el balance ya existe para este usuario.")

@router.get("/{balance_id}", response_model=schemas.BalanceUsuario)
async def read_balance_usuario(balance_id: int, db: AsyncSession = Depends(get_db)):
    """
    Recupera un único BalanceUsuario por su ID. Accesible por cualquier usuario autenticado.
    """
    db_balance = await crud.get_balance_usuario(db, balance_id=balance_id)
    if db_balance is None:
        raise HTTPException(status_code=404, detail="Balance de usuario no encontrado")
    return db_balance

@router.get("/user/{user_id}", response_model=schemas.BalanceUsuario)
async def read_balance_by_user_id(
    user_id: int, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user)
):
    """
    Recupera el BalanceUsuario de un ID de Usuario específico.
    Los usuarios pueden ver su propio saldo, los administradores pueden ver cualquier saldo.
    """
    if current_user.id_usuario != user_id and not ("admin" in [current_user.rol.nombre_rol]): # Comprobar con usuario_actual.id_usuario
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No tienes permisos para ver este balance.")
        
    db_balance = await crud.get_balance_usuario_by_user_id(db, user_id=user_id)
    if db_balance is None:
        raise HTTPException(status_code=404, detail=f"Balance de usuario no encontrado para el ID de usuario {user_id}")
    return db_balance

@router.put("/{balance_id}", response_model=schemas.BalanceUsuario)
async def update_balance_usuario(
    balance_id: int, 
    balance: schemas.BalanceUsuarioUpdate, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede actualizar directamente
):
    """
    Actualiza un BalanceUsuario existente por su ID. Requiere privilegios de administrador.
    Este endpoint es para actualizaciones directas de admin, no para añadir/deducir monedas.
    """
    db_balance = await crud.update_balance_usuario(db=db, balance_id=balance_id, balance=balance)
    if db_balance is None:
        raise HTTPException(status_code=404, detail="Balance de usuario no encontrado")
    return db_balance

@router.post("/{user_id}/add_coins", response_model=schemas.BalanceUsuario)
async def add_coins_to_user_balance(
    user_id: int,
    data: schemas.BalanceAddDeduct,
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede añadir monedas
):
    """
    Añade monedas al saldo de un usuario. Requiere privilegios de administrador.
    Suele activarse al procesar correctamente un pago (p. ej., webhook de PayPal).
    """
    try:
        updated_balance = await crud.add_coins_to_balance(db, user_id, data.cantidad)
        return updated_balance
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{user_id}/deduct_coins", response_model=schemas.BalanceUsuario)
async def deduct_coins_from_user_balance(
    user_id: int,
    data: schemas.BalanceAddDeduct,
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user) # Cualquier usuario activo puede deducir sus propias monedas
):
    """
    Deduce monedas del saldo de un usuario.
    Los usuarios pueden deducir de su propio saldo. Los administradores pueden deducir del saldo de cualquier usuario.
    """
    if current_user.id_usuario != user_id and not ("admin" in [current_user.rol.nombre_rol]): # comprobar con usuario_actual.id_usuario
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No tienes permisos para deducir monedas de este usuario.")

    try:
        updated_balance = await crud.deduct_coins_from_balance(db, user_id, data.cantidad)
        return updated_balance
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{balance_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_balance_usuario(
    balance_id: int, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede eliminar
):
    """
    Elimina un BalanceUsuario por su ID. Requiere privilegios de administrador.
    """
    success = await crud.delete_balance_usuario(db=db, balance_id=balance_id)
    if not success:
        raise HTTPException(status_code=404, detail="Balance de usuario no encontrado")
    return {"message": "Balance de usuario eliminado exitosamente"}