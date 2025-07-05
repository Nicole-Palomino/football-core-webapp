import { lazy, Suspense, useState } from 'react'
import { AuthProvider } from './contexts/AuthContexts'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'

function App() {

  return (
    <main className="overflow-x-auto bg-background">
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<div>Cargando FOOTBALL CORE... </div>}>
            <Routes>
              <Route path='/' element={<HomePage/>}/>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </main>
  )
}

export default App
