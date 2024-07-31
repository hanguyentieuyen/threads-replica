import { useRoutes } from 'react-router-dom'
import Login from './pages'
export default function useRouteElement() {
  const routeElements = useRoutes([
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '*',
      element: <>Not found page</>
    }
  ])
  return routeElements
}
