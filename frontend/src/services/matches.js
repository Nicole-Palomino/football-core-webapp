import axiosInstance from '../services/axiosConfig'
import { setToken, getToken } from './auth'

// -------------------------------------- matches --------------------------------------

// get all the matches by season and state
export const getMatchAll = async (seasonId) => {
    try {
        const response = await axiosInstance.get(`/partidos/season/${seasonId}`)
        return response.data
    } catch (err) {
        throw err
    }
}