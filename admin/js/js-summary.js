async function initSummariesPage() {
    const summaryModal = new bootstrap.Modal(document.getElementById('summaryModal'))
    const summaryForm = document.getElementById('summaryForm')
    const summaryIdInput = document.getElementById('summaryId')
    const summaryNameInput = document.getElementById('summaryName')
    const summaryImageInput = document.getElementById('imageUrl')

    mostrarSpinnerTabla('resumenes-table-body', 'Cargando resúmenes...')

    await cargarCatalogos()

    const matchesSelect = document.getElementById('selectMatch')
    matchesSelect.innerHTML = window._catalogos.matches.map(e =>
        `<option value="${e.id_partido}">${e.equipo_local.nombre_equipo} vs. ${e.equipo_visita.nombre_equipo}</option>`
    ).join('')

    // Mostrar el loader brevemente antes de inicializar el DataTable
    setTimeout(async () => {
        const data = await window.api.getSummaryByStateData([5, 8])

        // Limpiar el contenido del tbody manualmente antes de que lo tome DataTable
        const tbody = document.getElementById('resumenes-table-body')
        if (tbody) tbody.innerHTML = ''

        const table = $('#summaryTable').DataTable({
            data,
            destroy: true,
            columns: [
                { data: 'id_resumen', title: 'ID' },
                { data: 'nombre', title: 'Summary Name' },
                { data: 'url_imagen', title: 'Image URL' },
                { data: 'id_partido', title: 'ID Match' },
                {
                    data: null,
                    title: 'Actions',
                    orderable: false,
                    render: (data, type, row) => `
                        <button class="btn btn-sm btn-warning edit-btn" data-id="${row.id_resumen}"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${row.id_resumen}"><i class="fas fa-trash-alt"></i></button>
                    `
                }
            ],
            language: {
                zeroRecords: "Ningún resumen encontrado",
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
        document.getElementById('addNewSummaryBtn').onclick = () => {
            summaryForm.reset()
            summaryIdInput.value = ''
            document.getElementById('summaryModalLabel').textContent = 'Add New Summary'
            summaryModal.show()
        }

        summaryForm.onsubmit = async (e) => {
            e.preventDefault()
            const nombre = summaryNameInput.value.trim()
            const url_imagen = summaryImageInput.value.trim()
            const id_partido = matchesSelect.value.trim()
            const id = summaryIdInput.value

            let success = false
            if (id) {
                const updated = await window.api.updateSummary({ id: parseInt(id), nombre, url_imagen, id_partido })
                success = !!updated
            } else {
                const created = await window.api.addSummary({ nombre, url_imagen, id_partido })
                success = !!created
            }

            if (success) {
                summaryModal.hide()
                mostrarAlertaExito('Guardado correctamente')
                reloadTable()
            } else {
                mostrarAlertaError('Fallo al guardar el registro')
            }
        }

        $('#summaryTable tbody').on('click', '.edit-btn', function () {
            const id = $(this).data('id')
            const data = table.rows().data().toArray().find(row => row.id_resumen === id)
            if (data) {
                summaryNameInput.value = data.nombre
                summaryImageInput.value = data.url_imagen
                matchesSelect.value = data.id_partido
                document.getElementById('summaryModalLabel').textContent = 'Edit Summary'
                summaryModal.show()
            }
        })

        $('#summaryTable tbody').on('click', '.delete-btn', async function () {
            const id = $(this).data('id')
            const confirm = await mostrarAlertaConfirmacion({
                titulo: '¿Eliminar resumen?',
                texto: 'Esta acción no se puede deshacer',
                botonConfirmar: 'Sí, eliminar',
                botonCancelar: 'Cancelar'
            })

            if (confirm.isConfirmed) {
                const ok = await window.api.deleteSummary(id)
                if (ok) {
                    mostrarAlertaExito('Eliminado correctamente')
                    reloadTable()
                } else {
                    mostrarAlertaError('Fallo al eliminar el registro')
                }
            }
        })

        async function reloadTable() {
            const newData = await window.api.getSummaryByStateData([5, 8])
            table.clear().rows.add(newData).draw()
        }
    }, 200)
}