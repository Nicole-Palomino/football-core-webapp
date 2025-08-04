import { BiSupport } from "react-icons/bi"
import { GiSoccerField, GiSoccerKick } from "react-icons/gi"
import { TbDeviceAnalytics } from "react-icons/tb"
import {
    ChartBarIcon, CpuChipIcon, DocumentArrowDownIcon, SparklesIcon, ChatBubbleLeftRightIcon, EnvelopeIcon, 
    MapPinIcon, PhoneIcon, EyeIcon, RocketLaunchIcon, AcademicCapIcon, BoltIcon, GlobeAltIcon, HeartIcon, 
    LightBulbIcon, ShieldCheckIcon, TrophyIcon, UserGroupIcon
} from '@heroicons/react/24/outline'

export const services = [
    {
        id: 1,
        title: "Análisis Poisson",
        description: "Análisis estadístico avanzado de partidos utilizando distribución de Poisson para evaluar probabilidades de goles y resultados.",
        icon: ChartBarIcon,
        features: ["Distribución de goles", "Análisis de probabilidades", "Métrica de Monte Carlo"],
        price: "Gratis",
        color: "from-blue-500 to-cyan-500",
        delay: 0.1
    },
    {
        id: 2,
        title: "Clustering K-Means",
        description: "Agrupación inteligente de partidos basada en rendimiento, estilo de juego y características similares.",
        icon: CpuChipIcon,
        features: ["Agrupación de partidos", "Análisis de patrones", "Segmentación inteligente"],
        price: "Gratis",
        color: "from-purple-500 to-pink-500",
        delay: 0.2
    },
    {
        id: 3,
        title: "Predicciones RF",
        description: "Predicciones precisas usando Random Forest para clasificación y regresión de resultados de partidos.",
        icon: SparklesIcon,
        features: ["Clasificación de resultados", "Regresión de marcadores", "Alta precisión"],
        price: "$5/mes a partir del 30/08/25",
        isPremium: true,
        color: "from-orange-500 to-red-500",
        delay: 0.3
    },
    {
        id: 4,
        title: "Resúmenes PNG",
        description: "Descarga resúmenes visuales profesionales de análisis y estadísticas post-partidos en formato PNG.",
        icon: DocumentArrowDownIcon,
        features: ["Diseño profesional", "Descarga instantánea", "Múltiples formatos"],
        price: "Gratis",
        color: "from-green-500 to-emerald-500",
        delay: 0.4
    },
    {
        id: 5,
        title: "Stats de Partidos",
        description: "Visualiza estadísticas detalladas de partidos con métricas avanzadas y comparativas.",
        icon: EyeIcon,
        features: ["Stats de +17,000 partidos", "Comparativas históricas", "Métricas avanzadas"],
        price: "Gratis",
        color: "from-indigo-500 to-blue-500",
        delay: 0.5
    }
]

export const contactInfo = [
    {
        icon: EnvelopeIcon,
        title: "Email",
        value: "contacto@footballcore.com",
        description: "Respuesta en 24 horas",
        color: "from-blue-500 to-cyan-500"
    },
    {
        icon: PhoneIcon,
        title: "Teléfono",
        value: "+51 923 295 679",
        description: "Lun - Vie, 9AM - 6PM",
        color: "from-green-500 to-emerald-500"
    },
    {
        icon: MapPinIcon,
        title: "Ubicación",
        value: "Piura, Perú",
        description: "Disponible globalmente",
        color: "from-purple-500 to-pink-500"
    },
    {
        icon: ChatBubbleLeftRightIcon,
        title: "Soporte Técnico",
        description: "Disponible 24/7",
        color: "from-orange-500 to-red-500"
    }
]

export const stats = [
    {
        icon: ChartBarIcon,
        number: "17,000+",
        label: "Partidos Analizados",
        color: "from-blue-500 to-cyan-500"
    },
    {
        icon: TrophyIcon,
        number: "94.3%",
        label: "Precisión en Predicciones",
        color: "from-green-500 to-emerald-500"
    },
    {
        icon: UserGroupIcon,
        number: "5,000+",
        label: "Usuarios Activos",
        color: "from-purple-500 to-pink-500"
    },
    {
        icon: GlobeAltIcon,
        number: "5+",
        label: "Ligas Monitoreadas",
        color: "from-orange-500 to-red-500"
    }
]

export const team = [
    {
        name: "Nicole Palomino",
        role: "Analista de Datos",
        description: "Estudiante de Gestión de Sistemas de Información. Ha realizado proyectos sobre análisis de partidos usando Python y pandas, implementando modelos predictivos de resultados y desarrolló visualizaciones interactivas para competencias internas",
        image: "👩‍💻",
        skills: ["Machine Learning", "Análisis Deportivo", "Python", "React", "Electron"],
        color: "from-blue-500 to-cyan-500"
    },
    {
        name: "Gabriel López",
        role: "Analista de Datos & Desarrollo Web",
        description: "Estudiante de Gestión de Sistemas de Información con enfoque en desarrollo full-stack. Desarrolló una plataforma de estadísticas en React/FastAPI como proyecto personal",
        image: "👨‍💻",
        skills: ["React", "FastAPI", "Cloud Architecture"],
        color: "from-purple-500 to-pink-500"
    },
    {
        name: "Ana López",
        role: "Ingeniera Informática & Analista Deportivo",
        description: "Ing. Informática y Analista apasionada por el análisis de datos aplicados al fútbol. Apoyó en el desarrollo de un sistema de visualización estadística y modelos predictivos utilizando Python, FastAPI y React",
        image: "👩‍💻",
        skills: ["Machine Learning", "Análisis Deportivo", "Python", "FastAPI", "React"],
        color: "from-orange-500 to-red-500"
    }
]

export const timeline = [
    {
        year: "2023",
        title: "El Comienzo",
        description: "Iniciamos como un proyecto personal como hinchas del fútbol para predecir comportamientos y resultados de partidos de la Liga Inglesa",
        icon: LightBulbIcon,
        color: "from-blue-500 to-cyan-500"
    },
    {
        year: "2024",
        title: "Primeras Victorias",
        description: "Lanzamos nuestro primer modelo estadístico con 85% de precisión",
        icon: TrophyIcon,
        color: "from-green-500 to-emerald-500"
    },
    {
        year: "2025",
        title: "Revolución AI",
        description: "Implementamos Random Forest y K-means, alcanzando 94% de precisión y llegando a 5 ligas más como la italiana, española, alemana, entre otras",
        icon: RocketLaunchIcon,
        color: "from-orange-500 to-red-500"
    }
]

export const values = [
    {
        icon: ShieldCheckIcon,
        title: "Transparencia",
        description: "Mostramos exactamente cómo funcionan nuestros algoritmos y de dónde vienen nuestras predicciones",
        color: "from-blue-500 to-cyan-500"
    },
    {
        icon: BoltIcon,
        title: "Innovación",
        description: "Constantemente mejoramos nuestros modelos con las últimas técnicas de machine learning",
        color: "from-purple-500 to-pink-500"
    },
    {
        icon: HeartIcon,
        title: "Pasión",
        description: "Somos fanáticos del fútbol que creemos en el poder de los datos para entender el juego",
        color: "from-green-500 to-emerald-500"
    },
    {
        icon: AcademicCapIcon,
        title: "Educación",
        description: "Compartimos conocimiento para que todos puedan entender y usar análisis deportivo",
        color: "from-orange-500 to-red-500"
    }
]

export const tabs = [
    { id: 'mission', label: 'Misión', icon: SparklesIcon },
    { id: 'vision', label: 'Visión', icon: EyeIcon },
    { id: 'values', label: 'Valores', icon: HeartIcon }
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