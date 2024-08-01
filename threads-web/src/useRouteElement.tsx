import { useRoutes } from 'react-router-dom'
import Login from './pages/Login'
export default function useRouteElement() {
  const routeElements = useRoutes([
    {
      path: '',
      element: <>Posts</>
    },
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
