const { app, BrowserWindow, ipcMain, screen, dialog } = require('electron')
const path = require('path')
const fs = require('fs')

let authToken = null

// Función para crear la ventana principal
function createWindow() {
    const primaryDisplay = screen.getPrimaryDisplay()
    const { width, height } = primaryDisplay.workAreaSize

    const mainWindow = new BrowserWindow({
        x: 0,
        y: 0,
        width: width,    
        height: height,
        minWidth: 1200,
        minHeight: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            devTools: true
        }
    })

    mainWindow.loadFile('login.html')

    mainWindow.webContents.openDevTools()
}

// Cuando Electron esté listo, crea la ventana
app.whenReady().then(() =>  {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

// Cierra la aplicación cuando todas las ventanas estén cerradas (excepto en macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// --- Manejo de IPC (Inter-Process Communication) ---

// URL base de tu API de FastAPI
const API_BASE_URL = 'http://127.0.0.1:8000'

/**
 * Función auxiliar para realizar llamadas fetch autenticadas.
 * Incluye el token de autorización si está disponible.
 * @param {string} url La URL de la API.
 * @param {object} options Opciones para la llamada fetch.
 * @returns {Promise<Response>} La promesa de la respuesta fetch.
 */
async function fetchAuthenticated(url, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(url, {
        ...options,
        headers: headers,
    });

    // Si la respuesta es 401 Unauthorized, puedes manejar la redirección al login
    if (response.status === 401) {
        console.log('Token expirado o no autorizado. Redirigiendo al login.');
        authToken = null; // Limpiar el token
        // Encuentra la ventana actual para redirigir
        const currentWindow = BrowserWindow.getAllWindows()[0]; // Asume que solo hay una ventana principal
        if (currentWindow) {
            currentWindow.loadFile('login.html');
        }
        throw new Error('Unauthorized');
    }

    return response;
}

// IPC para manejar el inicio de sesión
ipcMain.handle('login-user', async (event, { username, password }) => {
    try {
        // Paso 1: Obtener el token
        const tokenResponse = await fetch(`${API_BASE_URL}/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ username, password }).toString(),
        })

        const tokenData = await tokenResponse.json()

        if (!tokenResponse.ok) {
            return { success: false, message: tokenData.detail || 'Credenciales inválidas' }
        }

        // Token obtenido, lo almacenamos temporalmente para la verificación del rol
        authToken = tokenData.access_token

        // Paso 2: Obtener los datos del usuario usando el token
        // Usamos fetchAuthenticated para esta llamada también, para manejar 401 si el token fuera inválido
        const userResponse = await fetchAuthenticated(`${API_BASE_URL}/users/me/`)

        const userData = await userResponse.json()
        console.log(userData)

        if (!userResponse.ok) {
            authToken = null // Limpiar el token si no se pueden obtener los datos del usuario
            return { success: false, message: userData.detail || 'No se pudo verificar el rol del usuario.' }
        }

        // Paso 3: Evaluar el id_rol
        if (userData && userData.rol.id_rol === 2) { // Asumiendo que `id_rol: 2` es para Administrador
            return { success: true, token: authToken }
        } else {
            authToken = null // Limpiar el token si el rol no es el esperado
            return { success: false, message: 'Acceso denegado: Se requiere rol de Administrador.' }
        }

    } catch (error) {
        authToken = null // Asegurar que el token se limpie en caso de cualquier error
        // Comprobar si el error es 'Unauthorized' lanzado por fetchAuthenticated
        if (error.message === 'Unauthorized') {
            return { success: false, message: 'Su sesión ha expirado o no está autorizado. Por favor, inicie sesión de nuevo.' };
        }
        return { success: false, message: 'Error de conexión con el servidor o inesperado.' }
    }
})

// IPC para cerrar sesión
ipcMain.handle('logout-user', (event) => {
    authToken = null // Limpia el token de autenticación
    return true // Confirma que la operación se realizó
})

// IPC para cargar la ventana principal (index.html) después del login
ipcMain.handle('load-main-window', (event, page = './index.html') => {
    const mainWindow = BrowserWindow.fromWebContents(event.sender)
    if (mainWindow) {
        mainWindow.loadFile(page) // Ahora puede cargar cualquier página
        // Aquí podrías opcionalmente abrir las herramientas de desarrollo si el login fue exitoso
        // mainWindow.webContents.openDevTools()
    }
})

// IPC para obtener los datos del usuario autenticado
// Este handler ya utiliza el authToken global, por lo que no necesita cambios.
ipcMain.handle('get-user-data', async () => {
    if (!authToken) {
        console.log('No hay token de autenticación disponible para get-user-data.')
        return null
    }
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/users/me/`)
        if (response.ok) {
            const userData = await response.json()
            return userData
        } else {
            console.error('Error al obtener datos del usuario:', response.status, response.statusText)
            return null
        }
    } catch (error) {
        console.error('Error de red al obtener datos del usuario:', error)
        return null
    }
})



// ---------- ESTADOS ----------
// --- IPC para la gestión de estados (ahora con autenticación) ---
ipcMain.handle('get-states', async () => {
    console.log('ipcMain: Solicitud para obtener estados (autenticada)')
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/estados`)
        if (response.ok) {
            return await response.json()
        } else {
            console.error('Error al obtener estados:', response.status, response.statusText)
            return []
        }
    } catch (err) {
        console.error('Error de red al obtener estados: ', err)
        return []
    }
})

ipcMain.handle('add-state', async (event, state) => {
    console.log('ipcMain: Solicitud para añadir estado (autenticada)', state)
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/estados`, {
            method: 'POST',
            body: JSON.stringify(state)
        })
        if (response.ok) {
            return await response.json()
        } else {
            console.error('Error al añadir estado:', response.status, response.statusText)
            return null
        }
    } catch (err) {
        console.error('Error de red al añdir estado: ', err)
        return null
    }
})

ipcMain.handle('update-state', async (event, upatedState) => {
    console.log('ipcMain: Solicitud para actualizar estado (autenticada)', upatedState)
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/estados/${upatedState.id}`, {
            method: 'PUT',
            body: JSON.stringify(upatedState)
        })
        if (response.ok) {
            return await response.json()
        } else {
            console.log('Error al actualizar estado:', response.status, response.statusText)
            return null
        }
    } catch (err) {
        console.log('Error de red al actualizar estado: ', err)
        return null
    }
})

ipcMain.handle('delete-state', async (event, id) => {
    console.log('ipcMain: Solicitud para eliminar estado (autenticada)', id)
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/estados/${id}`, {
            method: 'DELETE'
        })
        return response.ok
    } catch (err) {
        console.error('Error de red al eliminar estado: ', err)
        return false
    }
})


// ---------- ROLES ----------
// --- IPC para la gestión de roles (ahora con autenticación) ---
ipcMain.handle('get-roles', async () => {
    console.log('ipcMain: Solicitud para obtener roles (autenticada)')
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/roles`)
        if (response.ok) {
            return await response.json()
        } else {
            console.error('Error al obtener roles:', response.status, response.statusText)
            return []
        }
    } catch (err) {
        console.error('Error de red al obtener roles: ', err)
        return []
    }
})

ipcMain.handle('add-role', async (event, role) => {
    console.log('ipcMain: Solicitud para añadir rol (autenticada)', role)
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/roles`, {
            method: 'POST',
            body: JSON.stringify(role)
        })
        if (response.ok) {
            return await response.json()
        } else {
            console.error('Error al añadir rol:', response.status, response.statusText)
            return null
        }
    } catch (err) {
        console.error('Error de red al añdir rol: ', err)
        return null
    }
})

ipcMain.handle('update-role', async (event, upatedRole) => {
    console.log('ipcMain: Solicitud para actualizar rol (autenticada)', upatedRole)
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/roles/${upatedRole.id}`, {
            method: 'PUT',
            body: JSON.stringify(upatedRole)
        })
        if (response.ok) {
            return await response.json()
        } else {
            console.log('Error al actualizar rol:', response.status, response.statusText)
            return null
        }
    } catch (err) {
        console.log('Error de red al actualizar rol: ', err)
        return null
    }
})

ipcMain.handle('delete-role', async (event, id) => {
    console.log('ipcMain: Solicitud para eliminar rol (autenticada)', id)
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/roles/${id}`, {
            method: 'DELETE'
        })
        return response.ok
    } catch (err) {
        console.error('Error de red al eliminar rol: ', err)
        return false
    }
})


// ---------- TEMPORADAS ----------
// --- IPC para la gestión de temporadas (ahora con autenticación) ---
ipcMain.handle('get-seasons', async () => {
    console.log('ipcMain: Solicitud para obtener temporadas (autenticada)')
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/temporadas`)
        if (response.ok) {
            return await response.json()
        } else {
            console.error('Error al obtener temporadas:', response.status, response.statusText)
            return []
        }
    } catch (err) {
        console.error('Error de red al obtener temporadas: ', err)
        return []
    }
})

ipcMain.handle('add-season', async (event, season) => {
    console.log('ipcMain: Solicitud para añadir temporada (autenticada)', season)
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/temporadas`, {
            method: 'POST',
            body: JSON.stringify(season)
        })
        if (response.ok) {
            return await response.json()
        } else {
            console.error('Error al añadir temporada:', response.status, response.statusText)
            return null
        }
    } catch (err) {
        console.error('Error de red al añdir temporada: ', err)
        return null
    }
})

ipcMain.handle('update-season', async (event, upatedSeason) => {
    console.log('ipcMain: Solicitud para actualizar temporada (autenticada)', upatedSeason)
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/temporadas/${upatedSeason.id}`, {
            method: 'PUT',
            body: JSON.stringify(upatedSeason)
        })
        if (response.ok) {
            return await response.json()
        } else {
            console.log('Error al actualizar temporada:', response.status, response.statusText)
            return null
        }
    } catch (err) {
        console.log('Error de red al actualizar temporada: ', err)
        return null
    }
})

ipcMain.handle('delete-season', async (event, id) => {
    console.log('ipcMain: Solicitud para eliminar temporada (autenticada)', id)
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/temporadas/${id}`, {
            method: 'DELETE'
        })
        return response.ok
    } catch (err) {
        console.error('Error de red al eliminar temporada: ', err)
        return false
    }
})

ipcMain.handle('get-total-seasons', async () => {
    console.log('ipcMain: Solicitud para obtener total de temporadas')
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/temporadas/stats/total`)
        if (response.ok) {
            return await response.json()
        } else {
            console.error('Error al obtener total de temporadas:', response.status, response.statusText)
            return 0
        }
    } catch (error) {
        console.error('Error de red al obtener total de temporadas:', error)
        return 0
    }
})


// ---------- LIGAS ----------
// --- IPC para la gestión de ligas (ahora con autenticación) ---
ipcMain.handle('get-leagues', async () => {
    console.log('ipcMain: Solicitud para obtener ligas (autenticada)')
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/ligas`)
        if (response.ok) {
            return await response.json()
        } else {
            console.error('Error al obtener ligas:', response.status, response.statusText)
            return []
        }
    } catch (err) {
        console.error('Error de red al obtener ligas: ', err)
        return []
    }
})

ipcMain.handle('add-league', async (event, league) => {
    console.log('ipcMain: Solicitud para añadir liga (autenticada)', league)
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/ligas`, {
            method: 'POST',
            body: JSON.stringify(league)
        })
        if (response.ok) {
            return await response.json()
        } else {
            console.error('Error al añadir liga:', response.status, response.statusText)
            return null
        }
    } catch (err) {
        console.error('Error de red al añdir liga: ', err)
        return null
    }
})

ipcMain.handle('update-league', async (event, upatedLeague) => {
    console.log('ipcMain: Solicitud para actualizar liga (autenticada)', upatedLeague)
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/ligas/${upatedLeague.id}`, {
            method: 'PUT',
            body: JSON.stringify(upatedLeague)
        })
        if (response.ok) {
            return await response.json()
        } else {
            console.log('Error al actualizar liga:', response.status, response.statusText)
            return null
        }
    } catch (err) {
        console.log('Error de red al actualizar liga: ', err)
        return null
    }
})

ipcMain.handle('delete-league', async (event, id) => {
    console.log('ipcMain: Solicitud para eliminar liga (autenticada)', id)
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/ligas/${id}`, {
            method: 'DELETE'
        })
        return response.ok
    } catch (err) {
        console.error('Error de red al eliminar liga: ', err)
        return false
    }
})

ipcMain.handle('get-total-leagues', async () => {
    console.log('ipcMain: Solicitud para obtener total de ligas')
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/ligas/stats/total`)
        if (response.ok) {
            return await response.json()
        } else {
            console.error('Error al obtener total de ligas:', response.status, response.statusText)
            return 0
        }
    } catch (error) {
        console.error('Error de red al obtener total de ligas:', error)
        return 0
    }
})

// ---------- USUARIOS ----------
// --- IPC para la gestión de usuarios (ahora con autenticación) ---
ipcMain.handle('get-users', async () => {
    console.log('ipcMain: Solicitud para obtener usuarios (autenticada)')
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/users`)
        if (response.ok) {
            return await response.json()
        } else {
            console.error('Error al obtener usuarios:', response.status, response.statusText)
            return []
        }
    } catch (err) {
        console.error('Error de red al obtener usuarios: ', err)
        return []
    }
})

ipcMain.handle('add-user', async (event, user) => {
    console.log('ipcMain: Solicitud para añadir usuario (autenticada)', user)
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/register-admin`, {
            method: 'POST',
            body: JSON.stringify(user)
        })
        if (response.ok) {
            return await response.json()
        } else {
            console.error('Error al añadir usuario:', response.status, response.statusText)
            return null
        }
    } catch (err) {
        console.error('Error de red al añdir usuario: ', err)
        return null
    }
})

ipcMain.handle('update-user', async (event, upatedUser) => {
    console.log('ipcMain: Solicitud para actualizar usuario (autenticada)', upatedUser)
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/users/${upatedUser.id}`, {
            method: 'PUT',
            body: JSON.stringify(upatedUser)
        })
        if (response.ok) {
            return await response.json()
        } else {
            console.log('Error al actualizar usuario:', response.status, response.statusText)
            return null
        }
    } catch (err) {
        console.log('Error de red al actualizar usuario: ', err)
        return null
    }
})

ipcMain.handle('delete-user', async (event, id) => {
    console.log('ipcMain: Solicitud para eliminar usuario (autenticada)', id)
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/users/${id}`, {
            method: 'DELETE'
        })
        return response.ok
    } catch (err) {
        console.error('Error de red al eliminar usuario: ', err)
        return false
    }
})

ipcMain.handle('get-total-users', async () => {
    console.log('ipcMain: Solicitud para obtener total de usuarios')
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/users/stats/total`)
        if (response.ok) {
            return await response.json()
        } else {
            console.error('Error al obtener total de usuarios:', response.status, response.statusText)
            return 0
        }
    } catch (error) {
        console.error('Error de red al obtener total de usuarios:', error)
        return 0
    }
})

ipcMain.handle('get-total-users-by-date', async () => {
    console.log('ipcMain: Solicitud para obtener total de usuarios')
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/users/stats/usuarios-por-dia`)
        if (response.ok) {
            return await response.json()
        } else {
            console.error('Error al obtener total de usuarios:', response.status, response.statusText)
            return 0
        }
    } catch (error) {
        console.error('Error de red al obtener total de usuarios:', error)
        return 0
    }
})


// ---------- EQUIPOS ----------
// --- IPC para la gestión de equipos (ahora con autenticación) ---
ipcMain.handle('get-teams', async () => {
    console.log('ipcMain: Solicitud para obtener equipos (autenticada)')
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/equipos`)
        if (response.ok) {
            return await response.json()
        } else {
            console.error('Error al obtener equipos:', response.status, response.statusText)
            return []
        }
    } catch (err) {
        console.error('Error de red al obtener equipos: ', err)
        return []
    }
})

ipcMain.handle('get-teams-actives', async () => {
    console.log('ipcMain: Solicitud para obtener equipos activos (autenticada)')
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/equipos/activos`)
        if (response.ok) {
            return await response.json()
        } else {
            console.error('Error al obtener equipos activos:', response.status, response.statusText)
            return []
        }
    } catch (err) {
        console.error('Error de red al obtener equipos activos: ', err)
        return []
    }
})

ipcMain.handle('add-team', async (event, team) => {
    console.log('ipcMain: Solicitud para añadir equipo (autenticada)', team)
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/equipos`, {
            method: 'POST',
            body: JSON.stringify(team)
        })
        if (response.ok) {
            return await response.json()
        } else {
            console.error('Error al añadir equipo:', response.status, response.statusText)
            return null
        }
    } catch (err) {
        console.error('Error de red al añdir equipo: ', err)
        return null
    }
})

ipcMain.handle('update-team', async (event, upatedTeam) => {
    console.log('ipcMain: Solicitud para actualizar equipo (autenticada)', upatedTeam)
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/equipos/${upatedTeam.id}`, {
            method: 'PUT',
            body: JSON.stringify(upatedTeam)
        })
        if (response.ok) {
            return await response.json()
        } else {
            console.log('Error al actualizar equipo:', response.status, response.statusText)
            return null
        }
    } catch (err) {
        console.log('Error de red al actualizar equipo: ', err)
        return null
    }
})

ipcMain.handle('delete-team', async (event, id) => {
    console.log('ipcMain: Solicitud para eliminar equipo (autenticada)', id)
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/equipos/${id}`, {
            method: 'DELETE'
        })
        return response.ok
    } catch (err) {
        console.error('Error de red al eliminar equipo: ', err)
        return false
    }
})

ipcMain.handle('get-total-teams', async () => {
    console.log('ipcMain: Solicitud para obtener total de equipos')
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/equipos/stats/total`)
        if (response.ok) {
            return await response.json()
        } else {
            console.error('Error al obtener total de equipos:', response.status, response.statusText)
            return 0
        }
    } catch (error) {
        console.error('Error de red al obtener total de equipos:', error)
        return 0
    }
})


// ---------- PARTIDOS ----------
// --- IPC para la gestión de partidos (ahora con autenticación) ---
ipcMain.handle('get-matches', async () => {
    console.log('ipcMain: Solicitud para obtener partidos (autenticada)')
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/partidos/season/12`)
        if (response.ok) {
            return await response.json()
        } else {
            console.error('Error al obtener partidos:', response.status, response.statusText)
            return []
        }
    } catch (err) {
        console.error('Error de red al obtener partidos: ', err)
        return []
    }
})

ipcMain.handle('get-matches-by-state', async (event, id) => {
    console.log('ipcMain: Solicitud para obtener partidos por su estado (autenticada)')
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/partidos/${id}`)
        if (response.ok) {
            return await response.json()
        } else {
            console.error('Error al añadir partido:', response.status, response.statusText)
            return []
        }
    } catch (err) {
        console.error('Error de red al añdir partido: ', err)
        return []
    }
})

ipcMain.handle('add-match', async (event, match) => {
    console.log('ipcMain: Solicitud para añadir partido (autenticada)', match)
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/partidos`, {
            method: 'POST',
            body: JSON.stringify(match)
        })
        if (response.ok) {
            return await response.json()
        } else {
            console.error('Error al añadir partido:', response.status, response.statusText)
            return null
        }
    } catch (err) {
        console.error('Error de red al añdir partido: ', err)
        return null
    }
})

ipcMain.handle('update-match', async (event, upatedMatch) => {
    console.log('ipcMain: Solicitud para actualizar partido (autenticada)', upatedMatch)
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/partidos/${upatedMatch.id}`, {
            method: 'PUT',
            body: JSON.stringify(upatedMatch)
        })
        if (response.ok) {
            return await response.json()
        } else {
            console.log('Error al actualizar partido:', response.status, response.statusText)
            return null
        }
    } catch (err) {
        console.log('Error de red al actualizar partido: ', err)
        return null
    }
})

ipcMain.handle('delete-match', async (event, id) => {
    console.log('ipcMain: Solicitud para eliminar partido (autenticada)', id)
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/partidos/${id}`, {
            method: 'DELETE'
        })
        return response.ok
    } catch (err) {
        console.error('Error de red al eliminar partido: ', err)
        return false
    }
})

ipcMain.handle('get-total-matches', async () => {
    console.log('ipcMain: Solicitud para obtener total de partidos')
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/partidos/stats/total`)
        if (response.ok) {
            return await response.json()
        } else {
            console.error('Error al obtener total de partidos:', response.status, response.statusText)
            return 0
        }
    } catch (error) {
        console.error('Error de red al obtener total de partidos:', error)
        return 0
    }
})

ipcMain.handle('upload-match-data', async (event, filePath) => {
    console.log('ipcMain: Solicitud para subir archivo csv o xlsx del partido (autenticada)', dataCsv)
    if (!filePath) {
        return { success: false, message: 'No se seleccionó ningún archivo.' }
    }

    try {
        // Lee el contenido del archivo de forma síncrona (para simplificar, usar asíncrona en producción si los archivos son muy grandes)
        const fileContent = fs.readFileSync(filePath)
        const fileName = path.basename(filePath)

        // Crea un objeto FormData. Electron's fetch soporta Blob/File directamente.
        const formData = new FormData()
        const blob = new Blob([fileContent])
        // El nombre del campo 'file' debe coincidir con el nombre esperado por tu endpoint de FastAPI (e.g., File(file: UploadFile))
        formData.append('file', blob, fileName)

        console.log(`ipcMain: Subiendo archivo ${fileName} a ${API_BASE_URL}/partidos/upload-data`)

        const response = await fetchAuthenticated(`${API_BASE_URL}/partidos/upload-data`, {
            method: 'POST',
            body: formData
        })

        const responseData = await response.json()
        if (response.ok) {
            console.log('Archivo subido con éxito:', responseData)
            return { success: true, message: responseData.message || 'Archivo subido y procesado con éxito.' }
        } else {
            console.error('Error al subir archivo:', response.status, response.statusText, responseData)
            return { success: false, message: responseData.detail || 'Error al procesar el archivo en el servidor.' }
        }
    } catch (err) {
        console.error('Error de red al subir datos de un partido: ', err)
        return null
    }
})

// ---------- ESTADÍSTICAS ----------
// --- IPC para la gestión de estadísticas (ahora con autenticación) ---
ipcMain.handle('get-stats-by-match', async (event, id_match) => {
    console.log('ipcMain: Solicitud para obtener estadísticas de un partido (autenticada)', id_match)
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/estadisticas/partido/${id_match}`)
        if (response.ok) {
            return await response.json()
        } else {
            console.error('Error al obtener estadísticas:', response.status, response.statusText)
            return []
        }
    } catch (err) {
        console.error('Error de red al obtener estadísticas: ', err)
        return []
    }
})

ipcMain.handle('add-stats', async (event, stats) => {
    console.log('ipcMain: Solicitud para añadir estadisticas (autenticada)', stats)
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/estadisticas`, {
            method: 'POST',
            body: JSON.stringify(stats)
        })
        if (response.ok) {
            return await response.json()
        } else {
            console.error('Error al añadir estadisticas:', response.status, response.statusText)
            return null
        }
    } catch (err) {
        console.error('Error de red al añdir estadisticas: ', err)
        return null
    }
})

ipcMain.handle('update-stats', async (event, upatedStat) => {
    console.log('ipcMain: Solicitud para actualizar estadísticas (autenticada)', upatedStat)
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/estadisticas/by-partido/${upatedStat.id_partido}`, {
            method: 'PUT',
            body: JSON.stringify(upatedStat)
        })
        if (response.ok) {
            return await response.json()
        } else {
            console.log('Error al actualizar estadísticas:', response.status, response.statusText)
            return null
        }
    } catch (err) {
        console.log('Error de red al actualizar estadísticas: ', err)
        return null
    }
})


// ---------- RESUMENES ----------
// --- IPC para la gestión de resumenes (ahora con autenticación) ---
ipcMain.handle('get-summary-by-state', async (event, estados) => {
    console.log('ipcMain: Solicitud para obtener resúmenes de los partidos (autenticada)', estados)
    try {
        const params = new URLSearchParams()
        estados.forEach(e => params.append('estados', e))
        const url = `${API_BASE_URL}/resumenes/resumen-partido?${params.toString()}`
        const response = await fetchAuthenticated(url)
        if (response.ok) {
            return await response.json()
        } else {
            console.error('Error al obtener resúmenes:', response.status, response.statusText)
            return []
        }
    } catch (err) {
        console.error('Error de red al obtener resúmenes: ', err)
        return []
    }
})

ipcMain.handle('add-summary', async (event, summary) => {
    console.log('ipcMain: Solicitud para añadir resumen (autenticada)', summary)
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/resumenes`, {
            method: 'POST',
            body: JSON.stringify(summary)
        })
        if (response.ok) {
            return await response.json()
        } else {
            console.error('Error al añadir resumen:', response.status, response.statusText)
            return null
        }
    } catch (err) {
        console.error('Error de red al añdir resumen: ', err)
        return null
    }
})

ipcMain.handle('update-summary', async (event, upatedSummary) => {
    console.log('ipcMain: Solicitud para actualizar resúmenes (autenticada)', upatedSummary)
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/resumenes/${upatedSummary.id}`, {
            method: 'PUT',
            body: JSON.stringify(upatedSummary)
        })
        if (response.ok) {
            return await response.json()
        } else {
            console.log('Error al actualizar resúmenes:', response.status, response.statusText)
            return null
        }
    } catch (err) {
        console.log('Error de red al actualizar resúmenes: ', err)
        return null
    }
})

ipcMain.handle('delete-summary', async (event, id) => {
    console.log('ipcMain: Solicitud para eliminar resumen (autenticada)', id)
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/resumenes/${id}`, {
            method: 'DELETE'
        })
        return response.ok
    } catch (err) {
        console.error('Error de red al eliminar resumen: ', err)
        return false
    }
})


// ---------- PREDICCIONES K-MEANS ----------
// --- IPC para la gestión de predicciones con k-means (ahora con autenticación) ---
ipcMain.handle('get-kmeans', async () => {
    console.log('ipcMain: Solicitud para obtener predicciones (autenticada)')
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/resultados/kmeans/`)
        if (response.ok) {
            return await response.json()
        } else {
            console.error('Error al obtener predicciones:', response.status, response.statusText)
            return []
        }
    } catch (err) {
        console.error('Error de red al obtener predicciones: ', err)
        return []
    }
})

ipcMain.handle('add-kmeans', async (event, kmeans) => {
    console.log('ipcMain: Solicitud para añadir predicciones (autenticada)', kmeans)
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/resultados/kmeans/${kmeans.id_partido}`, {
            method: 'POST'
        })
        if (response.ok) {
            return await response.json()
        } else {
            console.error('Error al añadir predicciones:', response.status, response.statusText)
            return null
        }
    } catch (err) {
        console.error('Error de red al añdir predicciones: ', err)
        return null
    }
})

ipcMain.handle('update-kmeans', async (event, upatedKmeans) => {
    console.log('ipcMain: Solicitud para actualizar predicciones (autenticada)', upatedKmeans)
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/resultados/kmeans/${upatedKmeans.id}`, {
            method: 'PUT',
            body: JSON.stringify(upatedKmeans)
        })
        if (response.ok) {
            return await response.json()
        } else {
            console.log('Error al actualizar predicciones:', response.status, response.statusText)
            return null
        }
    } catch (err) {
        console.log('Error de red al actualizar predicciones: ', err)
        return null
    }
})

ipcMain.handle('delete-kmeans', async (event, id) => {
    console.log('ipcMain: Solicitud para eliminar predicción (autenticada)', id)
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/resultados/kmeans/${id}`, {
            method: 'DELETE'
        })
        return response.ok
    } catch (err) {
        console.error('Error de red al eliminar predicción: ', err)
        return false
    }
})


// ---------- PREDICCIONES RANDOM FOREST ----------
// --- IPC para la gestión de predicciones con random forest (ahora con autenticación) ---
ipcMain.handle('get-rf', async () => {
    console.log('ipcMain: Solicitud para obtener predicciones (autenticada)')
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/resultados/rf/`)
        if (response.ok) {
            return await response.json()
        } else {
            console.error('Error al obtener predicciones:', response.status, response.statusText)
            return []
        }
    } catch (err) {
        console.error('Error de red al obtener predicciones: ', err)
        return []
    }
})

ipcMain.handle('add-rf', async (event, rf) => {
    console.log('ipcMain: Solicitud para añadir predicciones (autenticada)', rf)
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/resultados/rf/${rf.id_partido}`, {
            method: 'POST'
        })
        if (response.ok) {
            return await response.json()
        } else {
            console.error('Error al añadir predicciones:', response.status, response.statusText)
            return null
        }
    } catch (err) {
        console.error('Error de red al añdir predicciones: ', err)
        return null
    }
})

ipcMain.handle('update-rf', async (event, upatedRf) => {
    console.log('ipcMain: Solicitud para actualizar predicciones (autenticada)', upatedRf)
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/resultados/rf/${upatedRf.id}`, {
            method: 'PUT',
            body: JSON.stringify(upatedRf)
        })
        if (response.ok) {
            return await response.json()
        } else {
            console.log('Error al actualizar predicciones:', response.status, response.statusText)
            return null
        }
    } catch (err) {
        console.log('Error de red al actualizar predicciones: ', err)
        return null
    }
})

ipcMain.handle('delete-rf', async (event, id) => {
    console.log('ipcMain: Solicitud para eliminar predicción (autenticada)', id)
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/resultados/rf/${id}`, {
            method: 'DELETE'
        })
        return response.ok
    } catch (err) {
        console.error('Error de red al eliminar predicción: ', err)
        return false
    }
})