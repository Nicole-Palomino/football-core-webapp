import { useState } from 'react'
import { Box, Container, useTheme } from '@mui/material'
import { getLigues, getTeams } from '../services/functions'
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from '../components/Loading/LoadingSpinner'
import SelectionControls from '../components/Forms/controls/SelectionControls'
import Header from '../components/Forms/controls/Header'
import CustomPrediction from '../components/Dashboard/Details/CustomPrediction'
import LoadingMessage from '../components/Loading/LoadingMessage'

const Forecasts = () => {

    const [loading, setLoading] = useState(false)
    const [equipos, setEquipos] = useState([])
    const [selectedLiga, setSelectedLiga] = useState('')
    const [selectedEquipo1, setSelectedEquipo1] = useState('')
    const [selectedEquipo2, setSelectedEquipo2] = useState('')
    const [showPrediction, setShowPrediction] = useState(false)
    const theme = useTheme()

    function parseLigas(raw) {
        return Object.entries(raw).map(([key, value]) => ({
            id: key,
            nombre: key,
            logo: value.logo,
            color: value.color,
        }));
    }

    const { data: ligas, isLoading: isLoadingLigas, isError: isErrorLigas } = useQuery({
        queryKey: ['ligas'],
        queryFn: async () => {
            const response = await getLigues()
            return parseLigas(response.ligas)
        },
        // staleTime: Infinity,
        staleTime: 1000 * 60 * 15,
        cacheTime: 5 * 60 * 1000
    })

    if (isLoadingLigas) {
        return (
            <LoadingSpinner />
        )
    }

    const fetchEquipos = async (liga) => {
        try {
            setLoading(true)
            const response = await getTeams(liga)
            setEquipos(response.equipos || [])
            console.log(response.equipos)
        } catch (error) {
            console.error('Error fetching equipos:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleLigaChange = (event) => {
        const liga = event.target.value
        setSelectedLiga(liga)
        setEquipos([])
        setSelectedEquipo1('')
        setSelectedEquipo2('')
        setShowPrediction(false)
        if (liga) {
            fetchEquipos(liga)
        }
    }

    const handleEquipo1Change = (event) => {
        const equipo = event.target.value
        setSelectedEquipo1(equipo)
        setShowPrediction(false)
    }

    const handleEquipo2Change = (event) => {
        const equipo = event.target.value
        setSelectedEquipo2(equipo)
        setShowPrediction(false)
    }

    const handleShowPrediction = () => {
        if (selectedLiga && selectedEquipo1 && selectedEquipo2) {
            setShowPrediction(true)
        }
    }

    return (
        <Box sx={{
            minHeight: "100vh",
            background: theme.palette.background.default
        }}
        >
            <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
                {/* Header */}
                <Header
                    title='Predicciones'
                    subtitle='Predicciones con machine learning supervisado' />

                {/* Selection Controls */}
                <SelectionControls
                    selectedLiga={selectedLiga}
                    handleLigaChange={handleLigaChange}
                    selectedEquipo1={selectedEquipo1}
                    handleEquipo1Change={handleEquipo1Change}
                    selectedEquipo2={selectedEquipo2}
                    handleEquipo2Change={handleEquipo2Change}
                    handleShowAnalysis={handleShowPrediction}
                    ligas={ligas}
                    equipos={equipos}
                    loading={loading} />

                {/* Predictions Results */}
                {showPrediction && (
                    <CustomPrediction
                        nombre_liga={selectedLiga}
                        equipo_local={selectedEquipo1}
                        equipo_visita={selectedEquipo2}
                    />
                )}

                {/* No analysis message */}
                {!showPrediction && !loading && (
                    <LoadingMessage />
                )}
            </Container>
        </Box>
    )
}

export default Forecasts