// 👉 Spinner para tabla (por ID de tbody)
function mostrarSpinnerTabla(tbodyId, mensaje = 'Cargando...') {
    const tbody = document.getElementById(tbodyId)
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="100%" class="text-center py-4">
                    <div class="d-flex align-items-center justify-content-center">
                        <div class="spinner-border text-primary spinner-border-sm me-2" role="status">
                            <span class="visually-hidden">Cargando</span>
                        </div> ${mensaje}
                    </div>
                </td>
            </tr>
        `
    }
}

// 👉 Formatea una fecha en formato corto (ej. 12/07/25 08:45 a. m.)
function formatDate(dateStr) {
    const d = new Date(dateStr)
    return d.toLocaleString('es-PE', {
        dateStyle: 'short',
        timeStyle: 'short'
    })
}

// ✅ Alertas SweetAlert simplificadas

function mostrarAlertaExito(texto = 'Operación exitosa') {
    Swal.fire({
        icon: 'success',
        title: texto,
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true
    });
}

function mostrarAlertaError(texto = 'Ha ocurrido un error') {
    Swal.fire({
        icon: 'error',
        title: texto,
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true
    });
}

function mostrarAlertaConfirmacion(opciones = {}) {
    return Swal.fire({
        icon: 'warning',
        title: opciones.titulo || '¿Estás seguro?',
        text: opciones.texto || '¡No podrás revertir esto!',
        showCancelButton: true,
        confirmButtonText: opciones.botonConfirmar || 'Sí, continuar',
        cancelButtonText: opciones.botonCancelar || 'Cancelar'
    });
}