import { lazy, Suspense, useState } from 'react'
import { motion } from 'framer-motion'
import { Paper, Tab, Tabs } from '@mui/material'
import NavbarClient from '../components/Navbar/NavbarClient'
import { a11yProps, CustomTabPanel } from '../utils/a11yProps'

const SignIn = lazy(() => import('./SignIn'))
const SignUp = lazy(() => import('./SignUp'))

const Form = () => {
    const [value, setValue] = useState(0)

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const paperStyle = { margin: 'auto' }

    return (
        <section className='w-full min-h-screen bg-background'>
            <NavbarClient />
            <div className='flex flex-col items-center justify-center min-h-[calc(100vh-130px)] px-4 sm:px-6'>
                <motion.div className='flex flex-col mt-5 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl px-4 sm:px-6 md:px-8 lg:px-10 rounded-2xl mx-auto' initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4, ease: "easeInOut" }}>
                    <Paper elevation={20} style={paperStyle}
                        sx={{
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                            backdropFilter: "blur(10px)",
                            width: "100%",
                            maxWidth: "500px",
                            "& .MuiTabs-indicator": {
                                backgroundColor: "#193cb8",
                            },
                        }}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="disabled tabs example"
                            centered
                            variant="fullWidth"
                            sx={{
                                "& .MuiTabs-indicator": { backgroundColor: "#193cb8" },
                                "& .MuiTab-root": { color: "white", fontFamily: 'cursive' },
                                "& .MuiTab-root.Mui-selected": { color: "#fff" },
                            }}>
                            <Tab label="Iniciar Sesión" {...a11yProps(0)} />
                            <Tab label="Registrarse" {...a11yProps(1)} />
                        </Tabs>

                        <CustomTabPanel value={value} index={0} className="w-full" style={{ minHeight: '430px' }}>
                            <div className="relative w-full h-full">
                                <Suspense fallback={
                                    <div className="absolute inset-0 flex items-center justify-center w-full h-full bg-gray-900/60">
                                        <div className="text-center text-white">
                                            <div className="spinner-border" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    </div>
                                }>
                                    <SignIn setValue={setValue} />
                                </Suspense>
                            </div>
                        </CustomTabPanel>

                        <CustomTabPanel value={value} index={1} className="w-full" style={{ minHeight: '430px' }}>
                            <div className="relative w-full h-full">
                                <Suspense fallback={
                                    <div className="absolute inset-0 flex items-center justify-center w-full h-full bg-gray-900/60">
                                        <div className="text-center text-white">
                                            <div className="spinner-border" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    </div>
                                }>
                                    <SignUp setValue={setValue} />
                                </Suspense>
                            </div>
                        </CustomTabPanel>
                    </Paper>
                </motion.div>
            </div>
        </section>
    )
}

export default Form