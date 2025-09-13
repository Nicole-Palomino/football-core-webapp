import axiosInstance from "../axiosConfig"

export const loginUser = async ({ username, password }) => {

    try {
        const formData = new URLSearchParams()
        formData.append("username", username)
        formData.append("password", password)

        const { data } = await axiosInstance.post("login", formData, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
        
        return data
    } catch (error) {
        console.log("CATCH LOGIN USER:", error)
        
        if (error.response) {
            const message =
                error.response.data?.detail ||
                error.response.data?.message ||
                "Credenciales inválidas"
            throw new Error(message)
        }

        throw new Error("Error de conexión con el servidor")
    }
}