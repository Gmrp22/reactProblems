import { Children, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ProblematicParent from './simple/first-problem/index.jsx'
import SecondProblem from './simple/second-problem/solution.jsx'
import ThirdProblem from './simple/third-problem/solution.jsx'
import FourthProblem from './simple/fourth-problem/solution.jsx'
import ChildrenAsProp from './childAsProp/index.jsx'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     {/* <ProblematicParent /> */}
     {/* <SecondProblem /> */}
     {/* <ThirdProblem/> */}
     {/* <FourthProblem/> */}
    <ChildrenAsProp/>
    </>
  )
}

export default App
