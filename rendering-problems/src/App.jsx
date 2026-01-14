import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ProblematicParent from './first-problem/index.jsx'
import SecondProblem from './second-problem/solution.jsx'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     {/* <ProblematicParent /> */}
     <SecondProblem />
    </>
  )
}

export default App
