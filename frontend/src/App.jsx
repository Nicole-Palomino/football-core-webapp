import { lazy, Suspense, useState } from 'react'
import { AuthProvider } from './contexts/AuthContexts'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PublicRoute from './routers/PublicRoute'
import PrivateRoute from './routers/PrivateRoute'
import HomePage from './pages/HomePage'
import Form from './pages/Form'
import Dashboard from './pages/Dashboard'
import Match from './pages/Match'
import { FavoritosProvider } from './hooks/FavoritosContext'
import Favorite from './pages/Favorite'
import PageProfile from './pages/PageProfile'
import PageSettings from './pages/PageSettings'
import Forecasts from './pages/Forecasts'
import Analysis from './pages/Analysis'
import Services from './components/Header/Services'
import Contact from './components/Header/Contact'
import AboutUs from './components/Header/AboutUs'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import MatchDetail from './components/Dashboard/Match/MatchDetail'

function App() {

  return (
    <main className="overflow-x-auto bg-background">
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<div>Cargando FOOTBALL CORE... </div>}>
            <Routes>
              <Route path='/' element={<HomePage/>}/>
              <Route path='/services' element={<Services/>}/>
              <Route path='/contact' element={<Contact/>}/>
              <Route path='/about-us' element={<AboutUs/>}/>
              <Route path='/get-started' element={<PublicRoute><Form /></PublicRoute>} />
              <Route path='/forgot-password' element={<PublicRoute><ForgotPassword /></PublicRoute>} />
              <Route path='/reset-password' element={<PublicRoute><ResetPassword /></PublicRoute>} />

              <Route path='/dashboard' element={
                <FavoritosProvider>
                  <PrivateRoute><Dashboard /></PrivateRoute>
                </FavoritosProvider>
              }>
                <Route index element={<PrivateRoute><Match /></PrivateRoute>}/>
                <Route path=':id_partido' element={<PrivateRoute><MatchDetail /></PrivateRoute>}/>
                <Route path='favorites' element={<PrivateRoute><Favorite /></PrivateRoute>}/>
                <Route path='analysis' element={<PrivateRoute><Analysis /></PrivateRoute>}/>
                <Route path='forecasts' element={<PrivateRoute><Forecasts /></PrivateRoute>}/>
                <Route path='profile' element={<PrivateRoute><PageProfile /></PrivateRoute>}/>
                <Route path='settings' element={<PrivateRoute><PageSettings /></PrivateRoute>}/>
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </main>
  )
}

export default App
