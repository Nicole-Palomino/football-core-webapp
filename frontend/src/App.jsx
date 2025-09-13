import { FavoritosProvider } from './hooks/FavoritosContext'
import AppRoutes from './routers/AppRoutes'

function App() {

  return (
    <FavoritosProvider>
      <AppRoutes />
    </FavoritosProvider>
  )
}

export default App
