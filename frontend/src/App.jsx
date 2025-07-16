import { lazy, Suspense, useState } from 'react'
import { AuthProvider } from './contexts/AuthContexts'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import PublicRoute from './routers/PublicRoute'
import PrivateRoute from './routers/PrivateRoute'
import HomePage from './pages/HomePage'
import Form from './pages/Form'
import Dashboard from './pages/Dashboard'
import Match from './pages/Match'

function App() {

  return (
    <main className="overflow-x-auto bg-background">
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<div>Cargando FOOTBALL CORE... </div>}>
            <Routes>
              <Route path='/' element={<HomePage/>}/>
              <Route path='/get-started' element={<PublicRoute><Form /></PublicRoute>} />

              <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>}>
                <Route index element={<PrivateRoute><Match /></PrivateRoute>}/>
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </main>
  )
}

export default App
