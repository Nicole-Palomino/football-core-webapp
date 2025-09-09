import {
    Plus, Edit, Trash2, Search, Filter, X, Eye, AlertTriangle, Check, User,
} from 'lucide-react'
import { useThemeMode } from '../../contexts/ThemeContext'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useFunctions } from '../../hooks/useFunctions'

const Roles = () => {

    const { currentTheme } = useThemeMode()
    const [showModal, setShowModal] = useState(false)
    const [modalType, setModalType] = useState('')

    const { register, handleSubmit, formState: { errors }, reset } = useForm()

    const [selectedUser, setSelectedUser] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterRole, setFilterRole] = useState('todos')
    const [filterStatus, setFilterStatus] = useState('todos')
    const [showPassword, setShowPassword] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const usersPerPage = 10
    const contentClasses = `p-6 ${currentTheme.text}`

    const { allroles } = useFunctions()

    // const filteredUsers = (allusers || []).filter(user => {
    //     const matchesSearch = user.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         user.correo.toLowerCase().includes(searchTerm.toLowerCase())
    //     const matchesRole = filterRole === 'todos' || user.rol.nombre_rol === filterRole
    //     const matchesStatus = filterStatus === 'todos' ||
    //         (filterStatus === 'activo' && user.is_active) ||
    //         (filterStatus === 'inactivo' && !user.is_active)

    //     return matchesSearch && matchesRole && matchesStatus
    // })

    // const totalPages = Math.ceil(filteredUsers.length / usersPerPage) || 1
    // const paginatedUsers = filteredUsers.slice(
    //     (currentPage - 1) * usersPerPage,
    //     currentPage * usersPerPage
    // )

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success", // success | error | warning | info
    })

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false })
    }

    return (
        <div>Roles</div>
    )
}

export default Roles