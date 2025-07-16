async function initStatesPage() {
    const stateModal = new bootstrap.Modal(document.getElementById('stateModal'))
    const stateForm = document.getElementById('stateForm')
    const stateIdInput = document.getElementById('stateId')
    const stateNameInput = document.getElementById('stateName')

    mostrarSpinnerTabla('estados-table-body', 'Cargando estados...')

    // Mostrar el loader brevemente antes de inicializar el DataTable
    setTimeout(async () => {
        const data = await window.api.getStateData()

        // Limpiar el contenido del tbody manualmente antes de que lo tome DataTable
        const tbody = document.getElementById('estados-table-body')
        if (tbody) tbody.innerHTML = ''

        const table = $('#stateTable').DataTable({
            data,
            destroy: true,
            columns: [
                { data: 'id_estado', title: 'ID' },
                { data: 'nombre_estado', title: 'State Name' },
                {
                    data: null,
                    title: 'Actions',
                    orderable: false,
                    render: (data, type, row) => `
                        <button class="btn btn-sm btn-warning edit-btn" data-id="${row.id_estado}"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${row.id_estado}"><i class="fas fa-trash-alt"></i></button>
                    `
                }
            ],
            language: {
                zeroRecords: "Ningún estado encontrado",
            }
        })

        // Eventos de botones
        document.getElementById('addNewStateBtn').onclick = () => {
            stateForm.reset()
            stateIdInput.value = ''
            document.getElementById('stateModalLabel').textContent = 'Add New State'
            stateModal.show()
        }

        stateForm.onsubmit = async (e) => {
            e.preventDefault()
            const nombre_estado = stateNameInput.value.trim()
            const id = stateIdInput.value

            let success = false
            if (id) {
                const updated = await window.api.updateState({ id: parseInt(id), nombre_estado })
                success = !!updated
            } else {
                const created = await window.api.addState({ nombre_estado })
                success = !!created
            }

            if (success) {
                stateModal.hide()
                mostrarAlertaExito('Guardado correctamente')
                reloadTable()
            } else {
                mostrarAlertaError('Fallo al guardar el registro')
            }
        }

        $('#stateTable tbody').on('click', '.edit-btn', function () {
            const id = $(this).data('id')
            const data = table.rows().data().toArray().find(row => row.id_estado === id)
            if (data) {
                stateIdInput.value = data.id_estado
                stateNameInput.value = data.nombre_estado
                document.getElementById('stateModalLabel').textContent = 'Edit State'
                stateModal.show()
            }
        })

        $('#stateTable tbody').on('click', '.delete-btn', async function () {
            const id = $(this).data('id')
            const confirm = await mostrarAlertaConfirmacion({
                titulo: '¿Eliminar estado?',
                texto: 'Esta acción no se puede deshacer',
                botonConfirmar: 'Sí, eliminar',
                botonCancelar: 'Cancelar'
            })

            if (confirm.isConfirmed) {
                const ok = await window.api.deleteState(id)
                if (ok) {
                    mostrarAlertaExito('Eliminado correctamente')
                    reloadTable()
                } else {
                    mostrarAlertaError('Fallo al eliminar el registro')
                }
            }
        })

        async function reloadTable() {
            const newData = await window.api.getStateData()
            table.clear().rows.add(newData).draw()
        }
    }, 200) // pequeño retraso para que el loader se vea
}