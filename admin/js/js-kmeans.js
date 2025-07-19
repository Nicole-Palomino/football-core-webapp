async function initKmeansPage() {
    const kmeanModal = new bootstrap.Modal(document.getElementById('kmeanModal'))
    const kmeanForm = document.getElementById('kmeanForm')
    const kmeanIdInput = document.getElementById('kmeanId')

    mostrarSpinnerTabla('kmeans-table-body', 'Cargando probabilidades...')

    await cargarCatalogos()

    const matchSelect = document.getElementById('selectMatch')
    matchSelect.innerHTML = window._catalogos.matches_byplay.map(e =>
        `<option value="${e.id_partido}">${e.equipo_local.nombre_equipo} vs. ${e.equipo_visita.nombre_equipo}</option>`
    ).join('')

    // Mostrar el loader brevemente antes de inicializar el DataTable
    setTimeout(async () => {
        const data = await window.api.getKmeansData()

        // Limpiar el contenido del tbody manualmente antes de que lo tome DataTable
        const tbody = document.getElementById('kmeans-table-body')
        if (tbody) tbody.innerHTML = ''

        const table = $('#kmeanTable').DataTable({
            data,
            destroy: true,
            columns: [
                { data: 'id_resultado_kmeans', title: 'ID' },
                { data: 'id_partido', title: 'Match ID' },
                { data: 'cluster_predicho', title: 'Cluster' },
                { data: 'resumen', title: 'Summary' },
                {
                    data: null,
                    title: 'Actions',
                    orderable: false,
                    render: (data, type, row) => `
                        <button class="btn btn-sm btn-warning edit-btn" data-id="${row.id_resultado_kmeans}"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${row.id_resultado_kmeans}"><i class="fas fa-trash-alt"></i></button>
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
        document.getElementById('addNewKmeanBtn').onclick = () => {
            kmeanForm.reset()
            kmeanIdInput.value = ''
            document.getElementById('kmeanModalLabel').textContent = 'Add New Prediction with K-means'
            kmeanModal.show()
        }

        kmeanForm.onsubmit = async (e) => {
            e.preventDefault()
            const id_partido = matchSelect.value.trim()
            const id = kmeanIdInput.value

            let success = false
            if (id) {
                const updated = await window.api.updateKmean({ 
                    id: parseInt(id), 
                    id_partido
                })
                success = !!updated
            } else {
                const created = await window.api.addKmean({ 
                    id_partido
                })
                success = !!created
            }

            if (success) {
                kmeanForm.hide()
                mostrarAlertaExito('Guardado correctamente')
                reloadTable()
            } else {
                mostrarAlertaError('Fallo al guardar el registro')
            }
        }

        $('#kmeanTable tbody').on('click', '.edit-btn', function () {
            const id = $(this).data('id')
            const data = table.rows().data().toArray().find(row => row.id_resultado_kmeans === id)
            if (data) {
                matchSelect.value = data.id_partido || ''
                document.getElementById('kmeanModalLabel').textContent = 'Edit Prediction with K-Means'
                kmeanModal.show()
            }
        })

        $('#kmeanTable tbody').on('click', '.delete-btn', async function () {
            const id = $(this).data('id')
            const confirm = await mostrarAlertaConfirmacion({
                titulo: '¿Eliminar predicción?',
                texto: 'Esta acción no se puede deshacer',
                botonConfirmar: 'Sí, eliminar',
                botonCancelar: 'Cancelar'
            })

            if (confirm.isConfirmed) {
                const ok = await window.api.deleteKmean(id)
                if (ok) {
                    mostrarAlertaExito('Eliminado correctamente')
                    reloadTable()
                } else {
                    mostrarAlertaError('Fallo al eliminar el registro')
                }
            }
        })

        async function reloadTable() {
            const newData = await window.api.getKmeansData()
            table.clear().rows.add(newData).draw()
        }
    }, 200)
}