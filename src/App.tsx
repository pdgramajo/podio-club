import { Outlet } from 'react-router-dom'
import NavBar from './components/layout/NavBar'
import Footer from './components/layout/Footer'

export default function App() {
  return (
    <div className="app">
      <NavBar />
      <main className="app__main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
