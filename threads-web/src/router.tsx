/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import { Navigate, Outlet, useRoutes } from "react-router-dom"
import path from "./constant/path"
import RegisterLayout from "./layouts/RegisterLayout"
import MainLayout from "./layouts/MainLayout"
import { lazy, Suspense, useContext } from "react"
import { AppContext } from "./context/app.context"
import LoadingScreen from "./components/LoadingScreen"

const Login = lazy(() => import("./pages/Login"))
const Register = lazy(() => import("./pages/Register"))
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"))
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"))
const ChangePassword = lazy(() => import("./pages/ChangePassword"))
const ResetPassword = lazy(() => import("./pages/ResetPassword"))
const VerifyForgotPassword = lazy(() => import("./pages/VerifyForgotPassword"))
const Profile = lazy(() => import("./pages/Profile"))
const Posts = lazy(() => import("./pages/Posts"))
const PostDetail = lazy(() => import("./pages/PostDetail"))
const Search = lazy(() => import("./pages/Search"))

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}
function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

export default function useRouteElement() {
  const routeElements = useRoutes([
    // Public routes (accessible by anyone)
    {
      path: "",
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: (
            <RegisterLayout>
              <Suspense fallback={<LoadingScreen />}>
                <Login />
              </Suspense>
            </RegisterLayout>
          )
        },
        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Suspense fallback={<LoadingScreen />}>
                <Register />
              </Suspense>
            </RegisterLayout>
          )
        }
      ]
    },
    {
      path: path.verifyEmail,
      element: (
        <Suspense fallback={<LoadingScreen />}>
          <VerifyEmail />
        </Suspense>
      )
    },
    {
      path: path.forgotPassword,
      element: (
        <RegisterLayout>
          <Suspense fallback={<LoadingScreen />}>
            <ForgotPassword />
          </Suspense>
        </RegisterLayout>
      )
    },
    {
      path: path.verifyForgotPassword,
      element: (
        <Suspense fallback={<LoadingScreen />}>
          <VerifyForgotPassword />
        </Suspense>
      )
    },
    {
      path: path.resetPassword,
      element: (
        <RegisterLayout>
          <Suspense fallback={<LoadingScreen />}>
            <ResetPassword />
          </Suspense>
        </RegisterLayout>
      )
    },
    {
      path: path.changePassword,
      element: (
        <RegisterLayout>
          <Suspense fallback={<LoadingScreen />}>
            <ChangePassword />
          </Suspense>
        </RegisterLayout>
      )
    },

    // Protected routes (only accessible if authenticated)
    {
      path: "",
      element: <ProtectedRoute />,
      children: [
        {
          path: path.postDetail,
          element: (
            <MainLayout>
              <Suspense fallback={<LoadingScreen />}>
                <PostDetail />
              </Suspense>
            </MainLayout>
          )
        },
        {
          path: path.search,
          element: (
            <MainLayout>
              <Suspense fallback={<LoadingScreen />}>
                <Search />
              </Suspense>
            </MainLayout>
          )
        },
        {
          path: path.me,
          element: (
            <MainLayout>
              <Suspense fallback={<LoadingScreen />}>
                <Profile />
              </Suspense>
            </MainLayout>
          )
        },
        {
          path: path.userProfile,
          element: (
            <MainLayout>
              <Suspense fallback={<LoadingScreen />}>
                <Profile />
              </Suspense>
            </MainLayout>
          )
        }
      ]
    },

    // Default route for displaying posts
    {
      path: "",
      index: true,
      element: (
        <MainLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Posts />
          </Suspense>
        </MainLayout>
      )
    },

    // Catch-all route for undefined paths
    {
      path: "*",
      element: <>Not found page</>
    }
  ])

  return routeElements
}
