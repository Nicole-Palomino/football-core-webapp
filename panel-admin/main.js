const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs'); // Módulo fs para leer archivos

// Variable para almacenar el token de autenticación de forma segura en el proceso principal
let authToken = null;

// Función para crear la ventana principal
function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200, // Ancho de la ventana
        height: 800, // Altura de la ventana
        minWidth: 800, // Ancho mínimo de la ventana
        minHeight: 600, // Altura mínima de la ventana
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Carga el script preload
            nodeIntegration: false, // Deshabilita la integración de Node.js para mayor seguridad
            contextIsolation: true, // Aísla el contexto del renderizador del proceso principal
            devTools: true // Habilita las herramientas de desarrollador para depuración
        }
    });

    // Carga el archivo HTML principal de la aplicación
    mainWindow.loadFile('login.html');

    // Abre las herramientas de desarrollo (solo en desarrollo)
    mainWindow.webContents.openDevTools();
}

// Cuando Electron esté listo, crea la ventana
app.whenReady().then(() => {
    createWindow();

    // Reabre una ventana si la aplicación no tiene ventanas abiertas (macOS)
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Cierra la aplicación cuando todas las ventanas estén cerradas (excepto en macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// --- Manejo de IPC (Inter-Process Communication) ---
// Aquí es donde puedes definir los "canales" para la comunicación entre el renderizador y el proceso principal.
// En una aplicación real, aquí harías las llamadas HTTP a tu API de FastAPI.

// URL base de tu API de FastAPI
const API_BASE_URL = 'http://127.0.0.1:8000'; // Asegúrate de que esta URL sea correcta

/**
 * Función auxiliar para realizar llamadas fetch autenticadas.
 * Incluye el token de autorización si está disponible.
 * @param {string} url La URL de la API.
 * @param {object} options Opciones para la llamada fetch.
 * @returns {Promise<Response>} La promesa de la respuesta fetch.
 */

async function fetchAuthenticated(url, options = {}) {
    const headers = { ...options.headers }; // Inicia con cualquier encabezado personalizado

    // Solo establece Content-Type a application/json si el cuerpo es una cadena y no se ha especificado ya
    // Para FormData, fetch establecerá automáticamente el Content-Type correcto.
    if (options.body && typeof options.body === 'string' && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

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
    console.log('ipcMain: Intentando iniciar sesión para:', username);
    try {
        // Paso 1: Obtener el token
        const tokenResponse = await fetch(`${API_BASE_URL}/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ username, password }).toString(),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error('Error de inicio de sesión (token):', tokenData.detail || 'Credenciales inválidas');
            return { success: false, message: tokenData.detail || 'Credenciales inválidas' };
        }

        // Token obtenido, lo almacenamos temporalmente para la verificación del rol
        authToken = tokenData.access_token;
        console.log('Token obtenido. Verificando rol...');

        // Paso 2: Obtener los datos del usuario usando el token
        const userResponse = await fetchAuthenticated(`${API_BASE_URL}/users/me/`, {
            // Asegurarse de que el fetchAuthenticated usa el authToken que acabamos de obtener
            // No es necesario pasar headers aquí ya que fetchAuthenticated los añade
        });

        if (!userResponse.ok) {
            if (userResponse.status === 401) {
                event.sender.send('auth-expired');
            }
        }

        const userData = await userResponse.json();

        if (!userResponse.ok) {
            console.error('Error al obtener datos del usuario:', userData.detail || 'No se pudo obtener información del usuario.');
            authToken = null; // Limpiar el token si no se pueden obtener los datos del usuario
            return { success: false, message: userData.detail || 'No se pudo verificar el rol del usuario.' };
        }

        // Paso 3: Evaluar el id_rol
        if (userData && userData.rol.id_rol === 2) { // Asumiendo que `id_rol: 2` es para Administrador
            console.log('Inicio de sesión exitoso. Usuario es Administrador.');
            return { success: true, token: authToken };
        } else {
            console.warn('Inicio de sesión fallido: El usuario no es Administrador.', userData);
            authToken = null; // Limpiar el token si el rol no es el esperado
            return { success: false, message: 'Acceso denegado: Se requiere rol de Administrador.' };
        }

    } catch (error) {
        console.error('Error general en el proceso de inicio de sesión:', error);
        authToken = null; // Asegurar que el token se limpie en caso de cualquier error
        return { success: false, message: 'Error de conexión con el servidor o inesperado.' };
    }
});

// IPC para cerrar sesión
ipcMain.handle('logout-user', (event) => {
    console.log('ipcMain: Cerrando sesión. Limpiando token.');
    authToken = null; // Limpia el token de autenticación
    return true; // Confirma que la operación se realizó
});

// IPC para cargar la ventana principal (index.html) después del login
ipcMain.handle('load-main-window', (event) => {
    const mainWindow = BrowserWindow.fromWebContents(event.sender);
    if (mainWindow) {
        mainWindow.loadFile('index.html');
        // Aquí podrías opcionalmente abrir las herramientas de desarrollo si el login fue exitoso
        // mainWindow.webContents.openDevTools();
    }
});

// IPC para obtener los datos del usuario autenticado
// Este handler ya utiliza el authToken global, por lo que no necesita cambios.
ipcMain.handle('get-user-data', async () => {
    if (!authToken) {
        console.log('No hay token de autenticación disponible para get-user-data.');
        return null;
    }
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/users/me/`);
        if (response.ok) {
            const userData = await response.json();
            return userData;
        } else {
            console.error('Error al obtener datos del usuario:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error de red al obtener datos del usuario:', error);
        return null;
    }
});

// --- IPC para la gestión de Estados (con autenticación) ---

ipcMain.handle('get-estados', async () => {
    console.log('ipcMain: Solicitud para obtener estados (autenticada)');
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/estados/`);
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Error al obtener estados:', response.status, response.statusText);
            return [];
        }
    } catch (error) {
        console.error('Error de red al obtener estados:', error);
        return [];
    }
});

ipcMain.handle('add-estado', async (event, estado) => {
    console.log('ipcMain: Solicitud para añadir estado (autenticada)', estado);
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/estados/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(estado)
        });
        if (response.ok) {
            return await response.json();
        } else {
            const errorText = await response.text();
            console.error('Error al añadir estado:', response.status, response.statusText, errorText);
            return null;
        }
    } catch (error) {
        console.error('Error de red al añadir estado:', error);
        return null;
    }
});

ipcMain.handle('update-estado', async (event, updatedEstado) => {
    console.log('ipcMain: Solicitud para actualizar estado (autenticada)', updatedEstado);
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/estados/${updatedEstado.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedEstado)
        });
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Error al actualizar estado:', response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error de red al actualizar estado:', error);
        return null;
    }
});

ipcMain.handle('delete-estado', async (event, id) => {
    console.log('ipcMain: Solicitud para eliminar estado (autenticada)', id);
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/estados/${id}`, {
            method: 'DELETE'
        });
        return response.ok;
    } catch (error) {
        console.error('Error de red al eliminar estado:', error);
        return false;
    }
});

// --- IPC para la gestión de Roles (con autenticación) ---

ipcMain.handle('get-roles', async () => {
    console.log('ipcMain: Solicitud para obtener roles (autenticada)');
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/roles/`);
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Error al obtener roles:', response.status, response.statusText);
            return [];
        }
    } catch (error) {
        console.error('Error de red al obtener roles:', error);
        return [];
    }
});

ipcMain.handle('add-rol', async (event, rol) => {
    console.log('ipcMain: Solicitud para añadir rol (autenticada)', rol);
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/roles/`, {
            method: 'POST',
            body: JSON.stringify(rol)
        });
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Error al añadir rol:', response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error de red al añadir rol:', error);
        return null;
    }
});

ipcMain.handle('update-rol', async (event, updatedRol) => {
    console.log('ipcMain: Solicitud para actualizar rol (autenticada)', updatedRol);
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/roles/${updatedRol.id}`, {
            method: 'PUT',
            body: JSON.stringify(updatedRol)
        });
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Error al actualizar rol:', response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error de red al actualizar rol:', error);
        return null;
    }
});

ipcMain.handle('delete-rol', async (event, id) => {
    console.log('ipcMain: Solicitud para eliminar rol (autenticada)', id);
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/roles/${id}`, {
            method: 'DELETE'
        });
        return response.ok;
    } catch (error) {
        console.error('Error de red al eliminar rol:', error);
        return false;
    }
});

// --- IPC para la gestión de ligas (ahora con autenticación) ---

ipcMain.handle('get-ligas', async () => {
    console.log('ipcMain: Solicitud para obtener liga (autenticada)');
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/ligas/`);
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Error al obtener ligas:', response.status, response.statusText);
            return [];
        }
    } catch (error) {
        console.error('Error de red al obtener ligas:', error);
        return [];
    }
});

ipcMain.handle('add-liga', async (event, liga) => {
    console.log('ipcMain: Solicitud para añadir liga (autenticada)', liga);
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/ligas/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(liga)
        });
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Error al añadir liga:', response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error de red al añadir liga:', error);
        return null;
    }
});

ipcMain.handle('update-liga', async (event, updatedLiga) => {
    console.log('ipcMain: Solicitud para actualizar liga (autenticada)', updatedLiga);
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/ligas/${updatedLiga.id}`, {
            method: 'PUT',
            body: JSON.stringify(updatedLiga)
        });
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Error al actualizar liga:', response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error de red al actualizar liga:', error);
        return null;
    }
});

ipcMain.handle('delete-liga', async (event, id) => {
    console.log('ipcMain: Solicitud para eliminar liga (autenticada)', id);
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/ligas/${id}`, {
            method: 'DELETE'
        });
        return response.ok; // Devuelve true si la eliminación fue exitosa (código 200/204)
    } catch (error) {
        console.error('Error de red al eliminar liga:', error);
        return false;
    }
});

ipcMain.handle('get-total-ligas', async () => {
    console.log('ipcMain: Solicitud para obtener total de ligas');
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/ligas/stats/total`);
        if (response.ok) {
            return await response.json(); // esto será un número
        } else {
            console.error('Error al obtener total de ligas:', response.status, response.statusText);
            return 0;
        }
    } catch (error) {
        console.error('Error de red al obtener total de ligas:', error);
        return 0;
    }
});

// --- IPC para la gestión de equipos (ahora con autenticación) ---

ipcMain.handle('get-teams', async () => {
    console.log('ipcMain: Solicitud para obtener equipos (autenticada)');
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/equipos/`);
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Error al obtener equipos:', response.status, response.statusText);
            return [];
        }
    } catch (error) {
        console.error('Error de red al obtener equipos:', error);
        return [];
    }
});

ipcMain.handle('add-team', async (event, team) => {
    console.log('ipcMain: Solicitud para añadir equipo (autenticada)', team);
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/equipos/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(team)
        });
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Error al añadir equipo:', response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error de red al añadir equipo:', error);
        return null;
    }
});

ipcMain.handle('update-team', async (event, updatedTeam) => {
    console.log('ipcMain: Solicitud para actualizar equipo (autenticada)', updatedTeam);
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/equipos/${updatedTeam.id}`, {
            method: 'PUT',
            body: JSON.stringify(updatedTeam)
        });
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Error al actualizar equipo:', response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error de red al actualizar equipo:', error);
        return null;
    }
});

ipcMain.handle('delete-team', async (event, id) => {
    console.log('ipcMain: Solicitud para eliminar equipo (autenticada)', id);
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/equipos/${id}`, {
            method: 'DELETE'
        });
        return response.ok; // Devuelve true si la eliminación fue exitosa (código 200/204)
    } catch (error) {
        console.error('Error de red al eliminar equipo:', error);
        return false;
    }
});

ipcMain.handle('get-total-teams', async () => {
    console.log('ipcMain: Solicitud para obtener total de equipos');
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/equipos/stats/total`);
        if (response.ok) {
            return await response.json(); // esto será un número
        } else {
            console.error('Error al obtener total de equipos:', response.status, response.statusText);
            return 0;
        }
    } catch (error) {
        console.error('Error de red al obtener total de equipos:', error);
        return 0;
    }
});

// --- IPC para la gestión de usuarios (ahora con autenticación) ---

ipcMain.handle('get-users', async () => {
    console.log('ipcMain: Solicitud para obtener usuarios (autenticada)');
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/users/`);
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Error al obtener usuarios:', response.status, response.statusText);
            return [];
        }
    } catch (error) {
        console.error('Error de red al obtener usuarios:', error);
        return [];
    }
});

ipcMain.handle('add-user', async (event, user) => {
    console.log('ipcMain: Solicitud para añadir usuario (autenticada)', user);
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/register-admin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
        });
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Error al añadir usuario:', response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error de red al añadir usuario:', error);
        return null;
    }
});

ipcMain.handle('update-user', async (event, updatedUser) => {
    console.log('ipcMain: Solicitud para actualizar usuario (autenticada)', updatedUser);
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/users/${updatedUser.id}`, {
            method: 'PUT',
            body: JSON.stringify(updatedUser)
        });
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Error al actualizar usuario:', response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error de red al actualizar usuario:', error);
        return null;
    }
});

ipcMain.handle('delete-user', async (event, id) => {
    console.log('ipcMain: Solicitud para eliminar usuario (autenticada)', id);
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/users/${id}`, {
            method: 'DELETE'
        });
        return response.ok; // Devuelve true si la eliminación fue exitosa (código 200/204)
    } catch (error) {
        console.error('Error de red al eliminar usuario:', error);
        return false;
    }
});

ipcMain.handle('get-total-users', async () => {
    console.log('ipcMain: Solicitud para obtener total de usuarios');
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/users/stats/total`);
        if (response.ok) {
            return await response.json(); // esto será un número
        } else {
            console.error('Error al obtener total de usuarios:', response.status, response.statusText);
            return 0;
        }
    } catch (error) {
        console.error('Error de red al obtener total de usuarios:', error);
        return 0;
    }
});

ipcMain.handle('get-total-users-by-dia', async () => {
    console.log('ipcMain: Solicitud para obtener total de usuarios');
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/users/stats/usuarios-por-dia`);
        if (response.ok) {
            return await response.json(); // esto será un número
        } else {
            console.error('Error al obtener total de usuarios:', response.status, response.statusText);
            return 0;
        }
    } catch (error) {
        console.error('Error de red al obtener total de usuarios:', error);
        return 0;
    }
});

// --- IPC para la gestión de temporadas (ahora con autenticación) ---

ipcMain.handle('get-seasons', async () => {
    console.log('ipcMain: Solicitud para obtener temporadas (autenticada)');
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/temporadas/`);
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Error al obtener temporadas:', response.status, response.statusText);
            return [];
        }
    } catch (error) {
        console.error('Error de red al obtener temporadas:', error);
        return [];
    }
});

ipcMain.handle('add-season', async (event, season) => {
    console.log('ipcMain: Solicitud para añadir temporada (autenticada)', season);
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/temporadas/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(season)
        });
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Error al añadir temporada:', response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error de red al añadir temporada:', error);
        return null;
    }
});

ipcMain.handle('update-season', async (event, updatedSeason) => {
    console.log('ipcMain: Solicitud para actualizar temporada (autenticada)', updatedSeason);
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/temporadas/${updatedSeason.id}`, {
            method: 'PUT',
            body: JSON.stringify(updatedSeason)
        });
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Error al actualizar temporada:', response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error de red al actualizar temporada:', error);
        return null;
    }
});

ipcMain.handle('delete-season', async (event, id) => {
    console.log('ipcMain: Solicitud para eliminar temporada (autenticada)', id);
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/temporadas/${id}`, {
            method: 'DELETE'
        });
        return response.ok; // Devuelve true si la eliminación fue exitosa (código 200/204)
    } catch (error) {
        console.error('Error de red al eliminar temporada:', error);
        return false;
    }
});

ipcMain.handle('get-total-seasons', async () => {
    console.log('ipcMain: Solicitud para obtener total de temporadas');
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/temporadas/stats/total`);
        if (response.ok) {
            return await response.json(); // esto será un número
        } else {
            console.error('Error al obtener total de temporadas:', response.status, response.statusText);
            return 0;
        }
    } catch (error) {
        console.error('Error de red al obtener total de temporadas:', error);
        return 0;
    }
});

// IPC para la subida de archivos de partidos/estadísticas
ipcMain.handle('open-file-dialog', async (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    const { canceled, filePaths } = await dialog.showOpenDialog(window, {
        properties: ['openFile'],
        filters: [
            { name: 'Archivos CSV & Excel', extensions: ['csv', 'xls', 'xlsx'] },
            { name: 'Todos los archivos', extensions: ['*'] }
        ]
    });
    if (canceled) {
        return null;
    } else {
        return filePaths[0];
    }
});

ipcMain.handle('upload-match-data', async (event, filePath) => {
    if (!filePath) {
        return { success: false, message: 'No se seleccionó ningún archivo.' };
    }

    try {
        // Lee el contenido del archivo de forma síncrona (para simplificar, usar asíncrona en producción si los archivos son muy grandes)
        const fileContent = fs.readFileSync(filePath);
        const fileName = path.basename(filePath);

        // Crea un objeto FormData. Electron's fetch soporta Blob/File directamente.
        const formData = new FormData();
        // El nombre del campo 'file' debe coincidir con el nombre esperado por tu endpoint de FastAPI (e.g., File(file: UploadFile))
        formData.append('file', new Blob([fileContent]), fileName);

        console.log(`ipcMain: Subiendo archivo ${fileName} a ${API_BASE_URL}/partidos/upload-data`);

        const response = await fetchAuthenticated(`${API_BASE_URL}/partidos/upload-data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: formData,
            // fetchAuthenticated se encarga de añadir el Authorization header y no necesitamos Content-Type aquí
            // ya que FormData lo configura automáticamente con el boundary correcto.
        });

        const responseData = await response.json();

        if (response.ok) {
            console.log('Archivo subido con éxito:', responseData);
            return { success: true, message: responseData.message || 'Archivo subido y procesado con éxito.' };
        } else {
            console.error('Error al subir archivo:', response.status, response.statusText, responseData);
            return { success: false, message: responseData.detail || 'Error al procesar el archivo en el servidor.' };
        }

    } catch (error) {
        console.error('Error durante la subida del archivo:', error);
        if (error.message === 'Unauthorized') {
             return { success: false, message: 'Su sesión ha expirado. Por favor, inicie sesión de nuevo.' };
        }
        return { success: false, message: `Error al leer o subir el archivo: ${error.message}` };
    }
});

// --- IPC para la gestión de partidos (ahora con autenticación) ---

ipcMain.handle('get-matches', async () => {
    console.log('ipcMain: Solicitud para obtener partidos (autenticada)');
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/partidos/`);
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Error al obtener partidos:', response.status, response.statusText);
            return [];
        }
    } catch (error) {
        console.error('Error de red al obtener partidos:', error);
        return [];
    }
});

ipcMain.handle('add-match', async (event, match) => {
    console.log('ipcMain: Solicitud para añadir partido (autenticada)', match);
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/partidos/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(match)
        });
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Error al añadir partido:', response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error de red al añadir partido:', error);
        return null;
    }
});

ipcMain.handle('update-match', async (event, updatedMatch) => {
    console.log('ipcMain: Solicitud para actualizar partido (autenticada)', updatedMatch);
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/partidos/${updatedMatch.id}`, {
            method: 'PUT',
            body: JSON.stringify(updatedMatch)
        });
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Error al actualizar partido:', response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error de red al actualizar partido:', error);
        return null;
    }
});

ipcMain.handle('delete-match', async (event, id) => {
    console.log('ipcMain: Solicitud para eliminar partido (autenticada)', id);
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/partidos/${id}`, {
            method: 'DELETE'
        });
        return response.ok; // Devuelve true si la eliminación fue exitosa (código 200/204)
    } catch (error) {
        console.error('Error de red al eliminar partido:', error);
        return false;
    }
});

ipcMain.handle('get-total-matches', async () => {
    console.log('ipcMain: Solicitud para obtener total de partidos');
    try {
        const response = await fetchAuthenticated(`${API_BASE_URL}/partidos/stats/total`);
        if (response.ok) {
            return await response.json(); // esto será un número
        } else {
            console.error('Error al obtener total de partidos:', response.status, response.statusText);
            return 0;
        }
    } catch (error) {
        console.error('Error de red al obtener total de partidos:', error);
        return 0;
    }
});

// IPC para la Gestión de Estadísticas
ipcMain.handle('get-statistics-by-match-id', async (event, matchId) => {
    console.log(`ipcMain: Solicitud para obtener estadísticas para partido ID: ${matchId}`);
    try {
        // Suponemos que tu API tiene un endpoint como /statistics/by_match/{match_id}
        const response = await fetchAuthenticated(`${API_BASE_URL}/estadisticas/partido/${matchId}`);
        if (response.ok) {
            const data = await response.json();
            // La API puede devolver una lista si no hay estadísticas, o el objeto directamente
            // Si la API devuelve un 404 para no encontrado, se maneja en fetchAuthenticated
            return data;
        } else if (response.status === 404) {
            // Si no se encuentran estadísticas, devolver null para indicar que no existen
            return null;
        } else {
            console.error('Error al obtener estadísticas:', response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error de red al obtener estadísticas:', error);
        return null;
    }
});

ipcMain.handle('save-statistics', async (event, statsData) => {
    console.log('ipcMain: Solicitud para guardar estadísticas:', statsData);
    let response;
    try {
        if (statsData.id_estadistica) {
            // Si tiene id_estadistica, es una actualización (PUT)
            response = await fetchAuthenticated(`${API_BASE_URL}/estadisticas/${statsData.id_estadistica}`, {
                method: 'PUT',
                body: JSON.stringify(statsData)
            });
        } else {
            // Si no tiene id_estadistica, es una creación (POST)
            response = await fetchAuthenticated(`${API_BASE_URL}/estadisticas/`, { // Endpoint para crear
                method: 'POST',
                body: JSON.stringify(statsData)
            });
        }

        const responseData = await response.json();

        if (response.ok) {
            return { success: true, message: responseData.message || 'Estadísticas guardadas con éxito.', data: responseData };
        } else {
            console.error('Error al guardar estadísticas:', response.status, response.statusText, responseData);
            return { success: false, message: responseData.detail || 'Error desconocido al guardar estadísticas.' };
        }
    } catch (error) {
        console.error('Error de red al guardar estadísticas:', error);
        return { success: false, message: `Error de red o inesperado al guardar estadísticas: ${error.message}` };
    }
});