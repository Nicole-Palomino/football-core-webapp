import axiosInstance from "../axiosConfig"

export const getAllRoles = async () => {
    try {
        const response = await axiosInstance.get('roles/')
        return response.data
    } catch (error) {
        console.error("Error al obtener usuarios:", error)
        throw error.response?.data || new Error("No se pudo obtener usuarios")
    }
}

export const registerRole = async ( roleData ) => {
    try {
        const response = await axiosInstance.post('roles/', roleData, {
            headers: {
                "Content-Type": "application/json",
            },
        })
        return response.data
    } catch (error) {
        console.error("Error en registerRole:", error);
        if (error.response) {
            throw new Error(error.response.data?.detail || "Error desconocido.");
        }
        throw new Error("Error al conectar con el servidor.");
    }
}

export const updateRole = async (roleId, roleData) => {
    try {
        const response = await axiosInstance.put(`roles/${roleId}`, roleData, {
            headers: {
                "Content-Type": "application/json",
            },
        })
        return response.data
    } catch (error) {
        console.error("Error en updateRole:", error)
        if (error.response) {
            throw new Error(error.response.data?.detail || "Error desconocido.")
        }
        throw new Error("Error al conectar con el servidor.")
    }
}

export const deleteRole = async (roleId) => {
    try {
        const response = await axiosInstance.delete(`roles/${roleId}`)
        return response.data
    } catch (error) {
        console.error("Error en deleteRole:", error)
        if (error.response) {
            throw new Error(error.response.data?.detail || "Error desconocido.")
        }
        throw new Error("Error al conectar con el servidor.")
    }
}