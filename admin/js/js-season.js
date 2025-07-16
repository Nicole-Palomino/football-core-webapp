async function initSeasonsPage() {
    const seasonModal = new bootstrap.Modal(document.getElementById('seasonModal'))
    const seasonForm = document.getElementById('seasonForm')
    const seasonIdInput = document.getElementById('seasonId')
    const seasonNameInput = document.getElementById('seasonName')

    mostrarSpinnerTabla('temporadas-table-body', 'Cargando temporadas...')

    // Mostrar el loader brevemente antes de inicializar el DataTable
    setTimeout(async () => {
        const data = await window.api.getSeasonData()

        // Limpiar el contenido del tbody manualmente antes de que lo tome DataTable
        const tbody = document.getElementById('temporadas-table-body')
        if (tbody) tbody.innerHTML = ''

        const table = $('#seasonTable').DataTable({
            data,
            destroy: true,
            columns: [
                { data: 'id_temporada', title: 'ID' },
                { data: 'nombre_temporada', title: 'Season Name' },
                {
                    data: null,
                    title: 'Actions',
                    orderable: false,
                    render: (data, type, row) => `
                        <button class="btn btn-sm btn-warning edit-btn" data-id="${row.id_temporada}"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${row.id_temporada}"><i class="fas fa-trash-alt"></i></button>
                    `
                }
            ],
            language: {
                zeroRecords: "Ninguna temporada encontrada",
            }
        })

        // Eventos de botones
        document.getElementById('addNewSeasonBtn').onclick = () => {
            seasonForm.reset()
            seasonIdInput.value = ''
            document.getElementById('seasonModalLabel').textContent = 'Add New Season'
            seasonModal.show()
        }

        seasonForm.onsubmit = async (e) => {
            e.preventDefault()
            const nombre_temporada = seasonNameInput.value.trim()
            const id = seasonIdInput.value

            let success = false
            if (id) {
                const updated = await window.api.updateSeason({ id: parseInt(id), nombre_temporada })
                success = !!updated
            } else {
                const created = await window.api.addSeason({ nombre_temporada })
                success = !!created
            }

            if (success) {
                seasonModal.hide()
                mostrarAlertaExito('Guardado correctamente')
                reloadTable()
            } else {
                mostrarAlertaError('Fallo al guardar el registro')
            }
        }

        $('#seasonTable tbody').on('click', '.edit-btn', function () {
            const id = $(this).data('id')
            const data = table.rows().data().toArray().find(row => row.id_temporada === id)
            if (data) {
                seasonIdInput.value = data.id_temporada
                seasonNameInput.value = data.nombre_temporada
                document.getElementById('seasonModalLabel').textContent = 'Edit Season'
                seasonModal.show()
            }
        })

        $('#seasonTable tbody').on('click', '.delete-btn', async function () {
            const id = $(this).data('id')
            const confirm = await mostrarAlertaConfirmacion({
                titulo: '¿Eliminar temporada?',
                texto: 'Esta acción no se puede deshacer',
                botonConfirmar: 'Sí, eliminar',
                botonCancelar: 'Cancelar'
            })

            if (confirm.isConfirmed) {
                const ok = await window.api.deleteSeason(id)
                if (ok) {
                    mostrarAlertaExito('Eliminado correctamente')
                    reloadTable()
                } else {
                    mostrarAlertaError('Fallo al eliminar el registro')
                }
            }
        })

        async function reloadTable() {
            const newData = await window.api.getSeasonData()
            table.clear().rows.add(newData).draw()
        }
    }, 200) // pequeño retraso para que el loader se vea
}