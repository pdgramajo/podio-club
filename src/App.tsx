import { Outlet } from 'react-router-dom'
import { ToastProvider } from './application/toast/ToastContext'
import NavBar from './components/layout/NavBar'
import Footer from './components/layout/Footer'
import ToastHost from './components/ui/ToastHost'

export default function App() {
  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col bg-paper">
        <NavBar />
        <main className="mx-auto w-full max-w-[1120px] flex-1 px-6 pt-8">
          <Outlet />
        </main>
        <Footer />
      </div>
      <ToastHost />
    </ToastProvider>
  )
}
