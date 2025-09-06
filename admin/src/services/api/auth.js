import axiosInstance from "../axiosConfig"

export const loginUser = async ({ username, password }) => {
    const formData = new URLSearchParams()
    formData.append("username", username)
    formData.append("password", password)

    const { data } = await axiosInstance.post("/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })

    return data
}