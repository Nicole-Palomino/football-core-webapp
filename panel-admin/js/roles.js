// Elementos del formulario de roles
const rolForm = document.getElementById('rol-form');
const rolIdInput = document.getElementById('rol-id');
const rolNameInput = document.getElementById('rol-name');
const rolFormTitle = document.getElementById('rol-form-title');
const cancelRolEditBtn = document.getElementById('cancel-rol-edit');
const rolesTableBody = document.getElementById('roles-table-body');

// --- Funciones para Roles ---
async function loadRoles() {
    rolesTableBody.innerHTML = `<tr><td colspan="3" class="text-center py-4"><div class="d-flex align-items-center justify-content-center"><div class="spinner-border text-primary spinner-border-sm me-2" role="status"><span class="visually-hidden">Cargando...</span></div> Cargando roles...</div></td></tr>`;
    try {
        const roles = await window.api.getRoles();
        rolesTableBody.innerHTML = '';
        if (roles.length === 0) {
            rolesTableBody.innerHTML = `<tr><td colspan="3" class="text-center py-4 text-muted">No hay roles registrados.</td></tr>`;
            return;
        }
        roles.forEach(rol => {
            const row = document.createElement('tr');
            row.innerHTML = `
                        <td>${rol.id_rol}</td>
                        <td>${rol.nombre_rol}</td>
                        <td>${rol.created_at}</td>
                        <td>
                            <button data-id="${rol.id_rol}" class="edit-rol-btn btn btn-warning btn-sm me-1 btn-action">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button data-id="${rol.id_rol}" class="delete-rol-btn btn btn-danger btn-sm btn-action">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    `;
            rolesTableBody.appendChild(row);
        });
        document.querySelectorAll('.edit-rol-btn').forEach(button => {
            button.onclick = (e) => editRol(e.currentTarget.dataset.id);
        });
        document.querySelectorAll('.delete-rol-btn').forEach(button => {
            button.onclick = (e) => deleteRol(e.currentTarget.dataset.id);
        });
    } catch (error) {
        console.error('Error al cargar roles:', error);
        rolesTableBody.innerHTML = `<tr><td colspan="3" class="text-center py-4 text-danger">Error al cargar roles. Por favor, inténtalo de nuevo.</td></tr>`;
    }
}

rolForm.onsubmit = async (event) => {
    event.preventDefault();
    const rolData = { nombre_rol: rolNameInput.value };
    const rolId = rolIdInput.value;
    let success = false;
    let message = '';
    try {
        if (rolId) {
            rolData.id = rolId;
            const result = await window.api.updateRol(rolData);
            if (result) {
                message = 'Rol actualizado con éxito.';
                success = true;
            } else {
                message = 'Error al actualizar el rol.';
            }
        } else {
            const result = await window.api.addRol(rolData);
            if (result) {
                message = 'Rol añadido con éxito.';
                success = true;
            } else {
                message = 'Error al añadir el rol.';
            }
        }
    } catch (error) {
        console.error('Error al guardar rol:', error);
        message = `Error de red o servidor: ${error.message}`;
        success = false;
    }
    if (success) {
        showAlert('success', 'Éxito', message);
        resetRolForm();
        loadRoles();
    } else {
        showAlert('error', 'Error', message);
    }
};

async function editRol(id) {
    try {
        const roles = await window.api.getRoles();
        const rol = roles.find(r => r.id_rol === parseInt(id));
        if (rol) {
            rolIdInput.value = rol.id_rol;
            rolNameInput.value = rol.nombre_rol;
            rolFormTitle.textContent = 'Editar Rol';
            cancelRolEditBtn.classList.remove('d-none');
        } else {
            showAlert('error', 'Error', 'Rol no encontrado para editar.');
        }
    } catch (error) {
        console.error('Error al cargar datos del rol para edición:', error);
        showAlert('error', 'Error', 'Error al cargar datos del rol.', false);
    }
}

async function deleteRol(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, ¡eliminar!',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const deleteResult = await window.api.deleteRol(id);
                if (deleteResult) {
                    showAlert('success', '¡Eliminado!', 'El rol ha sido eliminado.');
                    loadRoles();
                } else {
                    showAlert('error', 'Error', 'Error al eliminar el rol.');
                }
            } catch (error) {
                console.error('Error al eliminar rol:', error);
                showAlert('error', 'Error', 'Error de red o servidor al eliminar el rol.');
            }
        }
    });
}

function resetRolForm() {
    rolForm.reset();
    rolIdInput.value = '';
    rolFormTitle.textContent = 'Añadir Nuevo Rol';
    cancelRolEditBtn.classList.add('d-none');
}
cancelRolEditBtn.onclick = resetRolForm;