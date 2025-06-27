// NUEVOS: Elementos del Modal de Estadísticas
const statisticsModal = new bootstrap.Modal(document.getElementById('statisticsModal'));
const modalMatchIdSpan = document.getElementById('modal-match-id');
const statisticsForm = document.getElementById('statistics-form');
const statIdPartidoInput = document.getElementById('stat-id-partido');
const statIdEstadisticaInput = document.getElementById('stat-id-estadistica');
const statFTHGInput = document.getElementById('stat-FTHG');
const statFTAGInput = document.getElementById('stat-FTAG');
const statFTRSelect = document.getElementById('stat-FTR');
const statHTHGInput = document.getElementById('stat-HTHG');
const statHTAGInput = document.getElementById('stat-HTAG');
const statHTRSelect = document.getElementById('stat-HTR');
const statHSInput = document.getElementById('stat-HS');
const statASInput = document.getElementById('stat-AS'); // AS_ en Python, AS en HTML
const statHSTInput = document.getElementById('stat-HST');
const statASTInput = document.getElementById('stat-AST');
const statHFInput = document.getElementById('stat-HF');
const statAFInput = document.getElementById('stat-AF');
const statHCInput = document.getElementById('stat-HC');
const statACInput = document.getElementById('stat-AC');
const statHYInput = document.getElementById('stat-HY');
const statAYInput = document.getElementById('stat-AY');
const statHRInput = document.getElementById('stat-HR');
const statARInput = document.getElementById('stat-AR');

// --- Funciones para Estadísticas (NUEVAS) ---
/**
 * Abre el modal de estadísticas y carga los datos del partido.
 * @param {string} matchId El ID del partido para el que se editarán las estadísticas.
 */
async function openStatisticsModal(matchId) {
    modalMatchIdSpan.textContent = matchId; // Muestra el ID del partido en el título del modal
    statIdPartidoInput.value = matchId; // Almacena el ID del partido en un campo oculto

    // Restablecer el formulario antes de cargar nuevos datos
    resetStatisticsForm();

    try {
        const statistics = await window.api.getStatisticsByMatchId(matchId);
        if (statistics) {
            // Si existen estadísticas, cargarlas en el formulario
            statIdEstadisticaInput.value = statistics.id_estadistica || '';
            statFTHGInput.value = statistics.FTHG || '';
            statFTAGInput.value = statistics.FTAG || '';
            statFTRSelect.value = statistics.FTR || '';
            statHTHGInput.value = statistics.HTHG || '';
            statHTAGInput.value = statistics.HTAG || '';
            statHTRSelect.value = statistics.HTR || '';
            statHSInput.value = statistics.HS || '';
            statASInput.value = statistics.AS_ || ''; // Usar AS_ porque en Python es así
            statHSTInput.value = statistics.HST || '';
            statASTInput.value = statistics.AST || '';
            statHFInput.value = statistics.HF || '';
            statAFInput.value = statistics.AF || '';
            statHCInput.value = statistics.HC || '';
            statACInput.value = statistics.AC || '';
            statHYInput.value = statistics.HY || '';
            statAYInput.value = statistics.AY || '';
            statHRInput.value = statistics.HR || '';
            statARInput.value = statistics.AR || '';
        }
        // Si no hay estadísticas, los campos quedarán vacíos (ya reseteados)

        statisticsModal.show(); // Muestra el modal
    } catch (error) {
        console.error('Error al abrir modal de estadísticas:', error);
        showAlert('error', 'Error', 'No se pudieron cargar las estadísticas del partido.');
        statisticsModal.hide(); // Oculta el modal en caso de error
    }
}

/**
 * Maneja el envío del formulario de estadísticas.
 * @param {Event} event El evento de envío del formulario.
 */
statisticsForm.onsubmit = async (event) => {
    event.preventDefault();

    const statsData = {
        id_estadistica: statIdEstadisticaInput.value ? parseInt(statIdEstadisticaInput.value) : null,
        id_partido: parseInt(statIdPartidoInput.value),
        FTHG: statFTHGInput.value ? parseInt(statFTHGInput.value) : null,
        FTAG: statFTAGInput.value ? parseInt(statFTAGInput.value) : null,
        FTR: statFTRSelect.value || null,
        HTHG: statHTHGInput.value ? parseInt(statHTHGInput.value) : null,
        HTAG: statHTAGInput.value ? parseInt(statHTAGInput.value) : null,
        HTR: statHTRSelect.value || null,
        HS: statHSInput.value ? parseInt(statHSInput.value) : null,
        AS_: statASInput.value ? parseInt(statASInput.value) : null, // Coincide con el nombre de Python
        HST: statHSTInput.value ? parseInt(statHSTInput.value) : null,
        AST: statASTInput.value ? parseInt(statASTInput.value) : null,
        HF: statHFInput.value ? parseInt(statHFInput.value) : null,
        AF: statAFInput.value ? parseInt(statAFInput.value) : null,
        HC: statHCInput.value ? parseInt(statHCInput.value) : null,
        AC: statACInput.value ? parseInt(statACInput.value) : null,
        HY: statHYInput.value ? parseInt(statHYInput.value) : null,
        AY: statAYInput.value ? parseInt(statAYInput.value) : null,
        HR: statHRInput.value ? parseInt(statHRInput.value) : null,
        AR: statARInput.value ? parseInt(statARInput.value) : null
    };

    const result = await window.api.saveStatistics(statsData);

    if (result.success) {
        showAlert('success', 'Éxito', result.message);
        statisticsModal.hide(); // Cierra el modal
        // No es necesario recargar la tabla de partidos, ya que las estadísticas
        // no se muestran directamente en esa tabla.
    } else {
        showAlert('error', 'Error', result.message);
    }
};

/**
 * Resetea el formulario de estadísticas a sus valores por defecto.
 */
function resetStatisticsForm() {
    statisticsForm.reset();
    statIdPartidoInput.value = '';
    statIdEstadisticaInput.value = '';
    modalMatchIdSpan.textContent = '';
}