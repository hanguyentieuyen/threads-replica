import { Navigate, Outlet, useRoutes } from "react-router-dom"
import path from "./constant/path"
import RegisterLayout from "./layouts/RegisterLayout"
import MainLayout from "./layouts/MainLayout"
import { lazy, Suspense, useContext } from "react"
import { AppContext } from "./context/app.context"

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

const withSuspense = (Component: unknown) => (
  <Suspense fallback={<div>Loading...</div>}>
    <Component />
  </Suspense>
)

export default function useRouteElement() {
  const routeElements = useRoutes([
    // Public routes (accessible by anyone)
    {
      path: "",
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: <RegisterLayout>{withSuspense(Login)}</RegisterLayout>
        },
        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Register />
            </RegisterLayout>
          )
        }
      ]
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
      path: path.changePassword,
      element: (
        <RegisterLayout>
          <ChangePassword />
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
              <PostDetail />
            </MainLayout>
          )
        },
        {
          path: path.search,
          element: (
            <MainLayout>
              <Search />
            </MainLayout>
          )
        },
        {
          path: path.me,
          element: (
            <MainLayout>
              <Profile />
            </MainLayout>
          )
        },
        {
          path: path.userProfile,
          element: (
            <MainLayout>
              <Profile />
            </MainLayout>
          )
        }
      ]
    },

    // Default route for displaying posts
    {
      path: "",
      element: <MainLayout>{withSuspense(Posts)}</MainLayout>
    },

    // Catch-all route for undefined paths
    {
      path: "*",
      element: <>Not found page</>
    }
  ])

  return routeElements
}
