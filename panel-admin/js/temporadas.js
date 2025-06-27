// Elementos del formulario de temporadas
const seasonForm = document.getElementById('season-form');
const seasonIdInput = document.getElementById('season-id');
const seasonNameInput = document.getElementById('season-name');
const seasonFormTitle = document.getElementById('season-form-title');
const cancelseasonEditBtn = document.getElementById('cancel-season-edit');
const seasonsTableBody = document.getElementById('seasons-table-body');

// --- Funciones para temporadas ---
async function loadSeasons() {
    seasonsTableBody.innerHTML = `<tr><td colspan="3" class="text-center py-4"><div class="d-flex align-items-center justify-content-center"><div class="spinner-border text-primary spinner-border-sm me-2" role="status"><span class="visually-hidden">Cargando...</span></div> Cargando temporadas...</div></td></tr>`;
    try {
        const seasons = await window.api.getSeasons();
        seasonsTableBody.innerHTML = '';
        if (seasons.length === 0) {
            seasonsTableBody.innerHTML = `<tr><td colspan="3" class="text-center py-4 text-muted">No hay temporadas registradas.</td></tr>`;
            return;
        }
        seasons.forEach(season => {
            const row = document.createElement('tr');
            row.innerHTML = `
                        <td>${season.id_temporada}</td>
                        <td>${season.nombre_temporada}</td>
                        <td>${season.created_at}</td>
                        <td>
                            <button data-id="${season.id_temporada}" class="edit-season-btn btn btn-warning btn-sm me-1 btn-action">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button data-id="${season.id_temporada}" class="delete-season-btn btn btn-danger btn-sm btn-action">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    `;
            seasonsTableBody.appendChild(row);
        });
        document.querySelectorAll('.edit-season-btn').forEach(button => {
            button.onclick = (e) => editSeason(e.currentTarget.dataset.id);
        });
        document.querySelectorAll('.delete-season-btn').forEach(button => {
            button.onclick = (e) => deleteSeason(e.currentTarget.dataset.id);
        });
    } catch (error) {
        console.error('Error al cargar temporadas:', error);
        seasonsTableBody.innerHTML = `<tr><td colspan="3" class="text-center py-4 text-danger">Error al cargar temporadas. Por favor, inténtalo de nuevo.</td></tr>`;
    }
}

seasonForm.onsubmit = async (event) => {
    event.preventDefault();
    const seasonData = { nombre_temporada: seasonNameInput.value };
    const seasonId = seasonIdInput.value;
    let success = false;
    let message = '';
    try {
        if (seasonId) {
            seasonData.id = seasonId;
            const result = await window.api.updateSeason(seasonData);
            if (result) {
                message = 'Temporada actualizada con éxito.';
                success = true;
            } else {
                message = 'Error al actualizar la temporada.';
            }
        } else {
            const result = await window.api.addSeason(seasonData);
            if (result) {
                message = 'Temporada añadida con éxito.';
                success = true;
            } else {
                message = 'Error al añadir la temporada.';
            }
        }
    } catch (error) {
        console.error('Error al guardar temporada:', error);
        message = `Error de red o servidor: ${error.message}`;
        success = false;
    }
    if (success) {
        showAlert('success', 'Éxito', message);
        resetSeasonForm();
        loadSeasons();
    } else {
        showAlert('error', 'Error', message);
    }
};

async function editSeason(id) {
    try {
        const seasons = await window.api.getSeasons();
        const season = seasons.find(r => r.id_temporada === parseInt(id));
        if (season) {
            seasonIdInput.value = season.id_temporada;
            seasonNameInput.value = season.nombre_temporada;
            seasonFormTitle.textContent = 'Editar Temporada';
            cancelseasonEditBtn.classList.remove('d-none');
        } else {
            showAlert('error', 'Error', 'Temporada no encontrada para editar.');
        }
    } catch (error) {
        console.error('Error al cargar datos de la temporada para edición:', error);
        showAlert('error', 'Error', 'Error al cargar datos de la temporada.', false);
    }
}

async function deleteSeason(id) {
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
                const deleteResult = await window.api.deleteSeason(id);
                if (deleteResult) {
                    showAlert('success', '¡Eliminado!', 'La temporada ha sido eliminada.');
                    loadSeasons();
                } else {
                    showAlert('error', 'Error', 'Error al eliminar la temporada.');
                }
            } catch (error) {
                console.error('Error al eliminar temporada:', error);
                showAlert('error', 'Error', 'Error de red o servidor al eliminar la temporada.');
            }
        }
    });
}

function resetSeasonForm() {
    seasonForm.reset();
    seasonIdInput.value = '';
    seasonFormTitle.textContent = 'Añadir Nueva Temporada';
    cancelseasonEditBtn.classList.add('d-none');
}
cancelseasonEditBtn.onclick = resetSeasonForm;