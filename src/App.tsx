import { Outlet } from 'react-router-dom'
import NavBar from './components/layout/NavBar'

export default function App() {
  return (
    <div className="app">
      <NavBar />
      <main className="app__main">
        <Outlet />
      </main>
    </div>
  )
}
