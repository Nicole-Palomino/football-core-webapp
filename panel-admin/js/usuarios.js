// Elementos del formulario de partidos
const userForm = document.getElementById('user-form');
const userIdInput = document.getElementById('user-id');
const userNameInput = document.getElementById('user-name');
const emailUserInput = document.getElementById('email-user');
const contrasenaUserInput = document.getElementById('contrasena');
const userEstadoSelect = document.getElementById('user-estado');
const userRolSelect = document.getElementById('user-rol');
const userFormTitle = document.getElementById('user-form-title');
const cancelUserEditBtn = document.getElementById('cancel-user-edit');
const usersTableBody = document.getElementById('users-table-body');

// Variables para almacenar datos de estados y roles para los selectores de usuario
let allEstados = [];
let allRoles = [];

// --- Funciones para Usuarios ---
/**
 * Carga los datos iniciales para los selectores de estados y roles.
 */
async function loadLookupDataForUsers() {
    try {
        allEstados = await window.api.getEstados();
        allRoles = await window.api.getRoles();

        // Limpiar y poblar el selector de estados
        userEstadoSelect.innerHTML = '<option value="">Seleccione un estado</option>';
        allEstados.forEach(estado => {
            const option = document.createElement('option');
            option.value = estado.id_estado;
            option.textContent = estado.nombre_estado;
            userEstadoSelect.appendChild(option);
        });

        // Limpiar y poblar el selector de roles
        userRolSelect.innerHTML = '<option value="">Seleccione un rol</option>';
        allRoles.forEach(rol => {
            const option = document.createElement('option');
            option.value = rol.id_rol;
            option.textContent = rol.nombre_rol;
            userRolSelect.appendChild(option);
        });

    } catch (error) {
        console.error('Error al cargar datos de lookup para usuarios:', error);
        showAlert('error', 'Error de carga', 'No se pudieron cargar los estados y roles.');
    }
}

/**
 * Carga y muestra la lista de usuarios.
 */
async function loadUsers() {
    usersTableBody.innerHTML = `<tr><td colspan="9" class="text-center py-4"><div class="d-flex align-items-center justify-content-center"><div class="spinner-border text-primary spinner-border-sm me-2" role="status"><span class="visually-hidden">Cargando...</span></div> Cargando usuarios...</div></td></tr>`;
    try {
        await loadLookupDataForUsers(); // Asegurar que los datos de lookup estén cargados
        const users = await window.api.getUsers();

        usersTableBody.innerHTML = ''; // Limpiar mensaje de carga

        if (users.length === 0) {
            usersTableBody.innerHTML = `<tr><td colspan="9" class="text-center py-4 text-muted">No hay usuarios registrados.</td></tr>`;
            return;
        }

        users.forEach(user => {
            const row = document.createElement('tr');
            // Mapear id_estado e id_rol a nombres
            const estadoName = allEstados.find(e => e.id_estado === user.estado.id_estado)?.nombre_estado || 'Desconocido';
            const rolName = allRoles.find(r => r.id_rol === user.rol.id_rol)?.nombre_rol || 'Desconocido';
            const registroFormatted = user.registro ? new Date(user.registro).toLocaleString() : 'N/A';

            row.innerHTML = `
                        <td>${user.id_usuario}</td>
                        <td>${user.usuario}</td>
                        <td>${user.correo}</td>
                        <td>${estadoName}</td>
                        <td>${rolName}</td>
                        <td>${registroFormatted}</td>
                        <td>
                            <button data-id="${user.id_usuario}" class="edit-user-btn btn btn-warning btn-sm me-1 btn-action">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button data-id="${user.id_usuario}" class="delete-user-btn btn btn-danger btn-sm btn-action">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    `;
            usersTableBody.appendChild(row);
        });

        document.querySelectorAll('.edit-user-btn').forEach(button => {
            button.onclick = (e) => editUser(e.currentTarget.dataset.id);
        });
        document.querySelectorAll('.delete-user-btn').forEach(button => {
            button.onclick = (e) => deleteUser(e.currentTarget.dataset.id);
        });

    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        usersTableBody.innerHTML = `<tr><td colspan="9" class="text-center py-4 text-danger">Error al cargar usuarios. Por favor, inténtalo de nuevo.</td></tr>`;
    }
}

/**
 * Maneja el envío del formulario de usuario (añadir/editar).
 * @param {Event} event El evento de envío del formulario.
 */
userForm.onsubmit = async (event) => {
    event.preventDefault();

    const userData = {
        usuario: userNameInput.value,
        correo: emailUserInput.value,
        id_estado: parseInt(userEstadoSelect.value),
        id_rol: parseInt(userRolSelect.value)
    };

    // Solo incluye la contraseña si se ha ingresado un valor
    if (contrasenaUserInput.value) {
        userData.contrasena = contrasenaUserInput.value;
    }

    const userId = userIdInput.value;
    let result;

    try {
        if (userId) {
            userData.id = parseInt(userId);
            result = await window.api.updateUser(userData);
        } else {
            // La contraseña es obligatoria para nuevos usuarios
            if (!userData.contrasena) {
                showAlert('error', 'Error de Validación', 'La contraseña es obligatoria para nuevos usuarios.');
                return;
            }
            result = await window.api.addUser(userData);
        }

        if (result.success !== false) { // Verifica si no es un objeto de error explícito
            showAlert('success', 'Éxito', userId ? 'Usuario actualizado con éxito.' : 'Usuario añadido con éxito.');
            resetUserForm();
            loadUsers(); // Recargar la lista de usuarios
            updateDashboard(); // Actualizar el dashboard
        } else {
            showAlert('error', 'Error', result.message || 'Error desconocido al guardar el usuario.');
        }
    } catch (error) {
        console.error('Error al guardar usuario:', error);
        showAlert('error', 'Error', `Error de red o servidor: ${error.message}`);
    }
};

/**
 * Carga los datos de un usuario en el formulario para su edición.
 * @param {string} id El ID del usuario a editar.
 */
async function editUser(id) {
    try {
        // Asegurar que los selectores están poblados antes de intentar seleccionar
        await loadLookupDataForUsers();

        const users = await window.api.getUsers();
        const user = users.find(u => u.id_usuario === parseInt(id)); // Usar === para comparar string con number

        if (user) {
            userIdInput.value = user.id_usuario;
            userNameInput.value = user.usuario;
            emailUserInput.value = user.correo;
            userEstadoSelect.value = user.id_estado;
            userRolSelect.value = user.id_rol;
            contrasenaUserInput.value = ''; // Siempre limpiar al editar por seguridad

            userFormTitle.textContent = 'Editar Usuario';
            cancelUserEditBtn.classList.remove('d-none');
            // Hacer la contraseña opcional para editar
            contrasenaUserInput.placeholder = 'Dejar en blanco para no cambiar';
            contrasenaUserInput.removeAttribute('required'); // Asegurar que no sea requerido si se edita
        } else {
            showAlert('error', 'Error', 'Usuario no encontrado para editar.');
        }
    } catch (error) {
        console.error('Error al cargar datos del usuario para edición:', error);
        showAlert('error', 'Error', 'Error al cargar datos del usuario.');
    }
}

/**
 * Elimina un usuario.
 * @param {string} id El ID del usuario a eliminar.
 */
async function deleteUser(id) {
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
                const deleteResult = await window.api.deleteUser(id);

                if (deleteResult) {
                    showAlert('success', '¡Eliminado!', 'El usuario ha sido eliminado.');
                    loadUsers(); // Recargar la lista de usuarios
                    updateDashboard(); // Actualizar el dashboard
                } else {
                    showAlert('error', 'Error', 'Error al eliminar el usuario.');
                }
            } catch (error) {
                console.error('Error al eliminar usuario:', error);
                showAlert('error', 'Error', 'Error de red o servidor al eliminar el usuario.');
            }
        }
    });
}

/**
 * Resetea el formulario de usuarios a su estado inicial de "añadir".
 */
function resetUserForm() {
    userForm.reset();
    userIdInput.value = '';
    userFormTitle.textContent = 'Añadir Nuevo Usuario';
    cancelUserEditBtn.classList.add('d-none');
    contrasenaUserInput.setAttribute('required', 'required'); // Hacer la contraseña requerida para añadir
    contrasenaUserInput.placeholder = '********'; // Restaurar placeholder original
    // Asegurar que los selectores se restablecen a la opción por defecto si hay una vacía
    userEstadoSelect.value = '';
    userRolSelect.value = '';
}

cancelUserEditBtn.onclick = resetUserForm;