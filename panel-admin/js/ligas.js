// Elementos del formulario de equipos
const ligaForm = document.getElementById('liga-form');
const ligaIdInput = document.getElementById('liga-id');
const ligaNameInput = document.getElementById('liga-name');
const ligaCountryInput = document.getElementById('liga-country');
const ligaLogoInput = document.getElementById('liga-logo')
const ligaLogoCountryInput = document.getElementById('liga-logo')
const ligaFormTitle = document.getElementById('liga-form-title');
const cancelLigaEditBtn = document.getElementById('cancel-liga-edit');
const ligasTableBody = document.getElementById('ligas-table-body');

// --- Funciones para Ligas ---

/**
 * Carga y muestra la lista de ligas.
 */
async function loadLigas() {
    ligasTableBody.innerHTML = `<tr><td colspan="9" class="text-center py-4"><div class="d-flex align-items-center justify-content-center"><div class="spinner-border text-primary spinner-border-sm me-2" role="status"><span class="visually-hidden">Cargando...</span></div> Cargando ligas...</div></td></tr>`;
    try {
        const ligas = await window.api.getLigas();

        ligasTableBody.innerHTML = ''; // Limpiar mensaje de carga

        if (ligas.length === 0) {
            ligasTableBody.innerHTML = `<tr><td colspan="9" class="text-center py-4 text-muted">No hay ligas registradas.</td></tr>`;
            return;
        }

        ligas.forEach(liga => {
            const row = document.createElement('tr');

            row.innerHTML = `
                        <td>${liga.id_liga}</td>
                        <td>${liga.nombre_liga}</td>
                        <td>${liga.pais}</td>
                        <td>
                            <button data-id="${liga.id_liga}" class="edit-liga-btn btn btn-warning btn-sm me-1 btn-action">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button data-id="${liga.id_liga}" class="delete-liga-btn btn btn-danger btn-sm btn-action">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    `;
            ligasTableBody.appendChild(row);
        });

        document.querySelectorAll('.edit-liga-btn').forEach(button => {
            button.onclick = (e) => editLiga(e.currentTarget.dataset.id);
        });
        document.querySelectorAll('.delete-liga-btn').forEach(button => {
            button.onclick = (e) => deleteLiga(e.currentTarget.dataset.id);
        });

    } catch (error) {
        console.error('Error al cargar ligas:', error);
        ligasTableBody.innerHTML = `<tr><td colspan="9" class="text-center py-4 text-danger">Error al cargar ligas. Por favor, inténtalo de nuevo.</td></tr>`;
    }
}

/**
 * Maneja el envío del formulario de liga (añadir/editar).
 * @param {Event} event El evento de envío del formulario.
 */
ligaForm.onsubmit = async (event) => {
    event.preventDefault();
    const ligaData = {
        nombre_liga: ligaNameInput.value,
        pais: ligaCountryInput.value,
        imagen_liga: ligaLogoInput.value,
        imagen_pais: ligaLogoCountryInput.value,
    };

    const ligaId = ligaIdInput.value;
    let success = false;
    let message = '';

    try {
        if (ligaId) {
            ligaData.id = ligaId;
            const result = await window.api.updateLiga(ligaData);
            if (result) {
                message = 'Liga actualizada con éxito.';
                success = true;
            } else {
                message = 'Error al actualizar la liga.';
            }
        } else {
            const result = await window.api.addLiga(ligaData);
            if (result) {
                message = 'Liga añadida con éxito.';
                success = true;
            } else {
                message = 'Error al añadir la liga.';
            }
        }
    } catch (error) {
        console.error('Error al guardar liga:', error);
        message = `Error de red o servidor: ${error.message}`;
        success = false;
    }
    if (success) {
        showAlert('success', 'Éxito', message);
        resetLigasForm();
        loadLigas();
    } else {
        showAlert('error', 'Error', message);
    }
};

async function editLiga(id) {
    try {
        const ligas = await window.api.getLigas();
        const liga = ligas.find(l => l.id_liga === parseInt(id));
        if (liga) {
            ligaIdInput.value = liga.id_liga;
            ligaNameInput.value = liga.nombre_liga;
            ligaCountryInput.value = liga.pais;
            ligaLogoInput.value = liga.imagen_liga;
            ligaLogoCountryInput.value = liga.imagen_pais;
            ligaFormTitle.textContent = 'Editar Liga';
            cancelLigaEditBtn.classList.remove('d-none');
        } else {
            showAlert('error', 'Error', 'Liga no encontrada para editar.');
        }
    } catch (error) {
        console.error('Error al cargar datos de la liga para edición:', error);
        showAlert('error', 'Error', 'Error al cargar datos de la liga.', false);
    }
}

async function deleteLiga(id) {
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
                const deleteResult = await window.api.deleteLiga(id);
                if (deleteResult) {
                    showAlert('success', '¡Eliminada!', 'La Liga ha sido eliminada.');
                    loadLigas();
                } else {
                    showAlert('error', 'Error', 'Error al eliminar la liga.');
                }
            } catch (error) {
                console.error('Error al eliminar liga:', error);
                showAlert('error', 'Error', 'Error de red o servidor al eliminar la liga.');
            }
        }
    });
}

function resetLigasForm() {
    ligaForm.reset();
    ligaIdInput.value = '';
    ligaFormTitle.textContent = 'Añadir Nueva Liga';
    cancelLigaEditBtn.classList.add('d-none');
}
cancelLigaEditBtn.onclick = resetLigasForm;