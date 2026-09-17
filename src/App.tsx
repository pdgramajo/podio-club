import { Outlet } from 'react-router-dom'
import { useRouteFocus } from './application/useRouteFocus'
import { ToastProvider } from './application/toast/ToastContext'
import NavBar from './components/layout/NavBar'
import Footer from './components/layout/Footer'
import ToastHost from './components/ui/ToastHost'

export default function App() {
  useRouteFocus('#contenido')

  return (
    <ToastProvider>
      <a
        href="#contenido"
        className="sr-only z-50 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Saltar al contenido
      </a>

      <div className="flex min-h-screen flex-col bg-paper">
        <NavBar />
        <main id="contenido" tabIndex={-1} className="flex-1 focus:outline-none">
          <Outlet />
        </main>
        <Footer />
      </div>
      <ToastHost />
    </ToastProvider>
  )
}
