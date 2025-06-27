// Elementos del formulario de partidos
const matchForm = document.getElementById('match-form');
const matchIdInput = document.getElementById('match-id');
const matchLigaSelect = document.getElementById('match-liga');
const matchSeasonSelect = document.getElementById('match-temporada');
const matchDateInput = document.getElementById('match-date');
const homeTeamSelect = document.getElementById('home-team');
const awayTeamSelect = document.getElementById('away-team');
const matchThreeSixFiveInput = document.getElementById('threesixfive');
const matchFotmobInput = document.getElementById('fotmob');
const matchDataFactoryInput = document.getElementById('datafactory');
const matchEstadoSelect = document.getElementById('estado');
const matchFormTitle = document.getElementById('match-form-title');
const cancelMatchEditBtn = document.getElementById('cancel-match-edit');
const matchesTableBody = document.getElementById('matches-table-body');
const uploadDataBtn = document.getElementById('upload-data-btn');

// Variables para almacenar datos de estados y roles para los selectores de usuario
let allLigasMatch = [];
let allTemporadasMatch = [];
let allEquiposMatch = [];
let allEstadosMatch = [];

// --- Funciones para Partidos ---

/**
 * Carga los datos iniciales para los selectores de estados y roles.
 */
async function loadLookupDataForMatches() {
    try {
        allLigasMatch = await window.api.getLigas();
        allTemporadasMatch = await window.api.getSeasons();
        allEquiposMatch = await window.api.getTeams();
        allEstadosMatch = await window.api.getEstados();

        // Limpiar y poblar el selector de ligas
        matchLigaSelect.innerHTML = '<option value="">Seleccione una Liga</option>';
        allLigasMatch.forEach(liga => {
            const option = document.createElement('option');
            option.value = liga.id_liga;
            option.textContent = liga.nombre_liga;
            matchLigaSelect.appendChild(option);
        });

        // Limpiar y poblar el selector de temporadas
        matchSeasonSelect.innerHTML = '<option value="">Seleccione una Temporada</option>';
        allTemporadasMatch.forEach(season => {
            const option = document.createElement('option');
            option.value = season.id_temporada;
            option.textContent = season.nombre_temporada;
            matchSeasonSelect.appendChild(option);
        });

        // Limpiar y poblar el selector de equipos locales
        homeTeamSelect.innerHTML = '<option value="">Seleccione Equipo Local</option>'
        allEquiposMatch.forEach(equipo_local => {
            const option = document.createElement('option');
            option.value = equipo_local.id_equipo;
            option.textContent = equipo_local.nombre_equipo;
            homeTeamSelect.appendChild(option);
        })

        // Limpiar y poblar el selector de equipos visitantes
        awayTeamSelect.innerHTML = '<option value="">Seleccione Equipo Visitante</option>'
        allEquiposMatch.forEach(equipo_visita => {
            const option = document.createElement('option');
            option.value = equipo_visita.id_equipo;
            option.textContent = equipo_visita.nombre_equipo;
            awayTeamSelect.appendChild(option);
        })

        // Limpiar y poblar el selector de estados
        matchEstadoSelect.innerHTML = '<option value="">Seleccione un Estado</option>'
        allEstadosMatch.forEach(estado => {
            const option = document.createElement('option');
            option.value = estado.id_estado;
            option.textContent = estado.nombre_estado;
            matchEstadoSelect.appendChild(option);
        })

    } catch (error) {
        console.error('Error al cargar datos de lookup para partidos:', error);
        showAlert('error', 'Error de carga', 'No se pudieron cargar los estados, ligas, temporadas y equipos.');
    }
}

/**
 * Carga y muestra la lista de partidos.
 */
async function loadMatches() {
    matchesTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4"><div class="d-flex align-items-center justify-content-center"><div class="spinner-border text-primary spinner-border-sm me-2" role="status"><span class="visually-hidden">Cargando...</span></div> Cargando partidos...</div></td></tr>`;
    try {
        const matches = await window.api.getMatches();

        matchesTableBody.innerHTML = ''; // Limpiar mensaje de carga

        if (matches.length === 0) {
            matchesTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No hay partidos registrados.</td></tr>`;
            return;
        }

        matches.forEach(match => {
            const row = document.createElement('tr');
            row.innerHTML = `
                        <td>${match.id_partido}</td>
                        <td>${match.id_equipo_local}</td>
                        <td>${match.id_equipo_visita}</td>
                        <td>${match.dia}</td>
                        <td>${match.id_liga}</td>
                        <td>${match.id_estado}</td>
                        <td>
                            <button data-id="${match.id_partido}" class="edit-match-btn btn btn-warning btn-sm me-1 btn-action">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button data-id="${match.id_partido}" class="delete-match-btn btn btn-danger btn-sm me-1 btn-action">
                                <i class="bi bi-trash"></i>
                            </button>
                            <button data-id="${match.id_partido}" class="edit-stats-btn btn btn-info btn-sm btn-action" data-bs-toggle="modal" data-bs-target="#statisticsModal">
                                <i class="bi bi-bar-chart-fill"></i>
                            </button>
                        </td>
                    `;
            matchesTableBody.appendChild(row);
        });

        document.querySelectorAll('.edit-match-btn').forEach(button => {
            button.onclick = (e) => editMatch(e.currentTarget.dataset.id);
        });
        document.querySelectorAll('.delete-match-btn').forEach(button => {
            button.onclick = (e) => deleteMatch(e.currentTarget.dataset.id);
        });
        // NUEVO: Añadir evento click para el botón de estadísticas
        document.querySelectorAll('.edit-stats-btn').forEach(button => {
            button.onclick = (e) => openStatisticsModal(e.currentTarget.dataset.id);
        });

    } catch (error) {
        console.error('Error al cargar partidos:', error);
        matchesTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-danger">Error al cargar partidos. Por favor, inténtalo de nuevo.</td></tr>`;
    }
}

/**
 * Maneja el envío del formulario de partido (añadir/editar).
 * @param {Event} event El evento de envío del formulario.
 */
matchForm.onsubmit = async (event) => {
    event.preventDefault();

    const matchData = {
        id_liga: matchLigaSelect.value,
        id_temporada: matchSeasonSelect.value,
        dia: matchDateInput.value,
        id_equipo_local: homeTeamSelect.value,
        id_equipo_visita: awayTeamSelect.value,
        enlace_threesixfive: matchThreeSixFiveInput.value,
        enlace_fotmob: matchFotmobInput.value,
        enlace_datafactory: matchDataFactoryInput.value,
        id_estado: matchEstadoSelect.value
    };

    const matchId = matchIdInput.value;
    let success = false;
    let message = '';

    try {
        if (matchId) {
            matchData.id = parseInt(matchId);
            const result = await window.api.updateMatch(matchData);
            if (result) {
                message = 'Partido actualizado con éxito.';
                success = true;
            } else {
                message = 'Error al actualizar el partido.';
            }
        } else {
            const result = await window.api.addMatch(matchData);
            if (result) {
                message = 'Partido añadido con éxito.';
                success = true;
            } else {
                message = 'Error al añadir el partido.';
            }
        }
    } catch (error) {
        console.error('Error al guardar partido:', error);
        message = `Error de red o servidor: ${error.message}`;
        success = false;
    }

    if (success) {
        showAlert('success', 'Éxito', message);
        resetMatchForm();
        loadMatches();
        updateDashboard();
    } else {
        showAlert('error', 'Error', message);
    }
};

/**
 * Carga los datos de un partido en el formulario para su edición.
 * @param {string} id El ID del partido a editar.
 */
async function editMatch(id) {
    try {
        const matches = await window.api.getMatches();
        const match = matches.find(m => m.id_partido === parseInt(id));

        if (match) {
            matchIdInput.value = match.id_partido;
            matchLigaSelect.value = match.id_liga;
            matchSeasonSelect.value = match.id_temporada;
            matchDateInput.value = match.dia;
            homeTeamSelect.value = match.id_equipo_local;
            awayTeamSelect.value = match.id_equipo_visita;
            matchThreeSixFiveInput.value = match.enlace_threesixfive;
            matchFotmobInput.value = match.enlace_fotmob;
            matchDataFactoryInput.value = match.enlace_datafactory;
            matchEstadoSelect.value = match.id_estado;
            matchFormTitle.textContent = 'Editar Partido';
            cancelMatchEditBtn.classList.remove('d-none');
        } else {
            showAlert('error', 'Error', 'Partido no encontrado para editar.');
        }
    } catch (error) {
        console.error('Error al cargar datos del partido para edición:', error);
        showAlert('error', 'Error', 'Error al cargar datos del partido.');
    }
}

/**
 * Elimina un partido.
 * @param {string} id El ID del partido a eliminar.
 */
async function deleteMatch(id) {
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
                const deleteResult = await window.api.deleteMatch(id);

                if (deleteResult) {
                    showAlert('success', '¡Eliminado!', 'El partido ha sido eliminado.');
                    loadMatches();
                    updateDashboard();
                } else {
                    showAlert('error', 'Error', 'Error al eliminar el partido.');
                }
            } catch (error) {
                console.error('Error al eliminar partido:', error);
                showAlert('error', 'Error', 'Error de red o servidor al eliminar el partido.');
            }
        }
    });
}

/**
 * Resetea el formulario de partidos a su estado inicial de "añadir".
 */
function resetMatchForm() {
    matchForm.reset();
    matchIdInput.value = '';
    matchFormTitle.textContent = 'Añadir Nuevo Partido';
    cancelMatchEditBtn.classList.add('d-none');
    loadLookupDataForMatches();
}

cancelMatchEditBtn.onclick = resetMatchForm;

// Manejador para el botón de subir datos
uploadDataBtn.onclick = async () => {
    const result = await Swal.fire({
        title: 'Subir Datos de Partidos',
        text: 'Selecciona un archivo CSV o Excel con los datos de partidos y estadísticas.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Seleccionar Archivo',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        const filePath = await window.api.openFileDialog();

        if (filePath) {
            let loadingAlert;
            Swal.fire({
                title: 'Subiendo...',
                text: 'Por favor espera mientras se procesa el archivo.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                    loadingAlert = Swal.getPopup();
                }
            });

            const uploadResult = await window.api.uploadMatchData(filePath);

            if (loadingAlert) {
                Swal.close();
            }

            if (uploadResult.success) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Subida Exitosa!',
                    text: uploadResult.message,
                    timer: 3000,
                    timerProgressBar: true
                });
                loadMatches();
                updateDashboard();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Subida',
                    text: uploadResult.message
                });
            }
        } else {
            showAlert('info', 'Cancelado', 'No se seleccionó ningún archivo.');
        }
    }
};