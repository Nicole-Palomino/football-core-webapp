import { ChartPieIcon, CursorArrowRaysIcon, SquaresPlusIcon } from "@heroicons/react/24/outline"
import { BiSupport } from "react-icons/bi"
import { GiSoccerField, GiSoccerKick } from "react-icons/gi"
import { TbDeviceAnalytics } from "react-icons/tb"

export const products = [
    { name: 'Análisis', description: 'Conocer las estadísticas para el próximo partido', href: '#', icon: ChartPieIcon },
    { name: 'Predicciones', description: 'Conocer las predicciones para el próximo partido', href: '#', icon: CursorArrowRaysIcon },
    { name: 'Resúmenes', description: 'Generar resúmenes estadísticos de un partido', href: '#', icon: SquaresPlusIcon },
]

export const ServicesData = [
    {
        id: 1,
        title: "Análisis comparativo de equipos",
        link: "#",
        icon: GiSoccerKick,
        delay: 0.4,
    },
    {
        id: 2,
        title: "Pronóstico del partido",
        link: "#",
        icon: GiSoccerField,
        delay: 0.3,
    },
    {
        id: 3,
        title: "Resúmenes estadísticos personalizados",
        link: "#",
        icon: TbDeviceAnalytics,
        delay: 0.2,
    },
    {
        id: 4,
        title: "Soporte técnico",
        link: "#",
        icon: BiSupport,
        delay: 0.5,
    },
]

export const settings = [
    { name: "Perfil", path: "/dashboard/profile" },
    { name: "Configuración", path: "/dashboard/settings" }
]