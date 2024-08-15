import './App.css'
import useRouteElement from './useRouteElement'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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
