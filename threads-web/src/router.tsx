import { useRoutes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import path from './constant/path'
import RegisterLayout from './layouts/RegisterLayout'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import VerifyForgotPassword from './pages/VerifyForgotPassword'
import VerifyEmail from './pages/VerifyEmail'
import MainLayout from './layouts/MainLayout'
import Profile from './pages/Profile'

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
      path: path.verifyEmail,
      element: <VerifyEmail />
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
      path: path.verifyForgotPassword,
      element: <VerifyForgotPassword />
    },
    {
      path: path.resetPassword,
      element: (
        <RegisterLayout>
          <ResetPassword />
        </RegisterLayout>
      )
    },
    {
      path: path.profile,
      element: (
        <MainLayout>
          <Profile />
        </MainLayout>
      )
    },
    {
      path: '*',
      element: <>Not found page</>
    }
  ])
  return routeElements
}
