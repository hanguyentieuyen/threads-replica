import { useRoutes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import path from './constant/path'
import RegisterLayout from './layouts/RegisterLayout'
import ForgotPassword from './pages/ForgotPassword'

export default function useRouteElement() {
  const routeElements = useRoutes([
    {
      path: '',
      element: <>Posts</>
    },
    {
      path: path.login,
      element: (
        <RegisterLayout>
          <Login />
        </RegisterLayout>
      )
    },
    {
      path: path.register,
      element: (
        <RegisterLayout>
          <Register />
        </RegisterLayout>
      )
    },
    {
      path: path.forgotPassword,
      element: (
        <RegisterLayout>
          <ForgotPassword />
        </RegisterLayout>
      )
    },
    {
      path: '*',
      element: <>Not found page</>
    }
  ])
  return routeElements
}
