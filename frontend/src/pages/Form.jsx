import { lazy, Suspense, useState } from 'react'
import { motion } from 'framer-motion'
import { useThemeMode } from '../contexts/ThemeContext'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

const SignIn = lazy(() => import('./SignIn'))
const SignUp = lazy(() => import('./SignUp'))

const Form = () => {
    const [activeTab, setActiveTab] = useState('signin')
    const { currentTheme } = useThemeMode()

    return (
        <section className={`relative w-full min-h-screen overflow-x-hidden ${currentTheme.background} transition-colors duration-300`}>
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-xl"></div>
            </div>

            {/* Back Arrow Navigation */}
            <div className="absolute top-6 left-6 z-20">
                <Link to="/">
                    <motion.div
                        whileHover={{ scale: 1.1, x: -5 }}
                        whileTap={{ scale: 0.9 }}
                        className={`group ${currentTheme.card} ${currentTheme.border} border rounded-full p-3 ${currentTheme.shadow} ${currentTheme.hover} transition-all duration-300 backdrop-blur-sm`}
                    >
                        <ArrowLeftIcon className={`w-6 h-6 ${currentTheme.text} group-hover:text-blue-600 transition-colors duration-300`} />
                    </motion.div>
                </Link>
            </div>

            <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-8">
                <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
                    className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl"
                >
                    {/* Main Card */}
                    <div className={`${currentTheme.card} rounded-3xl ${currentTheme.shadow} ${currentTheme.border} border relative overflow-hidden backdrop-blur-sm`}>
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-5">
                            <div className="absolute inset-0" style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                backgroundSize: '60px 60px'
                            }}></div>
                        </div>

                        {/* Tab Navigation */}
                        <div className="relative z-10 p-6 pb-0">
                            <div className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl p-2 flex gap-2`}>
                                <motion.button
                                    onClick={() => setActiveTab('signin')}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                                        activeTab === 'signin'
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                            : `${currentTheme.textSecondary} ${currentTheme.hover}`
                                    }`}
                                >
                                    <span className="text-sm sm:text-base">Iniciar Sesión</span>
                                </motion.button>
                                <motion.button
                                    onClick={() => setActiveTab('signup')}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                                        activeTab === 'signup'
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                            : `${currentTheme.textSecondary} ${currentTheme.hover}`
                                    }`}
                                >
                                    <span className="text-sm sm:text-base">Registrarse</span>
                                </motion.button>
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="relative z-10 p-6 pt-8" style={{ minHeight: '500px' }}>
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                                className="w-full h-full"
                            >
                                <Suspense fallback={
                                    <div className="flex items-center justify-center w-full h-full py-20">
                                        <div className="text-center">
                                            <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                                            <p className={`${currentTheme.textSecondary} text-sm`}>Cargando...</p>
                                        </div>
                                    </div>
                                }>
                                    {activeTab === 'signin' ? (
                                        <SignIn setActiveTab={setActiveTab} />
                                    ) : (
                                        <SignUp setActiveTab={setActiveTab} />
                                    )}
                                </Suspense>
                            </motion.div>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className={`mt-6 text-center ${currentTheme.textSecondary} text-sm`}
                    >
                        <p>Al continuar, aceptas nuestros términos y condiciones</p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

export default Form