/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import "./App.css"
import useRouteElement from "./router"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function App() {
  const routerElements = useRouteElement()
  return (
    <>
      {routerElements}

      <ToastContainer />
    </>
  )
}

export default App
