import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import Cart from './pages/Cart'
import Catalog from './pages/Catalog'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ProductDetail from './pages/ProductDetail'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'catalogo', element: <Catalog /> },
      { path: 'producto/:slug', element: <ProductDetail /> },
      { path: 'carrito', element: <Cart /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
