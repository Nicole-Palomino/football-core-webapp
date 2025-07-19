async function initRfPage() {
    const rfModal = new bootstrap.Modal(document.getElementById('rfModal'))
    const rfForm = document.getElementById('rfForm')
    const rfIdInput = document.getElementById('rfId')

    mostrarSpinnerTabla('rf-table-body', 'Cargando predicciones...')

    await cargarCatalogos()

    const matchSelect = document.getElementById('selectMatch')
    matchSelect.innerHTML = window._catalogos.matches_byplay.map(e =>
        `<option value="${e.id_partido}">${e.equipo_local.nombre_equipo} vs. ${e.equipo_visita.nombre_equipo}</option>`
    ).join('')

    // Mostrar el loader brevemente antes de inicializar el DataTable
    setTimeout(async () => {
        const data = await window.api.getRfData()

        // Limpiar el contenido del tbody manualmente antes de que lo tome DataTable
        const tbody = document.getElementById('rf-table-body')
        if (tbody) tbody.innerHTML = ''

        const table = $('#rfTable').DataTable({
            data,
            destroy: true,
            columns: [
                { data: 'id_resultado_rf', title: 'ID' },
                { data: 'id_partido', title: 'Match ID' },
                { data: 'cluster_predicho', title: 'Cluster' },
                { data: 'resumen', title: 'Summary' },
                {
                    data: null,
                    title: 'Actions',
                    orderable: false,
                    render: (data, type, row) => `
                        <button class="btn btn-sm btn-warning edit-btn" data-id="${row.id_resultado_rf}"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${row.id_resultado_rf}"><i class="fas fa-trash-alt"></i></button>
                    `
                }
            ],
            language: {
                zeroRecords: "Ninguna predicción encontrada",
            },
            layout: {
                bottomEnd: {
                    paging: {
                        firstLast: false
                    }
                }
            }
        })

        // Eventos de botones
        document.getElementById('addNewRfBtn').onclick = () => {
            rfForm.reset()
            rfIdInput.value = ''
            document.getElementById('rfModalLabel').textContent = 'Add New Prediction with Random Forest'
            rfModal.show()
        }

        rfForm.onsubmit = async (e) => {
            e.preventDefault()
            const id_partido = matchSelect.value.trim()
            const id = rfIdInput.value

            let success = false
            if (id) {
                const updated = await window.api.updateRf({ 
                    id: parseInt(id), 
                    id_partido
                })
                success = !!updated
            } else {
                const created = await window.api.addRf({ 
                    id_partido
                })
                success = !!created
            }

            if (success) {
                rfForm.hide()
                mostrarAlertaExito('Guardado correctamente')
                reloadTable()
            } else {
                mostrarAlertaError('Fallo al guardar el registro')
            }
        }

        $('#rfTable tbody').on('click', '.edit-btn', function () {
            const id = $(this).data('id')
            const data = table.rows().data().toArray().find(row => row.id_resultado_rf === id)
            if (data) {
                matchSelect.value = data.id_partido || ''
                document.getElementById('rfModalLabel').textContent = 'Edit Prediction with Random Forest'
                rfModal.show()
            }
        })

        $('#rfTable tbody').on('click', '.delete-btn', async function () {
            const id = $(this).data('id')
            const confirm = await mostrarAlertaConfirmacion({
                titulo: '¿Eliminar predicción?',
                texto: 'Esta acción no se puede deshacer',
                botonConfirmar: 'Sí, eliminar',
                botonCancelar: 'Cancelar'
            })

            if (confirm.isConfirmed) {
                const ok = await window.api.deleteRf(id)
                if (ok) {
                    mostrarAlertaExito('Eliminado correctamente')
                    reloadTable()
                } else {
                    mostrarAlertaError('Fallo al eliminar el registro')
                }
            }
        })

        async function reloadTable() {
            const newData = await window.api.getRfData()
            table.clear().rows.add(newData).draw()
        }
    }, 200)
}