import IconButton from "@mui/material/IconButton"
import StarIcon from "@mui/icons-material/Star"
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid"
import { HeartIcon } from "@heroicons/react/24/outline"
import { useFavoritos } from "../../../hooks/FavoritosContext"
import { useThemeMode } from "../../../contexts/ThemeContext"
import { motion } from "framer-motion"

const FavoriteStar = ({ partidoId }) => {
    const { currentTheme } = useThemeMode()
    const { favoritos, toggleFavorite, addFavoriteMutation, deleteFavoriteMutation } = useFavoritos()
    const isFavorite = favoritos.some(fav => fav.id_partido === partidoId)

    const loading = addFavoriteMutation.isLoading || deleteFavoriteMutation.isLoading

    const handleClick = async () => {
        toggleFavorite(partidoId)
    }

    return (
        <motion.button
            onClick={handleClick}
            disabled={loading}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 rounded-full transition-colors duration-200"
            aria-label="favorito"
        >
            {isFavorite ? (
                <HeartSolidIcon className="w-5 h-5 text-red-500" />
            ) : (
                <HeartIcon className={`w-5 h-5 ${currentTheme.textSecondary} hover:text-red-500 transition-colors`} />
            )}
        </motion.button>
    )
}

export default FavoriteStar;
