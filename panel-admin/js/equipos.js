// Elementos del formulario de equipos
const teamForm = document.getElementById('team-form');
const teamIdInput = document.getElementById('team-id');
const teamNameInput = document.getElementById('team-name');
const teamStadiumInput = document.getElementById('team-stadium');
const teamLogoInput = document.getElementById('team-logo')
const teamEstadoSelect = document.getElementById('team-estado');
const teamLigaSelect = document.getElementById('team-liga');
const teamFormTitle = document.getElementById('team-form-title');
const cancelTeamEditBtn = document.getElementById('cancel-team-edit');
const teamsTableBody = document.getElementById('teams-table-body');

// Variables para almacenar datos de estados y ligas para los selectores de equipos
let allEstadosEquipos = [];
let allLigas = [];

// --- Funciones para Equipos ---

/**
 * Carga los datos iniciales para los selectores de estados y roles.
 */
async function loadLookupDataForTeams() {
    try {
        allEstadosEquipos = await window.api.getEstados();
        allLigas = await window.api.getLigas();

        // Limpiar y poblar el selector de estados
        teamEstadoSelect.innerHTML = '<option value="">Seleccione un estado</option>';
        allEstadosEquipos.forEach(estado => {
            const option = document.createElement('option');
            option.value = estado.id_estado;
            option.textContent = estado.nombre_estado;
            teamEstadoSelect.appendChild(option);
        });

        // Limpiar y poblar el selector de ligas
        teamLigaSelect.innerHTML = '<option value="">Seleccione una liga</option>';
        allLigas.forEach(liga => {
            const option = document.createElement('option');
            option.value = liga.id_liga;
            option.textContent = liga.nombre_liga;
            teamLigaSelect.appendChild(option);
        });

    } catch (error) {
        console.error('Error al cargar datos de lookup para ligas:', error);
        showAlert('error', 'Error de carga', 'No se pudieron cargar los estados y ligas.');
    }
}

/**
 * Carga y muestra la lista de equipos.
 */
async function loadTeams() {
    teamsTableBody.innerHTML = `<tr><td colspan="4" class="text-center py-4"><div class="d-flex align-items-center justify-content-center"><div class="spinner-border text-primary spinner-border-sm me-2" role="status"><span class="visually-hidden">Cargando...</span></div> Cargando equipos...</div></td></tr>`;
    try {
        await loadLookupDataForTeams();
        const teams = await window.api.getTeams();

        teamsTableBody.innerHTML = ''; // Limpiar mensaje de carga

        if (teams.length === 0) {
            teamsTableBody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-muted">No hay equipos registrados.</td></tr>`;
            return;
        }

        teams.forEach(team => {
            const row = document.createElement('tr');

            const estadoName = allEstadosEquipos.find(e => e.id_estado === team.estado.id_estado)?.nombre_estado || 'Desconocido';
            const ligaName = allLigas.find(l => l.id_liga === team.liga.id_liga)?.nombre_liga || 'Desconocido';

            row.innerHTML = `
                        <td>${team.id_equipo}</td>
                        <td>${team.nombre_equipo}</td>
                        <td>${estadoName}</td>
                        <td>${ligaName}</td>
                        <td>
                            <button data-id="${team.id_equipo}" class="edit-team-btn btn btn-warning btn-sm me-1 btn-action">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button data-id="${team.id_equipo}" class="delete-team-btn btn btn-danger btn-sm btn-action">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    `;
            teamsTableBody.appendChild(row);
        });

        document.querySelectorAll('.edit-team-btn').forEach(button => {
            button.onclick = (e) => editTeam(e.currentTarget.dataset.id);
        });
        document.querySelectorAll('.delete-team-btn').forEach(button => {
            button.onclick = (e) => deleteTeam(e.currentTarget.dataset.id);
        });

    } catch (error) {
        console.error('Error al cargar equipos:', error);
        teamsTableBody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-danger">Error al cargar equipos. Por favor, inténtalo de nuevo.</td></tr>`;
    }
}

/**
 * Maneja el envío del formulario de equipo (añadir/editar).
 * @param {Event} event El evento de envío del formulario.
 */
teamForm.onsubmit = async (event) => {
    event.preventDefault();

    const teamData = {
        nombre_equipo: teamNameInput.value,
        estadio: teamStadiumInput.value,
        logo: teamLogoInput.value,
        id_estado: teamEstadoSelect.value,
        id_liga: teamLigaSelect.value,
    };

    const teamId = teamIdInput.value;
    let success = false;
    let message = '';

    try {
        if (teamId) {
            teamData.id = teamId;
            const result = await window.api.updateTeam(teamData);
            if (result) {
                message = 'Equipo actualizado con éxito.';
                success = true;
            } else {
                message = 'Error al actualizar el equipo.';
            }
        } else {
            const result = await window.api.addTeam(teamData);
            if (result) {
                message = 'Equipo añadido con éxito.';
                success = true;
            } else {
                message = 'Error al añadir el equipo.';
            }
        }
    } catch (error) {
        console.error('Error al guardar equipo:', error);
        message = `Error de red o servidor: ${error.message}`;
        success = false;
    }

    if (success) {
        showAlert('success', 'Éxito', message);
        resetTeamForm();
        loadTeams();
        updateDashboard();
    } else {
        showAlert('error', 'Error', message);
    }
};

/**
 * Carga los datos de un equipo en el formulario para su edición.
 * @param {string} id El ID del equipo a editar.
 */
async function editTeam(id) {
    try {
        await loadLookupDataForTeams();

        const teams = await window.api.getTeams();
        const team = teams.find(t => t.id === id);

        if (team) {
            teamIdInput.value = team.id_equipo;
            teamNameInput.value = team.nombre_equipo;
            teamStadiumInput.value = team.estadio;
            teamLogoInput.value = team.logo;
            teamEstadoSelect.value = team.id_estado;
            teamLigaSelect.value = team.id_liga;

            teamFormTitle.textContent = 'Editar Equipo';
            cancelTeamEditBtn.classList.remove('d-none');
        } else {
            showAlert('error', 'Error', 'Equipo no encontrado para editar.');
        }
    } catch (error) {
        console.error('Error al cargar datos del equipo para edición:', error);
        showAlert('error', 'Error', 'Error al cargar datos del equipo.');
    }
}

/**
 * Elimina un equipo.
 * @param {string} id El ID del equipo a eliminar.
 */
async function deleteTeam(id) {
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
                const deleteResult = await window.api.deleteTeam(id);

                if (deleteResult) {
                    showAlert('success', '¡Eliminado!', 'El equipo ha sido eliminado.');
                    loadTeams();
                    updateDashboard();
                } else {
                    showAlert('error', 'Error', 'Error al eliminar el equipo.');
                }
            } catch (error) {
                console.error('Error al eliminar equipo:', error);
                showAlert('error', 'Error', 'Error de red o servidor al eliminar el equipo.');
            }
        }
    });
}

/**
 * Resetea el formulario de equipos a su estado inicial de "añadir".
 */
function resetTeamForm() {
    teamForm.reset();
    teamIdInput.value = '';
    teamFormTitle.textContent = 'Añadir Nuevo Equipo';
    cancelTeamEditBtn.classList.add('d-none');
    loadLookupDataForTeams();
}

cancelTeamEditBtn.onclick = resetTeamForm;