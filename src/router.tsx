import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import App from './App'

const Home = lazy(() => import('./pages/Home'))
const Catalog = lazy(() => import('./pages/Catalog'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const NotFound = lazy(() => import('./pages/NotFound'))

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
