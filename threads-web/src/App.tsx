import './App.css'
import useRouteElement from './useRouteElement'

function App() {
  const routerElements = useRouteElement()
  return <>{routerElements}</>
}

export default App
