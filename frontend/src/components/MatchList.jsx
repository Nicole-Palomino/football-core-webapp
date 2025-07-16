import { useState } from 'react'
import { List, ListItem, Grid, Box, Typography, IconButton, Tooltip, Modal, Tabs, Tab, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper,  CircularProgress } from "@mui/material"
import AutoFixHigh from "@mui/icons-material/AutoFixHigh"
import InfoOutlined from "@mui/icons-material/InfoOutlined"
import { formatFecha } from '../services/encryptionService'
import { getWinsDrawLoses, getMatchById, getAvgGoals, getFoulsTargetCorner, getTablePosition, getH2H, getUltimosPartidos } from "../../services/api"
import { HorizontalRule } from "@mui/icons-material"
import { a11yProps, CustomTabPanel } from '../utils/a11yProps'
import { motion } from "framer-motion"

const MatchList = ({ partidos }) => {

    const [open, setOpen] = useState(false)
    const [stats, setStats] = useState([])
    const [match, setMatch] = useState([])
    const [goal, setGoals] = useState([])
    const [fouls, setFouls] = useState([])
    const [table, setTable] = useState([])
    const [local, setLocal] = useState([])
    const [visita, setVisita] = useState([])
    const [h2hMatches, setH2HMatches] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [selectedTeams, setSelectedTeams] = useState({ team1: null, team2: null })
    const [valueH2H, setValueH2H] = useState(0)
    const [value, setValue] = useState(0)

    const handleChange = (event, newValue) => { setValue(newValue) }
    const handleChangeH2H = (event, newValue) => { setValueH2H(newValue) }
    const matchArray = Array.isArray(match) ? match : [match];

    return (
        <div>
            <List sx={{ color: "white" }}>
                {partidos.map((partido, index) => (
                    <ListItem key={index} alignItems="center" sx={{ borderBottom: "1px solid #E0E0E0", fontFamily: "cursive" }}>
                        <Grid container alignItems="center" spacing={2} justifyContent="space-between" sx={{ display: "flex", flexWrap: "nowrap" }}>
                            {/* Equipos */}
                            <Grid item xs={6} sm={4} sx={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: 1, textAlign: "left" }}>
                                
                            </Grid>
                        </Grid>
                    </ListItem>
                ))}
            </List>
        </div>
    )
}

export default MatchList