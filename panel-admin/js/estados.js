// Elementos del formulario de estados
const estadoForm = document.getElementById('estado-form');
const estadoIdInput = document.getElementById('estado-id');
const estadoNameInput = document.getElementById('estado-name');
const estadoFormTitle = document.getElementById('estado-form-title');
const cancelEstadoEditBtn = document.getElementById('cancel-estado-edit');
const estadosTableBody = document.getElementById('estados-table-body');

// --- Funciones para Estados ---
async function loadEstados() {
    estadosTableBody.innerHTML = `<tr><td colspan="3" class="text-center py-4"><div class="d-flex align-items-center justify-content-center"><div class="spinner-border text-primary spinner-border-sm me-2" role="status"><span class="visually-hidden">Cargando...</span></div> Cargando estados...</div></td></tr>`;
    try {
        const estados = await window.api.getEstados();
        estadosTableBody.innerHTML = '';
        if (estados.length === 0) {
            estadosTableBody.innerHTML = `<tr><td colspan="3" class="text-center py-4 text-muted">No hay estados registrados.</td></tr>`;
            return;
        }
        estados.forEach(estado => {
            const row = document.createElement('tr');
            row.innerHTML = `
                        <td>${estado.id_estado}</td>
                        <td>${estado.nombre_estado}</td>
                        <td>${estado.created_at}</td>
                        <td>
                            <button data-id="${estado.id_estado}" class="edit-estado-btn btn btn-warning btn-sm me-1 btn-action">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button data-id="${estado.id_estado}" class="delete-estado-btn btn btn-danger btn-sm btn-action">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    `;
            estadosTableBody.appendChild(row);
        });
        document.querySelectorAll('.edit-estado-btn').forEach(button => {
            button.onclick = (e) => editEstado(e.currentTarget.dataset.id);
        });
        document.querySelectorAll('.delete-estado-btn').forEach(button => {
            button.onclick = (e) => deleteEstado(e.currentTarget.dataset.id);
        });
    } catch (error) {
        console.error('Error al cargar estados:', error);
        estadosTableBody.innerHTML = `<tr><td colspan="3" class="text-center py-4 text-danger">Error al cargar estados. Por favor, inténtalo de nuevo.</td></tr>`;
    }
}

estadoForm.onsubmit = async (event) => {
    event.preventDefault();
    const estadoData = { nombre_estado: estadoNameInput.value };
    const estadoId = estadoIdInput.value;
    let success = false;
    let message = '';
    try {
        if (estadoId) {
            estadoData.id = estadoId;
            const result = await window.api.updateEstado(estadoData);
            if (result) {
                message = 'Estado actualizado con éxito.';
                success = true;
            } else {
                message = 'Error al actualizar el estado.';
            }
        } else {
            const result = await window.api.addEstado(estadoData);
            if (result) {
                message = 'Estado añadido con éxito.';
                success = true;
            } else {
                message = 'Error al añadir el estado.';
            }
        }
    } catch (error) {
        console.error('Error al guardar estado:', error);
        message = `Error de red o servidor: ${error.message}`;
        success = false;
    }
    if (success) {
        showAlert('success', 'Éxito', message);
        resetEstadoForm();
        loadEstados();
    } else {
        showAlert('error', 'Error', message);
    }
};

async function editEstado(id) {
    try {
        const estados = await window.api.getEstados();
        const estado = estados.find(e => e.id_estado === parseInt(id));
        if (estado) {
            estadoIdInput.value = estado.id_estado;
            estadoNameInput.value = estado.nombre_estado;
            estadoFormTitle.textContent = 'Editar Estado';
            cancelEstadoEditBtn.classList.remove('d-none');
        } else {
            showAlert('error', 'Error', 'Estado no encontrado para editar.');
        }
    } catch (error) {
        console.error('Error al cargar datos del estado para edición:', error);
        showAlert('error', 'Error', 'Error al cargar datos del estado.');
    }
}

async function deleteEstado(id) {
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
                const deleteResult = await window.api.deleteEstado(id);
                if (deleteResult) {
                    showAlert('success', '¡Eliminado!', 'El estado ha sido eliminado.');
                    loadEstados();
                } else {
                    showAlert('error', 'Error', 'Error al eliminar el estado.');
                }
            } catch (error) {
                console.error('Error al eliminar estado:', error);
                showAlert('error', 'Error', 'Error de red o servidor al eliminar el estado.');
            }
        }
    });
}

function resetEstadoForm() {
    estadoForm.reset();
    estadoIdInput.value = '';
    estadoFormTitle.textContent = 'Añadir Nuevo Estado';
    cancelEstadoEditBtn.classList.add('d-none');
}
cancelEstadoEditBtn.onclick = resetEstadoForm;