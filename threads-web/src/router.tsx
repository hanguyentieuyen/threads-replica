import { useRoutes } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import path from "./constant/path"
import RegisterLayout from "./layouts/RegisterLayout"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import VerifyForgotPassword from "./pages/VerifyForgotPassword"
import VerifyEmail from "./pages/VerifyEmail"
import MainLayout from "./layouts/MainLayout"
import Profile from "./pages/Profile"
import Posts from "./pages/Posts"
import PostDetail from "./pages/PostDetail"
import Search from "./pages/Search"
import ChangePassword from "./pages/ChangePassword"

export default function useRouteElement() {
  const routeElements = useRoutes([
    {
      path: "",
      element: (
        <MainLayout>
          <Posts />
        </MainLayout>
      )
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
      path: path.changePassword,
      element: (
        <RegisterLayout>
          <ChangePassword />
        </RegisterLayout>
      )
    },
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
    },
    {
      path: "*",
      element: <>Not found page</>
    }
  ])
  return routeElements
}
