const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

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